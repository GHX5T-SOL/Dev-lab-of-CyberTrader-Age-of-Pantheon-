"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Keypad } from "./Keypad";

export function VaultDoor({ from }: { from?: string }) {
  const router = useRouter();
  const [unlocking, setUnlocking] = useState(false);

  function handleUnlock() {
    setUnlocking(true);
    // Sync with the doors-open animation duration.
    setTimeout(() => {
      router.replace(from && from.startsWith("/office") ? from : "/office");
    }, 2200);
  }

  return (
    <div className="city-backdrop scanlines relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 py-10">
      {/* Overhead system strip */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between px-6 py-3 text-[10px] uppercase tracking-[0.3em] text-cyan/70">
        <span className="flicker">devlab // vault_01</span>
        <span>neon void city // sector 7</span>
        <span className="flicker">2077-04-19</span>
      </div>

      {/* The door */}
      <div className="relative mb-10 h-[340px] w-[520px] max-w-[92vw]">
        {/* Door frame glow */}
        <div className="absolute inset-0 rounded-sm border border-cyan/30 shadow-[0_0_120px_-20px_rgba(0,245,255,0.35)]" />

        {/* Left panel */}
        <motion.div
          className="absolute inset-y-0 left-0 w-1/2 border-r border-cyan/30"
          style={{
            background:
              "linear-gradient(135deg, #0a0d12 0%, #050608 55%, #0a0d12 100%)",
          }}
          initial={false}
          animate={unlocking ? { x: "-110%" } : { x: 0 }}
          transition={{ duration: 2, ease: [0.7, 0, 0.2, 1] }}
        >
          <DoorPlate side="L" />
        </motion.div>

        {/* Right panel */}
        <motion.div
          className="absolute inset-y-0 right-0 w-1/2 border-l border-cyan/30"
          style={{
            background:
              "linear-gradient(225deg, #0a0d12 0%, #050608 55%, #0a0d12 100%)",
          }}
          initial={false}
          animate={unlocking ? { x: "110%" } : { x: 0 }}
          transition={{ duration: 2, ease: [0.7, 0, 0.2, 1] }}
        >
          <DoorPlate side="R" />
        </motion.div>

        {/* Through-door light */}
        <AnimatePresence>
          {unlocking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, delay: 0.6 }}
              className="absolute inset-0 bg-gradient-to-b from-cyan/20 via-violet/10 to-transparent"
              aria-hidden
            />
          )}
        </AnimatePresence>

        {/* Door seam */}
        <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-cyan/40" />
      </div>

      {/* Greeting line */}
      <div className="mb-6 text-center">
        <div className="text-[10px] uppercase tracking-[0.3em] text-dust">incoming pair</div>
        <div className="mt-1 text-base text-chrome">
          <span className="text-cyan">Ghost</span>
          <span className="text-dust"> + </span>
          <span className="text-acid">Zoro</span>
        </div>
        <div className="mt-1 text-[11px] text-dust">
          enter the 4-digit studio code to unseal the office.
        </div>
      </div>

      <Keypad onUnlock={handleUnlock} />

      <div className="mt-6 max-w-xl text-center text-[10px] uppercase tracking-[0.25em] text-dust">
        cybertrader dev lab // virtual office // internal use only // no external ip
      </div>
    </div>
  );
}

function DoorPlate({ side }: { side: "L" | "R" }) {
  return (
    <div className="absolute inset-4 flex flex-col justify-between">
      <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.3em] text-cyan/60">
        <span>{side === "L" ? "plate_L" : "plate_R"}</span>
        <span className="flicker">lock:armed</span>
      </div>

      {/* Rivet decoration */}
      <div className="grid grid-cols-4 gap-6 opacity-30">
        {Array.from({ length: 16 }).map((_, i) => (
          <span key={i} className="h-1.5 w-1.5 rounded-full bg-cyan/50" />
        ))}
      </div>

      <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.3em] text-dust">
        <span>serial {side === "L" ? "7X9-A3F" : "Z0R-004"}</span>
        <span>rev 0.1.3</span>
      </div>
    </div>
  );
}
