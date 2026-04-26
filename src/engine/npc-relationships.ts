import { NPCS } from "@/data/npcs";
import type { NPCRelationship } from "@/engine/types";

export function createInitialNpcRelationships(): Record<string, NPCRelationship> {
  return Object.fromEntries(
    NPCS.map((npc) => [
      npc.id,
      {
        npcId: npc.id,
        reputation: 0,
        completedMissions: 0,
        failedMissions: 0,
        specialMessages: [],
        unlockedPerks: [],
      },
    ]),
  );
}

export function applyNpcReputationChange(input: {
  relationships: Record<string, NPCRelationship>;
  npcId: string;
  delta: number;
  missionOutcome?: "completed" | "failed" | "first_contact" | "betrayal";
}): Record<string, NPCRelationship> {
  const current = input.relationships[input.npcId] ?? {
    npcId: input.npcId,
    reputation: 0,
    completedMissions: 0,
    failedMissions: 0,
    specialMessages: [],
    unlockedPerks: [],
  };

  const reputation = Math.max(0, Math.min(100, current.reputation + input.delta));
  const completedMissions =
    input.missionOutcome === "completed" ? current.completedMissions + 1 : current.completedMissions;
  const failedMissions =
    input.missionOutcome === "failed" ? current.failedMissions + 1 : current.failedMissions;

  return {
    ...input.relationships,
    [input.npcId]: {
      ...current,
      reputation,
      completedMissions,
      failedMissions,
      specialMessages: getSpecialMessages(input.npcId, reputation),
      unlockedPerks: getUnlockedPerks(input.npcId, reputation),
    },
  };
}

export function getSpecialMessages(npcId: string, reputation: number): string[] {
  const messages: string[] = [];
  if (reputation >= 25) {
    messages.push(`${npcName(npcId)} trusts you with warmer routes.`);
  }
  if (reputation >= 60) {
    messages.push(`${npcName(npcId)} opens their private channel.`);
  }
  if (reputation >= 90) {
    messages.push(`${npcName(npcId)} calls you kin in the wire.`);
  }
  return messages;
}

export function getUnlockedPerks(npcId: string, reputation: number): string[] {
  const perks: string[] = [];
  if (npcId === "kite" && reputation >= 60) {
    perks.push("Kite offers discounted couriers.");
  }
  if (npcId === "librarian" && reputation >= 60) {
    perks.push("The Librarian reveals extra price intel.");
  }
  if (npcId === "verdigris" && reputation >= 60) {
    perks.push("Verdigris offers high-value gray contracts.");
  }
  if (reputation >= 90) {
    perks.push("Premium mission payouts improved.");
  }
  return perks;
}

function npcName(npcId: string): string {
  return NPCS.find((npc) => npc.id === npcId)?.name ?? npcId;
}
