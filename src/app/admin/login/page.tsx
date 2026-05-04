import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Masuk Admin", robots: { index: false } };

export default async function LoginPage() {
  // If already signed in, skip the form.
  const token = (await cookies()).get("ttm_session")?.value;
  const secret = process.env.SESSION_SECRET;
  if (token && secret && secret.length >= 32) {
    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(secret),
      );
      if (payload.admin === true) redirect("/admin");
    } catch {
      // Fall through to login form.
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6 py-16">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">
          Admin
        </p>
        <h1 className="mt-3 text-2xl font-semibold">Masuk ke dashboard</h1>
        <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
          Akses dibatasi untuk tim TTM Tank.
        </p>
      </div>

      <div className="mt-8">
        <LoginForm />
      </div>
    </main>
  );
}
