import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectMongoose } from "@/lib/mongoose";
import { getUserByEmail } from "@/lib/users";
import { Customer } from "@/models/Customer";

const ONE_DAY_IN_SECONDS = 60 * 60 * 24;

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
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

        const user = await getUserByEmail(email);

        if (!user) {
          return null;
        }

        const passwordMatches = await bcrypt.compare(password, user.password);

        if (!passwordMatches) {
          return null;
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name ?? "Admin",
          role: "admin",
        };
      },
    }),
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
  session: {
    strategy: "jwt",
    maxAge: ONE_DAY_IN_SECONDS,
  },
  jwt: {
    maxAge: ONE_DAY_IN_SECONDS,
  },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.email = token.email ?? "";
        session.user.name = token.name ?? "Admin";
        session.user.role = token.role === "customer" ? "customer" : "admin";
      }
      return session;
    },
  },
  trustHost: true,
});
