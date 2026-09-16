"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight, Binary, Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        const message = result.error?.toLowerCase().includes("credentials")
          ? "อีเมลหรือรหัสผ่านไม่ถูกต้อง"
          : result.error || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ";
        setError(message);
        return;
      }

      router.push("/");
    } catch {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fafafa] px-4 py-10 font-sans text-neutral-900 antialiased selection:bg-neutral-900 selection:text-white">
      <section className="w-full max-w-sm">
        <header className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-900 shadow-sm">
            <Binary aria-hidden="true" className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <h1 className="text-lg font-semibold tracking-tight">Base Number Handbook</h1>
          <p className="mt-1 text-xs text-neutral-500">
            เข้าสู่ระบบเพื่อเข้าใช้งานบทเรียนและแบบฝึกหัด
          </p>
        </header>

        <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] sm:p-7">
          <div className="mb-5">
            <h2 className="text-base font-semibold">ยินดีต้อนรับกลับ</h2>
            <p className="mt-0.5 text-xs text-neutral-400">กรอกข้อมูลบัญชีเพื่อดำเนินการต่อ</p>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 p-3 text-xs text-red-600" role="alert">
              <AlertCircle aria-hidden="true" className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleLogin}>
            <label className="block space-y-1 text-xs font-medium text-neutral-700" htmlFor="email">
              <span>อีเมล</span>
              <input
                className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 disabled:bg-neutral-50"
                disabled={isSubmitting}
                id="email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="student@example.com"
                required
                type="email"
                value={email}
              />
            </label>

            <label className="block space-y-1 text-xs font-medium text-neutral-700" htmlFor="password">
              <span>รหัสผ่าน</span>
              <span className="relative block">
                <input
                  className="w-full rounded-lg border border-neutral-200 bg-white py-2 pl-3.5 pr-10 font-mono text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 disabled:bg-neutral-50"
                  disabled={isSubmitting}
                  id="password"
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                />
                <button
                  aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 transition hover:text-neutral-700 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                  onClick={() => setShowPassword((isVisible) => !isVisible)}
                  type="button"
                >
                  {showPassword ? <EyeOff aria-hidden="true" className="h-4 w-4" /> : <Eye aria-hidden="true" className="h-4 w-4" />}
                </button>
              </span>
            </label>

            <label className="flex cursor-pointer select-none items-center gap-2 pt-0.5 text-xs text-neutral-500">
              <input
                checked={rememberMe}
                className="h-3.5 w-3.5 cursor-pointer rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 focus:ring-offset-0"
                onChange={(event) => setRememberMe(event.target.checked)}
                type="checkbox"
              />
              <span>จดจำการเข้าสู่ระบบ</span>
            </label>

            <button
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-neutral-900 px-4 py-2.5 text-xs font-medium text-white shadow-sm transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
              disabled={isSubmitting}
              type="submit"
            >
              <span>{isSubmitting ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}</span>
              {isSubmitting ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : <ArrowRight aria-hidden="true" className="h-4 w-4" />}
            </button>
          </form>

          <footer className="mt-5 border-t border-neutral-100 pt-4 text-center text-xs text-neutral-500">
            ยังไม่มีบัญชี?
            <Link className="ml-1 font-medium text-neutral-900 underline underline-offset-4 transition-colors hover:text-neutral-600" href="/register">
              สมัครสมาชิก
            </Link>
          </footer>
        </div>

        <p className="mt-6 text-center font-mono text-[11px] text-neutral-400">BASE NUMBER HANDBOOK © 2026</p>
      </section>
    </main>
  );
}
