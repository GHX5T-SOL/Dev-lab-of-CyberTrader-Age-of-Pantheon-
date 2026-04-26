import { getFirstSessionEvent } from "../first-session";
import { createHeistMission, getPortfolioValue, resolveHeistMission } from "../heist-missions";
import { applyNpcReputationChange, createInitialNpcRelationships } from "../npc-relationships";
import { purchaseShopItem } from "../obol-shop";

describe("v7 engagement systems", () => {
  it("emits first-hour script beats exactly by stage gate", () => {
    const event = getFirstSessionEvent(180, {
      firstSessionStage: 0,
      firstSessionComplete: false,
      secondsElapsed: 180,
      vblmQuantity: 0,
      vblmFirstBoughtAt: null,
      currentLocationId: "neon_plaza",
      rankLevel: 1,
      heat: 0,
    });

    expect(event?.type).toBe("kite_first_ping");
    expect(getFirstSessionEvent(180, {
      firstSessionStage: 1,
      firstSessionComplete: false,
      secondsElapsed: 180,
      vblmQuantity: 0,
      vblmFirstBoughtAt: null,
      currentLocationId: "neon_plaza",
      rankLevel: 1,
      heat: 0,
    })).toBeNull();
  });

  it("prices heist collateral and resolves payout without random purchase mechanics", () => {
    const portfolioValue = getPortfolioValue({ balance0Bol: 2_000, positions: {}, prices: {} });
    const mission = createHeistMission({
      nowMs: 10_000,
      seed: "test",
      index: 1,
      npcId: "kite",
      collateralPercentage: 50,
      portfolioValue,
      bountyLevel: 1,
      districtDanger: 1,
    });

    expect(mission.collateralValue).toBe(1_000);
    expect(mission.payoutMultiplier).toBe(2.5);
    expect(mission.flashEventsDuring.length).toBeGreaterThanOrEqual(3);

    const failed = resolveHeistMission({
      mission,
      nowMs: mission.endTimestamp,
      seed: "test",
      playerStayedActive: false,
      heat: 0,
    });

    expect(failed.mission.status).toBe("failed");
    expect(failed.payout0Bol).toBe(0);
  });

  it("keeps shop purchases fixed-price and feature flagged", () => {
    expect(purchaseShopItem({
      itemId: "instant_travel",
      obolBalance: 100,
      purchasedAt: 0,
      purchaseHistory: {},
      featureEnabled: false,
    })).toEqual({ ok: false, reason: "feature_disabled" });

    const result = purchaseShopItem({
      itemId: "instant_travel",
      obolBalance: 100,
      purchasedAt: 0,
      purchaseHistory: {},
      featureEnabled: true,
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.nextBalance).toBe(95);
      expect(result.item.fiatEquivalent).toBe("~$0.50 USD");
    }
  });

  it("tracks NPC relationships with threshold perks", () => {
    const relationships = applyNpcReputationChange({
      relationships: createInitialNpcRelationships(),
      npcId: "kite",
      delta: 60,
      missionOutcome: "completed",
    });

    expect(relationships.kite?.reputation).toBe(60);
    expect(relationships.kite?.completedMissions).toBe(1);
    expect(relationships.kite?.unlockedPerks).toContain("Kite offers discounted couriers.");
  });
});
