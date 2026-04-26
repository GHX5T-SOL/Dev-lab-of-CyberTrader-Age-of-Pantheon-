/**
 * src/engine/types.ts - authoritative data model for the game engine.
 *
 * These interfaces are the contract shared by UI, state, engine, and
 * authority adapters. Keep them serializable so save/restore remains simple.
 */

export type OsTier = "PIRATE" | "AGENT" | "PANTHEON";
export type Faction = "FREE_SPLINTERS" | "BLACKWAKE" | "NULL_CROWN" | "ARCHIVISTS";
export type Currency = "0BOL" | "$OBOL";

export interface PlayerProfile {
  id: string;
  walletAddress: string | null;
  devIdentity: string | null;
  eidolonHandle: string;
  osTier: OsTier;
  rank: number;
  faction: Faction | null;
  createdAt: string;
  currentLocationId?: string;
  travelDestinationId?: string | null;
  travelEndTime?: number | null;
}

export interface Resources {
  energySeconds: number;
  heat: number;
  integrity: number;
  stealth: number;
  influence: number;
}

export interface Commodity {
  ticker: string;
  name: string;
  basePrice: number;
  volatility: "very_low" | "low" | "med" | "high" | "very_high";
  heatRisk: "very_low" | "low" | "med" | "high" | "very_high";
  eventTags: readonly string[];
}

export interface Position {
  id: string;
  ticker: string;
  quantity: number;
  avgEntry: number;
  realizedPnl: number;
  unrealizedPnl: number;
  openedAt: string;
  closedAt: string | null;
}

export interface MarketNews {
  id: string;
  headline: string;
  body?: string;
  affectedTickers: readonly string[];
  direction?: "up" | "down";
  credibility: number;
  priceMultiplier: number;
  tickPublished: number;
  tickExpires: number;
  durationTicks?: number;
}

export interface WalletSession {
  mode: "dev_identity" | "solana_android_mwa" | "manual_external_wallet";
  walletAddress: string | null;
  cluster: "mainnet-beta" | "devnet" | "testnet" | "custom";
  canSignTransactions: boolean;
}

export interface TokenBalance {
  symbol: "$OBOL";
  mintAddress: string;
  rawAmount: string;
  uiAmount: string;
  decimals: number;
}

export interface LedgerEntry {
  id: string;
  playerId: string;
  currency: Currency;
  delta: number;
  reason: string;
  balanceAfter: number;
  createdAt: string;
}

export interface Trade {
  id: string;
  playerId: string;
  ticker: string;
  side: "BUY" | "SELL";
  quantity: number;
  price: number;
  heatDelta: number;
  executedAt: string;
}

export interface RankSnapshot {
  rank: number;
  level: number;
  title: string;
  xp: number;
  xpRequired: number;
  nextXpRequired: number | null;
  inventorySlots: number;
}

export interface TradeResult {
  trade: Trade;
  position: Position;
  ledger: LedgerEntry[];
  resources: Resources;
  positions: Position[];
  rank: RankSnapshot;
  xpGained: number;
  realizedPnl: number;
}

export interface FirstSessionEvent {
  stage: number;
  timestamp: number;
  type: string;
  headline: string;
  description: string;
  actionRequired: boolean;
  actionType?: string;
  expiresAt?: number;
}

export type FlashEventType =
  | "volatility_spike"
  | "arbitrage_window"
  | "eagent_scan"
  | "district_blackout"
  | "flash_crash"
  | "gang_takeover";

export type FlashRiskLevel = "low" | "medium" | "high" | "critical";

export interface FlashEvent {
  id: string;
  type: FlashEventType;
  headline: string;
  description: string;
  ticker?: string;
  locationId?: string;
  startTimestamp: number;
  activationTimestamp?: number;
  endTimestamp: number;
  modifierApplied: boolean;
  riskLevel: FlashRiskLevel;
  multiplier?: number;
  amplitude?: number;
  counterplayTags: string[];
  resolvedByPlayer: boolean;
  heatThreshold?: number;
}

export interface HeistMission {
  id: string;
  npcId: string;
  collateralPercentage: number;
  collateralValue: number;
  payoutMultiplier: number;
  startTimestamp: number;
  endTimestamp: number;
  flashEventsDuring: FlashEvent[];
  status: "pending" | "active" | "success" | "failed";
  riskRating: "moderate" | "high" | "extreme";
}

export type MissionType = "delivery" | "buy_request" | "hold" | "intel_drop";
export type MissionStatus = "pending" | "active" | "completed" | "failed" | "declined";

export interface Mission {
  id: string;
  npcId: string;
  npcName: string;
  type: MissionType;
  title: string;
  description: string;
  requiredTicker?: string;
  requiredQuantity?: number;
  destinationLocationId?: string;
  reward0Bol: number;
  rewardXp: number;
  reputationChangeOnSuccess: number;
  reputationChangeOnFail: number;
  expiresAtTimestamp: number;
  accepted: boolean;
  completed: boolean;
  failed: boolean;
  status: MissionStatus;
  objective: string;
  ticker?: string;
  quantity?: number;
  destinationId?: string;
  startTimestamp: number;
  endTimestamp: number;
  acceptedAt?: number;
  completedAt?: number;
  rewardObol: number;
  reputationDelta: number;
}

export interface NpcReputation {
  npcId: string;
  reputation: number;
}

export interface NPCRelationship {
  npcId: string;
  reputation: number;
  completedMissions: number;
  failedMissions: number;
  specialMessages: string[];
  unlockedPerks: string[];
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  category: "convenience" | "cosmetic" | "recovery" | "access";
  obolPrice: number;
  fiatEquivalent: string;
  zeroBolAlternative?: string;
  available: boolean;
  purchaseLimit?: string;
}

export interface PlayerRiskProfile {
  heat: number;
  bountyLevel: number;
  recentProfitVelocity: number;
  recentIllegalVolume: number;
  scannerAttention: number;
  raidImmunityUntil: number | null;
}

export interface MarketWhisper {
  id: string;
  createdAt: number;
  message: string;
  locationId?: string;
  ticker?: string;
}

export interface PantheonShardCliffhanger {
  detectedAt: number;
  expiresAt: number;
  requiredRank: number;
  headline: string;
  description: string;
}

export interface PlayerLoreShard {
  id: string;
  rankLevel: number;
  title: string;
  body: string;
  unlockedAt: number;
  read: boolean;
}

export interface MissedPeakLogEntry {
  id: string;
  ticker: string;
  quantity: number;
  sellPrice: number;
  peakPrice: number;
  missedValue: number;
  createdAt: number;
}

export interface RaidRecoveryWindow {
  id: string;
  raidAt: number;
  expiresAt: number;
  lostInventory: Record<string, number>;
  restored: boolean;
}

export type DailyChallengeType =
  | "daily_profit"
  | "location_trades"
  | "raid_survivor"
  | "courier_success"
  | "rank_push";

export interface DailyChallenge {
  id: string;
  type: DailyChallengeType;
  title: string;
  target: number;
  progress: number;
  rewardObol: number;
  rewardXp: number;
  completed: boolean;
  claimed: boolean;
}

export interface TradeStreak {
  count: number;
  multiplier: number;
  lastProfitableTradeAt: number | null;
  expiresAt: number | null;
  record: number;
  unlockedTitle?: "Hot Hand" | "Prophet" | "Oracle";
}

export type DistrictState =
  | "NORMAL"
  | "BOOM"
  | "LOCKDOWN"
  | "BLACKOUT"
  | "FESTIVAL"
  | "GANG_CONTROL"
  | "MARKET_CRASH";

export interface DistrictStateRecord {
  locationId: string;
  state: DistrictState;
  startTimestamp: number;
  endTimestamp: number;
  festivalTicker?: string;
}

export type BountyTier = 0 | 1 | 2 | 3;
export type BountyStatus = "SAFE" | "WATCHED" | "HUNTED" | "PRIORITY TARGET";

export interface BountySnapshot {
  level: BountyTier;
  status: BountyStatus;
  heatMin: number;
  heatMax: number;
  courierRiskBonus: number;
  missionRewardMultiplier: number;
  raidProbabilityDivisor: number;
}

export type DecisionUrgency = "low" | "medium" | "high" | "critical";

export type DecisionActionType =
  | "trade"
  | "travel"
  | "reduce_heat"
  | "mission"
  | "courier"
  | "claim"
  | "challenge"
  | "rank"
  | "plan";

export interface DecisionSignal {
  id: string;
  title: string;
  description: string;
  actionType: DecisionActionType;
  actionLabel: string;
  urgency: DecisionUrgency;
  expiresAt: number | null;
  ticker?: string;
  locationId?: string;
}

export interface DecisionContext {
  opportunity: DecisionSignal;
  risk: DecisionSignal;
  recommendedAction: DecisionSignal;
  urgency: DecisionUrgency;
  expiresAt: number | null;
  generatedAt: number;
  isSafeStop: boolean;
}

export type HeatPressureStage = 0 | 1 | 2 | 3;

export interface HeatPressureState {
  stage: HeatPressureStage;
  status: "CLEAR" | "WARNING" | "TRACKING" | "SCAN_LOCK";
  scanLockAt: number | null;
  lastConsequenceAt: number | null;
  lastMessage: string | null;
}

export interface HeatPressureConsequence {
  id: string;
  stage: HeatPressureStage;
  heatDelta: number;
  message: string;
  tone: "warning" | "danger";
  lockTrading: boolean;
  lockDurationMs: number;
}

export interface MicroReward {
  id: string;
  label: string;
  value: string;
  tone: "profit" | "xp" | "risk" | "info";
  createdAt: number;
}

export interface AwayReportItem {
  id: string;
  tone: "success" | "warning" | "danger" | "info";
  message: string;
  action?: "missions" | "terminal" | "travel" | "inventory" | "black_market";
}

export interface AwayReport {
  id: string;
  generatedAt: number;
  createdAt: number;
  minutesAway: number;
  courierResults: { id: string; result: "arrived" | "lost"; ticker: string; quantity: number }[];
  expiredMissions: { id: string; title: string }[];
  districtChanges: { locationId: string; oldState: string; newState: string }[];
  newContacts: { npcId: string; message: string }[];
  claimables: { type: string; reward: string }[];
  items: AwayReportItem[];
  dismissed: boolean;
}

export interface TradeJuice {
  kind: "profit" | "loss" | "breakeven";
  pnl: number;
  bigWin: boolean;
  createdAt: number;
}

export interface RankCelebration {
  level: number;
  title: string;
  createdAt: number;
}

export interface Authority {
  getProfile(playerId: string): Promise<PlayerProfile>;
  createProfile(input: Omit<PlayerProfile, "id" | "createdAt">): Promise<PlayerProfile>;
  getOpenPositions(playerId: string): Promise<Position[]>;
  getLedger(playerId: string): Promise<LedgerEntry[]>;

  getMarket(): Promise<Commodity[]>;
  getTickPrices(tick: number): Promise<Record<string, number>>;

  executeTrade(input: {
    playerId: string;
    ticker: string;
    side: "BUY" | "SELL";
    quantity: number;
    locationId?: string;
    priceOverride?: number;
  }): Promise<TradeResult>;

  getResources(playerId: string): Promise<Resources>;
  purchaseEnergy(playerId: string, seconds: number, currency: Currency): Promise<Resources>;
  advancePlayerClock?(playerId: string, tick: number): Promise<Resources>;
  reduceHeat?(
    playerId: string,
    cost: number,
    heatReduction: number,
  ): Promise<{ resources: Resources; ledger: LedgerEntry[] }>;
  applyHeatDelta?(
    playerId: string,
    heatDelta: number,
    reason: string,
  ): Promise<Resources>;
  transferPositionToShipment?(
    playerId: string,
    ticker: string,
    quantity: number,
    cost: number,
  ): Promise<{ ledger: LedgerEntry[]; positions: Position[] }>;
  claimShipment?(
    playerId: string,
    ticker: string,
    quantity: number,
    avgEntry: number,
  ): Promise<Position[]>;
  applyRaidLoss?(
    playerId: string,
    losses: Record<string, number>,
  ): Promise<{ positions: Position[]; resources: Resources }>;
  restoreRaidLoss?(
    playerId: string,
    recovered: Record<string, { quantity: number; avgEntry: number }>,
    cost: number,
    currency: Currency,
  ): Promise<{ positions: Position[]; ledger: LedgerEntry[] }>;
  grantReward?(
    playerId: string,
    amount: number,
    reason: string,
  ): Promise<LedgerEntry[]>;
  spendCurrency?(
    playerId: string,
    amount: number,
    currency: Currency,
    reason: string,
  ): Promise<LedgerEntry[]>;
  applyHeistCollateral?(
    playerId: string,
    collateralValue: number,
  ): Promise<LedgerEntry[]>;
  updateNpcReputation?(
    playerId: string,
    npcId: string,
    delta: number,
  ): Promise<NPCRelationship>;

  getActiveNews(tick: number): Promise<MarketNews[]>;

  getRank(playerId: string): Promise<RankSnapshot>;
  updateXp(playerId: string, xpDelta: number, reason?: string): Promise<RankSnapshot>;

  connectWallet?(): Promise<WalletSession>;
  disconnectWallet?(): Promise<void>;
  getObolBalance?(playerId: string): Promise<TokenBalance | null>;
}
