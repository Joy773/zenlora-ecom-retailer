import { connectMongoose } from "@/lib/mongoose";
import { AdminUser } from "@/models/AdminUser";

export async function getUserByEmail(email: string) {
  await connectMongoose();
  return AdminUser.findOne({ email: email.toLowerCase().trim() })
    .select("+password")
    .lean();
}

export async function updateUserPassword(
  email: string,
  passwordHash: string,
): Promise<boolean> {
  await connectMongoose();
  const result = await AdminUser.updateOne(
    { email: email.toLowerCase().trim() },
    { $set: { password: passwordHash } },
  );

  return result.matchedCount === 1;
}
