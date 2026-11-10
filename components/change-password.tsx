"use client";

import { useActionState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/common/button";
import {
  changePasswordAction,
  type AuthActionState,
} from "@/app/actions/auth";

const inputClassName =
  "rounded-full border border-primary bg-white px-4 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-foreground/35 focus:border-accent";

const initialState: AuthActionState = {};

export default function ChangePassword() {
  const [state, formAction, isPending] = useActionState(
    changePasswordAction,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      toast.success(state.success);
    }
  }, [state.success]);

  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
    }
  }, [state.error]);

  return (
    <div className="mt-8 w-full max-w-md rounded-xl border border-primary bg-background p-6 md:p-8">
      <p className="text-sm font-medium tracking-[0.2em] text-accent uppercase">
        Zenlora
      </p>
      <h2 className="mt-2 font-serif text-3xl font-normal italic text-foreground">
        Change password
      </h2>
      <p className="mt-3 text-[13px] leading-relaxed text-foreground/60">
        Enter your current password, then choose a new one.
      </p>

      <form action={formAction} className="mt-8 flex flex-col gap-5">
        <label className="flex flex-col gap-2">
          <span className="text-[12px] font-medium tracking-wide text-foreground/70">
            Current password
          </span>
          <input
            type="password"
            name="currentPassword"
            autoComplete="current-password"
            required
            className={inputClassName}
            placeholder="Enter current password"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-[12px] font-medium tracking-wide text-foreground/70">
            New password
          </span>
          <input
            type="password"
            name="newPassword"
            autoComplete="new-password"
            required
            minLength={8}
            className={inputClassName}
            placeholder="Enter new password"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-[12px] font-medium tracking-wide text-foreground/70">
            Confirm new password
          </span>
          <input
            type="password"
            name="confirmPassword"
            autoComplete="new-password"
            required
            minLength={8}
            className={inputClassName}
            placeholder="Confirm new password"
          />
        </label>

        <Button
          type="submit"
          variant="accent"
          className="mt-2 w-full"
          disabled={isPending}
        >
          {isPending ? "Updating..." : "Update password"}
        </Button>
      </form>
    </div>
  );
}
