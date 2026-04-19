"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Off-by-default ambient audio toggle. Respects autoplay policies — the user
 * has to press play once. Phase B will replace the <audio> source with a
 * licensed track (Ghost selects).
 *
 * The track path points to /audio/ambient.mp3 which ships as a README
 * placeholder only — no audio is committed yet.
 */
export function AmbientAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    // Probe: if the /audio/ambient.mp3 doesn't exist, disable the button.
    fetch("/audio/ambient.mp3", { method: "HEAD" })
      .then((r) => setAvailable(r.ok))
      .catch(() => setAvailable(false));
  }, []);

  function toggle() {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      el.volume = 0.35;
      el.loop = true;
      el.play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    }
  }

  return (
    <div className="pointer-events-auto fixed bottom-4 right-4 z-50">
      <audio ref={audioRef} src="/audio/ambient.mp3" preload="none" />
      <button
        onClick={toggle}
        disabled={!available}
        title={available ? "ambient audio" : "no track loaded yet (Phase B)"}
        className="panel rounded-sm px-3 py-2 text-[10px] uppercase tracking-[0.25em] text-dust hover:border-cyan/50 hover:text-cyan disabled:opacity-40"
      >
        {available ? (playing ? "▮▮ mute" : "▶ ambient") : "— no track"}
      </button>
    </div>
  );
}
