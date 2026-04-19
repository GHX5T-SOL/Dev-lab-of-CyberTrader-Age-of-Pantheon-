"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { SpendTicker } from "@/components/SpendTicker";

const NAV = [
  { href: "/office", label: "Floor" },
  { href: "/office/roadmap", label: "Roadmap" },
  { href: "/office/tasks", label: "Tasks" },
  { href: "/office/team", label: "Team" },
  { href: "/office/council", label: "Council" },
  { href: "/office/automations", label: "Crons" },
  { href: "/office/spend", label: "Spend" },
  { href: "/office/bible", label: "Bible" },
  { href: "/office/brand", label: "Brand" },
  { href: "/office/avatars", label: "Avatars" },
  { href: "/office/wireframes", label: "Wireframes" },
  { href: "/office/status", label: "Status" },
  { href: "/office/notes", label: "Notes" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/gate");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-cyan/15 bg-void/70 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
        <Link
          href="/office"
          className="flex items-center gap-3 text-chrome no-underline hover:text-chrome"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-sm border border-cyan/50 bg-ink text-[11px] text-cyan">
            CT
          </span>
          <span className="text-sm uppercase tracking-[0.25em]">
            <span className="text-chrome">dev</span>
            <span className="text-cyan">lab</span>
          </span>
          <span className="ml-2 hidden text-[10px] uppercase tracking-[0.25em] text-dust md:inline">
            neon void city // 2077
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => {
            const active = pathname === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={clsx(
                  "rounded-sm px-3 py-1 text-[11px] uppercase tracking-[0.2em] transition-colors",
                  active
                    ? "bg-cyan/10 text-cyan"
                    : "text-dust hover:bg-ink hover:text-chrome"
                )}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <SpendTicker />
          <button
            onClick={logout}
            className="rounded-sm border border-heat/30 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-heat hover:bg-heat/10"
          >
            lock
          </button>
        </div>
      </div>

      {/* Mobile mini-nav */}
      <nav className="flex gap-1 overflow-x-auto border-t border-cyan/10 px-5 py-2 md:hidden">
        {NAV.map((n) => {
          const active = pathname === n.href;
          return (
            <Link
              key={n.href}
              href={n.href}
              className={clsx(
                "shrink-0 rounded-sm px-2 py-1 text-[10px] uppercase tracking-[0.2em]",
                active ? "bg-cyan/10 text-cyan" : "text-dust"
              )}
            >
              {n.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
