"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/navbar";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
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

    toast.success(message, { toastId: `auth-${authNotice}` });

    const params = new URLSearchParams(searchParams.toString());
    params.delete("auth");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }, [authNotice, pathname, router, searchParams]);

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
