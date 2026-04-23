"use client";

import dynamic from "next/dynamic";

const OfficeRuntime = dynamic(() => import("@/components/game/office-v2/OfficeRuntime"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-screen items-center justify-center bg-void">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="relative h-12 w-12">
          <span className="absolute inset-0 animate-ping rounded-full bg-cyan/30" />
          <span className="absolute inset-0 rounded-full border border-cyan" />
        </div>
        <div className="text-[10px] uppercase tracking-[0.34em] text-cyan">
          booting 3d office runtime
        </div>
        <div className="text-[10px] uppercase tracking-[0.22em] text-dust">
          loading character select · free roam · live workstations
        </div>
      </div>
    </div>
  ),
});

export default function OfficeGameMount() {
  return <OfficeRuntime />;
}
