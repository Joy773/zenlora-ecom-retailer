import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { AdminUser } from "../models/AdminUser";

const uri = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017";
const dbName = process.env.MONGODB_DB ?? "zenlora";
const email = (process.env.ADMIN_EMAIL ?? "zenlorabd@gmail.com").toLowerCase();
const password = process.env.ADMIN_PASSWORD ?? "ZenloraAdmin1!";
const name = process.env.ADMIN_NAME ?? "Zenlora Admin";

async function seedAdmin() {
  try {
    await mongoose.connect(uri, { dbName });
    await AdminUser.createIndexes();

    const passwordHash = await bcrypt.hash(password, 12);

    await AdminUser.updateOne(
      { email },
      {
        $set: {
          email,
          password: passwordHash,
          name,
          role: "admin",
        },
      },
      { upsert: true },
    );

    console.log(`Admin user ready: ${email}`);
  } finally {
    await mongoose.disconnect();
  }
}

seedAdmin().catch((error) => {
  console.error("Failed to seed admin user:", error);
  process.exit(1);
});
