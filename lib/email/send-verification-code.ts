import "server-only";

import { Resend } from "resend";

type VerificationEmailResult =
  | { sent: true }
  | { sent: false; error: string };

export async function sendVerificationCode(
  email: string,
  code: string,
): Promise<VerificationEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    return {
      sent: false,
      error: "Email delivery is not configured.",
    };
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: email,
      subject: "Your Zenlora verification code",
      text: `Your Zenlora verification code is ${code}. It expires in 10 minutes.`,
      html: `<p>Your Zenlora verification code is:</p><p style="font-size: 28px; font-weight: 700; letter-spacing: 6px;">${code}</p><p>This code expires in 10 minutes.</p>`,
    });

    if (error) {
      return { sent: false, error: error.message };
    }

    return { sent: true };
  } catch (error) {
    return {
      sent: false,
      error: error instanceof Error ? error.message : "Email delivery failed.",
    };
  }
}
