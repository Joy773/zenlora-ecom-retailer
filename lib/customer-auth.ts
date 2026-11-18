"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import { connectMongoose } from "@/lib/mongoose";
import { Customer } from "@/models/Customer";

export type CustomerAuthState = {
  error?: string;
  success?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function field(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function isDuplicateEmailError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
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

  try {
    await connectMongoose();
    const passwordHash = await bcrypt.hash(password, 12);
    await Customer.create({ fullName, email, passwordHash });
  } catch (error) {
    if (isDuplicateEmailError(error)) {
      return { error: "An account already exists for this email." };
    }

    return { error: "We could not create your account. Please try again." };
  }

  try {
    await signIn("customer-credentials", {
      email,
      password,
      redirectTo: "/?auth=signup",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: "Account created. Please log in." };
    }

    throw error;
  }

  return { success: "Account created. Please log in." };
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
    const customer = await Customer.exists({ email });

    if (!customer) {
      return {
        error: "This account does not exist. Please create an account.",
      };
    }
  } catch {
    return { error: "We could not log you in. Please try again." };
  }

  try {
    await signIn("customer-credentials", {
      email,
      password,
      redirectTo: "/?auth=login",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password." };
    }

    throw error;
  }

  return {};
}

export async function logoutCustomer(_formData: FormData) {
  void _formData;
  await signOut({ redirectTo: "/?auth=logout" });
}
