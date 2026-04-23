"use client";

import dynamic from "next/dynamic";

const OfficeRuntime = dynamic(() => import("@/components/game/office-v2/OfficeRuntime"), {
  ssr: false,
});

export default function OfficeV2Mount() {
  return <OfficeRuntime />;
}
