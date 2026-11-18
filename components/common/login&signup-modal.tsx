"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import { toast } from "react-toastify";
import { HiOutlineXMark } from "react-icons/hi2";
import {
  loginCustomer,
  registerCustomer,
  type CustomerAuthState,
} from "@/lib/customer-auth";

type AccountView = "login" | "signup";

type LoginSignupModalProps = {
  open: boolean;
  onClose: () => void;
};

const inputClassName =
  "w-full rounded-full border border-primary bg-white px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-foreground/35 focus:border-accent";

const initialAuthState: CustomerAuthState = {};

export default function LoginSignupModal({
  open,
  onClose,
}: LoginSignupModalProps) {
  const [view, setView] = useState<AccountView>("login");
  const [loginState, loginFormAction, isLoginPending] = useActionState(
    loginCustomer,
    initialAuthState,
  );
  const [signupState, signupFormAction, isSignupPending] = useActionState(
    registerCustomer,
    initialAuthState,
  );
  const titleId = useId();
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (loginState.error) {
      toast.error(loginState.error);
    }
  }, [loginState]);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const focusFrame = window.requestAnimationFrame(() => {
      firstInputRef.current?.focus();
    });
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  const switchView = (nextView: AccountView) => {
    setView(nextView);
    window.requestAnimationFrame(() => firstInputRef.current?.focus());
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-6">
      <button
        type="button"
        aria-label="Close account modal"
        className="absolute inset-0 bg-foreground/35"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl border border-primary bg-background p-6 shadow-lg sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
              Zenlora
            </p>
            <h2
              id={titleId}
              className="mt-2 font-serif text-3xl font-normal italic leading-none text-foreground sm:text-4xl"
            >
              {view === "login" ? "Welcome back" : "Create an account"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close account modal"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-foreground/55 transition-colors hover:bg-primary/60 hover:text-foreground"
          >
            <HiOutlineXMark className="h-5 w-5" />
          </button>
        </div>

        <div
          role="tablist"
          aria-label="Account options"
          className="mt-7 grid grid-cols-2 border-b border-primary"
        >
          {(["login", "signup"] as const).map((option) => {
            const selected = view === option;
            return (
              <button
                key={option}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => switchView(option)}
                className={`border-b-2 px-3 py-3 text-sm font-semibold transition-colors ${
                  selected
                    ? "border-accent text-accent"
                    : "border-transparent text-foreground/55 hover:text-foreground"
                }`}
              >
                {option === "login" ? "Log in" : "Sign up"}
              </button>
            );
          })}
        </div>

        {view === "login" ? (
          <form action={loginFormAction} className="mt-7 flex flex-col gap-5">
            <label className="flex flex-col gap-2">
              <span className="text-xs font-medium text-foreground/70">
                Email address
              </span>
              <input
                ref={firstInputRef}
                type="email"
                name="email"
                autoComplete="email"
                required
                className={inputClassName}
                placeholder="you@example.com"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-xs font-medium text-foreground/70">
                Password
              </span>
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                required
                className={inputClassName}
                placeholder="Enter your password"
              />
            </label>
            <button
              type="submit"
              disabled={isLoginPending}
              className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent/90"
            >
              {isLoginPending ? "Logging in..." : "Log in"}
            </button>
            <p className="text-center text-xs text-foreground/55">
              New to Zenlora?{" "}
              <button
                type="button"
                onClick={() => switchView("signup")}
                className="font-semibold text-accent hover:underline"
              >
                Create an account
              </button>
            </p>
          </form>
        ) : (
          <form action={signupFormAction} className="mt-7 flex flex-col gap-5">
            <label className="flex flex-col gap-2">
              <span className="text-xs font-medium text-foreground/70">
                Full name
              </span>
              <input
                ref={firstInputRef}
                type="text"
                name="fullName"
                autoComplete="name"
                required
                className={inputClassName}
                placeholder="Your name"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-xs font-medium text-foreground/70">
                Email address
              </span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                required
                className={inputClassName}
                placeholder="you@example.com"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-xs font-medium text-foreground/70">
                Password
              </span>
              <input
                type="password"
                name="password"
                autoComplete="new-password"
                minLength={8}
                required
                className={inputClassName}
                placeholder="At least 8 characters"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-xs font-medium text-foreground/70">
                Confirm password
              </span>
              <input
                type="password"
                name="confirmPassword"
                autoComplete="new-password"
                minLength={8}
                required
                className={inputClassName}
                placeholder="Enter your password again"
              />
            </label>
            {signupState.error ? (
              <p className="text-xs text-red-600" role="alert">
                {signupState.error}
              </p>
            ) : null}
            {signupState.success ? (
              <p className="text-xs text-emerald-700" role="status">
                {signupState.success}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={isSignupPending}
              className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent/90"
            >
              {isSignupPending ? "Creating account..." : "Create account"}
            </button>
            <p className="text-center text-xs text-foreground/55">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => switchView("login")}
                className="font-semibold text-accent hover:underline"
              >
                Log in
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
