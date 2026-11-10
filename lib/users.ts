import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

export type AdminUser = {
  _id: ObjectId;
  email: string;
  password: string;
  name?: string;
  role?: string;
  createdAt: Date;
  updatedAt: Date;
};

const COLLECTION = "users";

export async function getUserByEmail(
  email: string,
): Promise<AdminUser | null> {
  const db = await getDb();
  return db.collection<AdminUser>(COLLECTION).findOne({
    email: email.toLowerCase().trim(),
  });
}

export async function updateUserPassword(
  email: string,
  passwordHash: string,
): Promise<boolean> {
  const db = await getDb();
  const result = await db.collection<AdminUser>(COLLECTION).updateOne(
    { email: email.toLowerCase().trim() },
    {
      $set: {
        password: passwordHash,
        updatedAt: new Date(),
      },
    },
  );

  return result.matchedCount === 1;
}
