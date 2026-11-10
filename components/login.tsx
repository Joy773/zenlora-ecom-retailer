"use client";

import { useActionState } from "react";
import Button from "@/components/common/button";
import { loginAction, type AuthActionState } from "@/app/actions/auth";

const initialState: AuthActionState = {};

export default function Login() {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState,
  );

  return (
    <section className="flex flex-1 items-center justify-center px-6 py-16 md:px-16 lg:px-20 lg:py-20">
      <div className="w-full max-w-md rounded-xl border border-primary bg-background p-8 md:p-10">
        <p className="text-sm font-medium tracking-[0.2em] text-accent uppercase">
          Zenlora
        </p>
        <h1 className="mt-3 font-serif text-4xl font-normal italic leading-none text-foreground md:text-5xl">
          Admin login
        </h1>
        <p className="mt-4 text-[13px] leading-relaxed text-foreground/60">
          Sign in to manage products, orders, and store content.
        </p>

        <form action={formAction} className="mt-10 flex flex-col gap-5">
          <label className="flex flex-col gap-2">
            <span className="text-[12px] font-medium tracking-wide text-foreground/70">
              Email
            </span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              className="rounded-full border border-primary bg-white px-4 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-foreground/35 focus:border-accent"
              placeholder="zenlorabd@gmail.com"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-[12px] font-medium tracking-wide text-foreground/70">
              Password
            </span>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              required
              className="rounded-full border border-primary bg-white px-4 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-foreground/35 focus:border-accent"
              placeholder="Enter your password"
            />
          </label>

          {state.error ? (
            <p className="text-[13px] text-red-600" role="alert">
              {state.error}
            </p>
          ) : null}

          <Button
            type="submit"
            variant="accent"
            className="mt-2 w-full"
            disabled={isPending}
          >
            {isPending ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </div>
    </section>
  );
}
