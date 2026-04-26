import { getUnlockedLocations } from "@/data/locations";
import { DEMO_COMMODITIES, roundCurrency, type PriceMap } from "@/engine/demo-market";
import { createFlashEvent } from "@/engine/flash-events";
import { seededStream } from "@/engine/prng";
import type { HeistMission, Position } from "@/engine/types";

export const HEIST_COLLATERAL_OPTIONS = [25, 50, 75] as const;
export const HEIST_PAYOUT_MULTIPLIER = 2.5;

export function getPortfolioValue(input: {
  balance0Bol: number;
  positions: Record<string, Position>;
  prices: PriceMap;
}): number {
  const positionValue = Object.values(input.positions).reduce((total, position) => {
    const price = input.prices[position.ticker] ?? position.avgEntry;
    return total + price * position.quantity;
  }, 0);

  return roundCurrency(Math.max(0, input.balance0Bol + positionValue));
}

export function createHeistMission(input: {
  nowMs: number;
  seed: string;
  index: number;
  npcId: string;
  collateralPercentage: 25 | 50 | 75;
  portfolioValue: number;
  bountyLevel: number;
  districtDanger: number;
}): HeistMission {
  const stream = seededStream(`${input.seed}:heist:${input.index}:${input.collateralPercentage}`);
  const durationMinutes = 5 + Math.floor(stream() * 6);
  const collateralValue = roundCurrency(input.portfolioValue * (input.collateralPercentage / 100));
  const eventCount = 3 + Math.floor(stream() * 3);
  const locations = getUnlockedLocations();
  const flashEventsDuring = Array.from({ length: eventCount }, (_, index) => {
    const event = createFlashEvent({
      nowMs: input.nowMs + (index + 1) * 60_000,
      seed: `${input.seed}:heist`,
      index: input.index * 10 + index,
    });
    const location = locations[index % Math.max(1, locations.length)];
    return {
      ...event,
      locationId: event.locationId ?? location?.id,
      headline: `HEIST PRESSURE: ${event.headline}`,
      counterplayTags: [...event.counterplayTags, "heist"],
    };
  });

  return {
    id: `heist_${input.nowMs}_${input.index}`,
    npcId: input.npcId,
    collateralPercentage: input.collateralPercentage,
    collateralValue,
    payoutMultiplier: HEIST_PAYOUT_MULTIPLIER,
    startTimestamp: input.nowMs,
    endTimestamp: input.nowMs + durationMinutes * 60_000,
    flashEventsDuring,
    status: "pending",
    riskRating: getHeistRiskRating(input.bountyLevel, input.districtDanger, input.collateralPercentage),
  };
}

export function getHeistRiskRating(
  bountyLevel: number,
  districtDanger: number,
  collateralPercentage: number,
): HeistMission["riskRating"] {
  const score = bountyLevel * 2 + districtDanger + collateralPercentage / 25;
  if (score >= 8) {
    return "extreme";
  }
  if (score >= 5) {
    return "high";
  }
  return "moderate";
}

export function resolveHeistMission(input: {
  mission: HeistMission;
  nowMs: number;
  seed: string;
  playerStayedActive: boolean;
  heat: number;
}): {
  mission: HeistMission;
  payout0Bol: number;
  reputationDelta: number;
  rareItem: string | null;
} {
  const stream = seededStream(`${input.seed}:resolve:${input.mission.id}:${input.heat}`);
  const riskPenalty =
    input.mission.riskRating === "extreme" ? 0.35 : input.mission.riskRating === "high" ? 0.2 : 0.1;
  const heatPenalty = Math.min(0.25, input.heat / 400);
  const successChance = Math.max(0.2, 0.78 - riskPenalty - heatPenalty);
  const success = input.playerStayedActive && stream() <= successChance;

  if (!success) {
    return {
      mission: { ...input.mission, status: "failed" },
      payout0Bol: 0,
      reputationDelta: -10,
      rareItem: null,
    };
  }

  const rareItem = DEMO_COMMODITIES[Math.floor(stream() * DEMO_COMMODITIES.length)]?.ticker ?? "VBLM";
  return {
    mission: { ...input.mission, status: "success" },
    payout0Bol: roundCurrency(input.mission.collateralValue * input.mission.payoutMultiplier),
    reputationDelta: 15,
    rareItem: `Rare ${rareItem} routing key`,
  };
}
