"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/navbar";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { status, update } = useSession();
  const searchParams = useSearchParams();
  const isAdminRoute = pathname.startsWith("/admin");
  const authNotice = searchParams.get("auth");

  useEffect(() => {
    const message =
      authNotice === "login"
        ? "You are now logged in."
        : authNotice === "signup"
          ? "Your account has been created and you are now logged in."
          : authNotice === "logout"
            ? "You have been logged out."
            : null;

    if (!message) return;

    const signedIn = authNotice === "login" || authNotice === "signup";
    if (signedIn && status === "loading") return;

    const url = new URL(window.location.href);
    if (url.searchParams.get("auth") !== authNotice) return;
    url.searchParams.delete("auth");
    window.history.replaceState(null, "", url.pathname + url.search + url.hash);

    // Server-side sign-in sets the cookie while SessionProvider stays mounted.
    if (signedIn && status === "unauthenticated") void update();
    toast.success(message, { toastId: `auth-${authNotice}` });
  }, [authNotice, status, update]);

  if (isAdminRoute) {
    return <main className="flex flex-1 flex-col">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
