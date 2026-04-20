"use client";

/**
 * Overlay card that appears when a performer is focused.
 * - Shows name, role, persona, signature line
 * - "Speak" button — plays pre-rendered /voices/<slug>.mp3 if available,
 *   otherwise fetches POST /api/voice/speak and streams.
 * - Close button clears focus.
 *
 * This is a DOM overlay (rendered by Floor3D outside the Canvas), not R3F
 * Html, so we can apply full Tailwind + animations without 3D distortion.
 */
import { useEffect, useRef, useState } from "react";
import type { PerformerSpec } from "@/data/performers";
import type { TeamMember } from "@/data/team";

interface Props {
  performer: PerformerSpec;
  member: TeamMember;
  onClose: () => void;
}

type SpeakState = "idle" | "loading" | "playing" | "error";

export function PerformerOverlay({ performer, member, onClose }: Props) {
  const [state, setState] = useState<SpeakState>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Stop any playing audio when the focused character changes.
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, [performer.slug]);

  async function speak() {
    setErrorMsg(null);

    // Prefer static sample — cheap, instant, no credits burned.
    if (performer.voiceSampleUrl) {
      try {
        setState("loading");
        const audio = new Audio(performer.voiceSampleUrl);
        audioRef.current = audio;
        audio.onended = () => setState("idle");
        audio.onerror = () => {
          setState("error");
          setErrorMsg("static sample failed — falling back to live TTS");
        };
        await audio.play();
        setState("playing");
        return;
      } catch {
        // fall through to live TTS
      }
    }

    // Live TTS via server proxy.
    try {
      setState("loading");
      const res = await fetch("/api/voice/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: performer.slug }),
      });
      if (!res.ok) {
        const detail = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        throw new Error(detail.error ?? `HTTP ${res.status}`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => {
        URL.revokeObjectURL(url);
        setState("idle");
      };
      audio.onerror = () => {
        URL.revokeObjectURL(url);
        setState("error");
      };
      await audio.play();
      setState("playing");
    } catch (err) {
      setState("error");
      setErrorMsg(err instanceof Error ? err.message : "unknown error");
    }
  }

  function stop() {
    audioRef.current?.pause();
    setState("idle");
  }

  const accent = member.accent;

  return (
    <div
      className="absolute bottom-3 right-3 z-10 w-[min(360px,calc(100%-24px))] rounded-sm border bg-ink/92 p-4 backdrop-blur"
      style={{ borderColor: `${accent}66`, boxShadow: `0 0 0 1px ${accent}22 inset, 0 10px 40px -16px ${accent}44` }}
    >
      <header className="flex items-start justify-between gap-2">
        <div>
          <div
            className="text-[10px] uppercase tracking-[0.3em]"
            style={{ color: accent }}
          >
            {member.codename}
          </div>
          <h3 className="mt-0.5 text-lg tracking-wide text-chrome">{member.name}</h3>
          <div className="text-[11px] text-dust">{member.role}</div>
        </div>
        <button
          onClick={onClose}
          className="rounded-sm border border-dust/30 px-2 py-0.5 text-[10px] uppercase tracking-[0.25em] text-dust hover:text-chrome"
          aria-label="Close"
        >
          esc
        </button>
      </header>

      <p className="mt-3 text-[12px] leading-relaxed text-chrome/90">
        &ldquo;{performer.signatureLine}&rdquo;
      </p>

      <div className="mt-3 flex items-center gap-2">
        {state === "playing" ? (
          <button
            onClick={stop}
            className="rounded-sm border border-heat/40 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-heat hover:bg-heat/10"
          >
            ■ stop
          </button>
        ) : (
          <button
            onClick={speak}
            disabled={state === "loading"}
            className="rounded-sm border px-3 py-1 text-[11px] uppercase tracking-[0.2em] transition-colors disabled:opacity-60"
            style={{
              borderColor: `${accent}55`,
              color: accent,
            }}
          >
            {state === "loading" ? "… synthesizing" : "▶ speak"}
          </button>
        )}
        <span className="text-[10px] uppercase tracking-[0.25em] text-dust">
          {performer.voiceSampleUrl ? "pre-rendered · mp3" : "live · elevenlabs"}
        </span>
      </div>

      {errorMsg && (
        <div className="mt-2 text-[10px] uppercase tracking-[0.2em] text-heat">
          err · {errorMsg}
        </div>
      )}

      <div className="mt-3 border-t border-cyan/10 pt-2 text-[11px] leading-relaxed text-dust">
        {member.persona}
      </div>
    </div>
  );
}
