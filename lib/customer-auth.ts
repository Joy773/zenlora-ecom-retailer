"use server";

import { createHmac, randomInt, randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import { sendVerificationCode } from "@/lib/email/send-verification-code";
import { connectMongoose } from "@/lib/mongoose";
import { Customer } from "@/models/Customer";

export type CustomerAuthState = {
  action?: "login" | "register" | "verify" | "resend";
  error?: string;
  success?: string;
  verificationRequired?: boolean;
  verificationEmail?: string;
  verificationChallengeId?: string;
  verified?: boolean;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CODE_PATTERN = /^\d{6}$/;
const CODE_LIFETIME_MS = 10 * 60 * 1000;
const VERIFICATION_RESEND_COOLDOWN_MS = 60 * 1000;
const CODE_ATTEMPTS = 5;

function field(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function verificationState(
  email: string,
  challengeId: string,
  message: Pick<CustomerAuthState, "error" | "success"> = {},
): CustomerAuthState {
  return {
    ...message,
    verificationRequired: true,
    verificationEmail: email,
    verificationChallengeId: challengeId,
  };
}

function createVerificationChallenge(customerId: mongoose.Types.ObjectId) {
  const secret = process.env.VERIFICATION_CODE_SECRET;

  if (!secret) {
    throw new Error("Missing VERIFICATION_CODE_SECRET environment variable");
  }

  const code = randomInt(0, 1_000_000).toString().padStart(6, "0");
  const challengeId = randomUUID();
  const now = new Date();
  const digest = createHmac("sha256", secret)
    .update(`${customerId.toString()}:${code}`)
    .digest("hex");

  return {
    code,
    challengeId,
    digest,
    expiresAt: new Date(now.getTime() + CODE_LIFETIME_MS),
    attemptsRemaining: CODE_ATTEMPTS,
    lastSentAt: now,
  };
}

function digestVerificationCode(
  customerId: mongoose.Types.ObjectId,
  code: string,
) {
  const secret = process.env.VERIFICATION_CODE_SECRET;

  if (!secret) {
    throw new Error("Missing VERIFICATION_CODE_SECRET environment variable");
  }

  return createHmac("sha256", secret)
    .update(`${customerId.toString()}:${code}`)
    .digest("hex");
}

function isDuplicateEmailError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  );
}

function emailVerificationIsConfigured() {
  return Boolean(
    process.env.RESEND_API_KEY &&
      process.env.EMAIL_FROM &&
      process.env.VERIFICATION_CODE_SECRET,
  );
}

export async function registerCustomer(
  _previousState: CustomerAuthState,
  formData: FormData,
): Promise<CustomerAuthState> {
  const fullName = field(formData, "fullName");
  const email = normalizeEmail(field(formData, "email"));
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (fullName.length < 2 || fullName.length > 100) {
    return { error: "Enter your full name." };
  }

  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return { error: "Enter a valid email address." };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const customerId = new mongoose.Types.ObjectId();

  try {
    await connectMongoose();
    const passwordHash = await bcrypt.hash(password, 12);
    await Customer.create({
      _id: customerId,
      fullName,
      email,
      passwordHash,
      isVerified: false,
    });
  } catch (error) {
    if (isDuplicateEmailError(error)) {
      return {
        error: "An account already exists for this email. Log in to continue.",
      };
    }

    return { error: "We could not create your account. Please try again." };
  }

  try {
    const redirectTo = field(formData, "redirectTo");
    await signIn("customer-credentials", {
      email,
      password,
      redirectTo:
        redirectTo === "/cart" ? "/cart?auth=signup" : "/?auth=signup",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        error: "Your account was created, but we could not log you in. Please log in to continue.",
      };
    }

    throw error;
  }

  return {};
}

export async function verifyCustomerEmail(
  previousState: CustomerAuthState,
  formData: FormData,
): Promise<CustomerAuthState> {
  const email = normalizeEmail(field(formData, "email"));
  const challengeId = field(formData, "challengeId");
  const code = field(formData, "code");

  if (!EMAIL_PATTERN.test(email) || !challengeId) {
    return { error: "Start the verification process again." };
  }

  if (!CODE_PATTERN.test(code)) {
    return verificationState(email, challengeId, {
      error: "Enter the six-digit code from your email.",
    });
  }

  if (!process.env.VERIFICATION_CODE_SECRET) {
    return verificationState(email, challengeId, {
      error: "Email verification is temporarily unavailable.",
    });
  }

  try {
    await connectMongoose();
    const customer = await Customer.findOne({
      email,
      isVerified: false,
      "emailVerification.challengeId": challengeId,
    }).select("_id");

    if (!customer) {
      const completedCustomer = await Customer.exists({
        email,
        isVerified: true,
        emailVerification: { $exists: false },
      });

      if (completedCustomer) {
        return {
          verified: true,
          verificationEmail: email,
          success: "Email verified. Log in to continue.",
        };
      }

      return verificationState(email, challengeId, {
        error: "This code is no longer current. Request a new code.",
      });
    }

    const digest = digestVerificationCode(customer._id, code);
    const now = new Date();
    const verifiedCustomer = await Customer.findOneAndUpdate(
      {
        _id: customer._id,
        isVerified: false,
        "emailVerification.challengeId": challengeId,
        "emailVerification.digest": digest,
        "emailVerification.expiresAt": { $gt: now },
        "emailVerification.attemptsRemaining": { $gt: 0 },
      },
      {
        $set: { isVerified: true },
        $unset: { emailVerification: "" },
      },
      { new: true },
    );

    if (verifiedCustomer) {
      return {
        verified: true,
        verificationEmail: email,
        success: "Email verified. Log in to continue.",
      };
    }

    const incorrectCode = await Customer.updateOne(
      {
        _id: customer._id,
        isVerified: false,
        "emailVerification.challengeId": challengeId,
        "emailVerification.digest": { $ne: digest },
        "emailVerification.expiresAt": { $gt: now },
        "emailVerification.attemptsRemaining": { $gt: 0 },
      },
      { $inc: { "emailVerification.attemptsRemaining": -1 } },
    );

    if (incorrectCode.modifiedCount === 1) {
      return verificationState(email, challengeId, {
        error: "That code is incorrect. Check the email and try again.",
      });
    }

    return verificationState(email, challengeId, {
      error: "This code has expired or has no attempts left. Request a new code.",
    });
  } catch {
    return verificationState(
      previousState.verificationEmail ?? email,
      previousState.verificationChallengeId ?? challengeId,
      { error: "We could not verify the code. Please try again." },
    );
  }
}

export async function resendVerificationCode(
  previousState: CustomerAuthState,
  formData: FormData,
): Promise<CustomerAuthState> {
  const email = normalizeEmail(field(formData, "email"));

  if (!EMAIL_PATTERN.test(email) || !emailVerificationIsConfigured()) {
    return {
      ...previousState,
      error: "We could not send another code. Please try again.",
      success: undefined,
    };
  }

  try {
    await connectMongoose();
    const customer = await Customer.findOne({
      email,
      isVerified: false,
      emailVerification: { $exists: true },
    }).select("emailVerification.challengeId emailVerification.lastSentAt");

    if (!customer?.emailVerification) {
      return { error: "Start the verification process again." };
    }

    const challenge = createVerificationChallenge(customer._id);
    const cooldownStartedBefore = new Date(
      Date.now() - VERIFICATION_RESEND_COOLDOWN_MS,
    );
    const reserved = await Customer.updateOne(
      {
        _id: customer._id,
        isVerified: false,
        "emailVerification.challengeId":
          customer.emailVerification.challengeId,
        "emailVerification.lastSentAt": { $lte: cooldownStartedBefore },
      },
      {
        $set: {
          emailVerification: {
            challengeId: challenge.challengeId,
            digest: challenge.digest,
            expiresAt: challenge.expiresAt,
            attemptsRemaining: challenge.attemptsRemaining,
            lastSentAt: challenge.lastSentAt,
          },
        },
      },
    );

    if (reserved.modifiedCount !== 1) {
      return verificationState(
        email,
        customer.emailVerification.challengeId,
        { error: "Please wait 60 seconds before requesting another code." },
      );
    }

    const delivery = await sendVerificationCode(email, challenge.code);

    if (!delivery.sent) {
      await Customer.updateOne(
        {
          _id: customer._id,
          "emailVerification.challengeId": challenge.challengeId,
        },
        { $set: { "emailVerification.lastSentAt": new Date(0) } },
      );

      return verificationState(email, challenge.challengeId, {
        error: "The code could not be sent. Try again.",
      });
    }

    return verificationState(email, challenge.challengeId, {
      success: "A new verification code was sent.",
    });
  } catch {
    return {
      ...previousState,
      error: "We could not send another code. Please try again.",
      success: undefined,
    };
  }
}

export async function loginCustomer(
  _previousState: CustomerAuthState,
  formData: FormData,
): Promise<CustomerAuthState> {
  const email = normalizeEmail(field(formData, "email"));
  const password = String(formData.get("password") ?? "");

  if (!EMAIL_PATTERN.test(email) || !password) {
    return { error: "Enter your email and password." };
  }

  try {
    await connectMongoose();
    const customer = await Customer.findOne({ email }).select(
      "+passwordHash emailVerification.challengeId",
    );

    if (!customer) {
      return {
        error: "This account does not exist. Please create an account.",
      };
    }

    const passwordMatches = await bcrypt.compare(
      password,
      customer.passwordHash,
    );

    if (!passwordMatches) {
      return { error: "Invalid email or password." };
    }

    if (customer.emailVerification) {
      return verificationState(
        email,
        customer.emailVerification.challengeId,
        { success: "Verify your email to finish creating your account." },
      );
    }
  } catch {
    return { error: "We could not log you in. Please try again." };
  }

  try {
    const redirectTo = field(formData, "redirectTo");
    await signIn("customer-credentials", {
      email,
      password,
      redirectTo: redirectTo === "/cart" ? "/cart?auth=login" : "/?auth=login",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password." };
    }

    throw error;
  }

  return {};
}

export async function customerAuth(
  previousState: CustomerAuthState,
  formData: FormData,
): Promise<CustomerAuthState> {
  switch (field(formData, "intent")) {
    case "register":
      return {
        ...(await registerCustomer(previousState, formData)),
        action: "register",
      };
    case "verify":
      return {
        ...(await verifyCustomerEmail(previousState, formData)),
        action: "verify",
      };
    case "resend":
      return {
        ...(await resendVerificationCode(previousState, formData)),
        action: "resend",
      };
    case "login":
      return {
        ...(await loginCustomer(previousState, formData)),
        action: "login",
      };
    default:
      return { error: "Choose an account action and try again." };
  }
}

export async function logoutCustomer(_formData: FormData) {
  void _formData;
  await signOut({ redirectTo: "/?auth=logout" });
}
