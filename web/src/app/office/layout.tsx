"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import { AmbientAudio } from "@/components/AmbientAudio";

export default function OfficeLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isWorldRoute = pathname === "/office";

  return (
    <div className="city-backdrop scanlines min-h-screen">
      <Header />
      <main className={isWorldRoute ? "" : "mx-auto max-w-7xl px-5 py-10"}>{children}</main>
      <AmbientAudio />
      {!isWorldRoute && (
        <footer className="border-t border-cyan/10 px-5 py-6 text-center text-[10px] uppercase tracking-[0.3em] text-dust">
          cybertrader dev lab // internal only // no external ip // ghost &amp; zoro // 2077
        </footer>
      )}
    </div>
  );
}
