"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "CLR", "0", "GO"] as const;

type Status = "idle" | "verifying" | "ok" | "err";

export function Keypad({ onUnlock }: { onUnlock: () => void }) {
  const [code, setCode] = useState<string>("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const submit = useCallback(
    async (value: string) => {
      setStatus("verifying");
      setErrorMsg("");
      try {
        const res = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ password: value }),
        });
        if (res.ok) {
          setStatus("ok");
          // Give the unlock animation time to play.
          setTimeout(() => onUnlock(), 1800);
        } else {
          setStatus("err");
          const body = (await res.json().catch(() => ({ error: "invalid code" }))) as {
            error?: string;
          };
          setErrorMsg(body.error ?? "invalid code");
          setTimeout(() => {
            setCode("");
            setStatus("idle");
          }, 1200);
        }
      } catch {
        setStatus("err");
        setErrorMsg("network error");
        setTimeout(() => {
          setStatus("idle");
        }, 1200);
      }
    },
    [onUnlock]
  );

  const press = useCallback(
    (k: (typeof KEYS)[number]) => {
      if (status === "verifying" || status === "ok") return;
      if (k === "CLR") {
        setCode("");
        return;
      }
      if (k === "GO") {
        if (code.length >= 1) submit(code);
        return;
      }
      if (code.length >= 8) return;
      setCode((prev) => prev + k);
    },
    [code, status, submit]
  );

  // Physical keyboard support
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (status === "verifying" || status === "ok") return;
      if (/^\d$/.test(e.key)) {
        setCode((prev) => (prev.length < 8 ? prev + e.key : prev));
      } else if (e.key === "Backspace") {
        setCode((prev) => prev.slice(0, -1));
      } else if (e.key === "Enter") {
        if (code.length >= 1) submit(code);
      } else if (e.key === "Escape") {
        setCode("");
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [code, status, submit]);

  return (
    <div className="flex w-full max-w-[340px] flex-col items-center gap-4">
      {/* Display */}
      <div
        className={`panel flex h-14 w-full items-center justify-between px-4 tabular-nums ${
          status === "err" ? "panel-heat" : status === "ok" ? "panel-acid" : ""
        }`}
      >
        <div className="text-[10px] uppercase tracking-[0.25em] text-dust">
          {status === "idle" && "enter code"}
          {status === "verifying" && "verifying..."}
          {status === "ok" && "access granted"}
          {status === "err" && (errorMsg || "denied")}
        </div>
        <div className="text-2xl tracking-[0.4em] text-cyan">
          {code ? "•".repeat(code.length) : "----"}
        </div>
      </div>

      {/* 3x4 grid */}
      <div className="grid grid-cols-3 gap-2">
        {KEYS.map((k) => {
          const isAction = k === "CLR" || k === "GO";
          return (
            <motion.button
              key={k}
              whileTap={{ scale: 0.92 }}
              whileHover={{ y: -1 }}
              onClick={() => press(k)}
              disabled={status === "verifying" || status === "ok"}
              className={`panel flex h-16 w-20 select-none items-center justify-center text-lg tracking-[0.25em] transition-colors ${
                isAction
                  ? k === "GO"
                    ? "panel-acid text-acid"
                    : "panel-heat text-heat"
                  : "text-chrome hover:border-cyan/50 hover:text-cyan"
              }`}
              aria-label={`key ${k}`}
            >
              {k}
            </motion.button>
          );
        })}
      </div>

      <div className="text-[10px] uppercase tracking-[0.25em] text-dust">
        kb: digits / backspace / enter / esc
      </div>
    </div>
  );
}
