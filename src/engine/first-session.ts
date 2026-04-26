import type { FirstSessionEvent } from "@/engine/types";

export interface FirstSessionPlayerState {
  firstSessionStage: number;
  firstSessionComplete: boolean;
  secondsElapsed: number;
  vblmQuantity: number;
  vblmFirstBoughtAt: number | null;
  currentLocationId: string;
  heat: number;
  rankLevel: number;
}

export function getFirstSessionEvent(
  secondsElapsed: number,
  playerState: FirstSessionPlayerState,
): FirstSessionEvent | null {
  if (playerState.firstSessionComplete) {
    return null;
  }

  const stage = Math.max(0, Math.min(5, playerState.firstSessionStage));
  const now = Math.max(0, Math.floor(secondsElapsed));

  if (stage === 0 && now >= 3 * 60) {
    return {
      stage: 0,
      timestamp: now,
      type: "kite_first_ping",
      headline: "Kite: Fresh shard?",
      description: "I need eyes. Buy 10 VBLM. It's cheap - I'll tell you when to sell.",
      actionRequired: true,
      actionType: "buy_vblm",
    };
  }

  if (stage === 1 && shouldTriggerGuidedProfit(now, playerState)) {
    return {
      stage: 1,
      timestamp: now,
      type: "guided_vblm_profit",
      headline: "VBLM demand spike in Neon Plaza.",
      description: "Void Bloom demand is up 18% for 60 seconds. Sell into the spike.",
      actionRequired: true,
      actionType: "sell_vblm",
      expiresAt: now + 60,
    };
  }

  if (stage === 2 && now >= 10 * 60) {
    return {
      stage: 2,
      timestamp: now,
      type: "first_eagent_scan",
      headline: "eAgent scanner detected!",
      description: "Reduce Heat below 30 in 2 minutes or face a raid. Kite is routing you to the Black Market.",
      actionRequired: true,
      actionType: "reduce_heat",
      expiresAt: now + 120,
    };
  }

  if (stage === 3 && now >= 20 * 60) {
    return {
      stage: 3,
      timestamp: now,
      type: "librarian_delivery",
      headline: "The Librarian: I need Neon Glass delivered.",
      description: "Bring 20 NGLS to Tech Valley within 12 minutes. Paying 2x market.",
      actionRequired: true,
      actionType: "deliver_ngls",
      expiresAt: now + 12 * 60,
    };
  }

  if (stage === 4 && now >= 35 * 60) {
    return {
      stage: 4,
      timestamp: now,
      type: "first_lockdown",
      headline: "District lockdown cascade.",
      description: "Your current market is freezing for 6 minutes. Travel and use the downtime to plan.",
      actionRequired: true,
      actionType: "travel_away",
      expiresAt: now + 6 * 60,
    };
  }

  if (stage === 5 && now >= 50 * 60) {
    return {
      stage: 5,
      timestamp: now,
      type: "pantheon_cliffhanger",
      headline: "Pantheon shard detected in the Undercity.",
      description: "Only accessible at Rank 10. 72 hours before it fragments.",
      actionRequired: false,
      actionType: "long_term_goal",
      expiresAt: now + 72 * 60 * 60,
    };
  }

  return null;
}

function shouldTriggerGuidedProfit(
  secondsElapsed: number,
  playerState: FirstSessionPlayerState,
): boolean {
  if (playerState.vblmQuantity < 10) {
    return false;
  }

  if (playerState.vblmFirstBoughtAt === null) {
    return secondsElapsed >= 5 * 60;
  }

  return secondsElapsed >= 5 * 60 || secondsElapsed - playerState.vblmFirstBoughtAt >= 90;
}
