"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

  const displayName = user?.user_metadata?.name || user?.email || "Profile";

  return (
    <main className="min-h-screen bg-zinc-100 text-zinc-900">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold tracking-tight text-indigo-600">
            Exam App
          </h1>

          <div className="relative">
            <button
              aria-expanded={isProfileOpen}
              className="flex items-center gap-3 rounded-full border border-zinc-200 bg-white px-3 py-2 text-left transition hover:border-indigo-300 hover:bg-indigo-50"
              onClick={() => setIsProfileOpen((isOpen) => !isOpen)}
              type="button"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700">
                {displayName.charAt(0).toUpperCase()}
              </span>
              <span className="max-w-32 truncate text-sm font-medium">
                {displayName}
              </span>
              <span className="text-xs text-zinc-400">⌄</span>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 z-10 mt-2 w-56 rounded-xl border border-zinc-200 bg-white p-2 shadow-lg">
                <div className="border-b border-zinc-100 px-3 py-2">
                  <p className="text-xs text-zinc-500">Signed in as</p>
                  <p className="truncate text-sm font-medium text-zinc-900">
                    {user?.email || "Guest"}
                  </p>
                </div>
                <button
                  className="mt-2 w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                  onClick={handleLogout}
                  type="button"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
          Dashboard
        </p>
        <h2 className="mt-3 text-4xl font-bold tracking-tight">
          Welcome back, {displayName}
        </h2>
        <p className="mt-4 max-w-xl text-lg text-zinc-600">
          พร้อมแล้วสำหรับการทำแบบทดสอบและติดตามความคืบหน้าของคุณ
        </p>

        {!user && (
          <Link
            className="mt-8 inline-block rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
            href="/login"
          >
            Login
          </Link>
        )}
      </section>
    </main>
  );
}
