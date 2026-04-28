import type { TransitShipment } from "@/data/locations";
import { getLocation, getUnlockedLocations } from "@/data/locations";
import type {
  BountySnapshot,
  DailyChallenge,
  DecisionActionType,
  DecisionContext,
  DecisionSignal,
  DecisionUrgency,
  DistrictStateRecord,
  FlashEvent,
  HeatPressureState,
  MarketWhisper,
  Mission,
  PantheonShardCliffhanger,
  Position,
  RankSnapshot,
  Resources,
  TradeStreak,
} from "@/engine/types";
import { getNextStreakTarget } from "@/engine/pressure";

interface DecisionContextState {
  nowMs: number;
  resources: Resources;
  bounty: BountySnapshot;
  progression: RankSnapshot;
  currentLocationId: string;
  travelDestinationId: string | null;
  travelEndTime: number | null;
  positions: Record<string, Position>;
  prices: Record<string, number>;
  changes: Record<string, number>;
  activeFlashEvent: FlashEvent | null;
  pendingMission: Mission | null;
  activeMission: Mission | null;
  marketWhispers: MarketWhisper[];
  pantheonShard: PantheonShardCliffhanger | null;
  dailyChallenges: DailyChallenge[];
  transitShipments: TransitShipment[];
  district: DistrictStateRecord;
  heatPressure: HeatPressureState;
  streak: TradeStreak;
  recoveryOpportunity: DecisionSignal | null;
  exitHookMessage: DecisionSignal | null;
  nextFlashEventAt: number;
  nextMissionAt: number;
  nextMarketWhisperAt: number;
  firstSessionStage: number;
  firstSessionComplete: boolean;
}

const URGENCY_SCORE: Record<DecisionUrgency, number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
};

export function getDecisionContext(state: DecisionContextState): DecisionContext {
  const opportunity = getOpportunitySignal(state);
  const risk = getRiskSignal(state);
  const recommendedAction = chooseRecommendedAction(opportunity, risk, state);
  const urgency = maxUrgency(opportunity.urgency, risk.urgency, recommendedAction.urgency);
  const expiresAt = recommendedAction.expiresAt ?? opportunity.expiresAt ?? risk.expiresAt ?? state.nextFlashEventAt;

  return {
    opportunity,
    risk,
    recommendedAction,
    urgency,
    expiresAt,
    generatedAt: state.nowMs,
    isSafeStop: false,
  };
}

function getOpportunitySignal(state: DecisionContextState): DecisionSignal {
  if (state.recoveryOpportunity && state.recoveryOpportunity.expiresAt && state.recoveryOpportunity.expiresAt > state.nowMs) {
    return {
      ...state.recoveryOpportunity,
      urgency: maxUrgency(state.recoveryOpportunity.urgency, "high"),
    };
  }

  if (state.exitHookMessage && state.exitHookMessage.expiresAt && state.exitHookMessage.expiresAt > state.nowMs) {
    return state.exitHookMessage;
  }

  const nearWin = getNearWinSignal(state);
  if (nearWin) {
    return nearWin;
  }

  const arrivedShipment = state.transitShipments.find(
    (shipment) => shipment.status === "arrived" && shipment.destinationId === state.currentLocationId,
  );
  if (arrivedShipment) {
    return signal({
      id: `claim_${arrivedShipment.id}`,
      title: `Claim ${arrivedShipment.ticker} shipment`,
      description: `${arrivedShipment.quantity} ${arrivedShipment.ticker} is waiting at ${getLocation(arrivedShipment.destinationId).name}.`,
      actionType: "claim",
      actionLabel: "Open inventory",
      urgency: "high",
      expiresAt: state.nextFlashEventAt,
      ticker: arrivedShipment.ticker,
      locationId: arrivedShipment.destinationId,
    });
  }

  const activeMission = state.activeMission;
  if (activeMission) {
    return signal({
      id: activeMission.id,
      title: activeMission.title,
      description: activeMission.objective || activeMission.description,
      actionType: "mission",
      actionLabel: "Work mission",
      urgency: urgencyFromDeadline(activeMission.expiresAtTimestamp - state.nowMs, "medium"),
      expiresAt: activeMission.expiresAtTimestamp,
      ticker: activeMission.ticker ?? activeMission.requiredTicker,
      locationId: activeMission.destinationId ?? activeMission.destinationLocationId,
    });
  }

  const pendingMission = state.pendingMission;
  if (pendingMission) {
    return signal({
      id: pendingMission.id,
      title: `Incoming: ${pendingMission.npcName}`,
      description: pendingMission.description,
      actionType: "mission",
      actionLabel: "Accept or decline",
      urgency: urgencyFromDeadline(pendingMission.startTimestamp + 3 * 60_000 - state.nowMs, "medium"),
      expiresAt: pendingMission.startTimestamp + 3 * 60_000,
      ticker: pendingMission.ticker ?? pendingMission.requiredTicker,
      locationId: pendingMission.destinationId ?? pendingMission.destinationLocationId,
    });
  }

  const flashOpportunity = flashAsOpportunity(state);
  if (flashOpportunity) {
    return flashOpportunity;
  }

  const claimableChallenge = state.dailyChallenges.find(
    (challenge) => challenge.completed && !challenge.claimed,
  );
  if (claimableChallenge) {
    return signal({
      id: claimableChallenge.id,
      title: "Challenge reward ready",
      description: `${claimableChallenge.title} pays ${claimableChallenge.rewardObol} 0BOL and ${claimableChallenge.rewardXp} XP.`,
      actionType: "challenge",
      actionLabel: "Claim reward",
      urgency: "medium",
      expiresAt: nextUtcMidnight(state.nowMs),
    });
  }

  if (state.pantheonShard && state.pantheonShard.expiresAt > state.nowMs) {
    return signal({
      id: "pantheon_shard",
      title: state.pantheonShard.headline,
      description: `${state.progression.level}/${state.pantheonShard.requiredRank} rank access. Keep trading toward the shard.`,
      actionType: "rank",
      actionLabel: "Push rank",
      urgency: urgencyFromDeadline(state.pantheonShard.expiresAt - state.nowMs, "low"),
      expiresAt: state.pantheonShard.expiresAt,
    });
  }

  const marketMove = getMarketMove(state);
  if (marketMove) {
    return marketMove;
  }

  if (!state.firstSessionComplete && state.firstSessionStage === 0) {
    return signal({
      id: "starter_vblm",
      title: "Starter lane: Void Bloom",
      description: "Buy 10 VBLM while Heat is low. Kite's first ping is inbound.",
      actionType: "trade",
      actionLabel: "Open S1LKROAD",
      urgency: "medium",
      expiresAt: Math.min(state.nextMarketWhisperAt, state.nowMs + 60_000),
      ticker: "VBLM",
      locationId: state.currentLocationId,
    });
  }

  const whisper = state.marketWhispers[0];
  if (whisper) {
    return signal({
      id: whisper.id,
      title: "Market whisper",
      description: whisper.message,
      actionType: whisper.locationId && whisper.locationId !== state.currentLocationId ? "travel" : "trade",
      actionLabel: whisper.locationId && whisper.locationId !== state.currentLocationId ? "Check route" : "Inspect ticker",
      urgency: "low",
      expiresAt: state.nextMarketWhisperAt,
      ticker: whisper.ticker,
      locationId: whisper.locationId,
    });
  }

  return signal({
    id: "market_check",
    title: "Market Check",
    description: "No blank window. Check prices now and scout the safest small move.",
    actionType: "trade",
    actionLabel: "Check prices",
    urgency: "medium",
    expiresAt: Math.min(state.nextFlashEventAt, state.nowMs + 5_000),
    locationId: state.currentLocationId,
  });
}

function getNearWinSignal(state: DecisionContextState): DecisionSignal | null {
  const rankSpan = state.progression.nextXpRequired === null
    ? 0
    : state.progression.nextXpRequired - state.progression.xpRequired;
  const rankRemaining = state.progression.nextXpRequired === null
    ? Number.POSITIVE_INFINITY
    : state.progression.nextXpRequired - state.progression.xp;
  if (rankSpan > 0 && rankRemaining >= 0 && rankRemaining < rankSpan * 0.1) {
    return signal({
      id: "near_rank",
      title: "Rank up soon",
      description: `${rankRemaining} XP until the next rank. Take a controlled profit or mission payout.`,
      actionType: "rank",
      actionLabel: "Push rank",
      urgency: "high",
      expiresAt: state.nextFlashEventAt,
    });
  }

  const challenge = state.dailyChallenges.find(
    (item) => !item.completed && !item.claimed && item.target > 0 && item.progress >= item.target * 0.9,
  );
  if (challenge) {
    return signal({
      id: `near_challenge_${challenge.id}`,
      title: "Finish challenge",
      description: `${challenge.title} is ${Math.floor((challenge.progress / challenge.target) * 100)}% complete. Claim the near win.`,
      actionType: "challenge",
      actionLabel: "Finish challenge",
      urgency: "high",
      expiresAt: nextUtcMidnight(state.nowMs),
    });
  }

  const nextStreakTarget = getNextStreakTarget(state.streak.count);
  if (state.streak.count > 0 && nextStreakTarget.tradesNeeded <= 2) {
    return signal({
      id: "near_streak",
      title: "Streak bonus close",
      description: `${nextStreakTarget.tradesNeeded} more profitable trade${nextStreakTarget.tradesNeeded === 1 ? "" : "s"} for ${nextStreakTarget.title}. Don't break the chain.`,
      actionType: "trade",
      actionLabel: "Protect streak",
      urgency: "high",
      expiresAt: state.streak.expiresAt ?? state.nextFlashEventAt,
    });
  }

  return null;
}

function getRiskSignal(state: DecisionContextState): DecisionSignal {
  const scan = state.activeFlashEvent?.type === "eagent_scan" ? state.activeFlashEvent : null;
  if (scan) {
    return signal({
      id: scan.id,
      title: "eAgent scan",
      description: `Reduce Heat below ${scan.heatThreshold ?? 50} before the scan resolves.`,
      actionType: "reduce_heat",
      actionLabel: "Reduce Heat",
      urgency: "critical",
      expiresAt: scan.endTimestamp,
    });
  }

  if (state.heatPressure.stage > 0 && state.heatPressure.scanLockAt) {
    return signal({
      id: `heat_pressure_${state.heatPressure.stage}`,
      title: state.heatPressure.stage >= 4 ? "Scan lock forming" : state.heatPressure.status,
      description:
        state.heatPressure.lastMessage ??
        "Heat pressure is active. Reduce Heat before the scanner escalates.",
      actionType: "reduce_heat",
      actionLabel: state.currentLocationId === "black_market" ? "Bribe now" : "Find Black Market",
      urgency: urgencyFromDeadline(state.heatPressure.scanLockAt - state.nowMs, state.heatPressure.stage >= 3 ? "high" : "medium"),
      expiresAt: state.heatPressure.scanLockAt,
    });
  }

  if (state.streak.count >= 5) {
    return signal({
      id: "hot_streak_risk",
      title: `Hot streak x${state.streak.multiplier.toFixed(2)}`,
      description: "Profitable chains pay better, but scanner attention rises while you keep pushing.",
      actionType: "trade",
      actionLabel: "Bank or push",
      urgency: "medium",
      expiresAt: state.streak.expiresAt ?? state.nextFlashEventAt,
    });
  }

  if (state.travelDestinationId && state.travelEndTime && state.travelEndTime > state.nowMs) {
    return signal({
      id: "travel_lock",
      title: "Market locked in transit",
      description: `Travelling to ${getLocation(state.travelDestinationId).name}. Use the downtime to inspect missions and inventory.`,
      actionType: "plan",
      actionLabel: "Review plan",
      urgency: urgencyFromDeadline(state.travelEndTime - state.nowMs, "medium"),
      expiresAt: state.travelEndTime,
      locationId: state.travelDestinationId,
    });
  }

  if (state.district.state === "BLACKOUT") {
    return signal({
      id: `district_${state.district.locationId}_blackout`,
      title: `${getLocation(state.district.locationId).name} blackout`,
      description: "All actions are disabled here except travelling away.",
      actionType: "travel",
      actionLabel: "Travel away",
      urgency: "critical",
      expiresAt: state.district.endTimestamp,
      locationId: state.district.locationId,
    });
  }

  if (state.district.state === "LOCKDOWN") {
    return signal({
      id: `district_${state.district.locationId}_lockdown`,
      title: `${getLocation(state.district.locationId).name} lockdown`,
      description: "Buying is restricted. Sell, travel, or wait for checkpoints to clear.",
      actionType: "travel",
      actionLabel: "Review routes",
      urgency: "high",
      expiresAt: state.district.endTimestamp,
      locationId: state.district.locationId,
    });
  }

  if (state.resources.heat >= 70) {
    return signal({
      id: "priority_heat",
      title: `${state.bounty.status} heat`,
      description: "Raid pressure is high. Black Market bribe or smaller trades will lower exposure.",
      actionType: "reduce_heat",
      actionLabel: "Lower Heat",
      urgency: "critical",
      expiresAt: state.nextFlashEventAt,
    });
  }

  if (state.resources.heat >= 50) {
    return signal({
      id: "hunted_heat",
      title: `${state.bounty.status} heat`,
      description: "Courier risk and raid odds are elevated. Reduce Heat before stacking more volume.",
      actionType: "reduce_heat",
      actionLabel: "Find Black Market",
      urgency: "high",
      expiresAt: state.nextFlashEventAt,
    });
  }

  if (state.resources.heat >= 30) {
    return signal({
      id: "watched_heat",
      title: `${state.bounty.status} status`,
      description: "You are on the watchlist. Profits are still open, but size trades carefully.",
      actionType: "trade",
      actionLabel: "Trade small",
      urgency: "medium",
      expiresAt: state.nextFlashEventAt,
    });
  }

  const flashRisk = flashAsRisk(state);
  if (flashRisk) {
    return flashRisk;
  }

  const riskyShipment = state.transitShipments.find(
    (shipment) => shipment.status === "transit" && (shipment.lossChance ?? 0) >= 0.15,
  );
  if (riskyShipment) {
    return signal({
      id: `shipment_risk_${riskyShipment.id}`,
      title: `${riskyShipment.ticker} courier exposure`,
      description: `${getLocation(riskyShipment.destinationId).name} shipment has ${Math.round((riskyShipment.lossChance ?? 0) * 100)}% loss risk.`,
      actionType: "courier",
      actionLabel: "Track shipment",
      urgency: "medium",
      expiresAt: riskyShipment.arrivalTime,
      ticker: riskyShipment.ticker,
      locationId: riskyShipment.destinationId,
    });
  }

  return signal({
    id: "managed_risk",
    title: "Managed risk",
    description: "Heat is low. Main risk is missing the next signal window.",
    actionType: "trade",
    actionLabel: "Stay active",
    urgency: "low",
    expiresAt: state.nextFlashEventAt,
    locationId: state.currentLocationId,
  });
}

function flashAsOpportunity(state: DecisionContextState): DecisionSignal | null {
  const event = state.activeFlashEvent;
  if (!event) {
    return null;
  }

  if (event.type === "arbitrage_window") {
    const target = event.locationId ? getLocation(event.locationId).name : "target district";
    return signal({
      id: event.id,
      title: event.headline,
      description: `Sell ${event.ticker ?? "target stock"} at ${target} before the multiplier closes.`,
      actionType: event.locationId === state.currentLocationId ? "trade" : "travel",
      actionLabel: event.locationId === state.currentLocationId ? "Sell now" : "Travel to window",
      urgency: urgencyFromDeadline(event.endTimestamp - state.nowMs, "high"),
      expiresAt: event.endTimestamp,
      ticker: event.ticker,
      locationId: event.locationId,
    });
  }

  if (event.type === "flash_crash") {
    return signal({
      id: event.id,
      title: event.headline,
      description: `${event.ticker ?? "A commodity"} is discounted and recovering over the timer.`,
      actionType: "trade",
      actionLabel: "Buy the dip",
      urgency: urgencyFromDeadline(event.endTimestamp - state.nowMs, "medium"),
      expiresAt: event.endTimestamp,
      ticker: event.ticker,
      locationId: state.currentLocationId,
    });
  }

  if (event.type === "volatility_spike" && event.locationId === state.currentLocationId) {
    return signal({
      id: event.id,
      title: event.headline,
      description: `${event.ticker ?? "Target"} is swinging hard here. Trade smaller or take fast profit.`,
      actionType: "trade",
      actionLabel: "Inspect spread",
      urgency: urgencyFromDeadline(event.endTimestamp - state.nowMs, "medium"),
      expiresAt: event.endTimestamp,
      ticker: event.ticker,
      locationId: event.locationId,
    });
  }

  return null;
}

function flashAsRisk(state: DecisionContextState): DecisionSignal | null {
  const event = state.activeFlashEvent;
  if (!event) {
    return null;
  }

  if (event.type === "district_blackout") {
    return signal({
      id: event.id,
      title: event.headline,
      description: event.modifierApplied ? "Trading is frozen in the target district." : "Blackout warning active. Travel or finish trades before freeze.",
      actionType: event.locationId === state.currentLocationId ? "travel" : "plan",
      actionLabel: event.locationId === state.currentLocationId ? "Leave district" : "Avoid route",
      urgency: event.modifierApplied ? "critical" : "high",
      expiresAt: event.endTimestamp,
      locationId: event.locationId,
    });
  }

  if (event.type === "gang_takeover") {
    return signal({
      id: event.id,
      title: event.headline,
      description: "Courier costs are doubled in the affected district.",
      actionType: "courier",
      actionLabel: "Delay courier",
      urgency: "medium",
      expiresAt: event.endTimestamp,
      locationId: event.locationId,
    });
  }

  return null;
}

function getMarketMove(state: DecisionContextState): DecisionSignal | null {
  const entries = Object.entries(state.changes);
  if (!entries.length) {
    return null;
  }

  const [ticker, change] = entries.reduce(
    (best, entry) => (Math.abs(entry[1]) > Math.abs(best[1]) ? entry : best),
    entries[0]!,
  );
  const held = state.positions[ticker]?.quantity ?? 0;
  const price = state.prices[ticker] ?? 0;

  if (held > 0 && change > 0) {
    return signal({
      id: `market_sell_${ticker}`,
      title: `${ticker} strength`,
      description: `${ticker} is moving up at ${price.toFixed(2)} 0BOL. You hold ${held}; consider taking profit.`,
      actionType: "trade",
      actionLabel: "Sell into strength",
      urgency: "medium",
      expiresAt: state.nextFlashEventAt,
      ticker,
      locationId: state.currentLocationId,
    });
  }

  if (change < 0) {
    return signal({
      id: `market_dip_${ticker}`,
      title: `${ticker} dip`,
      description: `${ticker} is cheaper at ${price.toFixed(2)} 0BOL. Scout a small buy if Heat stays controlled.`,
      actionType: "trade",
      actionLabel: "Check dip",
      urgency: "medium",
      expiresAt: state.nextFlashEventAt,
      ticker,
      locationId: state.currentLocationId,
    });
  }

  return null;
}

function chooseRecommendedAction(
  opportunity: DecisionSignal,
  risk: DecisionSignal,
  state: DecisionContextState,
): DecisionSignal {
  if (risk.urgency === "critical" || (risk.urgency === "high" && state.resources.heat >= 50)) {
    return { ...risk, id: `recommended_${risk.id}` };
  }

  if (opportunity.urgency === "high" || opportunity.urgency === "critical") {
    return { ...opportunity, id: `recommended_${opportunity.id}` };
  }

  if (state.resources.energySeconds < 30 * 60) {
    return signal({
      id: "recommended_energy",
      title: "Stabilize energy",
      description: "Energy is low. Buy time before chasing a risky window.",
      actionType: "plan",
      actionLabel: "Buy energy",
      urgency: "medium",
      expiresAt: state.nextFlashEventAt,
    });
  }

  return { ...opportunity, id: `recommended_${opportunity.id}` };
}

function signal(input: {
  id: string;
  title: string;
  description: string;
  actionType: DecisionActionType;
  actionLabel: string;
  urgency: DecisionUrgency;
  expiresAt: number | null;
  ticker?: string;
  locationId?: string;
}): DecisionSignal {
  return input;
}

function nextUtcMidnight(nowMs: number): number {
  const date = new Date(nowMs);
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1);
}

function urgencyFromDeadline(ms: number, fallback: DecisionUrgency): DecisionUrgency {
  if (ms <= 30_000) {
    return "critical";
  }
  if (ms <= 2 * 60_000) {
    return "high";
  }
  if (ms <= 5 * 60_000) {
    return "medium";
  }
  return fallback;
}

function maxUrgency(...values: DecisionUrgency[]): DecisionUrgency {
  return values.reduce((best, value) =>
    URGENCY_SCORE[value] > URGENCY_SCORE[best] ? value : best,
  "low");
}
