import type { NextAuthConfig } from "next-auth";

export function sessionConfig(role: "admin" | "customer") {
  const cookiePrefix = `zenlora.${role}`;

  return {
    basePath: role === "admin" ? "/api/admin-auth" : "/api/auth",
    trustHost: true,
    session: { strategy: "jwt", maxAge: 24 * 60 * 60 },
    cookies: {
      sessionToken: { name: `${cookiePrefix}.session-token`, options: {} },
      csrfToken: { name: `${cookiePrefix}.csrf-token`, options: {} },
      callbackUrl: { name: `${cookiePrefix}.callback-url`, options: {} },
    },
    callbacks: {
      jwt({ token, user }) {
        if (user) token.role = user.role;
        if (!token.sub || token.role !== role) return null;
        return token;
      },
      session({ session, token }) {
        session.user.id = token.sub!;
        session.user.role = role;
        return session;
      },
    },
  } satisfies Omit<NextAuthConfig, "providers">;
}
