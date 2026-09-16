"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

const roles = [
  { value: "teacher", label: "ครู", description: "สำหรับผู้สอนและผู้ดูแลเนื้อหาชั้นเรียน" },
  { value: "student", label: "นักเรียน", description: "สำหรับผู้เรียนที่ใช้งานบทเรียน" },
  { value: "admin", label: "แอดมิน", description: "สิทธิ์นี้กำหนดโดยผู้ดูแลระบบเท่านั้น" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [alert, setAlert] = useState({ message: "", isSuccess: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleRegister(event) {
    event.preventDefault();
    setAlert({ message: "", isSuccess: false });

    if (password.length < 6) {
      setAlert({ message: "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร", isSuccess: false });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { full_name: fullName.trim(), role } },
      });

      if (signUpError) {
        setAlert({ message: signUpError.message, isSuccess: false });
        return;
      }

      if (!data.user) {
        setAlert({ message: "ไม่สามารถสร้างบัญชีได้", isSuccess: false });
        return;
      }

      if (!data.session) {
        setAlert({
          message: "สร้างบัญชีสำเร็จ! โปรดตรวจสอบอีเมลของคุณเพื่อยืนยันการใช้งาน",
          isSuccess: true,
        });
        setFullName("");
        setEmail("");
        setPassword("");
        return;
      }

      setAlert({ message: "สร้างบัญชีสำเร็จ กำลังนำคุณเข้าสู่ระบบ...", isSuccess: true });
      window.setTimeout(() => router.push("/"), 1200);
    } catch (error) {
      setAlert({ message: error.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง", isSuccess: false });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fafafa] px-4 py-10 font-sans text-neutral-900 antialiased selection:bg-neutral-900 selection:text-white">
      <section className="my-6 w-full max-w-[420px]">
        <header className="mb-6 text-center">
          <div className="mx-auto mb-3 inline-flex items-center gap-1.5 rounded-md border border-neutral-200 bg-neutral-100 px-2.5 py-1 font-mono text-[11px] text-neutral-600">
            <span>01</span><span className="text-neutral-300">/</span><span>CREATE_ACCOUNT</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight">สร้างบัญชีใหม่</h1>
          <p className="mt-1 text-xs text-neutral-500">เลือกบทบาทที่ตรงกับการใช้งานของคุณ</p>
        </header>

        <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] sm:p-7">
          {alert.message && (
            <div className={`mb-4 flex items-center gap-2 rounded-lg border p-3 text-xs ${alert.isSuccess ? "border-emerald-100 bg-emerald-50 text-emerald-700" : "border-red-100 bg-red-50 text-red-600"}`} role="alert">
              {alert.isSuccess ? <CheckCircle aria-hidden="true" className="h-4 w-4 shrink-0" /> : <AlertCircle aria-hidden="true" className="h-4 w-4 shrink-0" />}
              <span>{alert.message}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleRegister}>
            <label className="block space-y-1 text-xs font-medium text-neutral-700" htmlFor="fullName">
              <span>ชื่อที่แสดง</span>
              <input className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 disabled:bg-neutral-50" disabled={isSubmitting} id="fullName" onChange={(event) => setFullName(event.target.value)} placeholder="ชื่อ - นามสกุล" required type="text" value={fullName} />
            </label>

            <label className="block space-y-1 text-xs font-medium text-neutral-700" htmlFor="email">
              <span>อีเมล</span>
              <input className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 disabled:bg-neutral-50" disabled={isSubmitting} id="email" onChange={(event) => setEmail(event.target.value)} placeholder="name@example.com" required type="email" value={email} />
            </label>

            <label className="block space-y-1 text-xs font-medium text-neutral-700" htmlFor="password">
              <span>รหัสผ่าน</span>
              <input className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2 font-mono text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 disabled:bg-neutral-50" disabled={isSubmitting} id="password" minLength={6} onChange={(event) => setPassword(event.target.value)} placeholder="อย่างน้อย 6 ตัวอักษร" required type="password" value={password} />
            </label>

            <fieldset className="space-y-2 pt-1">
              <legend className="text-xs font-medium text-neutral-700">บทบาท</legend>
              <div className="space-y-2">
                {roles.map((item) => {
                  const isSelected = role === item.value;
                  return (
                    <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-all ${isSelected ? "border-neutral-900 bg-neutral-50/60" : "border-neutral-200 bg-white hover:border-neutral-300"}`} key={item.value}>
                      <input checked={isSelected} className="mt-0.5 h-3.5 w-3.5 cursor-pointer accent-neutral-900" disabled={isSubmitting} name="role" onChange={() => setRole(item.value)} type="radio" value={item.value} />
                      <span className="select-none"><span className="block text-xs font-medium text-neutral-900">{item.label}</span><span className="mt-0.5 block text-[11px] text-neutral-500">{item.description}</span></span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <button className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-neutral-900 px-4 py-2.5 text-xs font-medium text-white shadow-sm transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm" disabled={isSubmitting} type="submit">
              <span>{isSubmitting ? "กำลังสร้างบัญชี..." : "สมัครสมาชิก"}</span>
              {isSubmitting && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />}
            </button>
          </form>

          <footer className="mt-5 border-t border-neutral-100 pt-4 text-center text-xs text-neutral-500">
            มีบัญชีอยู่แล้ว?
            <Link className="ml-1 font-medium text-neutral-900 underline underline-offset-4 transition-colors hover:text-neutral-600" href="/login">เข้าสู่ระบบ</Link>
          </footer>
        </div>

        <p className="mt-6 text-center font-mono text-[11px] text-neutral-400">BASE NUMBER HANDBOOK © 2026</p>
      </section>
    </main>
  );
}
