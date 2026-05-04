"use client";

import { useActionState } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { login, type LoginState } from "./actions";

const initial: LoginState = { error: null };

export function LoginForm() {
  const [state, action, isPending] = useActionState(login, initial);

  return (
    <form action={action} className="space-y-5" noValidate>
      {state.error ? (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-[var(--radius-md)] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <p>{state.error}</p>
        </div>
      ) : null}

      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          autoFocus
          className="block w-full rounded-[var(--radius-sm)] border border-[var(--color-line)] bg-white px-3.5 py-2.5 text-sm focus:border-[var(--color-ink)] focus:outline-none"
        />
      </div>

      <Button type="submit" size="lg" disabled={isPending} className="w-full">
        {isPending ? "Memverifikasi..." : "Masuk"}
      </Button>
    </form>
  );
}
