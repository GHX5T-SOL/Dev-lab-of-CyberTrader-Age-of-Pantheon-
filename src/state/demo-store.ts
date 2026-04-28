import { create } from "zustand";
import {
  exportAuthoritySnapshot,
  getAuthority,
  resetConfiguredAuthority,
  restoreLocalAuthority,
} from "@/authority";
import {
  COURIER_SERVICES,
  DEFAULT_LOCATION_ID,
  LOCATIONS,
  getCourierService,
  getLocation,
  getUnlockedLocations,
  type CourierService,
  type LocationInventoryMap,
  type TransitShipment,
} from "@/data/locations";
import {
  DEFAULT_TRADE_QUANTITY,
  DEMO_COMMODITIES,
  DEMO_STARTING_BALANCE,
  FIRST_TRADE_HINT_TICKER,
  applyLocationPriceModifiers,
  createInitialChanges,
  createInitialPrices,
  formatDelta,
  formatObol,
  getCommodity,
  normalizeCommodityPrice,
  normalizePriceMap,
  roundCurrency,
  type ChangeMap,
  type PriceMap,
} from "@/engine/demo-market";
import {
  createDailyChallenges,
  advanceDailyChallengeProgress,
  claimDailyChallenge as claimDailyChallengeEngine,
  getDailyChallengeDayKey,
} from "@/engine/daily-challenges";
import { getDecisionContext } from "@/engine/decision-context";
import {
  getBountyByHeat,
  getBountyFlashFrequencyMultiplier,
  getBountyRaidIntervalTicks,
  getBountyRiskLabel,
} from "@/engine/bounty";
import { getFirstSessionEvent } from "@/engine/first-session";
import {
  createHeistMission,
  getPortfolioValue,
  resolveHeistMission,
} from "@/engine/heist-missions";
import {
  ENABLE_OBOL_TOKEN,
  MOCK_STARTING_OBOL_BALANCE,
  getUtcWeekKey,
  purchaseShopItem as purchaseShopItemEngine,
} from "@/engine/obol-shop";
import {
  applyNpcReputationChange,
  createInitialNpcRelationships,
} from "@/engine/npc-relationships";
import {
  createDistrictShift,
  createInitialDistrictStates,
  districtAnnouncement,
  getActiveDistrictState,
  getDistrictCourierRiskBonus,
  getDistrictCourierRiskMultiplier,
  getDistrictCourierTimeMultiplier,
  getNextDistrictShiftDelay,
  isDistrictBuyRestricted,
  isDistrictSellRestricted,
  normalizeDistrictStates,
} from "@/engine/district-state";
import {
  FLASH_EVENT_COOLDOWN_MS,
  applyFlashEventPriceModifiers,
  createFlashEvent,
  getFlashCourierCostMultiplier,
  getNextFlashEventDelay,
  isTradingBlockedByFlash,
  updateFlashEvent,
} from "@/engine/flash-events";
import {
  createMission,
  getMissionProgress,
  getNextMissionDelay,
} from "@/engine/mission-generator";
import { checkRaid } from "@/engine/raid-checker";
import { MEMORY_SHARD_TEXT, getRankSnapshot, shouldUnlockMemoryShard } from "@/engine/rank";
import {
  advanceHeatPressure,
  createInitialHeatPressure,
  getStreakRiskHeatBonus,
  makeMicroReward,
} from "@/engine/pressure";
import { seededStream } from "@/engine/prng";
import {
  applySellToStreak,
  createInitialStreak,
  expireStreakIfNeeded,
} from "@/engine/streak";
import type {
  DailyChallenge,
  AwayReport,
  BountySnapshot,
  DecisionContext,
  DecisionSignal,
  DistrictStateRecord,
  FlashEvent,
  HeatPressureState,
  HeistMission,
  MarketNews,
  MarketWhisper,
  MicroReward,
  Mission,
  MissedPeakLogEntry,
  NPCRelationship,
  PantheonShardCliffhanger,
  PlayerProfile,
  PlayerLoreShard,
  PlayerRiskProfile,
  Position,
  RaidRecoveryWindow,
  RankCelebration,
  RankSnapshot,
  RecoveryPrompt,
  Resources,
  TradeJuice,
  TradeStreak,
} from "@/engine/types";
import {
  clearDemoSession,
  loadDemoSession,
  saveDemoSession,
  type PersistedDemoSession,
} from "@/state/demo-storage";

export type DemoPhase = "intro" | "login" | "boot" | "home" | "handle" | "terminal";
export type TerminalView = "home" | "market";

export interface GameClockState {
  nowMs: number;
  displayTime: string;
  lastTickAt: number;
  lastRaidTick: number;
}

export interface WorldState {
  currentLocationId: string;
  travelDestinationId: string | null;
  travelEndTime: number | null;
}

export interface GameNotification {
  id: string;
  createdAt: number;
  message: string;
  tone: "info" | "success" | "warning" | "danger";
}

const INITIAL_PLAYER_RESOURCES: Resources = {
  energySeconds: 72 * 60 * 60,
  heat: 6,
  integrity: 82,
  stealth: 64,
  influence: 3,
};

const GAME_TICK_MS = 30_000;
const MAX_CATCH_UP_TICKS = 100;
const BLACK_MARKET_BRIBE_COST = 50_000;
const FIRST_SESSION_BRIBE_COST = 500;
const ENGAGEMENT_SEED = "v6-engagement";
const BASE_COURIER_LIMIT = 3;
const HEAT_WARNING_THRESHOLDS = [20, 30, 50, 70, 90] as const;
const RAID_RECOVERY_0BOL_COST = 50_000;
const FALLBACK_MISSION_DEADLINE_MS = 10 * 60_000;
const MAX_MISSION_DEADLINE_MS = 24 * 60 * 60_000;

interface DemoStoreState {
  phase: DemoPhase;
  activeView: TerminalView;
  handle: string;
  profile: PlayerProfile | null;
  playerId: string | null;
  tick: number;
  prices: PriceMap;
  changes: ChangeMap;
  priceHistory: Record<string, number[]>;
  balanceObol: number;
  resources: Resources;
  positions: Record<string, Position>;
  activeNews: MarketNews[];
  progression: RankSnapshot;
  clock: GameClockState;
  world: WorldState;
  notifications: GameNotification[];
  transitShipments: TransitShipment[];
  locationInventories: LocationInventoryMap;
  activeFlashEvent: FlashEvent | null;
  flashEventCount: number;
  nextFlashEventAt: number;
  flashCooldownUntil: number;
  pendingMission: Mission | null;
  activeMission: Mission | null;
  missionHistory: Mission[];
  npcReputation: Record<string, number>;
  npcRelationships: Record<string, NPCRelationship>;
  missionCount: number;
  nextMissionAt: number;
  heistMissions: HeistMission[];
  activeHeistMission: HeistMission | null;
  heistCount: number;
  streak: TradeStreak;
  dailyChallenges: DailyChallenge[];
  dailyChallengeDayKey: string;
  firstSessionStage: number;
  firstSessionStartedAt: number | null;
  firstSessionComplete: boolean;
  firstVblmBoughtAt: number | null;
  firstSessionMessage: string | null;
  pantheonShard: PantheonShardCliffhanger | null;
  obolBalance: number;
  shopPurchases: Record<string, number[]>;
  extraInventorySlots: number;
  marketWhispers: MarketWhisper[];
  marketWhisperCount: number;
  nextMarketWhisperAt: number;
  playerLore: PlayerLoreShard[];
  missedPeakLog: MissedPeakLogEntry[];
  heldPricePeaks: Record<string, number>;
  playerRiskProfile: PlayerRiskProfile;
  raidRecoveryWindow: RaidRecoveryWindow | null;
  raidBuybackLastUsedWeek: string | null;
  districtStates: Record<string, DistrictStateRecord>;
  districtStateCount: number;
  nextDistrictStateAt: number;
  bounty: BountySnapshot;
  decisionContext: DecisionContext;
  heatPressure: HeatPressureState;
  scannerEvadeTradesRemaining: number;
  recoveryOpportunity: DecisionSignal | null;
  pendingRecoveryPrompt: RecoveryPrompt | null;
  exitHookMessage: DecisionSignal | null;
  lastInteractionAt: number;
  lastExitHookAt: number;
  microRewards: MicroReward[];
  awayReport: AwayReport | null;
  tradeJuice: TradeJuice | null;
  heatWarning: { threshold: number; createdAt: number } | null;
  rankCelebration: RankCelebration | null;
  selectedTicker: string;
  orderSize: number;
  lastRealizedPnl: number | null;
  firstTradeComplete: boolean;
  introSeen: boolean;
  tutorialCompleted: boolean;
  systemMessage: string;
  isBusy: boolean;
  isHydrated: boolean;
}

interface DemoStoreActions {
  hydrateDemo: () => Promise<void>;
  moveToHandle: () => void;
  setHandle: (rawHandle: string) => void;
  markIntroSeen: () => void;
  resetIntro: () => void;
  completeBoot: () => Promise<void>;
  completeTutorial: () => void;
  resetTutorial: () => void;
  submitHandle: (rawHandle: string) => Promise<boolean>;
  openMarket: () => void;
  goHome: () => void;
  selectTicker: (ticker: string) => void;
  setOrderSize: (quantity: number) => void;
  advanceMarket: () => Promise<void>;
  runGameLoop: (nowMs: number) => Promise<void>;
  markInteraction: () => void;
  runExitHookCheck: (nowMs: number) => void;
  buySelected: () => Promise<void>;
  sellSelected: () => Promise<void>;
  ignoreSignal: (signalId: string) => Promise<void>;
  purchaseEnergyHour: () => Promise<void>;
  purchaseEnergyHours: (hours: number) => Promise<void>;
  startTravel: (destinationId: string) => void;
  reduceHeatWithBribe: () => Promise<void>;
  sendCourierShipment: (input: {
    ticker: string;
    quantity: number;
    destinationId: string;
    courierId: CourierService["id"];
    insured?: boolean;
  }) => Promise<void>;
  claimShipment: (shipmentId: string) => Promise<void>;
  acceptMission: () => void;
  declineMission: () => void;
  createHeistDraft: (collateralPercentage: 25 | 50 | 75) => HeistMission | null;
  acceptHeistMission: (collateralPercentage: 25 | 50 | 75) => Promise<void>;
  resolveActiveHeist: (success?: boolean) => Promise<void>;
  purchaseShopItem: (itemId: string) => Promise<void>;
  instantTravelWithObol: () => Promise<void>;
  buyBackRaidLoss: (currency: "0BOL" | "$OBOL") => Promise<void>;
  claimDailyChallenge: (challengeId: string) => Promise<void>;
  recordAwayReport: (nowMs: number, awayStartedAt: number) => void;
  dismissAwayReport: () => void;
  resetDemo: () => Promise<void>;
}

type DemoStore = DemoStoreState & DemoStoreActions;

function buildInitialState(): DemoStoreState {
  const nowMs = Date.now();
  const basePrices = createInitialPrices();
  const prices = applyLocationPriceModifiers(basePrices, DEFAULT_LOCATION_ID);
  const dailyChallengeDayKey = getDailyChallengeDayKey(nowMs);
  const initialProgression = getRankSnapshot(40);
  const initialBounty = getBountyByHeat(INITIAL_PLAYER_RESOURCES.heat);
  const initialHeatPressure = createInitialHeatPressure(nowMs, INITIAL_PLAYER_RESOURCES.heat);
  const initialStreak = createInitialStreak();
  const initialWhispers = [createMarketWhisper(nowMs, 0)];
  const initialDailyChallenges = createDailyChallenges(nowMs, 1);
  const initialDistrictStates = createInitialDistrictStates(nowMs);
  const initialDecisionContext = getDecisionContext({
    nowMs,
    resources: INITIAL_PLAYER_RESOURCES,
    bounty: initialBounty,
    progression: initialProgression,
    currentLocationId: DEFAULT_LOCATION_ID,
    travelDestinationId: null,
    travelEndTime: null,
    positions: {},
    prices,
    changes: createInitialChanges(),
    activeFlashEvent: null,
    pendingMission: null,
    activeMission: null,
    marketWhispers: initialWhispers,
    pantheonShard: null,
    dailyChallenges: initialDailyChallenges,
    transitShipments: [],
    district: getActiveDistrictState(initialDistrictStates, DEFAULT_LOCATION_ID, nowMs),
    heatPressure: initialHeatPressure,
    streak: initialStreak,
    recoveryOpportunity: null,
    exitHookMessage: null,
    nextFlashEventAt: nowMs + getNextFlashEventDelay(ENGAGEMENT_SEED, 0),
    nextMissionAt: nowMs + getNextMissionDelay(ENGAGEMENT_SEED, 0),
    nextMarketWhisperAt: nowMs + getNextWhisperDelay(ENGAGEMENT_SEED, 1),
    firstSessionStage: 0,
    firstSessionComplete: false,
  });

  return {
    phase: "intro",
    activeView: "home",
    handle: "",
    profile: null,
    playerId: null,
    tick: 0,
    prices,
    changes: createInitialChanges(),
    priceHistory: buildInitialPriceHistory(prices),
    balanceObol: DEMO_STARTING_BALANCE,
    resources: { ...INITIAL_PLAYER_RESOURCES },
    positions: {},
    activeNews: [],
    progression: initialProgression,
    clock: {
      nowMs,
      displayTime: formatClock(nowMs),
      lastTickAt: nowMs,
      lastRaidTick: 0,
    },
    world: {
      currentLocationId: DEFAULT_LOCATION_ID,
      travelDestinationId: null,
      travelEndTime: null,
    },
    notifications: [],
    transitShipments: [],
    locationInventories: {},
    activeFlashEvent: null,
    flashEventCount: 0,
    nextFlashEventAt: nowMs + getNextFlashEventDelay(ENGAGEMENT_SEED, 0),
    flashCooldownUntil: 0,
    pendingMission: null,
    activeMission: null,
    missionHistory: [],
    npcReputation: {},
    npcRelationships: createInitialNpcRelationships(),
    missionCount: 0,
    nextMissionAt: nowMs + getNextMissionDelay(ENGAGEMENT_SEED, 0),
    heistMissions: [],
    activeHeistMission: null,
    heistCount: 0,
    streak: initialStreak,
    dailyChallenges: initialDailyChallenges,
    dailyChallengeDayKey,
    firstSessionStage: 0,
    firstSessionStartedAt: null,
    firstSessionComplete: false,
    firstVblmBoughtAt: null,
    firstSessionMessage: "Absorbed residual data from the host cyberdeck. 40/200 XP to Packet Rat.",
    pantheonShard: null,
    obolBalance: MOCK_STARTING_OBOL_BALANCE,
    shopPurchases: {},
    extraInventorySlots: 0,
    marketWhispers: initialWhispers,
    marketWhisperCount: 1,
    nextMarketWhisperAt: nowMs + getNextWhisperDelay(ENGAGEMENT_SEED, 1),
    playerLore: [],
    missedPeakLog: [],
    heldPricePeaks: {},
    playerRiskProfile: createRiskProfile(INITIAL_PLAYER_RESOURCES, initialBounty, {}),
    raidRecoveryWindow: null,
    raidBuybackLastUsedWeek: null,
    districtStates: initialDistrictStates,
    districtStateCount: 0,
    nextDistrictStateAt: nowMs + getNextDistrictShiftDelay(ENGAGEMENT_SEED, 0),
    bounty: initialBounty,
    decisionContext: initialDecisionContext,
    heatPressure: initialHeatPressure,
    scannerEvadeTradesRemaining: 0,
    recoveryOpportunity: null,
    pendingRecoveryPrompt: null,
    exitHookMessage: null,
    lastInteractionAt: nowMs,
    lastExitHookAt: 0,
    microRewards: [],
    awayReport: null,
    tradeJuice: null,
    heatWarning: null,
    rankCelebration: null,
    selectedTicker: FIRST_TRADE_HINT_TICKER,
    orderSize: DEFAULT_TRADE_QUANTITY,
    lastRealizedPnl: null,
    firstTradeComplete: false,
    introSeen: false,
    tutorialCompleted: false,
    systemMessage: "[sys] you are awake. the deck is not yours.",
    isBusy: false,
    isHydrated: false,
  };
}

function sanitizeHandle(rawHandle: string): string {
  return rawHandle.trim().replace(/\s+/g, "_").slice(0, 16);
}

function formatClock(nowMs: number): string {
  return new Date(nowMs).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function buildChangeMap(currentPrices: PriceMap, nextPrices: PriceMap): ChangeMap {
  return Object.fromEntries(
    Object.entries(nextPrices).map(([ticker, nextPrice]) => [
      ticker,
      roundCurrency(nextPrice - (currentPrices[ticker] ?? nextPrice)),
    ]),
  );
}

function buildInitialPriceHistory(prices: PriceMap): Record<string, number[]> {
  return Object.fromEntries(Object.entries(prices).map(([ticker, price]) => [ticker, [price]]));
}

function normalizePriceHistory(history: Record<string, number[]> | undefined, prices: PriceMap): Record<string, number[]> {
  if (!history) {
    return buildInitialPriceHistory(prices);
  }

  return Object.fromEntries(
    DEMO_COMMODITIES.map((commodity) => {
      const values = history[commodity.ticker] ?? [prices[commodity.ticker] ?? commodity.basePrice];
      const normalizedValues = values
        .slice(-14)
        .map((value) => normalizeCommodityPrice(commodity.ticker, value));
      return [
        commodity.ticker,
        normalizedValues.length ? normalizedValues : [prices[commodity.ticker] ?? commodity.basePrice],
      ];
    }),
  );
}

function appendPriceHistory(
  history: Record<string, number[]>,
  prices: PriceMap,
): Record<string, number[]> {
  return Object.fromEntries(
    Object.entries(prices).map(([ticker, price]) => [
      ticker,
      [...(history[ticker] ?? []), price].slice(-14),
    ]),
  );
}

function toPositionMap(positions: Position[]): Record<string, Position> {
  return Object.fromEntries(positions.map((position) => [position.ticker, position]));
}

function latestBalance(balanceObol: number, deltas: { balanceAfter: number }[]): number {
  return deltas.at(-1)?.balanceAfter ?? balanceObol;
}

function isTravelling(world: WorldState, nowMs: number): boolean {
  return Boolean(world.travelDestinationId && world.travelEndTime && world.travelEndTime > nowMs);
}

function makeNotification(message: string, tone: GameNotification["tone"]): GameNotification {
  const createdAt = Date.now();
  return {
    id: `note_${createdAt}_${Math.random().toString(36).slice(2, 8)}`,
    createdAt,
    message,
    tone,
  };
}

function addNotification(
  notifications: GameNotification[],
  message: string,
  tone: GameNotification["tone"],
): GameNotification[] {
  return [makeNotification(message, tone), ...notifications].slice(0, 20);
}

function isSensibleTimestamp(
  value: number | null | undefined,
  nowMs: number,
  maxWindowMs: number,
): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0 && value <= nowMs + maxWindowMs;
}

function sanitizeMissionTimer(mission: Mission | null | undefined, nowMs: number): Mission | null {
  if (!mission) {
    return null;
  }
  if (mission.completed || mission.failed || mission.status === "completed" || mission.status === "failed") {
    const fallbackEnd = mission.completedAt ?? mission.startTimestamp + FALLBACK_MISSION_DEADLINE_MS;
    const endTimestamp =
      Number.isFinite(mission.endTimestamp) && mission.endTimestamp <= nowMs + MAX_MISSION_DEADLINE_MS
        ? mission.endTimestamp
        : fallbackEnd;
    return {
      ...mission,
      expiresAtTimestamp:
        Number.isFinite(mission.expiresAtTimestamp) &&
        mission.expiresAtTimestamp <= nowMs + MAX_MISSION_DEADLINE_MS
        ? mission.expiresAtTimestamp
        : endTimestamp,
      endTimestamp,
    };
  }

  const expiresAtTimestamp = isSensibleTimestamp(
    mission.expiresAtTimestamp,
    nowMs,
    MAX_MISSION_DEADLINE_MS,
  )
    ? mission.expiresAtTimestamp
    : nowMs + FALLBACK_MISSION_DEADLINE_MS;
  const endTimestamp = isSensibleTimestamp(mission.endTimestamp, nowMs, MAX_MISSION_DEADLINE_MS)
    ? mission.endTimestamp
    : expiresAtTimestamp;

  return {
    ...mission,
    expiresAtTimestamp,
    endTimestamp,
  };
}

function sanitizeFlashTimer(event: FlashEvent | null | undefined, nowMs: number): FlashEvent | null {
  if (!event || !Number.isFinite(event.endTimestamp) || event.endTimestamp <= nowMs) {
    return null;
  }
  return event;
}

function sanitizeShipmentTimers(shipments: TransitShipment[] | undefined): TransitShipment[] {
  return (shipments ?? []).filter((shipment) => Number.isFinite(shipment.arrivalTime));
}

function sanitizeHeistTimer(heist: HeistMission | null | undefined): HeistMission | null {
  if (!heist || !Number.isFinite(heist.endTimestamp)) {
    return null;
  }
  return heist;
}

function getCourierLimit(rankLevel: number): number {
  return rankLevel >= 10 ? 5 : BASE_COURIER_LIMIT;
}

function getNextWhisperDelay(seed: string, index: number): number {
  const stream = seededStream(`${seed}:whisper-delay:${index}`);
  return (30 + Math.floor(stream() * 16)) * 1000;
}

function createMarketWhisper(nowMs: number, index: number): MarketWhisper {
  const stream = seededStream(`${ENGAGEMENT_SEED}:whisper:${index}`);
  const ticker = DEMO_COMMODITIES[Math.floor(stream() * DEMO_COMMODITIES.length)]?.ticker ?? "PGAS";
  const location = getUnlockedLocations()[Math.floor(stream() * getUnlockedLocations().length)] ?? getLocation(DEFAULT_LOCATION_ID);
  const templates = [
    `Someone's moving big ${ticker} at ${location.name}...`,
    `Unusual scanner activity near ${location.name}.`,
    `${ticker} brokers just went quiet in ${location.name}.`,
    `Courier chatter says ${location.name} routes are heating up.`,
  ];
  const message = templates[Math.floor(stream() * templates.length)] ?? templates[0]!;
  return {
    id: `whisper_${nowMs}_${index}`,
    createdAt: nowMs,
    message,
    locationId: location.id,
    ticker,
  };
}

function createRiskProfile(resources: Resources, bounty: BountySnapshot, positions: Record<string, Position>): PlayerRiskProfile {
  const illegalVolume = Object.values(positions).reduce((total, position) => {
    const risky = ["BLCK", "AETH", "HXMD"].includes(position.ticker);
    return total + (risky ? position.quantity : 0);
  }, 0);
  return {
    heat: resources.heat,
    bountyLevel: bounty.level,
    recentProfitVelocity: 0,
    recentIllegalVolume: illegalVolume,
    scannerAttention: Math.min(100, Math.round(resources.heat * 0.75 + bounty.level * 12 + illegalVolume)),
    raidImmunityUntil: null,
  };
}

function buildDecisionContextForState(
  state: DemoStoreState,
  nowMs: number,
  overrides: Partial<DemoStoreState> = {},
): DecisionContext {
  const snapshot = {
    ...state,
    ...overrides,
  };
  const currentLocationId = snapshot.world.currentLocationId;

  return getDecisionContext({
    nowMs,
    resources: snapshot.resources,
    bounty: snapshot.bounty,
    progression: snapshot.progression,
    currentLocationId,
    travelDestinationId: snapshot.world.travelDestinationId,
    travelEndTime: snapshot.world.travelEndTime,
    positions: snapshot.positions,
    prices: snapshot.prices,
    changes: snapshot.changes,
    activeFlashEvent: snapshot.activeFlashEvent,
    pendingMission: snapshot.pendingMission,
    activeMission: snapshot.activeMission,
    marketWhispers: snapshot.marketWhispers,
    pantheonShard: snapshot.pantheonShard,
    dailyChallenges: snapshot.dailyChallenges,
    transitShipments: snapshot.transitShipments,
    district: getActiveDistrictState(snapshot.districtStates, currentLocationId, nowMs),
    heatPressure: snapshot.heatPressure,
    streak: snapshot.streak,
    recoveryOpportunity: snapshot.recoveryOpportunity,
    exitHookMessage: snapshot.exitHookMessage,
    nextFlashEventAt: snapshot.nextFlashEventAt,
    nextMissionAt: snapshot.nextMissionAt,
    nextMarketWhisperAt: snapshot.nextMarketWhisperAt,
    firstSessionStage: snapshot.firstSessionStage,
    firstSessionComplete: snapshot.firstSessionComplete,
  });
}

function createMemoryShard(rankLevel: number, nowMs: number): PlayerLoreShard {
  return {
    id: `memory_rank_${rankLevel}`,
    rankLevel,
    title: `Recovered Memory // Rank ${rankLevel}`,
    body: MEMORY_SHARD_TEXT,
    unlockedAt: nowMs,
    read: false,
  };
}

function maybeAddMemoryShard(
  previous: RankSnapshot,
  next: RankSnapshot,
  lore: PlayerLoreShard[],
  nowMs: number,
): PlayerLoreShard[] {
  const unlockLevel = shouldUnlockMemoryShard(previous.level, next.level);
  if (!unlockLevel || lore.some((shard) => shard.rankLevel === unlockLevel)) {
    return lore;
  }
  return [createMemoryShard(unlockLevel, nowMs), ...lore];
}

function buildRaidRecoveryWindow(
  losses: Record<string, number>,
  positionsBeforeRaid: Record<string, Position>,
  nowMs: number,
): RaidRecoveryWindow | null {
  const lostInventory = Object.fromEntries(
    Object.entries(losses).filter(([, quantity]) => quantity > 0),
  );
  if (!Object.keys(lostInventory).length) {
    return null;
  }
  return {
    id: `raid_recovery_${nowMs}`,
    raidAt: nowMs,
    expiresAt: nowMs + 24 * 60 * 60_000,
    lostInventory,
    restored: false,
  };
}

function applyAllPriceModifiers(input: {
  basePrices: PriceMap;
  locationId: string;
  districtStates: Record<string, DistrictStateRecord>;
  activeFlashEvent: FlashEvent | null;
  nowMs: number;
  tick: number;
}): PriceMap {
  const district = getActiveDistrictState(
    input.districtStates,
    input.locationId,
    input.nowMs,
  );
  const locationPrices = applyLocationPriceModifiers(
    input.basePrices,
    input.locationId,
    district,
  );
  return applyFlashEventPriceModifiers({
    prices: locationPrices,
    event: input.activeFlashEvent,
    locationId: input.locationId,
    nowMs: input.nowMs,
    tick: input.tick,
  });
}

function getTradeBlockReason(state: DemoStoreState, side: "BUY" | "SELL"): string | null {
  const district = getActiveDistrictState(
    state.districtStates,
    state.world.currentLocationId,
    state.clock.nowMs,
  );
  if (isTravelling(state.world, state.clock.nowMs)) {
    return "[sys] travelling. trading blocked until arrival.";
  }
  if (side === "BUY" && isDistrictBuyRestricted(district.state)) {
    return `[sys] ${district.state.toLowerCase()} in this district. buys restricted.`;
  }
  if (side === "SELL" && isDistrictSellRestricted(district.state)) {
    return `[sys] ${district.state.toLowerCase()} in this district. sells restricted.`;
  }
  if (isTradingBlockedByFlash(state.activeFlashEvent, state.world.currentLocationId)) {
    return "[sys] district blackout. trading frozen.";
  }
  return null;
}

function updateHeatWarning(
  previousHeat: number,
  nextResources: Resources,
  notifications: GameNotification[],
): {
  resources: Resources;
  notifications: GameNotification[];
  heatWarning: DemoStoreState["heatWarning"];
} {
  const threshold = HEAT_WARNING_THRESHOLDS.find(
    (value) => previousHeat < value && nextResources.heat >= value,
  );

  if (!threshold) {
    return { resources: nextResources, notifications, heatWarning: null };
  }

  return {
    resources: nextResources,
    notifications: addNotification(
      notifications,
      `Heat crossed ${threshold}. eAgent attention rising.`,
      "warning",
    ),
    heatWarning: { threshold, createdAt: Date.now() },
  };
}

function updateBountyFeedback(
  previousHeat: number,
  nextResources: Resources,
  notifications: GameNotification[],
): { bounty: BountySnapshot; notifications: GameNotification[] } {
  const previousBounty = getBountyByHeat(previousHeat);
  const bounty = getBountyByHeat(nextResources.heat);
  if (bounty.level <= previousBounty.level) {
    return { bounty, notifications };
  }

  return {
    bounty,
    notifications: addNotification(
      notifications,
      `eAGENT WATCHLIST: You are now ${bounty.status}.`,
      "danger",
    ),
  };
}

function maybeRankCelebration(
  previous: RankSnapshot,
  next: RankSnapshot,
): RankCelebration | null {
  if (next.level <= previous.level) {
    return null;
  }
  // AUDIO: rank_up.wav on rank change
  return {
    level: next.level,
    title: next.title,
    createdAt: Date.now(),
  };
}

function markMissionStatus(
  mission: Mission,
  status: Mission["status"],
  nowMs: number,
): Mission {
  return {
    ...mission,
    status,
    accepted: status === "active" || mission.accepted,
    completed: status === "completed",
    failed: status === "failed" || status === "declined",
    completedAt: status === "completed" || status === "failed" || status === "declined"
      ? nowMs
      : mission.completedAt,
  };
}

function createRecoveryPrompt(input: {
  nowMs: number;
  lossValue: number;
  reason: RecoveryPrompt["reason"];
}): RecoveryPrompt {
  const lossValue = Math.max(0, roundCurrency(input.lossValue));
  const reward0Bol = roundCurrency(Math.max(500, Math.min(25_000, lossValue * 0.3)));
  return {
    id: `recovery_${input.reason}_${input.nowMs}`,
    reason: input.reason,
    lossValue,
    reward0Bol,
    triggerAt: input.nowMs + 5_000,
    expiresAt: input.nowMs + 5 * 60_000,
    createdAt: input.nowMs,
  };
}

function recoverySignalFromPrompt(prompt: RecoveryPrompt): DecisionSignal {
  return {
    id: `signal_${prompt.id}`,
    title: "Rebuild - Low Risk",
    description: `Kite has a controlled VBLM rebuild lane. Reward covers about 30% of the last hit: ${formatObol(prompt.reward0Bol)} 0BOL.`,
    actionType: "trade",
    actionLabel: "Start rebuild",
    urgency: "high",
    expiresAt: prompt.expiresAt,
    ticker: "VBLM",
    locationId: DEFAULT_LOCATION_ID,
  };
}

function recoveryMissionFromPrompt(prompt: RecoveryPrompt): Mission {
  return {
    id: `mission_${prompt.id}`,
    npcId: "kite",
    npcName: "Kite",
    type: "buy_request",
    title: "Kite: Rebuild - Low Risk",
    description: `Buy 1 VBLM. I'll patch ${formatObol(prompt.reward0Bol)} 0BOL back into your route.`,
    requiredTicker: "VBLM",
    requiredQuantity: 1,
    reward0Bol: prompt.reward0Bol,
    rewardXp: 20,
    reputationChangeOnSuccess: 2,
    reputationChangeOnFail: 0,
    expiresAtTimestamp: prompt.expiresAt,
    accepted: true,
    completed: false,
    failed: false,
    status: "active",
    objective: "Buy 1 VBLM to rebuild momentum.",
    ticker: "VBLM",
    quantity: 1,
    startTimestamp: prompt.triggerAt,
    endTimestamp: prompt.expiresAt,
    acceptedAt: prompt.triggerAt,
    rewardObol: prompt.reward0Bol,
    reputationDelta: 2,
  };
}

function estimateInventoryLossValue(
  losses: Record<string, number>,
  positions: Record<string, Position>,
  prices: PriceMap,
): number {
  return roundCurrency(
    Object.entries(losses).reduce((total, [ticker, quantity]) => {
      const basis = positions[ticker]?.avgEntry ?? prices[ticker] ?? 1;
      return total + basis * quantity;
    }, 0),
  );
}

function createExitHookSignal(state: DemoStoreState, nowMs: number): DecisionSignal | null {
  const arrivingShipment = state.transitShipments
    .filter((shipment) => shipment.status === "transit" && shipment.arrivalTime > nowMs)
    .sort((left, right) => left.arrivalTime - right.arrivalTime)
    .find((shipment) => shipment.arrivalTime - nowMs <= 5 * 60_000);
  if (arrivingShipment) {
    return {
      id: `exit_courier_${arrivingShipment.id}`,
      title: "Courier arriving soon",
      description: `${arrivingShipment.quantity} ${arrivingShipment.ticker} lands in ${Math.ceil((arrivingShipment.arrivalTime - nowMs) / 60_000)} minutes. Stay to claim the run.`,
      actionType: "courier",
      actionLabel: "Track courier",
      urgency: "high",
      expiresAt: arrivingShipment.arrivalTime,
      ticker: arrivingShipment.ticker,
      locationId: arrivingShipment.destinationId,
    };
  }

  const mission = state.activeMission ?? state.pendingMission;
  if (mission && mission.expiresAtTimestamp > nowMs && mission.expiresAtTimestamp - nowMs <= 5 * 60_000) {
    return {
      id: `exit_mission_${mission.id}`,
      title: "Mission expiring soon",
      description: `${mission.title} is close to timing out. Finish or decline before the window closes.`,
      actionType: "mission",
      actionLabel: "Review mission",
      urgency: "high",
      expiresAt: mission.expiresAtTimestamp,
      ticker: mission.ticker ?? mission.requiredTicker,
      locationId: mission.destinationId ?? mission.destinationLocationId,
    };
  }

  if (state.activeFlashEvent && state.activeFlashEvent.endTimestamp > nowMs && state.activeFlashEvent.endTimestamp - nowMs <= 2 * 60_000) {
    return {
      id: `exit_flash_${state.activeFlashEvent.id}`,
      title: "Signal closing soon",
      description: `${state.activeFlashEvent.headline} is under 2 minutes from expiry.`,
      actionType: state.activeFlashEvent.locationId && state.activeFlashEvent.locationId !== state.world.currentLocationId ? "travel" : "trade",
      actionLabel: "Act before close",
      urgency: state.activeFlashEvent.riskLevel === "critical" ? "critical" : "high",
      expiresAt: state.activeFlashEvent.endTimestamp,
      ticker: state.activeFlashEvent.ticker,
      locationId: state.activeFlashEvent.locationId,
    };
  }

  return null;
}

function createAwayPrimaryAction(state: DemoStoreState, nowMs: number): NonNullable<AwayReport["primaryAction"]> {
  const arrivedHere = state.transitShipments.find(
    (shipment) => shipment.status === "arrived" && shipment.destinationId === state.world.currentLocationId,
  );
  if (arrivedHere) {
    return {
      label: "CHECK COURIER",
      message: `${arrivedHere.quantity} ${arrivedHere.ticker} is ready to claim.`,
      action: "inventory",
    };
  }

  const claimable = state.dailyChallenges.find((challenge) => challenge.completed && !challenge.claimed);
  if (claimable) {
    return {
      label: "CLAIM REWARD",
      message: `${claimable.title} reward is waiting.`,
      action: "missions",
    };
  }

  const exitSignal = createExitHookSignal(state, nowMs);
  if (exitSignal) {
    return {
      label: exitSignal.actionType === "mission" ? "REVIEW MISSION" : exitSignal.actionType === "courier" ? "CHECK COURIER" : "RESUME TRADING",
      message: exitSignal.description,
      action: exitSignal.actionType === "mission" ? "missions" : exitSignal.actionType === "courier" ? "inventory" : "terminal",
    };
  }

  return {
    label: "RESUME TRADING",
    message: "The market is live. Check the next best signal.",
    action: "terminal",
  };
}

function toPersistedSession(state: DemoStoreState): PersistedDemoSession {
  return {
    phase: state.phase,
    activeView: state.activeView,
    handle: state.handle,
    profile: state.profile,
    playerId: state.playerId,
    tick: state.tick,
    prices: state.prices,
    changes: state.changes,
    priceHistory: state.priceHistory,
    balanceObol: state.balanceObol,
    resources: state.resources,
    positions: state.positions,
    activeNews: state.activeNews,
    progression: state.progression,
    clock: state.clock,
    world: state.world,
    notifications: state.notifications,
    transitShipments: state.transitShipments,
    locationInventories: state.locationInventories,
    activeFlashEvent: state.activeFlashEvent,
    flashEventCount: state.flashEventCount,
    nextFlashEventAt: state.nextFlashEventAt,
    flashCooldownUntil: state.flashCooldownUntil,
    pendingMission: state.pendingMission,
    activeMission: state.activeMission,
    missionHistory: state.missionHistory,
    npcReputation: state.npcReputation,
    npcRelationships: state.npcRelationships,
    missionCount: state.missionCount,
    nextMissionAt: state.nextMissionAt,
    heistMissions: state.heistMissions,
    activeHeistMission: state.activeHeistMission,
    heistCount: state.heistCount,
    streak: state.streak,
    dailyChallenges: state.dailyChallenges,
    dailyChallengeDayKey: state.dailyChallengeDayKey,
    firstSessionStage: state.firstSessionStage,
    firstSessionStartedAt: state.firstSessionStartedAt,
    firstSessionComplete: state.firstSessionComplete,
    firstVblmBoughtAt: state.firstVblmBoughtAt,
    firstSessionMessage: state.firstSessionMessage,
    pantheonShard: state.pantheonShard,
    obolBalance: state.obolBalance,
    shopPurchases: state.shopPurchases,
    extraInventorySlots: state.extraInventorySlots,
    marketWhispers: state.marketWhispers,
    marketWhisperCount: state.marketWhisperCount,
    nextMarketWhisperAt: state.nextMarketWhisperAt,
    playerLore: state.playerLore,
    missedPeakLog: state.missedPeakLog,
    heldPricePeaks: state.heldPricePeaks,
    playerRiskProfile: state.playerRiskProfile,
    raidRecoveryWindow: state.raidRecoveryWindow,
    raidBuybackLastUsedWeek: state.raidBuybackLastUsedWeek,
    districtStates: state.districtStates,
    districtStateCount: state.districtStateCount,
    nextDistrictStateAt: state.nextDistrictStateAt,
    bounty: state.bounty,
    heatPressure: state.heatPressure,
    scannerEvadeTradesRemaining: state.scannerEvadeTradesRemaining,
    recoveryOpportunity: state.recoveryOpportunity,
    pendingRecoveryPrompt: state.pendingRecoveryPrompt,
    exitHookMessage: state.exitHookMessage,
    lastInteractionAt: state.lastInteractionAt,
    lastExitHookAt: state.lastExitHookAt,
    microRewards: state.microRewards,
    awayReport: state.awayReport,
    tradeJuice: state.tradeJuice,
    heatWarning: state.heatWarning,
    rankCelebration: state.rankCelebration,
    selectedTicker: state.selectedTicker,
    orderSize: state.orderSize,
    lastRealizedPnl: state.lastRealizedPnl,
    firstTradeComplete: state.firstTradeComplete,
    introSeen: state.introSeen,
    tutorialCompleted: state.tutorialCompleted,
    systemMessage: state.systemMessage,
    authoritySnapshot: exportAuthoritySnapshot(),
  };
}

export const useDemoStore = create<DemoStore>((set, get) => {
  const persistCurrentState = async () => {
    const state = get();
    if (!state.isHydrated) {
      return;
    }

    await saveDemoSession(toPersistedSession(state));
  };

  const commitState = (partial: Partial<DemoStoreState>) => {
    const nowMs = partial.clock?.nowMs ?? get().clock.nowMs ?? Date.now();
    const snapshot = {
      ...get(),
      ...partial,
    } as DemoStoreState;
    set({
      ...partial,
      decisionContext: buildDecisionContextForState(snapshot, nowMs),
    });
    void persistCurrentState();
  };

  const refreshDecisionContext = (nowMs: number = Date.now()) => {
    const state = get();
    set({ decisionContext: buildDecisionContextForState(state, nowMs) });
  };

  const refreshFromAuthority = async (
    playerId: string,
    nextTick: number,
    locationId: string,
    nowMs: number,
    activeFlashEvent: FlashEvent | null = get().activeFlashEvent,
    districtStates: Record<string, DistrictStateRecord> = get().districtStates,
  ) => {
    const authority = getAuthority();
    const current = get();
    const basePrices = await authority.getTickPrices(nextTick);
    const prices = applyAllPriceModifiers({
      basePrices,
      locationId,
      districtStates,
      activeFlashEvent,
      nowMs,
      tick: nextTick,
    });
    const [activeNews, resources, positions, progression] = await Promise.all([
      authority.getActiveNews(nextTick),
      authority.advancePlayerClock
        ? authority.advancePlayerClock(playerId, nextTick)
        : authority.getResources(playerId),
      authority.getOpenPositions(playerId, locationId),
      authority.getRank(playerId),
    ]);

    return {
      tick: nextTick,
      prices,
      changes: buildChangeMap(current.prices, prices),
      priceHistory: appendPriceHistory(current.priceHistory, prices),
      activeNews,
      resources,
      positions: toPositionMap(positions),
      progression,
    };
  };

  const forcePriceRecalc = async (input: {
    playerId: string;
    nextTick: number;
    locationId: string;
    nowMs: number;
    activeFlashEvent: FlashEvent | null;
    districtStates: Record<string, DistrictStateRecord>;
    previousPrices: PriceMap;
    previousHistory: Record<string, number[]>;
  }): Promise<Partial<DemoStoreState>> => {
    const authority = getAuthority();
    const basePrices = await authority.getTickPrices(input.nextTick);
    const prices = applyAllPriceModifiers({
      basePrices,
      locationId: input.locationId,
      districtStates: input.districtStates,
      activeFlashEvent: input.activeFlashEvent,
      nowMs: input.nowMs,
      tick: input.nextTick,
    });
    const positions = await authority.getOpenPositions(input.playerId, input.locationId);
    return {
      prices,
      changes: buildChangeMap(input.previousPrices, prices),
      priceHistory: appendPriceHistory(input.previousHistory, prices),
      positions: toPositionMap(positions),
    };
  };

  return {
    ...buildInitialState(),
    hydrateDemo: async () => {
      if (get().isHydrated) {
        return;
      }

      const session = await loadDemoSession();
      if (!session) {
        resetConfiguredAuthority();
        set({
          ...buildInitialState(),
          isHydrated: true,
        });
        return;
      }

      restoreLocalAuthority(session.authoritySnapshot);
      const fallback = buildInitialState();
      const prices = normalizePriceMap(session.prices ?? fallback.prices);
      const nowMs = Date.now();
      set({
        ...fallback,
        ...session,
        prices,
        changes: session.changes ?? createInitialChanges(),
        priceHistory: normalizePriceHistory(session.priceHistory, prices),
        activeNews: session.activeNews ?? [],
        progression: session.progression ?? getRankSnapshot(session.profile?.rank ?? 0),
        clock: {
          ...fallback.clock,
          ...(session.clock ?? {}),
          nowMs,
          displayTime: formatClock(nowMs),
        },
        world: session.world ?? fallback.world,
        notifications: session.notifications ?? [],
        transitShipments: sanitizeShipmentTimers(session.transitShipments),
        locationInventories: session.locationInventories ?? {},
        activeFlashEvent: sanitizeFlashTimer(session.activeFlashEvent, nowMs),
        flashEventCount: session.flashEventCount ?? 0,
        nextFlashEventAt: session.nextFlashEventAt ?? fallback.nextFlashEventAt,
        flashCooldownUntil: 0,
        pendingMission: sanitizeMissionTimer(session.pendingMission, nowMs),
        activeMission: sanitizeMissionTimer(session.activeMission, nowMs),
        missionHistory: (session.missionHistory ?? [])
          .map((mission) => sanitizeMissionTimer(mission, nowMs))
          .filter((mission): mission is Mission => mission !== null),
        npcReputation: session.npcReputation ?? {},
        npcRelationships: session.npcRelationships ?? fallback.npcRelationships,
        missionCount: session.missionCount ?? 0,
        nextMissionAt: session.nextMissionAt ?? fallback.nextMissionAt,
        heistMissions: (session.heistMissions ?? [])
          .map((heist) => sanitizeHeistTimer(heist))
          .filter((heist): heist is HeistMission => heist !== null),
        activeHeistMission: sanitizeHeistTimer(session.activeHeistMission),
        heistCount: session.heistCount ?? 0,
        streak: session.streak ?? fallback.streak,
        dailyChallenges: session.dailyChallenges ?? fallback.dailyChallenges,
        dailyChallengeDayKey: session.dailyChallengeDayKey ?? fallback.dailyChallengeDayKey,
        firstSessionStage: session.firstSessionStage ?? fallback.firstSessionStage,
        firstSessionStartedAt: session.firstSessionStartedAt ?? (session.profile ? Date.parse(session.profile.createdAt) : fallback.firstSessionStartedAt),
        firstSessionComplete: session.firstSessionComplete ?? false,
        firstVblmBoughtAt: session.firstVblmBoughtAt ?? null,
        firstSessionMessage: session.firstSessionMessage ?? fallback.firstSessionMessage,
        pantheonShard: session.pantheonShard ?? null,
        obolBalance: session.obolBalance ?? MOCK_STARTING_OBOL_BALANCE,
        shopPurchases: session.shopPurchases ?? {},
        extraInventorySlots: session.extraInventorySlots ?? 0,
        marketWhispers: session.marketWhispers ?? [],
        marketWhisperCount: session.marketWhisperCount ?? 0,
        nextMarketWhisperAt: session.nextMarketWhisperAt ?? fallback.nextMarketWhisperAt,
        playerLore: session.playerLore ?? [],
        missedPeakLog: session.missedPeakLog ?? [],
        heldPricePeaks: session.heldPricePeaks ?? {},
        playerRiskProfile: session.playerRiskProfile ?? createRiskProfile(session.resources ?? fallback.resources, getBountyByHeat((session.resources ?? fallback.resources).heat), session.positions ?? {}),
        raidRecoveryWindow: session.raidRecoveryWindow ?? null,
        raidBuybackLastUsedWeek: session.raidBuybackLastUsedWeek ?? null,
        districtStates: session.districtStates ?? fallback.districtStates,
        districtStateCount: session.districtStateCount ?? 0,
        nextDistrictStateAt: session.nextDistrictStateAt ?? fallback.nextDistrictStateAt,
        bounty: session.bounty ?? getBountyByHeat((session.resources ?? fallback.resources).heat),
        heatPressure: session.heatPressure ?? createInitialHeatPressure(nowMs, (session.resources ?? fallback.resources).heat),
        scannerEvadeTradesRemaining: session.scannerEvadeTradesRemaining ?? 0,
        recoveryOpportunity: session.recoveryOpportunity && session.recoveryOpportunity.expiresAt && session.recoveryOpportunity.expiresAt > nowMs
          ? session.recoveryOpportunity
          : null,
        pendingRecoveryPrompt: session.pendingRecoveryPrompt && session.pendingRecoveryPrompt.expiresAt > nowMs
          ? session.pendingRecoveryPrompt
          : null,
        exitHookMessage: session.exitHookMessage && session.exitHookMessage.expiresAt && session.exitHookMessage.expiresAt > nowMs
          ? session.exitHookMessage
          : null,
        lastInteractionAt: session.lastInteractionAt ?? nowMs,
        lastExitHookAt: session.lastExitHookAt ?? 0,
        microRewards: session.microRewards ?? [],
        awayReport: session.awayReport ?? null,
        tradeJuice: session.tradeJuice ?? null,
        heatWarning: session.heatWarning ?? null,
        rankCelebration: session.rankCelebration ?? null,
        orderSize: session.orderSize ?? DEFAULT_TRADE_QUANTITY,
        lastRealizedPnl: session.lastRealizedPnl ?? null,
        introSeen: session.introSeen ?? false,
        tutorialCompleted: session.tutorialCompleted ?? false,
        isBusy: false,
        isHydrated: true,
      });
      set({ decisionContext: buildDecisionContextForState(get(), Date.now()) });
    },
    moveToHandle: () => {
      commitState({
        phase: "login",
        systemMessage: "[sys] claim a local handle. uplink optional.",
      });
    },
    setHandle: (rawHandle) => {
      const handle = sanitizeHandle(rawHandle);
      commitState({
        handle,
        phase: "boot",
        systemMessage: handle
          ? `[sys] handle locked // ${handle.toLowerCase()}`
          : "[sys] handle required.",
      });
    },
    markIntroSeen: () => {
      commitState({ introSeen: true, phase: "login" });
    },
    resetIntro: () => {
      commitState({ introSeen: false, phase: "intro" });
    },
    completeBoot: async () => {
      const state = get();
      if (state.profile || state.playerId) {
        commitState({
          phase: "home",
          activeView: "home",
          systemMessage: "[sys] market open. start small. low heat.",
        });
        return;
      }

      const handle = sanitizeHandle(state.handle || "ZORO");
      set({ isBusy: true, handle, systemMessage: "[sys] provisioning local shard..." });

      try {
        const authority = getAuthority();
        const profile = await authority.createProfile({
          walletAddress: null,
          devIdentity: handle.toLowerCase(),
          eidolonHandle: handle,
          osTier: "PIRATE",
          rank: 1,
          faction: null,
        });

        const nowMs = Date.now();
        const basePrices = await authority.getTickPrices(0);
        const prices = applyLocationPriceModifiers(basePrices, DEFAULT_LOCATION_ID);
        const [resources, ledger, positions, activeNews, progression] = await Promise.all([
          authority.getResources(profile.id),
          authority.getLedger(profile.id),
          authority.getOpenPositions(profile.id, DEFAULT_LOCATION_ID),
          authority.getActiveNews(0),
          authority.getRank(profile.id),
        ]);

        set({
          phase: "home",
          handle: profile.eidolonHandle,
          profile,
          playerId: profile.id,
          activeView: "home",
          tick: 0,
          prices,
          changes: createInitialChanges(),
          priceHistory: buildInitialPriceHistory(prices),
          balanceObol: latestBalance(DEMO_STARTING_BALANCE, ledger),
          resources,
          positions: toPositionMap(positions),
          activeNews,
          progression,
          clock: {
            nowMs,
            displayTime: formatClock(nowMs),
            lastTickAt: nowMs,
            lastRaidTick: 0,
          },
          world: {
            currentLocationId: DEFAULT_LOCATION_ID,
            travelDestinationId: null,
            travelEndTime: null,
          },
          notifications: addNotification([], "Local shard online.", "success"),
          activeFlashEvent: null,
          flashEventCount: 0,
          nextFlashEventAt: nowMs + getNextFlashEventDelay(ENGAGEMENT_SEED, 0),
          flashCooldownUntil: 0,
          pendingMission: null,
          activeMission: null,
          missionHistory: [],
          npcReputation: {},
          npcRelationships: createInitialNpcRelationships(),
          missionCount: 0,
          nextMissionAt: nowMs + getNextMissionDelay(ENGAGEMENT_SEED, 0),
          heistMissions: [],
          activeHeistMission: null,
          heistCount: 0,
          streak: createInitialStreak(),
          dailyChallenges: createDailyChallenges(nowMs, progression.level),
          dailyChallengeDayKey: getDailyChallengeDayKey(nowMs),
          firstSessionStage: 0,
          firstSessionStartedAt: nowMs,
          firstSessionComplete: false,
          firstVblmBoughtAt: null,
          firstSessionMessage: "Absorbed residual data from the host cyberdeck. 40/200 XP to Packet Rat.",
          pantheonShard: null,
          obolBalance: MOCK_STARTING_OBOL_BALANCE,
          shopPurchases: {},
          extraInventorySlots: 0,
          marketWhispers: [createMarketWhisper(nowMs, 0)],
          marketWhisperCount: 1,
          nextMarketWhisperAt: nowMs + getNextWhisperDelay(ENGAGEMENT_SEED, 1),
          playerLore: [],
          missedPeakLog: [],
          heldPricePeaks: {},
          playerRiskProfile: createRiskProfile(resources, getBountyByHeat(resources.heat), {}),
          raidRecoveryWindow: null,
          raidBuybackLastUsedWeek: null,
          districtStates: createInitialDistrictStates(nowMs),
          districtStateCount: 0,
          nextDistrictStateAt: nowMs + getNextDistrictShiftDelay(ENGAGEMENT_SEED, 0),
          heatPressure: createInitialHeatPressure(nowMs, resources.heat),
          microRewards: [],
          tradeJuice: null,
          heatWarning: null,
          rankCelebration: null,
          isBusy: false,
          isHydrated: true,
          systemMessage: "Absorbed residual data from the host cyberdeck. 40/200 XP to Packet Rat.",
        });
        await persistCurrentState();
      } catch (error) {
        set({
          isBusy: false,
          systemMessage:
            error instanceof Error
              ? `[sys] ${error.message.toLowerCase()}`
              : "[sys] shell provisioning failed.",
        });
        await persistCurrentState();
      }
    },
    completeTutorial: () => {
      commitState({ tutorialCompleted: true, systemMessage: "[sys] tutorial complete." });
    },
    resetTutorial: () => {
      commitState({ tutorialCompleted: false, systemMessage: "[sys] tutorial reset." });
    },
    submitHandle: async (rawHandle) => {
      const handle = sanitizeHandle(rawHandle);
      if (!handle) {
        commitState({ systemMessage: "[sys] handle required." });
        return false;
      }

      set({ isBusy: true, systemMessage: "[sys] provisioning local shard..." });

      try {
        const authority = getAuthority();
        const profile = await authority.createProfile({
          walletAddress: null,
          devIdentity: handle.toLowerCase(),
          eidolonHandle: handle,
          osTier: "PIRATE",
          rank: 1,
          faction: null,
        });

        const nowMs = Date.now();
        const basePrices = await authority.getTickPrices(0);
        const prices = applyLocationPriceModifiers(basePrices, DEFAULT_LOCATION_ID);
        const [resources, ledger, positions, activeNews, progression] = await Promise.all([
          authority.getResources(profile.id),
          authority.getLedger(profile.id),
          authority.getOpenPositions(profile.id, DEFAULT_LOCATION_ID),
          authority.getActiveNews(0),
          authority.getRank(profile.id),
        ]);

        set({
          phase: "terminal",
          handle: profile.eidolonHandle,
          profile,
          playerId: profile.id,
          activeView: "home",
          tick: 0,
          prices,
          changes: createInitialChanges(),
          priceHistory: buildInitialPriceHistory(prices),
          balanceObol: latestBalance(DEMO_STARTING_BALANCE, ledger),
          resources,
          positions: toPositionMap(positions),
          activeNews,
          progression,
          clock: {
            nowMs,
            displayTime: formatClock(nowMs),
            lastTickAt: nowMs,
            lastRaidTick: 0,
          },
          world: {
            currentLocationId: DEFAULT_LOCATION_ID,
            travelDestinationId: null,
            travelEndTime: null,
          },
          notifications: addNotification([], "Local shard online.", "success"),
          activeFlashEvent: null,
          flashEventCount: 0,
          nextFlashEventAt: nowMs + getNextFlashEventDelay(ENGAGEMENT_SEED, 0),
          flashCooldownUntil: 0,
          pendingMission: null,
          activeMission: null,
          missionHistory: [],
          npcReputation: {},
          npcRelationships: createInitialNpcRelationships(),
          missionCount: 0,
          nextMissionAt: nowMs + getNextMissionDelay(ENGAGEMENT_SEED, 0),
          heistMissions: [],
          activeHeistMission: null,
          heistCount: 0,
          streak: createInitialStreak(),
          dailyChallenges: createDailyChallenges(nowMs, progression.level),
          dailyChallengeDayKey: getDailyChallengeDayKey(nowMs),
          firstSessionStage: 0,
          firstSessionStartedAt: nowMs,
          firstSessionComplete: false,
          firstVblmBoughtAt: null,
          firstSessionMessage: "Absorbed residual data from the host cyberdeck. 40/200 XP to Packet Rat.",
          pantheonShard: null,
          obolBalance: MOCK_STARTING_OBOL_BALANCE,
          shopPurchases: {},
          extraInventorySlots: 0,
          marketWhispers: [createMarketWhisper(nowMs, 0)],
          marketWhisperCount: 1,
          nextMarketWhisperAt: nowMs + getNextWhisperDelay(ENGAGEMENT_SEED, 1),
          playerLore: [],
          missedPeakLog: [],
          heldPricePeaks: {},
          playerRiskProfile: createRiskProfile(resources, getBountyByHeat(resources.heat), {}),
          raidRecoveryWindow: null,
          raidBuybackLastUsedWeek: null,
          districtStates: createInitialDistrictStates(nowMs),
          districtStateCount: 0,
          nextDistrictStateAt: nowMs + getNextDistrictShiftDelay(ENGAGEMENT_SEED, 0),
          heatPressure: createInitialHeatPressure(nowMs, resources.heat),
          microRewards: [],
          tradeJuice: null,
          heatWarning: null,
          rankCelebration: null,
          isBusy: false,
          isHydrated: true,
          systemMessage: "Absorbed residual data from the host cyberdeck. 40/200 XP to Packet Rat.",
        });
        await persistCurrentState();
        return true;
      } catch (error) {
        set({
          isBusy: false,
          systemMessage:
            error instanceof Error
              ? `[sys] ${error.message.toLowerCase()}`
              : "[sys] shell provisioning failed.",
        });
        await persistCurrentState();
        return false;
      }
    },
    openMarket: () => {
      commitState({ phase: "terminal", activeView: "market" });
    },
    goHome: () => {
      commitState({ phase: "home", activeView: "home" });
    },
    selectTicker: (ticker) => {
      const commodity = getCommodity(ticker);
      if (!commodity) {
        return;
      }

      commitState({
        phase: "terminal",
        activeView: "market",
        selectedTicker: ticker,
        systemMessage: `[scan] ${ticker} locked // ${commodity.name.toLowerCase()}`,
      });
    },
    setOrderSize: (quantity) => {
      const safeQuantity = Math.max(1, Math.floor(quantity));
      commitState({
        orderSize: safeQuantity,
        systemMessage: `[order] lot size set // x${safeQuantity}`,
      });
    },
    advanceMarket: async () => {
      const state = get();
      if (!state.playerId || !state.isHydrated) {
        return;
      }

      const nextTick = state.tick + 1;
      const nowMs = state.clock.nowMs || Date.now();
      const refresh = await refreshFromAuthority(
        state.playerId,
        nextTick,
        state.world.currentLocationId,
        nowMs,
      );
      set(refresh);
      await persistCurrentState();
    },
    runGameLoop: async (nowMs) => {
      const state = get();
      const baseClock = {
        ...state.clock,
        nowMs,
        displayTime: formatClock(nowMs),
      };
      set({
        clock: baseClock,
        decisionContext: buildDecisionContextForState(state, nowMs),
      });

      if (!state.isHydrated || !state.playerId) {
        return;
      }

      const authority = getAuthority();
      let nextWorld = state.world;
      let nextNotifications = state.notifications;
      let nextShipments = state.transitShipments;
      let nextLocationInventories = state.locationInventories;
      let nextActiveFlashEvent = updateFlashEvent(state.activeFlashEvent, nowMs);
      let nextFlashEventCount = state.flashEventCount;
      let nextFlashEventAt = state.nextFlashEventAt;
      let nextFlashCooldownUntil = state.flashCooldownUntil;
      let nextPendingMission = state.pendingMission;
      let nextActiveMission = state.activeMission;
      let nextMissionHistory = state.missionHistory;
      let nextNpcReputation = state.npcReputation;
      let nextNpcRelationships = state.npcRelationships;
      let nextMissionCount = state.missionCount;
      let nextMissionAt = state.nextMissionAt;
      let nextHeistMissions = state.heistMissions;
      let nextActiveHeistMission = state.activeHeistMission;
      let nextHeistCount = state.heistCount;
      let nextStreak = expireStreakIfNeeded(state.streak, nowMs);
      let nextDailyChallenges = state.dailyChallenges;
      let nextDailyChallengeDayKey = state.dailyChallengeDayKey;
      let nextFirstSessionStage = state.firstSessionStage;
      let nextFirstSessionStartedAt = state.firstSessionStartedAt ?? nowMs;
      let nextFirstSessionComplete = state.firstSessionComplete;
      let nextFirstVblmBoughtAt = state.firstVblmBoughtAt;
      let nextFirstSessionMessage = state.firstSessionMessage;
      let nextPantheonShard = state.pantheonShard;
      let nextObolBalance = state.obolBalance;
      let nextShopPurchases = state.shopPurchases;
      let nextMarketWhispers = state.marketWhispers;
      let nextMarketWhisperCount = state.marketWhisperCount;
      let nextMarketWhisperAt = state.nextMarketWhisperAt;
      let nextPlayerLore = state.playerLore;
      let nextMissedPeakLog = state.missedPeakLog;
      let nextHeldPricePeaks = state.heldPricePeaks;
      let nextPlayerRiskProfile = state.playerRiskProfile;
      let nextRaidRecoveryWindow = state.raidRecoveryWindow;
      let nextRaidBuybackLastUsedWeek = state.raidBuybackLastUsedWeek;
      let nextDistrictStates = normalizeDistrictStates(state.districtStates, nowMs);
      let nextDistrictStateCount = state.districtStateCount;
      let nextDistrictStateAt = state.nextDistrictStateAt;
      let nextResources = state.resources;
      let nextPositions = state.positions;
      let nextProgression = state.progression;
      let nextBalanceObol = state.balanceObol;
      let nextHeatWarning = state.heatWarning;
      let nextRankCelebration = state.rankCelebration;
      let nextTradeJuice = state.tradeJuice;
      let nextBounty = getBountyByHeat(nextResources.heat);
      let nextHeatPressure = state.heatPressure;
      let nextScannerEvadeTradesRemaining = state.scannerEvadeTradesRemaining;
      let nextRecoveryOpportunity = state.recoveryOpportunity;
      let nextPendingRecoveryPrompt = state.pendingRecoveryPrompt;
      let nextExitHookMessage = state.exitHookMessage;
      let nextMicroRewards = state.microRewards.filter((reward) => nowMs - reward.createdAt < 8_000);
      let nextAwayReport = state.awayReport;
      let didMutate = nextActiveFlashEvent !== state.activeFlashEvent || nextStreak !== state.streak || nextDistrictStates !== state.districtStates;

      if (
        nextActiveHeistMission &&
        nextActiveHeistMission.status === "active" &&
        nowMs >= nextActiveHeistMission.endTimestamp
      ) {
        const failedHeist: HeistMission = { ...nextActiveHeistMission, status: "failed" };
        nextActiveHeistMission = null;
        nextHeistMissions = nextHeistMissions.map((mission) =>
          mission.id === failedHeist.id ? failedHeist : mission,
        );
        nextNpcRelationships = applyNpcReputationChange({
          relationships: nextNpcRelationships,
          npcId: failedHeist.npcId,
          delta: -10,
          missionOutcome: "failed",
        });
        nextNpcReputation = {
          ...nextNpcReputation,
          [failedHeist.npcId]: nextNpcRelationships[failedHeist.npcId]?.reputation ?? 0,
        };
        nextNotifications = addNotification(
          nextNotifications,
          "Heist failed: deadline expired. Collateral lost.",
          "danger",
        );
        nextPendingRecoveryPrompt = createRecoveryPrompt({
          nowMs,
          lossValue: failedHeist.collateralValue,
          reason: "heist_failure",
        });
        didMutate = true;
      }

      const expiredFlash = state.activeFlashEvent && !nextActiveFlashEvent ? state.activeFlashEvent : null;
      if (expiredFlash) {
        nextFlashCooldownUntil = nowMs + FLASH_EVENT_COOLDOWN_MS;
        nextFlashEventAt = nextFlashCooldownUntil + getNextFlashEventDelay(ENGAGEMENT_SEED, nextFlashEventCount) * getBountyFlashFrequencyMultiplier(nextBounty.level);
        nextNotifications = addNotification(nextNotifications, `EVENT EXPIRED: ${expiredFlash.headline}.`, "info");
        if (expiredFlash.type === "eagent_scan" && nextResources.heat > (expiredFlash.heatThreshold ?? 50)) {
          const stream = seededStream(`${expiredFlash.id}:forced-raid`);
          const losses: Record<string, number> = {};
          for (const [ticker, position] of Object.entries(nextPositions)) {
            losses[ticker] = Math.max(1, Math.floor(position.quantity * (0.2 + stream() * 0.4)));
          }
          const positionsBeforeRaid = nextPositions;
          if (Object.keys(losses).length > 0 && authority.applyRaidLoss) {
            const raidState = await authority.applyRaidLoss(
              state.playerId,
              losses,
              nextWorld.currentLocationId,
            );
            nextPositions = toPositionMap(raidState.positions);
            nextResources = raidState.resources;
            nextRaidRecoveryWindow = buildRaidRecoveryWindow(losses, positionsBeforeRaid, nowMs);
          }
          const raidRank = await authority.updateXp(state.playerId, 100, "eagent_scan_raid");
          nextRankCelebration = maybeRankCelebration(nextProgression, raidRank) ?? nextRankCelebration;
          nextProgression = raidRank;
          nextNotifications = addNotification(nextNotifications, "ALERT: eAgent RAID! Scanner lock resolved the hard way.", "danger");
          nextPendingRecoveryPrompt = createRecoveryPrompt({
            nowMs,
            lossValue: estimateInventoryLossValue(losses, positionsBeforeRaid, state.prices),
            reason: "raid_loss",
          });
          // AUDIO: raid_warning.wav on eAgent proximity
          didMutate = true;
        } else if (expiredFlash.type === "eagent_scan") {
          nextScannerEvadeTradesRemaining = 2;
          nextNotifications = addNotification(
            nextNotifications,
            "Scanner Evaded: next 2 trades generate 50% less Heat.",
            "success",
          );
          nextMicroRewards = [
            makeMicroReward({
              label: "Scanner Evaded",
              value: "2 trades -50% Heat",
              tone: "info",
              nowMs,
            }),
            ...nextMicroRewards,
          ].slice(0, 8);
          didMutate = true;
        }
      }

      if (nextRecoveryOpportunity?.expiresAt && nextRecoveryOpportunity.expiresAt <= nowMs) {
        nextRecoveryOpportunity = null;
        didMutate = true;
      }

      if (nextPendingRecoveryPrompt && nextPendingRecoveryPrompt.expiresAt <= nowMs) {
        nextPendingRecoveryPrompt = null;
        didMutate = true;
      }

      if (nextExitHookMessage?.expiresAt && nextExitHookMessage.expiresAt <= nowMs) {
        nextExitHookMessage = null;
        didMutate = true;
      }

      if (nextPendingRecoveryPrompt && nowMs >= nextPendingRecoveryPrompt.triggerAt) {
        nextRecoveryOpportunity = recoverySignalFromPrompt(nextPendingRecoveryPrompt);
        if (!nextActiveMission && !nextPendingMission) {
          nextActiveMission = recoveryMissionFromPrompt(nextPendingRecoveryPrompt);
        }
        nextNotifications = addNotification(
          nextNotifications,
          `Recovery opportunity opened: ${formatObol(nextPendingRecoveryPrompt.reward0Bol)} 0BOL low-risk rebuild.`,
          "success",
        );
        nextMicroRewards = [
          makeMicroReward({
            label: "Recovery Open",
            value: `${formatObol(nextPendingRecoveryPrompt.reward0Bol)} 0BOL`,
            tone: "info",
            nowMs,
          }),
          ...nextMicroRewards,
        ].slice(0, 8);
        nextPendingRecoveryPrompt = null;
        didMutate = true;
      }

      if (!nextFirstSessionStartedAt) {
        nextFirstSessionStartedAt = nowMs;
      }
      if (!nextFirstVblmBoughtAt && (nextPositions.VBLM?.quantity ?? 0) >= 10) {
        nextFirstVblmBoughtAt = nowMs;
        didMutate = true;
      }

      const firstSessionEvent = getFirstSessionEvent(
        Math.floor((nowMs - nextFirstSessionStartedAt) / 1000),
        {
          firstSessionStage: nextFirstSessionStage,
          firstSessionComplete: nextFirstSessionComplete,
          secondsElapsed: Math.floor((nowMs - nextFirstSessionStartedAt) / 1000),
          vblmQuantity: nextPositions.VBLM?.quantity ?? 0,
          vblmFirstBoughtAt:
            nextFirstVblmBoughtAt === null
              ? null
              : Math.floor((nextFirstVblmBoughtAt - nextFirstSessionStartedAt) / 1000),
          currentLocationId: nextWorld.currentLocationId,
          heat: nextResources.heat,
          rankLevel: nextProgression.level,
        },
      );

      if (firstSessionEvent) {
        if (firstSessionEvent.type === "kite_first_ping") {
          const kiteMissionDeadline = nowMs + FALLBACK_MISSION_DEADLINE_MS;
          const mission: Mission = {
            id: "first_session_buy_vblm",
            npcId: "kite",
            npcName: "Kite",
            type: "buy_request",
            title: "Kite: Buy 10 Void Bloom",
            description: "Buy 10 VBLM. It's cheap - Kite will tell you when to sell.",
            requiredTicker: "VBLM",
            requiredQuantity: 10,
            reward0Bol: 0,
            rewardXp: 0,
            reputationChangeOnSuccess: 10,
            reputationChangeOnFail: 0,
            expiresAtTimestamp: kiteMissionDeadline,
            accepted: true,
            completed: false,
            failed: false,
            status: "active",
            objective: "Buy 10 VBLM.",
            ticker: "VBLM",
            quantity: 10,
            startTimestamp: nowMs,
            endTimestamp: kiteMissionDeadline,
            acceptedAt: nowMs,
            rewardObol: 0,
            reputationDelta: 10,
          };
          nextActiveMission = mission;
          nextFirstSessionStage = 1;
          nextFirstSessionMessage = firstSessionEvent.description;
          nextNotifications = addNotification(nextNotifications, firstSessionEvent.description, "info");
          didMutate = true;
        } else if (firstSessionEvent.type === "guided_vblm_profit") {
          nextActiveFlashEvent = {
            id: `first_vblm_spike_${nowMs}`,
            type: "arbitrage_window",
            headline: firstSessionEvent.headline,
            description: firstSessionEvent.description,
            ticker: "VBLM",
            locationId: "neon_plaza",
            startTimestamp: nowMs,
            endTimestamp: nowMs + 60_000,
            modifierApplied: true,
            riskLevel: "low",
            multiplier: 1.18,
            counterplayTags: ["sell_vblm", "take_profit"],
            resolvedByPlayer: false,
          };
          nextFirstSessionStage = 2;
          nextFirstSessionMessage = firstSessionEvent.description;
          nextNotifications = addNotification(nextNotifications, firstSessionEvent.description, "success");
          didMutate = true;
        } else if (firstSessionEvent.type === "first_eagent_scan") {
          const blackMarket = getLocation("black_market");
          nextActiveFlashEvent = {
            id: `first_eagent_scan_${nowMs}`,
            type: "eagent_scan",
            headline: firstSessionEvent.headline,
            description: firstSessionEvent.description,
            startTimestamp: nowMs,
            endTimestamp: nowMs + 120_000,
            modifierApplied: true,
            riskLevel: "critical",
            heatThreshold: 30,
            counterplayTags: ["travel_black_market", "bribe"],
            resolvedByPlayer: false,
          };
          nextWorld = {
            currentLocationId: nextWorld.currentLocationId,
            travelDestinationId: blackMarket.id,
            travelEndTime: nowMs + 3 * 60_000,
          };
          nextFirstSessionStage = 3;
          nextFirstSessionMessage = firstSessionEvent.description;
          nextNotifications = addNotification(nextNotifications, `${firstSessionEvent.description} Kite opened a 3 minute Black Market route.`, "danger");
          didMutate = true;
        } else if (firstSessionEvent.type === "librarian_delivery") {
          const mission: Mission = {
            id: "first_session_librarian_ngls",
            npcId: "librarian",
            npcName: "The Librarian",
            type: "delivery",
            title: "The Librarian: Deliver 20 NGLS",
            description: firstSessionEvent.description,
            requiredTicker: "NGLS",
            requiredQuantity: 20,
            destinationLocationId: "tech_valley",
            reward0Bol: Math.round((state.prices.NGLS ?? 73) * 20 * 2),
            rewardXp: 180,
            reputationChangeOnSuccess: 15,
            reputationChangeOnFail: -5,
            expiresAtTimestamp: nowMs + 12 * 60_000,
            accepted: true,
            completed: false,
            failed: false,
            status: "active",
            objective: "Deliver 20 NGLS to Tech Valley within 12 minutes.",
            ticker: "NGLS",
            quantity: 20,
            destinationId: "tech_valley",
            startTimestamp: nowMs,
            endTimestamp: nowMs + 12 * 60_000,
            acceptedAt: nowMs,
            rewardObol: Math.round((state.prices.NGLS ?? 73) * 20 * 2),
            reputationDelta: 15,
          };
          nextActiveMission = mission;
          nextActiveFlashEvent = {
            id: `first_fdst_vol_${nowMs}`,
            type: "volatility_spike",
            headline: "FDST volatility spike in The Port",
            description: "FDST volatility spike in The Port - +/-30% for 3 minutes.",
            ticker: "FDST",
            locationId: "the_port",
            startTimestamp: nowMs,
            endTimestamp: nowMs + 3 * 60_000,
            modifierApplied: true,
            riskLevel: "high",
            amplitude: 0.3,
            counterplayTags: ["travel_port", "avoid_if_heat_high"],
            resolvedByPlayer: false,
          };
          nextFirstSessionStage = 4;
          nextFirstSessionMessage = firstSessionEvent.description;
          nextNotifications = addNotification(nextNotifications, firstSessionEvent.description, "info");
          didMutate = true;
        } else if (firstSessionEvent.type === "first_lockdown") {
          const destination = getUnlockedLocations().find((location) => location.id !== nextWorld.currentLocationId) ?? getLocation("tech_valley");
          const lockdown = {
            locationId: nextWorld.currentLocationId,
            state: "LOCKDOWN" as const,
            startTimestamp: nowMs,
            endTimestamp: nowMs + 6 * 60_000,
          };
          nextDistrictStates = {
            ...nextDistrictStates,
            [lockdown.locationId]: lockdown,
          };
          nextWorld = {
            currentLocationId: nextWorld.currentLocationId,
            travelDestinationId: destination.id,
            travelEndTime: nowMs + Math.max(1, destination.travelTime) * 60_000,
          };
          nextFirstSessionStage = 5;
          nextFirstSessionMessage = firstSessionEvent.description;
          nextNotifications = addNotification(nextNotifications, firstSessionEvent.description, "warning");
          didMutate = true;
        } else if (firstSessionEvent.type === "pantheon_cliffhanger") {
          nextPantheonShard = {
            detectedAt: nowMs,
            expiresAt: nowMs + 72 * 60 * 60_000,
            requiredRank: 10,
            headline: firstSessionEvent.headline,
            description: firstSessionEvent.description,
          };
          nextDailyChallenges = [
            {
              id: `${getDailyChallengeDayKey(nowMs)}_first_hour_profit`,
              type: "daily_profit" as const,
              title: "Earn 10,000 0BOL profit before midnight.",
              target: 10_000,
              progress: 0,
              rewardObol: 10_000,
              rewardXp: 100,
              completed: false,
              claimed: false,
            },
            ...nextDailyChallenges.filter((challenge) => challenge.type !== "daily_profit"),
          ].slice(0, 3);
          nextFirstSessionComplete = true;
          nextFirstSessionMessage = firstSessionEvent.description;
          nextNotifications = addNotification(nextNotifications, firstSessionEvent.description, "danger");
          didMutate = true;
        }
      }

      const firstHourPromptCap = !nextFirstSessionComplete && nextFirstSessionStage < 3;

      if (!firstHourPromptCap && !nextActiveFlashEvent && nowMs >= nextFlashEventAt && nowMs >= nextFlashCooldownUntil) {
        nextActiveFlashEvent = createFlashEvent({
          nowMs,
          seed: ENGAGEMENT_SEED,
          index: nextFlashEventCount,
        });
        nextFlashEventCount += 1;
        nextNotifications = addNotification(nextNotifications, nextActiveFlashEvent.headline, "warning");
        // AUDIO: event_spawn.wav on flash event
        if (nextActiveFlashEvent.type === "eagent_scan") {
          // AUDIO: raid_warning.wav on eAgent proximity
        }
        didMutate = true;
      }

      const dayKey = getDailyChallengeDayKey(nowMs);
      if (dayKey !== nextDailyChallengeDayKey) {
        nextDailyChallengeDayKey = dayKey;
        nextDailyChallenges = createDailyChallenges(nowMs, nextProgression.level);
        nextNotifications = addNotification(nextNotifications, "Daily challenges refreshed.", "info");
        didMutate = true;
      }

      if (nowMs >= nextMarketWhisperAt) {
        const whisper = createMarketWhisper(nowMs, nextMarketWhisperCount);
        nextMarketWhispers = [whisper, ...nextMarketWhispers].slice(0, 5);
        nextMarketWhisperCount += 1;
        nextMarketWhisperAt = nowMs + getNextWhisperDelay(ENGAGEMENT_SEED, nextMarketWhisperCount);
        didMutate = true;
      }

      if (!firstHourPromptCap && nowMs >= nextDistrictStateAt) {
        const district = createDistrictShift({
          nowMs,
          seed: ENGAGEMENT_SEED,
          index: nextDistrictStateCount,
        });
        nextDistrictStates = {
          ...nextDistrictStates,
          [district.locationId]: district,
        };
        nextDistrictStateCount += 1;
        nextDistrictStateAt = district.endTimestamp + getNextDistrictShiftDelay(ENGAGEMENT_SEED, nextDistrictStateCount);
        nextNotifications = addNotification(nextNotifications, districtAnnouncement(district), district.state === "BOOM" ? "success" : "warning");
        didMutate = true;
      }

      if (
        state.world.travelDestinationId &&
        state.world.travelEndTime &&
        state.world.travelEndTime <= nowMs
      ) {
        const location = getLocation(state.world.travelDestinationId);
        nextWorld = {
          currentLocationId: location.id,
          travelDestinationId: null,
          travelEndTime: null,
        };
        nextNotifications = addNotification(nextNotifications, `Arrived at ${location.name}.`, "success");
        didMutate = true;
      }

      if (
        nextFirstSessionStage === 3 &&
        nextWorld.currentLocationId === "black_market" &&
        nextResources.heat > 0
      ) {
        const reduction = nextResources.heat;
        if (authority.reduceHeat) {
          const bribe = await authority.reduceHeat(state.playerId, FIRST_SESSION_BRIBE_COST, reduction);
          nextResources = bribe.resources;
          nextBalanceObol = latestBalance(nextBalanceObol, bribe.ledger);
        } else {
          nextResources = { ...nextResources, heat: 0 };
        }
        nextNotifications = addNotification(nextNotifications, "Kite's Black Market bribe cleared your Heat. First choice: chase The Port BOOM or stay safe.", "success");
        nextDistrictStates = {
          ...nextDistrictStates,
          the_port: {
            locationId: "the_port",
            state: "BOOM",
            startTimestamp: nowMs,
            endTimestamp: nowMs + 8 * 60_000,
          },
        };
        nextActiveFlashEvent = nextActiveFlashEvent?.type === "eagent_scan"
          ? { ...nextActiveFlashEvent, resolvedByPlayer: true }
          : nextActiveFlashEvent;
        didMutate = true;
      }

      nextShipments = nextShipments.map((shipment) => {
        if (shipment.status !== "transit" || shipment.arrivalTime > nowMs) {
          return shipment;
        }

        const service = getCourierService(shipment.courierUsed);
        const stream = seededStream(`${shipment.id}:${shipment.arrivalTime}:${service.id}`);
        const lossChance = shipment.lossChance ?? service.lossChance;
        const lost = stream() < lossChance;
        didMutate = true;
        if (lost) {
          nextNotifications = addNotification(nextNotifications, `Courier intercepted! Lost ${shipment.quantity} ${shipment.ticker}. Risk: ${shipment.riskLevel ?? getBountyRiskLabel(lossChance)}.`, "danger");
          return { ...shipment, status: "lost" };
        }

        const arrived = { ...shipment, status: "arrived" as const };
        const currentInventory = nextLocationInventories[shipment.destinationId] ?? [];
        nextLocationInventories = {
          ...nextLocationInventories,
          [shipment.destinationId]: [
            ...currentInventory,
            {
              id: shipment.id,
              ticker: shipment.ticker,
              quantity: shipment.quantity,
              avgEntry: shipment.avgEntry,
              realizedPnl: 0,
              unrealizedPnl: 0,
              openedAt: new Date(shipment.arrivalTime).toISOString(),
              closedAt: null,
            },
          ],
        };
        nextDailyChallenges = advanceDailyChallengeProgress(nextDailyChallenges, { courier_success: 1 });
        nextNotifications = addNotification(
          nextNotifications,
          `Shipment of ${shipment.quantity} ${shipment.ticker} arrived at ${getLocation(shipment.destinationId).name}. Claim it when you travel there.`,
          "success",
        );
        return arrived;
      });

      if (!firstHourPromptCap && !nextPendingMission && !nextActiveMission && nowMs >= nextMissionAt) {
        nextPendingMission = createMission({
          nowMs,
          seed: ENGAGEMENT_SEED,
          index: nextMissionCount,
          rankLevel: nextProgression.level,
          prices: state.prices,
          rewardMultiplier: nextBounty.missionRewardMultiplier,
        });
        nextMissionCount += 1;
        nextMissionAt = nowMs + getNextMissionDelay(ENGAGEMENT_SEED, nextMissionCount);
        nextNotifications = addNotification(nextNotifications, `${nextPendingMission.title}: ${nextPendingMission.description}`, "info");
        didMutate = true;
      }

      if (nextPendingMission && !nextPendingMission.accepted && nowMs >= nextPendingMission.startTimestamp + 3 * 60_000) {
        const expired = markMissionStatus(nextPendingMission, "failed", nowMs);
        nextPendingMission = null;
        nextMissionHistory = [expired, ...nextMissionHistory].slice(0, 20);
        nextNpcReputation = {
          ...nextNpcReputation,
          [expired.npcId]: (nextNpcReputation[expired.npcId] ?? 0) + expired.reputationChangeOnFail,
        };
        nextNpcRelationships = applyNpcReputationChange({
          relationships: nextNpcRelationships,
          npcId: expired.npcId,
          delta: expired.reputationChangeOnFail,
          missionOutcome: "failed",
        });
        nextNotifications = addNotification(nextNotifications, `Mission from ${expired.npcName} expired.`, "warning");
        didMutate = true;
      }

      if (nextActiveMission) {
        const progress = getMissionProgress({
          mission: nextActiveMission,
          positions: nextPositions,
          currentLocationId: nextWorld.currentLocationId,
          nowMs,
        });
        if (progress.complete || progress.failed) {
          const completed = progress.complete;
          const finishedMission = markMissionStatus(nextActiveMission, completed ? "completed" : "failed", nowMs);
          nextMissionHistory = [finishedMission, ...nextMissionHistory].slice(0, 20);
          nextNpcReputation = {
            ...nextNpcReputation,
            [finishedMission.npcId]: (nextNpcReputation[finishedMission.npcId] ?? 0) + (completed ? finishedMission.reputationChangeOnSuccess : finishedMission.reputationChangeOnFail),
          };
          nextNpcRelationships = applyNpcReputationChange({
            relationships: nextNpcRelationships,
            npcId: finishedMission.npcId,
            delta: completed ? finishedMission.reputationChangeOnSuccess : finishedMission.reputationChangeOnFail,
            missionOutcome: completed ? "completed" : "failed",
          });
          nextActiveMission = null;
          if (finishedMission.id.includes("recovery_")) {
            nextRecoveryOpportunity = null;
          }
          nextMissionAt = nowMs + getNextMissionDelay(ENGAGEMENT_SEED, nextMissionCount);
          if (completed) {
            const ledger = authority.grantReward
              ? await authority.grantReward(state.playerId, finishedMission.reward0Bol, `mission_${finishedMission.type}`)
              : [];
            const rank = await authority.updateXp(state.playerId, finishedMission.rewardXp, "mission_complete");
            nextBalanceObol = latestBalance(nextBalanceObol, ledger);
            nextRankCelebration = maybeRankCelebration(nextProgression, rank) ?? nextRankCelebration;
            nextPlayerLore = maybeAddMemoryShard(nextProgression, rank, nextPlayerLore, nowMs);
            nextProgression = rank;
            nextNotifications = addNotification(nextNotifications, `Mission complete: ${finishedMission.title}.`, "success");
            // AUDIO: mission_complete.wav on mission finish
          } else {
            nextNotifications = addNotification(nextNotifications, `Mission failed: ${finishedMission.title}. Contact disappointed.`, "warning");
          }
          didMutate = true;
        }
      }

      const lastTickAt = state.clock.lastTickAt || nowMs;
      const missedTicks = Math.min(
        MAX_CATCH_UP_TICKS,
        Math.floor(Math.max(0, nowMs - lastTickAt) / GAME_TICK_MS),
      );
      let nextTick = state.tick;
      let refresh: Partial<DemoStoreState> = {};

      if (missedTicks > 0) {
        for (let index = 0; index < missedTicks; index += 1) {
          nextTick += 1;
          refresh = await refreshFromAuthority(
            state.playerId,
            nextTick,
            nextWorld.currentLocationId,
            nowMs,
            nextActiveFlashEvent,
            nextDistrictStates,
          );
          nextResources = (refresh.resources ?? nextResources) as Resources;
          nextPositions = (refresh.positions ?? nextPositions) as Record<string, Position>;
          nextProgression = (refresh.progression ?? nextProgression) as RankSnapshot;
          if (getActiveDistrictState(nextDistrictStates, nextWorld.currentLocationId, nowMs).state === "BLACKOUT") {
            nextResources = {
              ...nextResources,
              heat: Math.max(0, nextResources.heat - 2),
            };
            refresh = {
              ...refresh,
              resources: nextResources,
            };
          }

          const raidIntervalTicks = getBountyRaidIntervalTicks(nextBounty.level);
          if (nextTick % raidIntervalTicks === 0 && nextTick !== state.clock.lastRaidTick) {
            const raid = checkRaid({
              tick: nextTick,
              heat: nextResources.heat,
              positions: nextPositions,
              raidIntervalTicks,
              probabilityDivisor: nextBounty.raidProbabilityDivisor,
            });
            if (raid.triggered) {
              const positionsBeforeRaid = nextPositions;
              const raidState = authority.applyRaidLoss
                ? await authority.applyRaidLoss(
                    state.playerId,
                    raid.losses,
                    nextWorld.currentLocationId,
                  )
                : { positions: Object.values(nextPositions), resources: nextResources };
              const progression = await authority.updateXp(state.playerId, raid.xpBonus, "raid_survived");
              nextPositions = toPositionMap(raidState.positions);
              nextResources = raidState.resources;
              nextProgression = progression;
              nextRaidRecoveryWindow = buildRaidRecoveryWindow(raid.losses, positionsBeforeRaid, nowMs);
              nextPendingRecoveryPrompt = createRecoveryPrompt({
                nowMs,
                lossValue: estimateInventoryLossValue(raid.losses, positionsBeforeRaid, state.prices),
                reason: "raid_loss",
              });
              refresh = {
                ...refresh,
                positions: nextPositions,
                resources: nextResources,
                progression,
              };
              nextNotifications = addNotification(nextNotifications, raid.message, "danger");
            }
          }
        }
      }

      const forceRepriceTicker =
        nextActiveFlashEvent !== state.activeFlashEvent &&
        (nextActiveFlashEvent?.type === "volatility_spike" || nextActiveFlashEvent?.type === "flash_crash")
          ? nextActiveFlashEvent.ticker ?? null
          : null;
      const shouldReprice = didMutate || Boolean(forceRepriceTicker) || missedTicks > 0;
      if (shouldReprice && missedTicks === 0) {
        refresh = await forcePriceRecalc({
          playerId: state.playerId,
          nextTick,
          locationId: nextWorld.currentLocationId,
          nowMs,
          activeFlashEvent: nextActiveFlashEvent,
          districtStates: nextDistrictStates,
          previousPrices: state.prices,
          previousHistory: state.priceHistory,
        });
        nextPositions = (refresh.positions ?? nextPositions) as Record<string, Position>;
      }

      const latestPrices = (refresh.prices ?? state.prices) as PriceMap;
      for (const [ticker, position] of Object.entries(nextPositions)) {
        if (position.quantity > 0) {
          nextHeldPricePeaks = {
            ...nextHeldPricePeaks,
            [ticker]: Math.max(nextHeldPricePeaks[ticker] ?? 0, latestPrices[ticker] ?? position.avgEntry),
          };
        }
      }

      const heatUpdate = updateHeatWarning(state.resources.heat, nextResources, nextNotifications);
      nextNotifications = heatUpdate.notifications;
      nextHeatWarning = heatUpdate.heatWarning ?? nextHeatWarning;
      nextResources = heatUpdate.resources;
      const bountyUpdate = updateBountyFeedback(state.resources.heat, nextResources, nextNotifications);
      nextBounty = bountyUpdate.bounty;
      nextNotifications = bountyUpdate.notifications;
      const pressureUpdate = advanceHeatPressure({
        pressure: nextHeatPressure,
        nowMs,
        heat: nextResources.heat,
      });
      nextHeatPressure = pressureUpdate.pressure;
      if (pressureUpdate.consequence) {
        const previousHeat = nextResources.heat;
        nextResources = authority.applyHeatDelta
          ? await authority.applyHeatDelta(
              state.playerId,
              pressureUpdate.consequence.heatDelta,
              pressureUpdate.consequence.id,
            )
          : {
              ...nextResources,
              heat: Math.min(100, nextResources.heat + pressureUpdate.consequence.heatDelta),
            };
        nextNotifications = addNotification(
          nextNotifications,
          pressureUpdate.consequence.message,
          pressureUpdate.consequence.tone,
        );
        nextMicroRewards = [
          makeMicroReward({
            label: "Pressure consequence",
            value: `+${pressureUpdate.consequence.heatDelta} Heat`,
            tone: "risk",
            nowMs,
          }),
          ...nextMicroRewards,
        ].slice(0, 8);
        if (pressureUpdate.consequence.lockTrading) {
          nextDistrictStates = {
            ...nextDistrictStates,
            [nextWorld.currentLocationId]: {
              locationId: nextWorld.currentLocationId,
              state: "LOCKDOWN",
              startTimestamp: nowMs,
              endTimestamp: nowMs + pressureUpdate.consequence.lockDurationMs,
            },
          };
        }
        const pressureHeatUpdate = updateHeatWarning(previousHeat, nextResources, nextNotifications);
        nextResources = pressureHeatUpdate.resources;
        nextNotifications = pressureHeatUpdate.notifications;
        nextHeatWarning = pressureHeatUpdate.heatWarning ?? nextHeatWarning;
        const pressureBountyUpdate = updateBountyFeedback(previousHeat, nextResources, nextNotifications);
        nextBounty = pressureBountyUpdate.bounty;
        nextNotifications = pressureBountyUpdate.notifications;
        didMutate = true;
      }
      nextPlayerRiskProfile = createRiskProfile(nextResources, nextBounty, nextPositions);
      const nextDecisionContext = buildDecisionContextForState(state, nowMs, {
        ...refresh,
        world: nextWorld,
        resources: nextResources,
        positions: nextPositions,
        progression: nextProgression,
        balanceObol: nextBalanceObol,
        activeFlashEvent: nextActiveFlashEvent,
        pendingMission: nextPendingMission,
        activeMission: nextActiveMission,
        missionHistory: nextMissionHistory,
        npcReputation: nextNpcReputation,
        npcRelationships: nextNpcRelationships,
        missionCount: nextMissionCount,
        nextMissionAt,
        heistMissions: nextHeistMissions,
        activeHeistMission: nextActiveHeistMission,
        heistCount: nextHeistCount,
        streak: nextStreak,
        dailyChallenges: nextDailyChallenges,
        dailyChallengeDayKey: nextDailyChallengeDayKey,
        firstSessionStage: nextFirstSessionStage,
        firstSessionStartedAt: nextFirstSessionStartedAt,
        firstSessionComplete: nextFirstSessionComplete,
        firstVblmBoughtAt: nextFirstVblmBoughtAt,
        firstSessionMessage: nextFirstSessionMessage,
        pantheonShard: nextPantheonShard,
        obolBalance: nextObolBalance,
        shopPurchases: nextShopPurchases,
        marketWhispers: nextMarketWhispers,
        marketWhisperCount: nextMarketWhisperCount,
        nextMarketWhisperAt: nextMarketWhisperAt,
        playerLore: nextPlayerLore,
        missedPeakLog: nextMissedPeakLog,
        heldPricePeaks: nextHeldPricePeaks,
        playerRiskProfile: nextPlayerRiskProfile,
        raidRecoveryWindow: nextRaidRecoveryWindow,
        raidBuybackLastUsedWeek: nextRaidBuybackLastUsedWeek,
        districtStates: nextDistrictStates,
        districtStateCount: nextDistrictStateCount,
        nextDistrictStateAt,
        bounty: nextBounty,
        heatPressure: nextHeatPressure,
        scannerEvadeTradesRemaining: nextScannerEvadeTradesRemaining,
        recoveryOpportunity: nextRecoveryOpportunity,
        pendingRecoveryPrompt: nextPendingRecoveryPrompt,
        exitHookMessage: nextExitHookMessage,
        microRewards: nextMicroRewards,
        awayReport: nextAwayReport,
        tradeJuice: nextTradeJuice,
        heatWarning: nextHeatWarning,
        rankCelebration: nextRankCelebration,
        transitShipments: nextShipments,
        locationInventories: nextLocationInventories,
        notifications: nextNotifications,
      });
      const heatPressureChanged =
        nextHeatPressure.stage !== state.heatPressure.stage ||
        nextHeatPressure.scanLockAt !== state.heatPressure.scanLockAt ||
        nextHeatPressure.lastConsequenceAt !== state.heatPressure.lastConsequenceAt ||
        nextHeatPressure.lastMessage !== state.heatPressure.lastMessage;
      const microRewardsChanged =
        nextMicroRewards.length !== state.microRewards.length ||
        nextMicroRewards[0]?.id !== state.microRewards[0]?.id;
      const retentionHooksChanged =
        nextRecoveryOpportunity !== state.recoveryOpportunity ||
        nextPendingRecoveryPrompt !== state.pendingRecoveryPrompt ||
        nextExitHookMessage !== state.exitHookMessage;

      if (shouldReprice || didMutate || nextStreak !== state.streak || nextBounty.level !== state.bounty.level || heatPressureChanged || microRewardsChanged || retentionHooksChanged || nextAwayReport !== state.awayReport) {
        set({
          ...refresh,
          tick: nextTick,
          world: nextWorld,
          resources: nextResources,
          positions: nextPositions,
          progression: nextProgression,
          balanceObol: nextBalanceObol,
          activeFlashEvent: nextActiveFlashEvent,
          flashEventCount: nextFlashEventCount,
          nextFlashEventAt,
          flashCooldownUntil: nextFlashCooldownUntil,
          pendingMission: nextPendingMission,
          activeMission: nextActiveMission,
          missionHistory: nextMissionHistory,
          npcReputation: nextNpcReputation,
          npcRelationships: nextNpcRelationships,
          missionCount: nextMissionCount,
          nextMissionAt,
          heistMissions: nextHeistMissions,
          activeHeistMission: nextActiveHeistMission,
          heistCount: nextHeistCount,
          streak: nextStreak,
          dailyChallenges: nextDailyChallenges,
          dailyChallengeDayKey: nextDailyChallengeDayKey,
          firstSessionStage: nextFirstSessionStage,
          firstSessionStartedAt: nextFirstSessionStartedAt,
          firstSessionComplete: nextFirstSessionComplete,
          firstVblmBoughtAt: nextFirstVblmBoughtAt,
          firstSessionMessage: nextFirstSessionMessage,
          pantheonShard: nextPantheonShard,
          obolBalance: nextObolBalance,
          shopPurchases: nextShopPurchases,
          marketWhispers: nextMarketWhispers,
          marketWhisperCount: nextMarketWhisperCount,
          nextMarketWhisperAt: nextMarketWhisperAt,
          playerLore: nextPlayerLore,
          missedPeakLog: nextMissedPeakLog,
          heldPricePeaks: nextHeldPricePeaks,
          playerRiskProfile: nextPlayerRiskProfile,
          raidRecoveryWindow: nextRaidRecoveryWindow,
          raidBuybackLastUsedWeek: nextRaidBuybackLastUsedWeek,
          districtStates: nextDistrictStates,
          districtStateCount: nextDistrictStateCount,
          nextDistrictStateAt,
          bounty: nextBounty,
          decisionContext: nextDecisionContext,
          heatPressure: nextHeatPressure,
          scannerEvadeTradesRemaining: nextScannerEvadeTradesRemaining,
          recoveryOpportunity: nextRecoveryOpportunity,
          pendingRecoveryPrompt: nextPendingRecoveryPrompt,
          exitHookMessage: nextExitHookMessage,
          microRewards: nextMicroRewards,
          awayReport: nextAwayReport,
          tradeJuice: nextTradeJuice,
          heatWarning: nextHeatWarning,
          rankCelebration: nextRankCelebration,
          transitShipments: nextShipments,
          locationInventories: nextLocationInventories,
          notifications: nextNotifications,
          clock: {
            nowMs,
            displayTime: formatClock(nowMs),
            lastTickAt: lastTickAt + missedTicks * GAME_TICK_MS,
            lastRaidTick: nextTick % getBountyRaidIntervalTicks(nextBounty.level) === 0 ? nextTick : state.clock.lastRaidTick,
          },
        });
        await persistCurrentState();
      }
    },
    markInteraction: () => {
      const nowMs = Date.now();
      set({
        lastInteractionAt: nowMs,
      });
    },
    runExitHookCheck: (nowMs) => {
      const state = get();
      if (!state.isHydrated || !state.playerId) {
        return;
      }
      if (nowMs - state.lastInteractionAt < 60_000 || nowMs - state.lastExitHookAt < 60_000) {
        return;
      }
      const signal = createExitHookSignal(state, nowMs);
      if (!signal) {
        return;
      }
      const nextState: Partial<DemoStoreState> = {
        exitHookMessage: signal,
        lastExitHookAt: nowMs,
        notifications: addNotification(state.notifications, signal.description, signal.urgency === "critical" ? "danger" : "warning"),
        systemMessage: `[retention] ${signal.title.toLowerCase()}`,
      };
      set({
        ...nextState,
        decisionContext: buildDecisionContextForState(
          {
            ...state,
            ...nextState,
          } as DemoStoreState,
          nowMs,
        ),
      });
      void persistCurrentState();
    },
    buySelected: async () => {
      const state = get();
      if (!state.playerId || state.isBusy) {
        return;
      }
      const tradeBlockReason = getTradeBlockReason(state, "BUY");
      if (tradeBlockReason) {
        commitState({ systemMessage: tradeBlockReason });
        return;
      }

      const price = state.prices[state.selectedTicker];
      if (price === undefined) {
        return;
      }

      set({ isBusy: true });

      try {
        const authority = getAuthority();
        const result = await authority.executeTrade({
          playerId: state.playerId,
          ticker: state.selectedTicker,
          side: "BUY",
          quantity: state.orderSize,
          locationId: state.world.currentLocationId,
          priceOverride: price,
          streakHeatBonus: getStreakRiskHeatBonus(state.streak),
          heatMultiplier: state.scannerEvadeTradesRemaining > 0 ? 0.5 : 1,
        });
        const heatUpdate = updateHeatWarning(
          state.resources.heat,
          result.resources,
          state.notifications,
        );
        const bountyUpdate = updateBountyFeedback(
          state.resources.heat,
          heatUpdate.resources,
          heatUpdate.notifications,
        );

        const nextPositionsMap = toPositionMap(result.positions);
        set({
          positions: nextPositionsMap,
          resources: heatUpdate.resources,
          balanceObol: latestBalance(state.balanceObol, result.ledger),
          progression: result.rank,
          bounty: bountyUpdate.bounty,
          playerRiskProfile: createRiskProfile(heatUpdate.resources, bountyUpdate.bounty, nextPositionsMap),
          profile: state.profile ? { ...state.profile, rank: result.rank.level } : null,
          firstVblmBoughtAt: state.firstVblmBoughtAt ?? (state.selectedTicker === "VBLM" ? state.clock.nowMs || Date.now() : null),
          heldPricePeaks: {
            ...state.heldPricePeaks,
            [state.selectedTicker]: Math.max(state.heldPricePeaks[state.selectedTicker] ?? 0, price),
          },
          dailyChallenges: advanceDailyChallengeProgress(state.dailyChallenges, {
            location_trades: state.world.currentLocationId === "neon_plaza" ? 1 : 0,
          }),
          microRewards: [
            makeMicroReward({
              label: "Position opened",
              value: `${state.selectedTicker} x${state.orderSize}`,
              tone: "info",
              nowMs: state.clock.nowMs || Date.now(),
            }),
            ...state.microRewards,
          ].slice(0, 8),
          notifications: bountyUpdate.notifications,
          heatWarning: heatUpdate.heatWarning ?? state.heatWarning,
          rankCelebration: maybeRankCelebration(state.progression, result.rank),
          scannerEvadeTradesRemaining: Math.max(0, state.scannerEvadeTradesRemaining - 1),
          recoveryOpportunity: null,
          exitHookMessage: null,
          lastInteractionAt: state.clock.nowMs || Date.now(),
          activeView: "market",
          isBusy: false,
          systemMessage: `[trade] buy committed // ${state.selectedTicker} x${state.orderSize} @ ${price.toFixed(2)}`,
        });
        refreshDecisionContext(state.clock.nowMs || Date.now());
        await persistCurrentState();
      } catch (error) {
        set({
          isBusy: false,
          systemMessage:
            error instanceof Error
              ? `[sys] ${error.message}`
              : "[sys] trade rejected.",
        });
        await persistCurrentState();
      }
    },
    sellSelected: async () => {
      const state = get();
      if (!state.playerId || state.isBusy) {
        return;
      }
      const tradeBlockReason = getTradeBlockReason(state, "SELL");
      if (tradeBlockReason) {
        commitState({ systemMessage: tradeBlockReason });
        return;
      }

      const price = state.prices[state.selectedTicker];
      const position = state.positions[state.selectedTicker];
      if (price === undefined || !position) {
        return;
      }

      set({ isBusy: true });

      try {
        const authority = getAuthority();
        const result = await authority.executeTrade({
          playerId: state.playerId,
          ticker: state.selectedTicker,
          side: "SELL",
          quantity: Math.min(state.orderSize, position.quantity),
          locationId: state.world.currentLocationId,
          priceOverride: price,
          streakHeatBonus: getStreakRiskHeatBonus(state.streak),
          heatMultiplier: state.scannerEvadeTradesRemaining > 0 ? 0.5 : 1,
        });
        const nextStreak = applySellToStreak({
          streak: state.streak,
          realizedPnl: result.realizedPnl,
          nowMs: state.clock.nowMs || Date.now(),
        });
        const streakBonusXp = result.realizedPnl > 0
          ? Math.floor(result.xpGained * (nextStreak.multiplier - 1))
          : 0;
        let nextRank = result.rank;
        if (streakBonusXp > 0) {
          nextRank = await authority.updateXp(
            state.playerId,
            streakBonusXp,
            `streak_${nextStreak.count}`,
          );
        }
        const heatUpdate = updateHeatWarning(
          state.resources.heat,
          result.resources,
          state.notifications,
        );
        const bountyUpdate = updateBountyFeedback(
          state.resources.heat,
          heatUpdate.resources,
          heatUpdate.notifications,
        );
        let nextNotifications = bountyUpdate.notifications;
        const totalXp = result.xpGained + streakBonusXp;
        if (totalXp > 0) {
          nextNotifications = addNotification(nextNotifications, `XP +${totalXp}`, "success");
        }
        if (result.realizedPnl > 0) {
          // AUDIO: trade_success.wav on profit
        } else if (result.realizedPnl < 0) {
          // AUDIO: trade_loss.wav on loss
        }

        const peakPrice = state.heldPricePeaks[state.selectedTicker] ?? price;
        const soldQuantity = Math.min(state.orderSize, position.quantity);
        const missedValue = peakPrice > price
          ? roundCurrency((peakPrice - price) * soldQuantity)
          : 0;
        if (missedValue > 0) {
          nextNotifications = addNotification(
            nextNotifications,
            `Missed peak: +${formatObol(missedValue)} 0BOL. ${state.selectedTicker} hit ${peakPrice.toFixed(2)} earlier.`,
            "warning",
          );
        }
        const nextPositionsMap = toPositionMap(result.positions);
        const nextLore = maybeAddMemoryShard(state.progression, nextRank, state.playerLore, state.clock.nowMs || Date.now());
        const nowForReward = state.clock.nowMs || Date.now();
        const pendingRecoveryPrompt = result.realizedPnl < 0
          ? createRecoveryPrompt({
              nowMs: nowForReward,
              lossValue: Math.abs(result.realizedPnl),
              reason: "trade_loss",
            })
          : state.pendingRecoveryPrompt;
        const nextMicroRewards = [
          ...(totalXp > 0
            ? [makeMicroReward({
                label: "XP tick",
                value: `+${totalXp} XP`,
                tone: "xp" as const,
                nowMs: nowForReward,
              })]
            : []),
          ...(result.realizedPnl !== 0
            ? [makeMicroReward({
                label: result.realizedPnl > 0 ? "Profit tick" : "Loss tick",
                value: `${result.realizedPnl > 0 ? "+" : ""}${formatObol(result.realizedPnl)} 0BOL`,
                tone: result.realizedPnl > 0 ? "profit" as const : "risk" as const,
                nowMs: nowForReward,
              })]
            : []),
          ...(nextStreak.count >= 2
            ? [makeMicroReward({
                label: "Streak pressure",
                value: `x${nextStreak.multiplier.toFixed(2)} // +${getStreakRiskHeatBonus(nextStreak)} risk`,
                tone: "risk" as const,
                nowMs: nowForReward,
              })]
            : []),
          ...state.microRewards,
        ].slice(0, 8);

        set({
          positions: nextPositionsMap,
          resources: heatUpdate.resources,
          balanceObol: latestBalance(state.balanceObol, result.ledger),
          progression: nextRank,
          bounty: bountyUpdate.bounty,
          playerRiskProfile: createRiskProfile(heatUpdate.resources, bountyUpdate.bounty, nextPositionsMap),
          profile: state.profile ? { ...state.profile, rank: nextRank.level } : null,
          lastRealizedPnl: result.realizedPnl,
          firstTradeComplete: state.firstTradeComplete || result.realizedPnl > 0,
          streak: nextStreak,
          microRewards: nextMicroRewards,
          playerLore: nextLore,
          missedPeakLog: missedValue > 0
            ? [
                {
                  id: `missed_peak_${Date.now()}_${state.selectedTicker}`,
                  ticker: state.selectedTicker,
                  quantity: soldQuantity,
                  sellPrice: price,
                  peakPrice,
                  missedValue,
                  createdAt: state.clock.nowMs || Date.now(),
                },
                ...state.missedPeakLog,
              ].slice(0, 20)
            : state.missedPeakLog,
          heldPricePeaks: Object.fromEntries(
            Object.entries(state.heldPricePeaks).filter(([ticker]) => nextPositionsMap[ticker]),
          ),
          dailyChallenges: advanceDailyChallengeProgress(state.dailyChallenges, {
            daily_profit: Math.max(0, result.realizedPnl),
            location_trades: state.world.currentLocationId === "neon_plaza" ? 1 : 0,
          }),
          tradeJuice: {
            kind: result.realizedPnl > 0 ? "profit" : result.realizedPnl < 0 ? "loss" : "breakeven",
            pnl: result.realizedPnl,
            bigWin: result.realizedPnl > 50_000,
            createdAt: Date.now(),
          },
          heatWarning: heatUpdate.heatWarning ?? state.heatWarning,
          rankCelebration: maybeRankCelebration(state.progression, nextRank),
          scannerEvadeTradesRemaining: Math.max(0, state.scannerEvadeTradesRemaining - 1),
          pendingRecoveryPrompt,
          recoveryOpportunity: result.realizedPnl > 0 ? null : state.recoveryOpportunity,
          exitHookMessage: null,
          lastInteractionAt: nowForReward,
          activeView: "home",
          isBusy: false,
          notifications: nextNotifications,
          systemMessage: `[trade] sell executed // ${state.selectedTicker} ${formatDelta(result.realizedPnl)} 0BOL`,
        });
        refreshDecisionContext(nowForReward);
        await persistCurrentState();
      } catch (error) {
        set({
          isBusy: false,
          systemMessage:
            error instanceof Error
              ? `[sys] ${error.message}`
              : "[sys] sell failed.",
        });
        await persistCurrentState();
      }
    },
    ignoreSignal: async (signalId) => {
      const state = get();
      if (!state.playerId || state.isBusy) {
        return;
      }

      const nowMs = state.clock.nowMs || Date.now();
      const ignoredRiskScan =
        state.activeFlashEvent?.type === "eagent_scan" &&
        (signalId.includes(state.activeFlashEvent.id) ||
          state.decisionContext.recommendedAction.actionType === "reduce_heat");
      const heatDelta = ignoredRiskScan ? 5 : 2;
      const authority = getAuthority();
      const resources = authority.applyHeatDelta
        ? await authority.applyHeatDelta(state.playerId, heatDelta, "ignored_signal")
        : { ...state.resources, heat: Math.min(100, state.resources.heat + heatDelta) };
      const heatUpdate = updateHeatWarning(state.resources.heat, resources, state.notifications);
      const bountyUpdate = updateBountyFeedback(
        state.resources.heat,
        heatUpdate.resources,
        heatUpdate.notifications,
      );
      const currentDelay = Math.max(0, state.nextFlashEventAt - nowMs);
      const nextFlashEventAt = nowMs + Math.floor(currentDelay * 0.8);
      const shortenedScanAt = state.heatPressure.scanLockAt && ignoredRiskScan
        ? Math.max(nowMs + 5_000, state.heatPressure.scanLockAt - 30_000)
        : state.heatPressure.scanLockAt;
      const activeFlashEvent = ignoredRiskScan && state.activeFlashEvent?.type === "eagent_scan"
        ? {
            ...state.activeFlashEvent,
            endTimestamp: Math.max(nowMs + 5_000, state.activeFlashEvent.endTimestamp - 30_000),
          }
        : state.activeFlashEvent;
      const heatPressure = shortenedScanAt !== state.heatPressure.scanLockAt
        ? { ...state.heatPressure, scanLockAt: shortenedScanAt }
        : state.heatPressure;
      const notifications = addNotification(
        bountyUpdate.notifications,
        ignoredRiskScan
          ? "Ignored eAgent risk: Heat +5 and scan timer shortened."
          : "Ignored signal: Heat +2 and next flash pressure accelerated.",
        ignoredRiskScan ? "danger" : "warning",
      );
      const microRewards = [
        makeMicroReward({
          label: "Ignored signal",
          value: `+${heatDelta} Heat`,
          tone: "risk",
          nowMs,
        }),
        ...state.microRewards,
      ].slice(0, 8);
      const nextState: Partial<DemoStoreState> = {
        resources: heatUpdate.resources,
        bounty: bountyUpdate.bounty,
        playerRiskProfile: createRiskProfile(heatUpdate.resources, bountyUpdate.bounty, state.positions),
        activeFlashEvent,
        nextFlashEventAt,
        heatPressure,
        heatWarning: heatUpdate.heatWarning ?? state.heatWarning,
        microRewards,
        notifications,
        exitHookMessage: null,
        lastInteractionAt: nowMs,
        systemMessage: ignoredRiskScan
          ? "[signal] ignored scan // timer compressed"
          : "[signal] ignored // grid pressure increased",
      };
      set({
        ...nextState,
        decisionContext: buildDecisionContextForState(
          {
            ...state,
            ...nextState,
          } as DemoStoreState,
          nowMs,
        ),
      });
      await persistCurrentState();
    },
    purchaseEnergyHour: async () => {
      await get().purchaseEnergyHours(1);
    },
    purchaseEnergyHours: async (hours) => {
      const state = get();
      if (!state.playerId || state.isBusy) {
        return;
      }

      set({ isBusy: true });

      try {
        const authority = getAuthority();
        const energySeconds = Math.max(1, Math.min(24, Math.floor(hours))) * 3600;
        const resources = await authority.purchaseEnergy(state.playerId, energySeconds, "0BOL");
        const ledger = await authority.getLedger(state.playerId);

        set({
          resources,
          balanceObol: latestBalance(state.balanceObol, ledger),
          isBusy: false,
          systemMessage: `[energy] ${Math.floor(energySeconds / 3600)}h purchased // shell stabilized`,
        });
        await persistCurrentState();
      } catch (error) {
        set({
          isBusy: false,
          systemMessage:
            error instanceof Error
              ? `[sys] ${error.message.toLowerCase()}`
              : "[sys] energy purchase failed.",
        });
        await persistCurrentState();
      }
    },
    startTravel: (destinationId) => {
      const state = get();
      const destination = LOCATIONS.find((location) => location.id === destinationId && location.unlocked);
      if (!destination || destination.id === state.world.currentLocationId) {
        return;
      }

      const nowMs = state.clock.nowMs || Date.now();
      const travelEndTime = nowMs + destination.travelTime * 60_000;
      commitState({
        world: {
          currentLocationId: state.world.currentLocationId,
          travelDestinationId: destination.id,
          travelEndTime,
        },
        notifications: addNotification(
          state.notifications,
          `Travelling to ${destination.name}.`,
          "info",
        ),
        systemMessage: `[route] travelling to ${destination.name.toUpperCase()}`,
      });
    },
    reduceHeatWithBribe: async () => {
      const state = get();
      if (!state.playerId || state.isBusy || state.world.currentLocationId !== "black_market") {
        return;
      }
      const district = getActiveDistrictState(
        state.districtStates,
        state.world.currentLocationId,
        state.clock.nowMs,
      );
      if (district.state === "BLACKOUT") {
        commitState({ systemMessage: "[sys] blackout. bribe channel offline." });
        return;
      }

      set({ isBusy: true });
      try {
        const reduction = 20 + ((state.tick * 7 + state.resources.heat) % 21);
        const authority = getAuthority();
        const result = authority.reduceHeat
          ? await authority.reduceHeat(state.playerId, BLACK_MARKET_BRIBE_COST, reduction)
          : { resources: { ...state.resources, heat: Math.max(0, state.resources.heat - reduction) }, ledger: [] };
        set({
          resources: result.resources,
          bounty: getBountyByHeat(result.resources.heat),
          balanceObol: latestBalance(state.balanceObol, result.ledger),
          notifications: addNotification(
            state.notifications,
            `Black Market bribe reduced Heat by ${reduction}.`,
            "success",
          ),
          exitHookMessage: null,
          lastInteractionAt: state.clock.nowMs || Date.now(),
          isBusy: false,
          systemMessage: `[heat] bribe accepted // -${reduction}`,
        });
        refreshDecisionContext(state.clock.nowMs || Date.now());
        await persistCurrentState();
      } catch (error) {
        set({
          isBusy: false,
          systemMessage:
            error instanceof Error
              ? `[sys] ${error.message}`
              : "[sys] bribe failed.",
        });
        await persistCurrentState();
      }
    },
    sendCourierShipment: async ({ ticker, quantity, destinationId, courierId, insured = false }) => {
      const state = get();
      if (!state.playerId || state.isBusy) {
        return;
      }
      const currentDistrict = getActiveDistrictState(
        state.districtStates,
        state.world.currentLocationId,
        state.clock.nowMs,
      );
      if (currentDistrict.state === "BLACKOUT") {
        commitState({ systemMessage: "[sys] blackout. courier dispatch disabled." });
        return;
      }
      const activeCourierCount = state.transitShipments.filter((shipment) => shipment.status === "transit").length;
      if (activeCourierCount >= getCourierLimit(state.progression.level)) {
        commitState({ systemMessage: "[sys] courier grid full. wait for a run to finish." });
        return;
      }

      const position = state.positions[ticker];
      const destination = LOCATIONS.find((location) => location.id === destinationId && location.unlocked);
      const courier = COURIER_SERVICES.find((service) => service.id === courierId);
      if (!position || !destination || !courier) {
        return;
      }

      const sendQuantity = Math.max(1, Math.min(position.quantity, Math.floor(quantity)));
      set({ isBusy: true });

      try {
        const authority = getAuthority();
        if (!authority.transferPositionToShipment) {
          throw new Error("Courier authority unavailable");
        }
        const destinationDistrict = getActiveDistrictState(
          state.districtStates,
          destination.id,
          state.clock.nowMs,
        );
        const bountyRiskBonus = state.bounty.level >= 3
          ? 0.3
          : state.bounty.level >= 2
            ? 0.15
            : state.bounty.courierRiskBonus;
        const heatRiskBonus = state.resources.heat > 50 ? 0.1 : 0;
        const streakRiskBonus = state.streak.count > 5 ? 0.08 : getStreakRiskHeatBonus(state.streak) / 100;
        const riskChance = Math.min(
          0.95,
          courier.lossChance * getDistrictCourierRiskMultiplier(currentDistrict.state) +
            getDistrictCourierRiskBonus(currentDistrict.state) +
            bountyRiskBonus +
            heatRiskBonus +
            streakRiskBonus,
        );
        const insuranceObolCost = Math.max(2, Math.min(10, Math.ceil(riskChance * 20)));
        if (insured && (!ENABLE_OBOL_TOKEN || state.obolBalance < insuranceObolCost)) {
          throw new Error("Courier insurance requires $OBOL balance.");
        }
        const effectiveCost = roundCurrency(
          courier.cost * getFlashCourierCostMultiplier(state.activeFlashEvent, state.world.currentLocationId),
        );
        const result = await authority.transferPositionToShipment(
          state.playerId,
          ticker,
          sendQuantity,
          effectiveCost,
          state.world.currentLocationId,
        );
        const nowMs = state.clock.nowMs || Date.now();
        const timeMultiplier = getDistrictCourierTimeMultiplier(destinationDistrict.state);
        const shipment: TransitShipment = {
          id: `shipment_${nowMs}_${ticker}_${destination.id}`,
          ticker,
          quantity: sendQuantity,
          avgEntry: position.avgEntry,
          destinationId: destination.id,
          arrivalTime: nowMs + destination.travelTime * 60_000 * timeMultiplier,
          courierUsed: courier.id,
          status: "transit",
          lossChance: insured ? 0 : riskChance,
          riskLevel: insured ? "low" : getBountyRiskLabel(riskChance),
          costPaid: effectiveCost,
          insured,
          insuranceObolCost: insured ? insuranceObolCost : undefined,
        };

        set({
          positions: toPositionMap(result.positions),
          balanceObol: latestBalance(state.balanceObol, result.ledger),
          obolBalance: insured ? state.obolBalance - insuranceObolCost : state.obolBalance,
          transitShipments: [shipment, ...state.transitShipments],
          notifications: addNotification(
            state.notifications,
            `${courier.name} carrying ${sendQuantity} ${ticker} to ${destination.name}.`,
            "info",
          ),
          exitHookMessage: null,
          lastInteractionAt: nowMs,
          isBusy: false,
          systemMessage: `[courier] ${ticker} dispatched via ${courier.name}`,
        });
        refreshDecisionContext(nowMs);
        await persistCurrentState();
      } catch (error) {
        set({
          isBusy: false,
          systemMessage:
            error instanceof Error
              ? `[sys] ${error.message}`
              : "[sys] courier failed.",
        });
        await persistCurrentState();
      }
    },
    claimShipment: async (shipmentId) => {
      const state = get();
      if (!state.playerId || state.isBusy) {
        return;
      }
      const shipment = state.transitShipments.find((item) => item.id === shipmentId);
      if (
        !shipment ||
        shipment.status !== "arrived" ||
        shipment.destinationId !== state.world.currentLocationId
      ) {
        return;
      }

      set({ isBusy: true });
      try {
        const authority = getAuthority();
        const positions = authority.claimShipment
          ? await authority.claimShipment(
              state.playerId,
              shipment.ticker,
              shipment.quantity,
              shipment.avgEntry,
              state.world.currentLocationId,
            )
          : Object.values(state.positions);

        set({
          positions: toPositionMap(positions),
          transitShipments: state.transitShipments.map((item) =>
            item.id === shipmentId ? { ...item, status: "claimed" } : item,
          ),
          notifications: addNotification(
            state.notifications,
            `${shipment.quantity} ${shipment.ticker} claimed.`,
            "success",
          ),
          exitHookMessage: null,
          lastInteractionAt: state.clock.nowMs || Date.now(),
          isBusy: false,
          systemMessage: `[courier] ${shipment.ticker} claimed`,
        });
        refreshDecisionContext(state.clock.nowMs || Date.now());
        await persistCurrentState();
      } catch (error) {
        set({
          isBusy: false,
          systemMessage:
            error instanceof Error
              ? `[sys] ${error.message}`
              : "[sys] claim failed.",
        });
        await persistCurrentState();
      }
    },
    acceptMission: () => {
      const state = get();
      if (!state.pendingMission) {
        return;
      }

      const mission: Mission = {
        ...state.pendingMission,
        status: "active",
        accepted: true,
        acceptedAt: state.clock.nowMs || Date.now(),
      };
      commitState({
        pendingMission: null,
        activeMission: mission,
        notifications: addNotification(
          state.notifications,
          `Mission accepted: ${mission.title}.`,
          "success",
        ),
        exitHookMessage: null,
        lastInteractionAt: state.clock.nowMs || Date.now(),
        systemMessage: `[mission] accepted // ${mission.title}`,
      });
    },
    declineMission: () => {
      const state = get();
      if (!state.pendingMission) {
        return;
      }

      const nowMs = state.clock.nowMs || Date.now();
      const declined = markMissionStatus(state.pendingMission, "declined", nowMs);
      commitState({
        pendingMission: null,
        missionHistory: [declined, ...state.missionHistory].slice(0, 20),
        npcReputation: {
          ...state.npcReputation,
          [declined.npcId]: (state.npcReputation[declined.npcId] ?? 0) - 1,
        },
        npcRelationships: applyNpcReputationChange({
          relationships: state.npcRelationships,
          npcId: declined.npcId,
          delta: -1,
          missionOutcome: "failed",
        }),
        nextMissionAt: nowMs + getNextMissionDelay(ENGAGEMENT_SEED, state.missionCount),
        notifications: addNotification(
          state.notifications,
          `Mission declined: ${declined.title}.`,
          "warning",
        ),
        exitHookMessage: null,
        lastInteractionAt: nowMs,
        systemMessage: `[mission] declined // ${declined.title}`,
      });
    },
    createHeistDraft: (collateralPercentage) => {
      const state = get();
      if (state.progression.level < 5 && state.world.currentLocationId !== "black_market") {
        return null;
      }
      const portfolioValue = getPortfolioValue({
        balance0Bol: state.balanceObol,
        positions: state.positions,
        prices: state.prices,
      });
      return createHeistMission({
        nowMs: state.clock.nowMs || Date.now(),
        seed: ENGAGEMENT_SEED,
        index: state.heistCount,
        npcId: "kite",
        collateralPercentage,
        portfolioValue,
        bountyLevel: state.bounty.level,
        districtDanger: getActiveDistrictState(state.districtStates, state.world.currentLocationId, state.clock.nowMs).state === "NORMAL" ? 1 : 3,
      });
    },
    acceptHeistMission: async (collateralPercentage) => {
      const state = get();
      if (!state.playerId || state.isBusy) {
        return;
      }
      const mission = get().createHeistDraft(collateralPercentage);
      if (!mission) {
        commitState({ systemMessage: "[heist] locked until Rank 5 or Black Market access." });
        return;
      }
      set({ isBusy: true });
      try {
        const authority = getAuthority();
        const ledger = authority.applyHeistCollateral
          ? await authority.applyHeistCollateral(state.playerId, mission.collateralValue)
          : [];
        const activeMission = { ...mission, status: "active" as const };
        set({
          balanceObol: latestBalance(state.balanceObol, ledger),
          heistMissions: [activeMission, ...state.heistMissions].slice(0, 10),
          activeHeistMission: activeMission,
          heistCount: state.heistCount + 1,
          activeFlashEvent: activeMission.flashEventsDuring[0] ?? state.activeFlashEvent,
          notifications: addNotification(
            state.notifications,
            `Heist accepted. Collateral pledged: ${mission.collateralValue} 0BOL.`,
            "warning",
          ),
          exitHookMessage: null,
          lastInteractionAt: state.clock.nowMs || Date.now(),
          isBusy: false,
          systemMessage: `[heist] active // risk ${mission.riskRating}`,
        });
        refreshDecisionContext(state.clock.nowMs || Date.now());
        await persistCurrentState();
      } catch (error) {
        set({
          isBusy: false,
          systemMessage: error instanceof Error ? `[sys] ${error.message}` : "[sys] heist failed.",
        });
        await persistCurrentState();
      }
    },
    resolveActiveHeist: async (success) => {
      const state = get();
      if (!state.playerId || !state.activeHeistMission || state.isBusy) {
        return;
      }
      set({ isBusy: true });
      try {
        const authority = getAuthority();
        const result = success === undefined
          ? resolveHeistMission({
              mission: state.activeHeistMission,
              nowMs: state.clock.nowMs || Date.now(),
              seed: ENGAGEMENT_SEED,
              playerStayedActive: true,
              heat: state.resources.heat,
            })
          : {
              mission: { ...state.activeHeistMission, status: success ? "success" as const : "failed" as const },
              payout0Bol: success ? Math.round(state.activeHeistMission.collateralValue * state.activeHeistMission.payoutMultiplier) : 0,
              reputationDelta: success ? 15 : -10,
              rareItem: success ? "Rare routing key" : null,
            };
        const ledger = result.payout0Bol > 0 && authority.grantReward
          ? await authority.grantReward(state.playerId, result.payout0Bol, "heist_success")
          : [];
        const relationships = applyNpcReputationChange({
          relationships: state.npcRelationships,
          npcId: state.activeHeistMission.npcId,
          delta: result.reputationDelta,
          missionOutcome: result.mission.status === "success" ? "completed" : "failed",
        });
        const nowMs = state.clock.nowMs || Date.now();
        const pendingRecoveryPrompt = result.mission.status === "failed"
          ? createRecoveryPrompt({
              nowMs,
              lossValue: state.activeHeistMission.collateralValue,
              reason: "heist_failure",
            })
          : state.pendingRecoveryPrompt;
        set({
          balanceObol: latestBalance(state.balanceObol, ledger),
          npcRelationships: relationships,
          npcReputation: {
            ...state.npcReputation,
            [state.activeHeistMission.npcId]: relationships[state.activeHeistMission.npcId]?.reputation ?? 0,
          },
          heistMissions: state.heistMissions.map((mission) =>
            mission.id === result.mission.id ? result.mission : mission,
          ),
          activeHeistMission: null,
          notifications: addNotification(
            state.notifications,
            result.mission.status === "success"
              ? `Heist success: +${result.payout0Bol} 0BOL${result.rareItem ? ` // ${result.rareItem}` : ""}.`
              : "Heist failed. Collateral lost.",
            result.mission.status === "success" ? "success" : "danger",
          ),
          pendingRecoveryPrompt,
          recoveryOpportunity: result.mission.status === "success" ? null : state.recoveryOpportunity,
          exitHookMessage: null,
          lastInteractionAt: nowMs,
          isBusy: false,
          systemMessage: `[heist] ${result.mission.status}`,
        });
        refreshDecisionContext(nowMs);
        await persistCurrentState();
      } catch (error) {
        set({
          isBusy: false,
          systemMessage: error instanceof Error ? `[sys] ${error.message}` : "[sys] heist resolution failed.",
        });
        await persistCurrentState();
      }
    },
    purchaseShopItem: async (itemId) => {
      const state = get();
      if (!state.playerId || state.isBusy) {
        return;
      }
      const nowMs = state.clock.nowMs || Date.now();
      const purchase = purchaseShopItemEngine({
        itemId,
        obolBalance: state.obolBalance,
        purchasedAt: nowMs,
        purchaseHistory: state.shopPurchases,
      });
      if (!purchase.ok) {
        commitState({ systemMessage: `[shop] ${purchase.reason.replace(/_/g, " ")}` });
        return;
      }
      set({
        obolBalance: purchase.nextBalance,
        shopPurchases: {
          ...state.shopPurchases,
          [itemId]: [...(state.shopPurchases[itemId] ?? []), nowMs],
        },
        extraInventorySlots: itemId === "extra_inventory_slot" ? state.extraInventorySlots + 1 : state.extraInventorySlots,
        notifications: addNotification(state.notifications, `Purchased ${purchase.item.name}.`, "success"),
        systemMessage: `[shop] purchased // ${purchase.item.name}`,
      });
      await persistCurrentState();
    },
    instantTravelWithObol: async () => {
      const state = get();
      if (!state.world.travelDestinationId || !state.playerId) {
        return;
      }
      const purchase = purchaseShopItemEngine({
        itemId: "instant_travel",
        obolBalance: state.obolBalance,
        purchasedAt: state.clock.nowMs || Date.now(),
        purchaseHistory: state.shopPurchases,
      });
      if (!purchase.ok) {
        commitState({ systemMessage: `[travel] instant travel unavailable: ${purchase.reason.replace(/_/g, " ")}` });
        return;
      }
      const destination = getLocation(state.world.travelDestinationId);
      commitState({
        obolBalance: purchase.nextBalance,
        shopPurchases: {
          ...state.shopPurchases,
          instant_travel: [...(state.shopPurchases.instant_travel ?? []), state.clock.nowMs || Date.now()],
        },
        world: {
          currentLocationId: destination.id,
          travelDestinationId: null,
          travelEndTime: null,
        },
        notifications: addNotification(state.notifications, `Instant travel complete: ${destination.name}.`, "success"),
        systemMessage: `[travel] instant // ${destination.name}`,
      });
    },
    buyBackRaidLoss: async (currency) => {
      const state = get();
      if (!state.playerId || !state.raidRecoveryWindow || state.raidRecoveryWindow.restored) {
        return;
      }
      const nowMs = state.clock.nowMs || Date.now();
      if (nowMs > state.raidRecoveryWindow.expiresAt) {
        commitState({ systemMessage: "[raid] recovery window expired." });
        return;
      }
      const weekKey = getUtcWeekKey(nowMs);
      if (state.raidBuybackLastUsedWeek === weekKey) {
        commitState({ systemMessage: "[raid] weekly buyback already used." });
        return;
      }
      set({ isBusy: true });
      try {
        const authority = getAuthority();
        const recovered = Object.fromEntries(
          Object.entries(state.raidRecoveryWindow.lostInventory).map(([ticker, quantity]) => [
            ticker,
            { quantity, avgEntry: state.positions[ticker]?.avgEntry ?? state.prices[ticker] ?? 1 },
          ]),
        );
        const tokenPurchase = currency === "$OBOL"
          ? purchaseShopItemEngine({
              itemId: "raid_buyback",
              obolBalance: state.obolBalance,
              purchasedAt: nowMs,
              purchaseHistory: state.shopPurchases,
            })
          : null;
        if (tokenPurchase && !tokenPurchase.ok) {
          set({ isBusy: false, systemMessage: `[raid] token buyback unavailable: ${tokenPurchase.reason.replace(/_/g, " ")}` });
          await persistCurrentState();
          return;
        }
        const cost = currency === "$OBOL" ? 0 : RAID_RECOVERY_0BOL_COST;
        const result = authority.restoreRaidLoss
          ? await authority.restoreRaidLoss(
              state.playerId,
              recovered,
              cost,
              "0BOL",
              state.world.currentLocationId,
            )
          : { positions: Object.values(state.positions), ledger: [] };
        set({
          positions: toPositionMap(result.positions),
          balanceObol: currency === "0BOL" ? latestBalance(state.balanceObol, result.ledger) : state.balanceObol,
          obolBalance: tokenPurchase?.ok ? tokenPurchase.nextBalance : state.obolBalance,
          shopPurchases: tokenPurchase?.ok
            ? {
                ...state.shopPurchases,
                raid_buyback: [...(state.shopPurchases.raid_buyback ?? []), nowMs],
              }
            : state.shopPurchases,
          raidRecoveryWindow: { ...state.raidRecoveryWindow, restored: true },
          raidBuybackLastUsedWeek: weekKey,
          notifications: addNotification(state.notifications, "Raid buyback restored lost inventory.", "success"),
          recoveryOpportunity: null,
          pendingRecoveryPrompt: null,
          exitHookMessage: null,
          lastInteractionAt: nowMs,
          isBusy: false,
          systemMessage: "[raid] buyback complete",
        });
        refreshDecisionContext(nowMs);
        await persistCurrentState();
      } catch (error) {
        set({
          isBusy: false,
          systemMessage: error instanceof Error ? `[sys] ${error.message}` : "[sys] buyback failed.",
        });
        await persistCurrentState();
      }
    },
    claimDailyChallenge: async (challengeId) => {
      const state = get();
      if (!state.playerId || state.isBusy) {
        return;
      }

      const { challenges, claimed } = claimDailyChallengeEngine(
        state.dailyChallenges,
        challengeId,
      );
      if (!claimed) {
        return;
      }

      set({ isBusy: true });
      try {
        const authority = getAuthority();
        const ledger = authority.grantReward
          ? await authority.grantReward(
              state.playerId,
              claimed.rewardObol,
              `daily_${claimed.type}`,
            )
          : [];
        const rank = await authority.updateXp(
          state.playerId,
          claimed.rewardXp,
          `daily_${claimed.type}`,
        );
        set({
          dailyChallenges: challenges,
          balanceObol: latestBalance(state.balanceObol, ledger),
          progression: rank,
          profile: state.profile ? { ...state.profile, rank: rank.level } : null,
          rankCelebration: maybeRankCelebration(state.progression, rank),
          playerLore: maybeAddMemoryShard(state.progression, rank, state.playerLore, state.clock.nowMs || Date.now()),
          notifications: addNotification(
            state.notifications,
            `Challenge claimed: ${claimed.title}`,
            "success",
          ),
          exitHookMessage: null,
          lastInteractionAt: state.clock.nowMs || Date.now(),
          isBusy: false,
          systemMessage: `[challenge] claimed // ${claimed.rewardObol} 0BOL`,
        });
        refreshDecisionContext(state.clock.nowMs || Date.now());
        await persistCurrentState();
      } catch (error) {
        set({
          isBusy: false,
          systemMessage:
            error instanceof Error
              ? `[sys] ${error.message}`
              : "[sys] challenge claim failed.",
        });
        await persistCurrentState();
      }
    },
    recordAwayReport: (nowMs, awayStartedAt) => {
      const state = get();
      const awayMs = Math.max(0, nowMs - awayStartedAt);
      if (awayMs < 2 * 60_000) {
        return;
      }

      const items = [
        ...state.transitShipments
          .filter((shipment) => shipment.arrivalTime >= awayStartedAt && shipment.arrivalTime <= nowMs)
          .slice(0, 4)
          .map((shipment) => ({
            id: `away_${shipment.id}`,
            tone: shipment.status === "lost" ? "danger" as const : "success" as const,
            message: shipment.status === "lost"
              ? `x Courier: ${shipment.quantity} ${shipment.ticker} lost in transit`
              : `+ Courier: ${shipment.quantity} ${shipment.ticker} arrived at ${getLocation(shipment.destinationId).name}`,
            action: "inventory" as const,
          })),
        ...(state.pendingMission && state.pendingMission.startTimestamp >= awayStartedAt
          ? [{
              id: `away_${state.pendingMission.id}`,
              tone: "warning" as const,
              message: `! Mission from ${state.pendingMission.npcName} waiting`,
              action: "missions" as const,
            }]
          : []),
        ...(state.activeFlashEvent
          ? [{
              id: `away_${state.activeFlashEvent.id}`,
              tone: state.activeFlashEvent.riskLevel === "critical" ? "danger" as const : "warning" as const,
              message: `! Flash Event: ${state.activeFlashEvent.headline}`,
              action: "terminal" as const,
            }]
          : []),
        ...Object.values(state.districtStates)
          .filter((district) => district.startTimestamp >= awayStartedAt && district.state !== "NORMAL")
          .slice(0, 3)
          .map((district) => ({
            id: `away_${district.locationId}_${district.startTimestamp}`,
            tone: district.state === "BOOM" || district.state === "FESTIVAL" ? "success" as const : "warning" as const,
            message: `! ${getLocation(district.locationId).name} entered ${district.state}`,
            action: "travel" as const,
          })),
      ].slice(0, 8);
      const primaryAction = createAwayPrimaryAction(state, nowMs);
      const exitHookMessage: DecisionSignal = {
        id: `away_resume_${nowMs}`,
        title: primaryAction.label,
        description: primaryAction.message,
        actionType: primaryAction.action === "inventory"
          ? "courier"
          : primaryAction.action === "missions"
            ? "mission"
            : primaryAction.action === "travel"
              ? "travel"
              : "trade",
        actionLabel: primaryAction.label,
        urgency: "high",
        expiresAt: nowMs + 5 * 60_000,
      };

      commitState({
        exitHookMessage,
        awayReport: {
          id: `away_${nowMs}`,
          generatedAt: nowMs,
          createdAt: nowMs,
          minutesAway: Math.max(2, Math.round(awayMs / 60_000)),
          courierResults: state.transitShipments
            .filter((shipment) => shipment.arrivalTime >= awayStartedAt && shipment.arrivalTime <= nowMs)
            .map((shipment) => ({
              id: shipment.id,
              result: shipment.status === "lost" ? "lost" as const : "arrived" as const,
              ticker: shipment.ticker,
              quantity: shipment.quantity,
            })),
          expiredMissions: state.missionHistory
            .filter((mission) => mission.failed && (mission.completedAt ?? 0) >= awayStartedAt)
            .map((mission) => ({ id: mission.id, title: mission.title })),
          districtChanges: Object.values(state.districtStates)
            .filter((district) => district.startTimestamp >= awayStartedAt && district.state !== "NORMAL")
            .map((district) => ({ locationId: district.locationId, oldState: "NORMAL", newState: district.state })),
          newContacts: state.pendingMission && state.pendingMission.startTimestamp >= awayStartedAt
            ? [{ npcId: state.pendingMission.npcId, message: `Mission from ${state.pendingMission.npcName} waiting.` }]
            : [],
          claimables: state.dailyChallenges
            .filter((challenge) => challenge.completed && !challenge.claimed)
            .map((challenge) => ({ type: "challenge", reward: `${challenge.rewardObol} 0BOL + ${challenge.rewardXp} XP` })),
          primaryAction,
          items: items.length
            ? items
            : [{ id: `away_quiet_${nowMs}`, tone: "info", message: "No major events. The grid kept humming." }],
          dismissed: false,
        },
      });
    },
    dismissAwayReport: () => {
      const state = get();
      if (!state.awayReport) {
        return;
      }
      commitState({
        awayReport: {
          ...state.awayReport,
          dismissed: true,
        },
      });
    },
    resetDemo: async () => {
      resetConfiguredAuthority();
      await clearDemoSession();
      set({
        ...buildInitialState(),
        isHydrated: true,
      });
    },
  };
});
