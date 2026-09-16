"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronDown, LogOut, UserRound } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getUser().then(({ data }) => {
      if (isMounted) {
        setUser(data.user);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      },
    );

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  const displayName =
    user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || "Profile";

  return (
    <main className="min-h-screen bg-[#fafafa] text-neutral-900">
      <header className="border-b border-neutral-200/80 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <Link className="flex items-center gap-2.5" href="/">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 font-mono text-xs font-medium text-neutral-700">
              01
            </span>
            <span className="text-sm font-semibold tracking-tight">Base Number Handbook</span>
          </Link>

          <div className="relative">
            <button
              aria-label="เปิดเมนูโปรไฟล์"
              aria-expanded={isProfileOpen}
              className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-2 py-1.5 text-left transition hover:border-neutral-300 hover:bg-neutral-50"
              onClick={() => setIsProfileOpen((isOpen) => !isOpen)}
              type="button"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-neutral-900 text-white">
                <UserRound aria-hidden="true" className="h-3.5 w-3.5" />
              </span>
              <span className="hidden max-w-32 truncate text-xs font-medium sm:block">
                {displayName}
              </span>
              <ChevronDown aria-hidden="true" className="h-3.5 w-3.5 text-neutral-400" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 z-10 mt-2 w-56 rounded-xl border border-neutral-200 bg-white p-2 shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
                <div className="border-b border-neutral-100 px-3 py-2">
                  <p className="text-[11px] text-neutral-400">SIGNED IN AS</p>
                  <p className="mt-0.5 truncate text-sm font-medium text-neutral-900">
                    {user?.email || "Guest"}
                  </p>
                </div>
                <button
                  className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-red-600 transition hover:bg-red-50"
                  onClick={handleLogout}
                  type="button"
                >
                  <LogOut aria-hidden="true" className="h-3.5 w-3.5" />
                  ออกจากระบบ
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="max-w-2xl">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400">
            BASE NUMBER HANDBOOK / DASHBOARD
          </p>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">
            ยินดีต้อนรับกลับ, {displayName}
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-6 text-neutral-500 sm:text-base">
            พร้อมแล้วสำหรับการทำแบบทดสอบและติดตามความคืบหน้าของคุณ
          </p>

          {!user && (
            <Link
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-neutral-800"
              href="/login"
            >
              เข้าสู่ระบบ
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}
