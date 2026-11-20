"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import { HiOutlineXMark } from "react-icons/hi2";
import {
  customerAuth,
  type CustomerAuthState,
} from "@/lib/customer-auth";

type AccountView = "login" | "signup" | "verify";

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
  const [authState, authFormAction, isAuthPending] = useActionState(
    customerAuth,
    initialAuthState,
  );
  const titleId = useId();
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (authState.verificationRequired) {
      // The completed server action advances the modal's local state machine.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setView("verify");
    } else if (authState.verified) {
      setView("login");
    }
  }, [authState]);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;

    const focusFrame = window.requestAnimationFrame(() => {
      firstInputRef.current?.focus();
    });

    return () => window.cancelAnimationFrame(focusFrame);
  }, [open, view]);

  if (!open) return null;

  const switchView = (nextView: AccountView) => {
    setView(nextView);
  };

  const activeView = view;
  const verificationEmail = authState.verificationEmail ?? "";
  const verificationChallengeId = authState.verificationChallengeId ?? "";
  const loginEmail = verificationEmail;

  const title =
    activeView === "login"
      ? "Welcome back"
      : activeView === "signup"
        ? "Create an account"
        : "Verify your email";

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
              {title}
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

        {activeView !== "verify" ? (
          <div
            role="tablist"
            aria-label="Account options"
            className="mt-7 grid grid-cols-2 border-b border-primary"
          >
            {(["login", "signup"] as const).map((option) => {
              const selected = activeView === option;
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
        ) : null}

        {activeView === "login" ? (
          <form action={authFormAction} className="mt-7 flex flex-col gap-5">
            <input type="hidden" name="intent" value="login" />
            {authState.verified && authState.success ? (
              <p className="text-xs text-emerald-700" role="status">
                {authState.success}
              </p>
            ) : null}
            <label className="flex flex-col gap-2">
              <span className="text-xs font-medium text-foreground/70">
                Email address
              </span>
              <input
                key={loginEmail}
                ref={firstInputRef}
                type="email"
                name="email"
                autoComplete="email"
                defaultValue={loginEmail}
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
            {authState.action === "login" && authState.error ? (
              <p className="text-xs text-red-600" role="alert">
                {authState.error}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={isAuthPending}
              className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isAuthPending ? "Logging in..." : "Log in"}
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
        ) : activeView === "signup" ? (
          <form action={authFormAction} className="mt-7 flex flex-col gap-5">
            <input type="hidden" name="intent" value="register" />
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
            {authState.action === "register" && authState.error ? (
              <p className="text-xs text-red-600" role="alert">
                {authState.error}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={isAuthPending}
              className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isAuthPending ? "Creating account..." : "Create account"}
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
        ) : (
          <div className="mt-7 flex flex-col gap-5">
            <p className="text-sm text-foreground/70">
              Enter the six-digit code sent to{" "}
              <span className="font-semibold text-foreground">
                {verificationEmail}
              </span>
              .
            </p>
            <form action={authFormAction} className="flex flex-col gap-5">
              <input type="hidden" name="intent" value="verify" />
              <input type="hidden" name="email" value={verificationEmail} />
              <input
                type="hidden"
                name="challengeId"
                value={verificationChallengeId}
              />
              <label className="flex flex-col gap-2">
                <span className="text-xs font-medium text-foreground/70">
                  Verification code
                </span>
                <input
                  ref={firstInputRef}
                  type="text"
                  name="code"
                  autoComplete="one-time-code"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  required
                  className={`${inputClassName} text-center text-xl font-semibold tracking-[0.35em]`}
                  placeholder="000000"
                  onInput={(event) => {
                    event.currentTarget.value = event.currentTarget.value
                      .replace(/\D/g, "")
                      .slice(0, 6);
                  }}
                />
              </label>
              {authState.error || authState.success ? (
                <p
                  className={`text-xs ${
                    authState.error
                      ? "text-red-600"
                      : "text-emerald-700"
                  }`}
                  role={authState.error ? "alert" : "status"}
                >
                  {authState.error ?? authState.success}
                </p>
              ) : null}
              <button
                type="submit"
                disabled={isAuthPending}
                className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isAuthPending ? "Verifying..." : "Verify email"}
              </button>
            </form>
            <form action={authFormAction} className="text-center">
              <input type="hidden" name="intent" value="resend" />
              <input type="hidden" name="email" value={verificationEmail} />
              <button
                type="submit"
                disabled={isAuthPending}
                className="text-xs font-semibold text-accent hover:underline disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isAuthPending ? "Sending..." : "Resend code"}
              </button>
            </form>
            <button
              type="button"
              onClick={() => switchView("login")}
              className="text-center text-xs text-foreground/55 hover:text-foreground"
            >
              Back to login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
