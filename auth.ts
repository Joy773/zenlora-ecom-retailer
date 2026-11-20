import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { sessionConfig } from "@/lib/session-config";
import { connectMongoose } from "@/lib/mongoose";
import { Customer } from "@/models/Customer";

export const { handlers, signIn, signOut } = NextAuth({
  ...sessionConfig("customer"),
  providers: [
    Credentials({
      id: "customer-credentials",
      name: "Customer credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email =
          typeof credentials?.email === "string"
            ? credentials.email.trim().toLowerCase()
            : "";
        const password =
          typeof credentials?.password === "string"
            ? credentials.password
            : "";

        if (!email || !password) {
          return null;
        }

        await connectMongoose();
        const customer = await Customer.findOne({ email }).select(
          "+passwordHash",
        );

        if (!customer) {
          return null;
        }

        const passwordMatches = await bcrypt.compare(
          password,
          customer.passwordHash,
        );

        if (!passwordMatches) {
          return null;
        }

        return {
          id: customer._id.toString(),
          email: customer.email,
          name: customer.fullName,
          role: "customer",
        };
      },
    }),
  ],
});
