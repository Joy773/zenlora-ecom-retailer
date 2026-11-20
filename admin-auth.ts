import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { sessionConfig } from "@/lib/session-config";
import { getUserByEmail } from "@/lib/users";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...sessionConfig("admin"),
  pages: { signIn: "/admin/login" },
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

        if (user?.role !== "admin") {
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
  ],
});
