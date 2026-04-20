"use client";

/**
 * Client-side dynamic import of the R3F scene. Keeps three.js out of the
 * server bundle and gives us a lightweight skeleton while the Canvas boots.
 */
import dynamic from "next/dynamic";

const Floor3D = dynamic(() => import("@/components/three/Floor3D"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[70vh] min-h-[520px] items-center justify-center rounded-sm border border-cyan/20 bg-void">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="relative h-10 w-10">
          <span className="absolute inset-0 animate-ping rounded-full bg-cyan/30" />
          <span className="absolute inset-0 rounded-full border border-cyan" />
        </div>
        <div className="text-[10px] uppercase tracking-[0.3em] text-cyan">
          booting spatial compositor…
        </div>
        <div className="text-[10px] uppercase tracking-[0.2em] text-dust">
          loading three.js · r3f · drei · bloom
        </div>
      </div>
    </div>
  ),
});

export default function Floor3DMount() {
  return <Floor3D />;
}
