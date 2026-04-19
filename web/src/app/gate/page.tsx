import { Suspense } from "react";
import { VaultDoor } from "@/components/VaultDoor";

// Force dynamic so middleware + cookies always run.
export const dynamic = "force-dynamic";

export default async function GatePage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  return (
    <Suspense fallback={null}>
      <VaultDoor from={from} />
    </Suspense>
  );
}
