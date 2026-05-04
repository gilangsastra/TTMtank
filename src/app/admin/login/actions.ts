"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import bcrypt from "bcryptjs";
import { createSessionToken, setSessionCookie } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

export type LoginState = { error: string | null };

const RATE_LIMIT = { max: 8, windowMs: 10 * 60_000 };

async function getIp(): Promise<string> {
  const h = await headers();
  const fwd = h.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]?.trim() || "unknown";
  return h.get("x-real-ip") ?? "unknown";
}

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const ip = await getIp();
  const rl = rateLimit(`login:${ip}`, RATE_LIMIT);
  if (!rl.allowed) {
    return { error: "Terlalu banyak percobaan masuk. Coba lagi dalam beberapa menit." };
  }

  const password = formData.get("password");
  if (typeof password !== "string" || password.length === 0) {
    return { error: "Password wajib diisi." };
  }

  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash) {
    console.error("[login] ADMIN_PASSWORD_HASH not set");
    return { error: "Konfigurasi server belum lengkap." };
  }

  const ok = await bcrypt.compare(password, hash);
  if (!ok) {
    // Generic message — don't reveal whether the password is wrong vs. config issue.
    return { error: "Password salah." };
  }

  try {
    const token = await createSessionToken();
    await setSessionCookie(token);
  } catch (err) {
    console.error("[login] session creation failed", err);
    return { error: "Gagal membuat sesi. Coba lagi." };
  }

  redirect("/admin");
}
