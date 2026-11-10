import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "@/lib/users";

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
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.email = token.email ?? "";
        session.user.name = token.name ?? "Admin";
      }
      return session;
    },
  },
  trustHost: true,
});
