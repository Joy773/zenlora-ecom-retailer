import bcrypt from "bcryptjs";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017";
const dbName = process.env.MONGODB_DB ?? "zenlora";
const email = (process.env.ADMIN_EMAIL ?? "zenlorabd@gmail.com").toLowerCase();
const password = process.env.ADMIN_PASSWORD ?? "ZenloraAdmin1!";
const name = process.env.ADMIN_NAME ?? "Zenlora Admin";

async function seedAdmin() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const users = db.collection("users");

    await users.createIndex({ email: 1 }, { unique: true });

    const passwordHash = await bcrypt.hash(password, 12);
    const now = new Date();

    await users.updateOne(
      { email },
      {
        $set: {
          email,
          password: passwordHash,
          name,
          role: "admin",
          updatedAt: now,
        },
        $setOnInsert: {
          createdAt: now,
        },
      },
      { upsert: true },
    );

    console.log(`Admin user ready: ${email}`);
  } finally {
    await client.close();
  }
}

seedAdmin().catch((error) => {
  console.error("Failed to seed admin user:", error);
  process.exit(1);
});
