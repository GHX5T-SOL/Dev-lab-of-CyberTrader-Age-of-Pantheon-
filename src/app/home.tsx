import * as React from "react";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import {
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Svg, { Polyline } from "react-native-svg";
import ActionButton from "@/components/action-button";
import AnimatedNumber from "@/components/animated-number";
import AwayReportPanel from "@/components/away-report";
import { COMMODITY_ICON_MAP } from "@/components/commodity-row";
import CourierBoard from "@/components/courier-board";
import DailyChallengesPanel from "@/components/daily-challenges-panel";
import DistrictStrip from "@/components/district-strip";
import FlashEventBanner from "@/components/flash-event-banner";
import LocationBanner from "@/components/location-banner";
import MarketWhisperPanel from "@/components/market-whisper";
import { MetricRing } from "@/components/metric-ring";
import MissionBanner from "@/components/mission-banner";
import ObolBalanceDisplay from "@/components/obol-balance-display";
import OpportunityRail from "@/components/opportunity-rail";
import ProgressRail from "@/components/progress-rail";
import RiskRail from "@/components/risk-rail";
import StreakDisplay from "@/components/streak-display";
import { BurgerTrigger } from "@/components/burger-menu";
import { useMenu } from "@/context/menu-context";
import { getLocation, getUnlockedLocations } from "@/data/locations";
import {
  getActiveDistrictState,
  isDistrictBuyRestricted,
  isDistrictSellRestricted,
} from "@/engine/district-state";
import {
  DEMO_COMMODITIES,
  formatObol,
  getValueBasedTradeHeatDelta,
  roundCurrency,
} from "@/engine/demo-market";
import { isTradingBlockedByFlash } from "@/engine/flash-events";
import { getNextStreakTarget, getStreakRiskHeatBonus } from "@/engine/pressure";
import { useDemoBootstrap } from "@/hooks/use-demo-bootstrap";
import { useDemoStore } from "@/state/demo-store";
import { displayFont, terminalColors, terminalFont } from "@/theme/terminal";
import CyberText from "@/components/cyber-text";

const MAGENTA = terminalColors.purple;
const GLASS = terminalColors.glass;
const GLASS_STRONG = terminalColors.glassStrong;
const OPPORTUNITY_ORANGE = terminalColors.amber;

function percentChange(change: number, price: number) {
  return price ? (change / Math.max(1, price - change)) * 100 : 0;
}

function truncateHandle(handle: string) {
  if (!handle) {
    return "LOCAL...000";
  }
  return handle.length > 9 ? `${handle.slice(0, 6)}...${handle.slice(-3)}` : handle;
}

function colorForUrgency(urgency: string) {
  if (urgency === "critical") {
    return terminalColors.red;
  }
  if (urgency === "high") {
    return terminalColors.amber;
  }
  if (urgency === "medium") {
    return terminalColors.cyan;
  }
  return terminalColors.green;
}

function formatCountdown(expiresAt: number | null, nowMs: number): string {
  if (!expiresAt) {
    return "LIVE";
  }
  const rawSeconds = Math.max(0, Math.ceil((expiresAt - nowMs) / 1000));
  const totalSeconds = rawSeconds > 5999
    ? Math.max(1, 180 - (Math.floor(nowMs / 1000) % 180))
    : rawSeconds;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function msUntil(expiresAt: number | null, nowMs: number): number | null {
  return expiresAt ? Math.max(0, expiresAt - nowMs) : null;
}

function countdownColor(expiresAt: number | null, nowMs: number, fallback: string): string {
  const remaining = msUntil(expiresAt, nowMs);
  if (remaining === null) {
    return fallback;
  }
  if (remaining <= 30_000) {
    return terminalColors.red;
  }
  if (remaining <= 90_000) {
    return terminalColors.amber;
  }
  return fallback;
}

function riskLabel(heatDelta: number) {
  if (heatDelta >= 10) {
    return "CRITICAL";
  }
  if (heatDelta >= 5) {
    return "HIGH";
  }
  if (heatDelta >= 2) {
    return "MED";
  }
  return "LOW";
}

function riskColor(label: string) {
  if (label === "CRITICAL" || label === "HIGH") {
    return terminalColors.red;
  }
  if (label === "MED") {
    return terminalColors.amber;
  }
  return terminalColors.green;
}

export default function HomeRoute() {
  useDemoBootstrap();
  const menu = useMenu();
  const { width } = useWindowDimensions();
  const isWide = width >= 620;
  const frameWidth = isWide ? 430 : "100%";
  const handle = useDemoStore((state) => state.handle);
  const resources = useDemoStore((state) => state.resources);
  const prices = useDemoStore((state) => state.prices);
  const changes = useDemoStore((state) => state.changes);
  const balance = useDemoStore((state) => state.balanceObol);
  const positions = useDemoStore((state) => state.positions);
  const progression = useDemoStore((state) => state.progression);
  const clock = useDemoStore((state) => state.clock);
  const world = useDemoStore((state) => state.world);
  const transitShipments = useDemoStore((state) => state.transitShipments);
  const activeFlashEvent = useDemoStore((state) => state.activeFlashEvent);
  const pendingMission = useDemoStore((state) => state.pendingMission);
  const activeMission = useDemoStore((state) => state.activeMission);
  const streak = useDemoStore((state) => state.streak);
  const dailyChallenges = useDemoStore((state) => state.dailyChallenges);
  const districtStates = useDemoStore((state) => state.districtStates);
  const bounty = useDemoStore((state) => state.bounty);
  const playerRiskProfile = useDemoStore((state) => state.playerRiskProfile);
  const marketWhispers = useDemoStore((state) => state.marketWhispers);
  const pantheonShard = useDemoStore((state) => state.pantheonShard);
  const obolBalance = useDemoStore((state) => state.obolBalance);
  const firstSessionMessage = useDemoStore((state) => state.firstSessionMessage);
  const raidRecoveryWindow = useDemoStore((state) => state.raidRecoveryWindow);
  const awayReport = useDemoStore((state) => state.awayReport);
  const heatWarning = useDemoStore((state) => state.heatWarning);
  const rankCelebration = useDemoStore((state) => state.rankCelebration);
  const decisionContext = useDemoStore((state) => state.decisionContext);
  const heatPressure = useDemoStore((state) => state.heatPressure);
  const microRewards = useDemoStore((state) => state.microRewards);
  const tradeJuice = useDemoStore((state) => state.tradeJuice);
  const nextFlashEventAt = useDemoStore((state) => state.nextFlashEventAt);
  const nextMissionAt = useDemoStore((state) => state.nextMissionAt);
  const nextMarketWhisperAt = useDemoStore((state) => state.nextMarketWhisperAt);
  const tutorialCompleted = useDemoStore((state) => state.tutorialCompleted);
  const openMarket = useDemoStore((state) => state.openMarket);
  const selectTicker = useDemoStore((state) => state.selectTicker);
  const setOrderSize = useDemoStore((state) => state.setOrderSize);
  const buySelected = useDemoStore((state) => state.buySelected);
  const sellSelected = useDemoStore((state) => state.sellSelected);
  const purchaseEnergyHours = useDemoStore((state) => state.purchaseEnergyHours);
  const startTravel = useDemoStore((state) => state.startTravel);
  const reduceHeatWithBribe = useDemoStore((state) => state.reduceHeatWithBribe);
  const claimShipment = useDemoStore((state) => state.claimShipment);
  const acceptMission = useDemoStore((state) => state.acceptMission);
  const declineMission = useDemoStore((state) => state.declineMission);
  const claimDailyChallenge = useDemoStore((state) => state.claimDailyChallenge);
  const dismissAwayReport = useDemoStore((state) => state.dismissAwayReport);
  const instantTravelWithObol = useDemoStore((state) => state.instantTravelWithObol);
  const buyBackRaidLoss = useDemoStore((state) => state.buyBackRaidLoss);
  const isBusy = useDemoStore((state) => state.isBusy);
  const [energyModal, setEnergyModal] = React.useState(false);
  const [travelModal, setTravelModal] = React.useState(false);
  const [hours, setHours] = React.useState(1);
  const [intelOpen, setIntelOpen] = React.useState(false);
  const [ignoredSignalId, setIgnoredSignalId] = React.useState<string | null>(null);
  const [tradeTicker, setTradeTicker] = React.useState<string | null>(null);
  const [tradeSide, setTradeSide] = React.useState<"BUY" | "SELL">("BUY");
  const [tradeQuantity, setTradeQuantity] = React.useState(1);
  const [signalPing, setSignalPing] = React.useState(false);
  const [streakMoment, setStreakMoment] = React.useState<"gain" | "break" | null>(null);
  const [courierMoment, setCourierMoment] = React.useState<{
    tone: "success" | "loss";
    title: string;
    body: string;
  } | null>(null);
  const signalPulse = useSharedValue(0);
  const signalBreath = useSharedValue(0);
  const countdownPulse = useSharedValue(0);
  const heatPulse = useSharedValue(0);
  const tradePulse = useSharedValue(0);
  const shakeOffset = useSharedValue(0);
  const streakPulse = useSharedValue(0);
  const courierPulse = useSharedValue(0);
  const microPulse = useSharedValue(0);
  const marketPulse = useSharedValue(0);
  const idleFlicker = useSharedValue(0);
  const previousSignalId = React.useRef(decisionContext.recommendedAction.id);
  const previousHeat = React.useRef(resources.heat);
  const previousStreak = React.useRef(streak.count);
  const previousShipmentStatuses = React.useRef<Record<string, string>>({});

  React.useEffect(() => {
    if (!tutorialCompleted) {
      const timer = setTimeout(() => router.push("/tutorial"), 600);
      return () => clearTimeout(timer);
    }
  }, [tutorialCompleted]);

  React.useEffect(() => {
    if (!heatWarning || clock.nowMs - heatWarning.createdAt > 2500 || Platform.OS === "web") {
      return;
    }

    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  }, [clock.nowMs, heatWarning]);

  React.useEffect(() => {
    idleFlicker.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 2400, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      false,
    );
  }, [idleFlicker]);

  React.useEffect(() => {
    if (previousSignalId.current === decisionContext.recommendedAction.id) {
      return;
    }

    previousSignalId.current = decisionContext.recommendedAction.id;
    signalPulse.value = withSequence(
      withTiming(1, { duration: 120, easing: Easing.out(Easing.quad) }),
      withTiming(0, { duration: 780, easing: Easing.out(Easing.cubic) }),
    );
    setSignalPing(true);
    if (Platform.OS !== "web") {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    const timer = setTimeout(() => setSignalPing(false), 1200);
    return () => clearTimeout(timer);
  }, [decisionContext.recommendedAction.id, signalPulse]);

  React.useEffect(() => {
    signalBreath.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2600, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 2800, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      false,
    );
  }, [signalBreath]);

  const signalTimerCritical = Boolean(decisionContext.expiresAt && decisionContext.expiresAt - clock.nowMs <= 30_000);

  React.useEffect(() => {
    if (signalTimerCritical) {
      countdownPulse.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 260, easing: Easing.out(Easing.quad) }),
          withTiming(0, { duration: 360, easing: Easing.in(Easing.quad) }),
        ),
        -1,
        false,
      );
    } else {
      countdownPulse.value = withTiming(0, { duration: 220 });
    }
  }, [countdownPulse, signalTimerCritical]);

  React.useEffect(() => {
    if (resources.heat > previousHeat.current) {
      heatPulse.value = withSequence(
        withTiming(1, { duration: 110, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: 820, easing: Easing.out(Easing.cubic) }),
      );
    }
    previousHeat.current = resources.heat;
  }, [heatPulse, resources.heat]);

  React.useEffect(() => {
    if (!tradeJuice || Date.now() - tradeJuice.createdAt > 5_000) {
      return;
    }

    tradePulse.value = withSequence(
      withTiming(1, { duration: 110, easing: Easing.out(Easing.quad) }),
      withTiming(0, { duration: 860, easing: Easing.out(Easing.cubic) }),
    );
    if (tradeJuice.kind === "loss") {
      shakeOffset.value = withSequence(
        withTiming(-5, { duration: 34 }),
        withTiming(5, { duration: 34 }),
        withTiming(-3, { duration: 34 }),
        withTiming(3, { duration: 34 }),
        withTiming(0, { duration: 60 }),
      );
    }
  }, [shakeOffset, tradeJuice?.createdAt, tradeJuice?.kind, tradePulse]);

  React.useEffect(() => {
    const previous = previousStreak.current;
    if (streak.count > previous) {
      setStreakMoment("gain");
      streakPulse.value = withSequence(
        withTiming(1, { duration: 120, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: 820, easing: Easing.out(Easing.cubic) }),
      );
      const timer = setTimeout(() => setStreakMoment(null), 1600);
      previousStreak.current = streak.count;
      return () => clearTimeout(timer);
    }
    if (previous > 0 && streak.count === 0) {
      setStreakMoment("break");
      streakPulse.value = withSequence(
        withTiming(1, { duration: 80 }),
        withTiming(0, { duration: 620 }),
      );
      const timer = setTimeout(() => setStreakMoment(null), 1600);
      previousStreak.current = streak.count;
      return () => clearTimeout(timer);
    }
    previousStreak.current = streak.count;
  }, [streak.count, streakPulse]);

  React.useEffect(() => {
    if (!microRewards[0]) {
      return;
    }
    microPulse.value = withSequence(
      withTiming(1, { duration: 140, easing: Easing.out(Easing.quad) }),
      withTiming(0, { duration: 760, easing: Easing.out(Easing.cubic) }),
    );
  }, [microPulse, microRewards]);

  React.useEffect(() => {
    const previous = previousShipmentStatuses.current;
    const resolved = transitShipments.find((shipment) =>
      previous[shipment.id] === "transit" && (shipment.status === "arrived" || shipment.status === "lost"),
    );
    if (resolved) {
      previousShipmentStatuses.current = Object.fromEntries(
        transitShipments.map((shipment) => [shipment.id, shipment.status]),
      );
      setCourierMoment({
        tone: resolved.status === "arrived" ? "success" : "loss",
        title: resolved.status === "arrived" ? "COURIER SUCCESS" : "COURIER LOST",
        body: `${resolved.quantity} ${resolved.ticker} ${resolved.status === "arrived" ? "arrived" : "was intercepted"}`,
      });
      courierPulse.value = withSequence(
        withTiming(1, { duration: 140, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: 980, easing: Easing.out(Easing.cubic) }),
      );
      const timer = setTimeout(() => setCourierMoment(null), 3000);
      return () => clearTimeout(timer);
    }

    previousShipmentStatuses.current = Object.fromEntries(
      transitShipments.map((shipment) => [shipment.id, shipment.status]),
    );
  }, [courierPulse, transitShipments]);

  const energyHours = Math.floor(resources.energySeconds / 3600);
  const energyPercent = Math.min(100, Math.round((resources.energySeconds / (72 * 3600)) * 100));
  const energyColor = energyHours > 24 ? terminalColors.green : energyHours >= 6 ? terminalColors.amber : terminalColors.red;
  const heatColor = resources.heat < 30 ? terminalColors.green : resources.heat < 70 ? terminalColors.amber : terminalColors.red;
  const currentLocation = getLocation(world.currentLocationId);
  const district = getActiveDistrictState(districtStates, world.currentLocationId, clock.nowMs);
  const travelling = Boolean(world.travelDestinationId && world.travelEndTime && world.travelEndTime > clock.nowMs);
  const nextXp = progression.nextXpRequired === null
    ? 0
    : Math.max(0, progression.nextXpRequired - progression.xp);
  const signalColor = colorForUrgency(decisionContext.urgency);
  const signalCountdown = formatCountdown(decisionContext.expiresAt, clock.nowMs);
  const signalMuted = ignoredSignalId === decisionContext.recommendedAction.id;
  const tradeCommodity = DEMO_COMMODITIES.find((commodity) => commodity.ticker === tradeTicker) ?? null;
  const tradePrice = tradeCommodity ? prices[tradeCommodity.ticker] ?? tradeCommodity.basePrice : 0;
  const tradePosition = tradeTicker ? positions[tradeTicker] : undefined;
  const tradeQuantitySafe = Math.max(1, Math.floor(tradeQuantity));
  const tradeValue = roundCurrency(tradePrice * tradeQuantitySafe);
  const projectedPnl = tradeSide === "SELL" && tradePosition
    ? roundCurrency((tradePrice - tradePosition.avgEntry) * Math.min(tradeQuantitySafe, tradePosition.quantity))
    : null;
  const heatImpact = tradeCommodity ? getValueBasedTradeHeatDelta(tradeCommodity.ticker, tradeValue) : 0;
  const streakRiskBonus = getStreakRiskHeatBonus(streak);
  const displayedHeatImpact = heatImpact + streakRiskBonus;
  const tradeRisk = riskLabel(displayedHeatImpact);
  const tradeBlockedByDistrict = tradeSide === "BUY"
    ? isDistrictBuyRestricted(district.state)
    : isDistrictSellRestricted(district.state);
  const tradeBlockedByFlash = isTradingBlockedByFlash(activeFlashEvent, world.currentLocationId);
  const tradeBlocked = travelling || tradeBlockedByDistrict || tradeBlockedByFlash;
  const canExecuteTrade = Boolean(tradeCommodity) &&
    !tradeBlocked &&
    !isBusy &&
    (tradeSide === "BUY" || (tradePosition?.quantity ?? 0) > 0);
  const nextSignalAt = Math.min(nextFlashEventAt, nextMissionAt, nextMarketWhisperAt);
  const openPnl = Object.values(positions).reduce((total, position) => {
    const current = prices[position.ticker] ?? position.avgEntry;
    return total + (current - position.avgEntry) * position.quantity;
  }, 0);
  const nextProfitMilestone = Math.max(1_000, Math.ceil((Math.max(0, openPnl) + 1) / 5_000) * 5_000);
  const profitRemaining = Math.max(0, nextProfitMilestone - Math.max(0, openPnl));
  const streakTarget = getNextStreakTarget(streak.count);
  const activeCourier = transitShipments
    .filter((shipment) => shipment.status === "transit")
    .sort((left, right) => left.arrivalTime - right.arrivalTime)[0];
  const courierExpectedProfit = activeCourier
    ? roundCurrency(((prices[activeCourier.ticker] ?? activeCourier.avgEntry) - activeCourier.avgEntry) * activeCourier.quantity)
    : 0;
  const signalCountdownColor = countdownColor(decisionContext.expiresAt, clock.nowMs, terminalColors.text);
  const nextSignalUrgent = Boolean(msUntil(nextSignalAt, clock.nowMs) !== null && (msUntil(nextSignalAt, clock.nowMs) ?? 0) <= 90_000);
  const scanLockUrgent = Boolean(heatPressure.scanLockAt && heatPressure.scanLockAt - clock.nowMs <= 90_000);
  const courierUrgent = Boolean(activeCourier && activeCourier.arrivalTime - clock.nowMs <= 90_000);
  const topMarketMove = React.useMemo(() => {
    return DEMO_COMMODITIES
      .map((commodity) => {
        const price = prices[commodity.ticker] ?? commodity.basePrice;
        const changePercent = percentChange(changes[commodity.ticker] ?? 0, price);
        return { ticker: commodity.ticker, changePercent };
      })
      .sort((left, right) => Math.abs(right.changePercent) - Math.abs(left.changePercent))[0];
  }, [changes, prices]);
  const marketMoveKey = topMarketMove
    ? `${topMarketMove.ticker}:${Math.round(topMarketMove.changePercent * 10)}`
    : "quiet";

  React.useEffect(() => {
    marketPulse.value = withSequence(
      withTiming(1, { duration: 120, easing: Easing.out(Easing.quad) }),
      withTiming(0, { duration: 680, easing: Easing.out(Easing.cubic) }),
    );
  }, [marketMoveKey, marketPulse]);

  const signalAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + signalPulse.value * 0.018 + signalBreath.value * 0.004 }],
    opacity: signalMuted ? 0.74 : 1,
    shadowOpacity: 0.28 + signalPulse.value * 0.2 + signalBreath.value * 0.12,
    shadowRadius: 18 + signalBreath.value * 10,
  }));

  const countdownAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + countdownPulse.value * 0.055 }],
    opacity: 1 - countdownPulse.value * 0.12,
  }));

  const heatCardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + heatPulse.value * 0.018 }],
  }));

  const dangerOverlayStyle = useAnimatedStyle(() => ({
    opacity: Math.min(0.34, heatPulse.value * 0.3 + (resources.heat >= 90 ? 0.16 : resources.heat >= 75 ? 0.08 : 0)),
  }));

  const tradeOverlayStyle = useAnimatedStyle(() => ({
    opacity: tradePulse.value * 0.3,
  }));

  const tradeFloatStyle = useAnimatedStyle(() => ({
    opacity: tradePulse.value,
    transform: [
      { translateY: -18 * tradePulse.value },
      { scale: 0.92 + tradePulse.value * 0.16 },
    ],
  }));

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeOffset.value }],
  }));

  const streakFloatStyle = useAnimatedStyle(() => ({
    opacity: streakPulse.value,
    transform: [
      { translateY: -12 * streakPulse.value },
      { scale: 0.9 + streakPulse.value * 0.18 },
    ],
  }));

  const courierMomentStyle = useAnimatedStyle(() => ({
    opacity: courierPulse.value,
    transform: [{ scale: 0.96 + courierPulse.value * 0.06 }],
  }));

  const microRewardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + microPulse.value * 0.04 }],
  }));

  const marketMoveStyle = useAnimatedStyle(() => ({
    opacity: 0.78 + marketPulse.value * 0.22,
    transform: [{ translateY: -2 * marketPulse.value }],
  }));

  const idleFlickerStyle = useAnimatedStyle(() => ({
    opacity: 0.01 + idleFlicker.value * 0.018,
  }));

  const followDecision = () => {
    const action = decisionContext.recommendedAction;
    switch (action.actionType) {
      case "mission":
        router.push("/missions");
        break;
      case "travel":
        setTravelModal(true);
        break;
      case "reduce_heat":
        if (currentLocation.special === "heat_reduction") {
          void reduceHeatWithBribe();
        } else {
          setTravelModal(true);
        }
        break;
      case "claim":
      case "courier":
        router.push("/menu/inventory");
        break;
      case "challenge":
      case "rank":
        router.push("/menu/progression");
        break;
      case "plan":
      case "trade":
      default:
        if (action.ticker) {
          openTradeSheet(action.ticker);
        } else {
          openMarket();
          router.push("/terminal");
        }
        break;
    }
  };

  const openTradeSheet = (ticker: string) => {
    selectTicker(ticker);
    setTradeTicker(ticker);
    setTradeSide(positions[ticker]?.quantity ? "SELL" : "BUY");
    setTradeQuantity(1);
  };

  const executeTrade = async () => {
    if (!tradeCommodity) {
      return;
    }

    selectTicker(tradeCommodity.ticker);
    setOrderSize(tradeQuantitySafe);
    if (tradeSide === "BUY") {
      await buySelected();
    } else {
      await sellSelected();
    }
    setTradeTicker(null);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "transparent", alignItems: "center" }}>
      <Animated.View
        pointerEvents="none"
        style={[
          { position: "absolute", top: 0, right: 0, bottom: 0, left: 0, backgroundColor: terminalColors.purple },
          idleFlickerStyle,
        ]}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: "center",
          paddingBottom: 108,
          backgroundColor: "transparent",
        }}
        style={{ width: "100%" }}
      >
        <Animated.View style={[{ width: frameWidth, maxWidth: 430, minHeight: "100%", paddingHorizontal: 14, paddingTop: 10 }, shakeStyle]}>
          <BurgerTrigger onPress={menu.openMenu} style={{ position: "absolute", top: 10, right: 18, zIndex: 20 }} />

          <View style={{ paddingRight: 48 }}>
            <CyberText style={{ fontFamily: terminalFont, fontSize: 16, color: terminalColors.cyan, letterSpacing: 1.4 }}>
              AG3NT_OS//PIRAT3
            </CyberText>
            <CyberText style={{ fontFamily: terminalFont, fontSize: 11, color: terminalColors.muted, marginTop: 4 }}>
              {truncateHandle(handle)} // {clock.displayTime} // {currentLocation.name.toUpperCase()}
            </CyberText>
          </View>

          <View style={{ marginTop: 14 }}>
            <LocationBanner
              currentLocationId={world.currentLocationId}
              travelDestinationId={world.travelDestinationId}
              travelEndTime={world.travelEndTime}
              nowMs={clock.nowMs}
              districtState={district.state}
              onTravelPress={() => setTravelModal(true)}
            />
          </View>

          <View style={{ flexDirection: "row", gap: 14, marginTop: 14, justifyContent: "center" }}>
            <VitalCard label="ENERGY" value={`${energyHours}h`} percent={energyPercent} color={energyColor} tone="cyan" sub="runtime" onPress={() => setEnergyModal(true)} />
            <Animated.View style={[{ flex: 1 }, heatCardAnimatedStyle]}>
              <VitalCard label="HEAT" value={`${resources.heat}%`} percent={resources.heat} color={heatColor} tone="red" sub={bounty.status} danger={resources.heat >= 75} />
            </Animated.View>
          </View>

          <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
            <GlassChip label="0BOL" value={formatObol(balance)} color={terminalColors.cyan} />
            <GlassChip label="RANK" value={`${progression.title}`} sub={`${nextXp} XP NEXT`} color={terminalColors.green} />
          </View>
          <View style={{ marginTop: 10 }}>
            <ObolBalanceDisplay balance={obolBalance} />
          </View>

          <Animated.View style={[{ shadowColor: signalColor }, signalAnimatedStyle]}>
            <Pressable
              onPress={followDecision}
              style={{
                marginTop: 16,
                borderWidth: 2,
                borderColor: decisionContext.urgency === "critical" ? terminalColors.red : OPPORTUNITY_ORANGE,
                borderRadius: 0,
                backgroundColor: terminalColors.glassStrong,
                padding: 20,
                shadowColor: decisionContext.urgency === "critical" ? terminalColors.red : OPPORTUNITY_ORANGE,
                shadowOpacity: decisionContext.urgency === "critical" ? 0.62 : 0.48,
                shadowRadius: decisionContext.urgency === "critical" ? 30 : 24,
                elevation: 10,
                overflow: "hidden",
              }}
            >
            <LinearGradient
              pointerEvents="none"
              colors={[
                decisionContext.urgency === "critical" ? "rgba(255,59,59,0.22)" : "rgba(255,200,87,0.15)",
                "rgba(138,124,255,0.08)",
                "rgba(20,25,35,0.6)",
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
            />
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
              <CyberText style={{ flex: 1, fontFamily: displayFont, color: terminalColors.yellow, fontSize: 13, fontWeight: "800", letterSpacing: -0.2 }}>
                SIGNAL // {decisionContext.urgency.toUpperCase()} {signalPing ? "// PING" : ""}
              </CyberText>
              <Animated.View style={[{ borderWidth: 1, borderColor: signalCountdownColor, borderRadius: 0, paddingHorizontal: 14, paddingVertical: 7, backgroundColor: "rgba(5,7,13,0.62)", shadowColor: signalCountdownColor, shadowOpacity: 0.3, shadowRadius: 10 }, countdownAnimatedStyle]}>
                <CyberText style={{ fontFamily: terminalFont, color: signalCountdownColor, fontSize: 24, fontVariant: ["tabular-nums"] }}>
                  {signalCountdown}
                </CyberText>
              </Animated.View>
            </View>
            <CyberText style={{ marginTop: 14, fontFamily: displayFont, color: terminalColors.text, fontSize: 24, fontWeight: "800", lineHeight: 30, letterSpacing: -0.2 }}>
              {signalMuted ? "SIGNAL MUTED" : decisionContext.recommendedAction.title.toUpperCase()}
            </CyberText>
            <CyberText style={{ marginTop: 8, fontFamily: displayFont, color: terminalColors.muted, fontSize: 14, lineHeight: 20 }}>
              {signalMuted ? "Muted locally. The grid keeps watching for the next stronger move." : decisionContext.recommendedAction.description}
            </CyberText>

            <View style={{ marginTop: 14, height: 58, borderWidth: 1, borderColor: "rgba(255,200,87,0.45)", borderRadius: 0, backgroundColor: "rgba(5,7,13,0.52)", padding: 6 }}>
              <MiniGraph color={decisionContext.urgency === "critical" ? terminalColors.red : terminalColors.yellow} intensity={decisionContext.urgency === "critical" ? 1.4 : 1} />
            </View>

            <View style={{ flexDirection: "row", gap: 8, marginTop: 14 }}>
              <MiniSignal label="OPPORTUNITY" value={decisionContext.opportunity.title} color={terminalColors.green} />
              <MiniSignal label="RISK" value={decisionContext.risk.title} color={terminalColors.red} />
            </View>

            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
              <SignalButton label="ACT ON SIGNAL" color={signalColor} onPress={followDecision} />
              <SignalButton label="IGNORE" color={terminalColors.muted} onPress={() => setIgnoredSignalId(decisionContext.recommendedAction.id)} />
              {decisionContext.risk.actionType === "reduce_heat" ? (
                <SignalButton
                  label="REDUCE HEAT"
                  color={terminalColors.red}
                  onPress={() => {
                    if (currentLocation.special === "heat_reduction") {
                      void reduceHeatWithBribe();
                    } else {
                      setTravelModal(true);
                    }
                  }}
                />
              ) : null}
              {decisionContext.opportunity.locationId && decisionContext.opportunity.locationId !== world.currentLocationId ? (
                <SignalButton label="TRAVEL" color={terminalColors.amber} onPress={() => setTravelModal(true)} />
              ) : null}
            </View>
            </Pressable>
          </Animated.View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingTop: 10 }}
          >
            {heatPressure.scanLockAt ? (
              <PressureCard
                label={heatPressure.status === "SCAN_LOCK" ? "SCAN LOCK" : "SCAN TIMER"}
                value={formatCountdown(heatPressure.scanLockAt, clock.nowMs)}
                detail={heatPressure.lastMessage ?? "Reduce Heat before escalation."}
                color={heatPressure.stage >= 2 ? terminalColors.red : terminalColors.amber}
                urgent={scanLockUrgent}
              />
            ) : null}
            <PressureCard
              label="NEXT SIGNAL"
              value={formatCountdown(nextSignalAt, clock.nowMs)}
              detail="A new event, mission, or whisper is about to move the market."
              color={countdownColor(nextSignalAt, clock.nowMs, terminalColors.cyan)}
              urgent={nextSignalUrgent}
            />
            <PressureCard
              label="NEAR WIN"
              value={`${formatObol(profitRemaining)} 0BOL`}
              detail={`Until ${formatObol(nextProfitMilestone)} open-profit milestone.`}
              color={terminalColors.green}
            />
            <PressureCard
              label="STREAK"
              value={streakTarget.tradesNeeded === 0 ? streakTarget.title : `${streakTarget.tradesNeeded} trades`}
              detail={streak.count > 0 ? `Current x${streak.multiplier.toFixed(2)} // Risk +${streakRiskBonus}` : "Start a profitable chain."}
              color={streak.count >= 5 ? terminalColors.amber : terminalColors.green}
              urgent={streak.count >= 5}
            />
            {activeCourier ? (
              <PressureCard
                label="COURIER ETA"
                value={formatCountdown(activeCourier.arrivalTime, clock.nowMs)}
                detail={`${activeCourier.quantity} ${activeCourier.ticker} // ${Math.round((activeCourier.lossChance ?? 0) * 100)}% risk // ${courierExpectedProfit >= 0 ? "+" : ""}${courierExpectedProfit.toFixed(0)} expected`}
                color={countdownColor(activeCourier.arrivalTime, clock.nowMs, (activeCourier.lossChance ?? 0) >= 0.15 ? terminalColors.amber : terminalColors.green)}
                urgent={courierUrgent}
              />
            ) : null}
          </ScrollView>

          {microRewards[0] && clock.nowMs - microRewards[0].createdAt < 6_000 ? (
            <Animated.View style={[{ marginTop: 10, borderWidth: 1, borderColor: colorForReward(microRewards[0].tone), borderRadius: 0, backgroundColor: GLASS_STRONG, paddingHorizontal: 12, paddingVertical: 9 }, microRewardAnimatedStyle]}>
              <CyberText style={{ fontFamily: terminalFont, color: colorForReward(microRewards[0].tone), fontSize: 12, textAlign: "center" }}>
                {microRewards[0].label.toUpperCase()} // {microRewards[0].value}
              </CyberText>
            </Animated.View>
          ) : null}

          {topMarketMove && Math.abs(topMarketMove.changePercent) >= 0.4 ? (
            <Animated.View style={[{ marginTop: 8, borderWidth: 1, borderColor: topMarketMove.changePercent >= 0 ? terminalColors.green : terminalColors.red, borderRadius: 0, backgroundColor: terminalColors.glass, paddingHorizontal: 12, paddingVertical: 8 }, marketMoveStyle]}>
              <CyberText style={{ fontFamily: terminalFont, color: topMarketMove.changePercent >= 0 ? terminalColors.green : terminalColors.red, fontSize: 11, textAlign: "center" }}>
                MARKET MOVE // {topMarketMove.ticker} {topMarketMove.changePercent >= 0 ? "+" : ""}{topMarketMove.changePercent.toFixed(1)}%
              </CyberText>
            </Animated.View>
          ) : null}

          {firstSessionMessage ? (
            <View style={{ marginTop: 12, borderWidth: 1, borderColor: terminalColors.green, borderRadius: 0, backgroundColor: GLASS_STRONG, padding: 10 }}>
              <CyberText style={{ fontFamily: terminalFont, color: terminalColors.green, fontSize: 12, lineHeight: 17 }}>
                {firstSessionMessage}
              </CyberText>
            </View>
          ) : null}

          <View style={{ marginTop: 18 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
              <View>
                <CyberText style={{ fontFamily: terminalFont, color: terminalColors.text, fontSize: 20 }}>MARKET DECK</CyberText>
                <CyberText style={{ marginTop: 3, fontFamily: terminalFont, color: terminalColors.muted, fontSize: 11 }}>
                  TAP A CARD // EXECUTE FROM SHEET
                </CyberText>
              </View>
              <Pressable
                onPress={() => {
                  openMarket();
                  router.push("/terminal");
                }}
              >
                <CyberText style={{ fontFamily: terminalFont, color: terminalColors.cyan, fontSize: 12 }}>[ FULL ]</CyberText>
              </Pressable>
            </View>

            <View style={{ gap: 10, marginTop: 12 }}>
              {DEMO_COMMODITIES.map((commodity) => {
                const price = prices[commodity.ticker] ?? commodity.basePrice;
                const change = percentChange(changes[commodity.ticker] ?? 0, price);
                const position = positions[commodity.ticker];
                return (
                  <CommodityCard
                    key={commodity.ticker}
                    ticker={commodity.ticker}
                    name={commodity.name}
                    price={price}
                    changePercent={change}
                    owned={position?.quantity ?? 0}
                    onPress={() => openTradeSheet(commodity.ticker)}
                  />
                );
              })}
            </View>
          </View>

          <Pressable
            onPress={() => setIntelOpen((value) => !value)}
            style={{ marginTop: 18, borderWidth: 1, borderColor: terminalColors.borderDim, borderRadius: 0, backgroundColor: terminalColors.panel, padding: 14 }}
          >
            <CyberText style={{ fontFamily: terminalFont, color: terminalColors.cyan, fontSize: 13 }}>
              {intelOpen ? "HIDE" : "EXPAND"} INTEL STACK
            </CyberText>
            <CyberText style={{ marginTop: 4, fontFamily: terminalFont, color: terminalColors.muted, fontSize: 11 }}>
              Rails, logs, courier board, district states, and deeper progression.
            </CyberText>
          </Pressable>

          {intelOpen ? (
            <View style={{ marginTop: 8 }}>
              <AwayReportPanel report={awayReport} onDismiss={dismissAwayReport} />
              {pantheonShard && pantheonShard.expiresAt > clock.nowMs ? (
                <View style={{ marginTop: 12, borderWidth: 1, borderColor: terminalColors.red, borderRadius: 0, backgroundColor: terminalColors.panel, padding: 10 }}>
                  <CyberText style={{ fontFamily: terminalFont, color: terminalColors.red, fontSize: 12 }}>
                    {pantheonShard.headline.toUpperCase()}
                  </CyberText>
                  <CyberText style={{ marginTop: 5, fontFamily: terminalFont, color: terminalColors.muted, fontSize: 10 }}>
                    RANK {pantheonShard.requiredRank} ACCESS // {Math.max(0, Math.ceil((pantheonShard.expiresAt - clock.nowMs) / 3_600_000))}h UNTIL FRAGMENTATION
                  </CyberText>
                </View>
              ) : null}
              <ProgressRail progression={progression} streak={streak} />
              <RiskRail resources={resources} bounty={bounty} district={district} riskProfile={playerRiskProfile} />
              <OpportunityRail
                flashEvent={activeFlashEvent}
                pendingMission={pendingMission}
                activeMission={activeMission}
                shard={pantheonShard}
                whispers={marketWhispers}
                nowMs={clock.nowMs}
                onPress={() => router.push("/terminal")}
              />
              <DistrictStrip districtStates={districtStates} />
              <MarketWhisperPanel whispers={marketWhispers} />
              {activeFlashEvent ? <FlashEventBanner event={activeFlashEvent} nowMs={clock.nowMs} /> : null}
              {pendingMission || activeMission ? (
                <MissionBanner
                  mission={(activeMission ?? pendingMission)!}
                  nowMs={clock.nowMs}
                  onAccept={acceptMission}
                  onDecline={declineMission}
                />
              ) : null}
              <StreakDisplay streak={streak} nowMs={clock.nowMs} />
              <DailyChallengesPanel challenges={dailyChallenges} onClaim={(id) => void claimDailyChallenge(id)} />
              <CourierBoard shipments={transitShipments} nowMs={clock.nowMs} currentLocationId={world.currentLocationId} onClaim={(id) => void claimShipment(id)} />

              {raidRecoveryWindow && !raidRecoveryWindow.restored && raidRecoveryWindow.expiresAt > clock.nowMs ? (
                <View style={{ marginTop: 12, borderWidth: 1, borderColor: terminalColors.amber, borderRadius: 0, backgroundColor: terminalColors.panel, padding: 10 }}>
                  <CyberText style={{ fontFamily: terminalFont, color: terminalColors.amber, fontSize: 12 }}>
                    RAID RECOVERY WINDOW // 24H
                  </CyberText>
                  <CyberText style={{ marginTop: 5, fontFamily: terminalFont, color: terminalColors.muted, fontSize: 10 }}>
                    BUY BACK LOST INVENTORY BY CHOICE. FREE PATH: REBUILD THROUGH TRADING.
                  </CyberText>
                  <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
                    <ActionButton variant="muted" label="[ 50,000 0BOL ]" onPress={() => void buyBackRaidLoss("0BOL")} />
                    <ActionButton variant="amber" label="[ 25 $OBOL (~$2.50 USD) ]" onPress={() => void buyBackRaidLoss("$OBOL")} />
                  </View>
                </View>
              ) : null}
            </View>
          ) : null}

          {heatWarning && clock.nowMs - heatWarning.createdAt < 2500 ? (
            <View style={{ marginTop: 12, borderWidth: 1, borderColor: terminalColors.red, borderRadius: 0, padding: 10 }}>
              <CyberText style={{ fontFamily: terminalFont, color: terminalColors.red, fontSize: 12 }}>
                HEAT THRESHOLD {heatWarning.threshold} CROSSED
              </CyberText>
            </View>
          ) : null}

          {rankCelebration && clock.nowMs - rankCelebration.createdAt < 3000 ? (
            <View style={{ marginTop: 12, borderWidth: 1, borderColor: terminalColors.cyan, borderRadius: 0, backgroundColor: terminalColors.panel, padding: 14 }}>
              <CyberText style={{ fontFamily: terminalFont, color: terminalColors.cyan, fontSize: 22, textAlign: "center" }}>
                RANK UP // {rankCelebration.title.toUpperCase()}
              </CyberText>
            </View>
          ) : null}
        </Animated.View>
      </ScrollView>

      <View
        style={{
          width: frameWidth,
          maxWidth: 430,
          position: "absolute",
          bottom: 0,
          borderTopWidth: 1,
          borderTopColor: terminalColors.borderDim,
          backgroundColor: "rgba(5,7,13,0.94)",
          paddingHorizontal: 14,
          paddingTop: 10,
          paddingBottom: 18,
        }}
      >
        <View style={{ flexDirection: "row", gap: 8 }}>
          <NavButton label="TRADE" active onPress={() => {
            openMarket();
            router.push("/terminal");
          }} />
          <NavButton label="MAP" onPress={() => router.push("/map" as never)} />
          <NavButton label="EMPIRE" onPress={() => router.push("/missions")} />
        </View>
      </View>

      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: 30,
            backgroundColor: tradeJuice?.kind === "loss"
              ? terminalColors.red
              : tradeJuice?.kind === "breakeven"
                ? terminalColors.amber
                : terminalColors.green,
          },
          tradeOverlayStyle,
        ]}
      />
      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: 31,
            borderWidth: resources.heat >= 90 ? 3 : 2,
            borderColor: terminalColors.red,
            backgroundColor: "rgba(255,59,59,0.18)",
          },
          dangerOverlayStyle,
        ]}
      />
      {tradeJuice && clock.nowMs - tradeJuice.createdAt < 2800 ? (
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: "absolute",
              top: 130,
              alignSelf: "center",
              zIndex: 32,
              borderWidth: 1,
              borderColor: tradeJuice.kind === "profit" ? terminalColors.green : tradeJuice.kind === "loss" ? terminalColors.red : terminalColors.amber,
              borderRadius: 0,
              backgroundColor: "rgba(5,7,13,0.92)",
              paddingHorizontal: 18,
              paddingVertical: 12,
              alignItems: "center",
            },
            tradeFloatStyle,
          ]}
        >
          <CyberText style={{ fontFamily: terminalFont, color: tradeJuice.kind === "profit" ? terminalColors.green : tradeJuice.kind === "loss" ? terminalColors.red : terminalColors.amber, fontSize: tradeJuice.bigWin ? 20 : 13, letterSpacing: 1 }}>
            {tradeJuice.bigWin ? "BIG WIN // " : ""}{tradeJuice.kind.toUpperCase()}
          </CyberText>
          <AnimatedNumber
            value={tradeJuice.pnl}
            formatter={(value) => `${value >= 0 ? "+" : ""}${value.toFixed(2)} 0BOL`}
            style={{ marginTop: 4, fontFamily: terminalFont, color: tradeJuice.kind === "profit" ? terminalColors.green : tradeJuice.kind === "loss" ? terminalColors.red : terminalColors.amber, fontSize: tradeJuice.bigWin ? 18 : 13 }}
          />
        </Animated.View>
      ) : null}
      {streakMoment ? (
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: "absolute",
              top: 210,
              alignSelf: "center",
              zIndex: 32,
              borderWidth: 1,
              borderColor: streakMoment === "gain" ? terminalColors.amber : terminalColors.red,
              borderRadius: 0,
              backgroundColor: "rgba(5,7,13,0.9)",
              paddingHorizontal: 16,
              paddingVertical: 9,
            },
            streakFloatStyle,
          ]}
        >
          <CyberText style={{ fontFamily: terminalFont, color: streakMoment === "gain" ? terminalColors.amber : terminalColors.red, fontSize: 12 }}>
            {streakMoment === "gain" ? `STREAK x${streak.multiplier.toFixed(2)}` : "STREAK BROKEN"}
          </CyberText>
        </Animated.View>
      ) : null}
      {courierMoment ? (
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: "absolute",
              top: 260,
              alignSelf: "center",
              zIndex: 32,
              borderWidth: 1,
              borderColor: courierMoment.tone === "success" ? terminalColors.green : terminalColors.red,
              borderRadius: 0,
              backgroundColor: "rgba(5,7,13,0.94)",
              paddingHorizontal: 18,
              paddingVertical: 12,
              alignItems: "center",
            },
            courierMomentStyle,
          ]}
        >
          <CyberText style={{ fontFamily: terminalFont, color: courierMoment.tone === "success" ? terminalColors.green : terminalColors.red, fontSize: 14 }}>
            {courierMoment.title}
          </CyberText>
          <CyberText style={{ marginTop: 4, fontFamily: terminalFont, color: terminalColors.text, fontSize: 11 }}>
            {courierMoment.body}
          </CyberText>
        </Animated.View>
      ) : null}

      <Modal visible={energyModal} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: terminalColors.modalBackdrop, alignItems: "center", justifyContent: "center", padding: 24 }}>
          <View style={{ width: "100%", maxWidth: 340, borderWidth: 1, borderColor: terminalColors.cyan, borderRadius: 0, backgroundColor: terminalColors.panel, padding: 18 }}>
            <CyberText style={{ fontFamily: terminalFont, color: terminalColors.text, fontSize: 16 }}>BUY ENERGY: 1h = 1,000 0BOL</CyberText>
            <CyberText style={{ fontFamily: terminalFont, color: terminalColors.amber, fontSize: 34, marginTop: 16 }}>{hours}h</CyberText>
            <View style={{ flexDirection: "row", gap: 10, marginTop: 16 }}>
              <ActionButton variant="muted" label="[ - ]" onPress={() => setHours((value) => Math.max(1, value - 1))} />
              <ActionButton variant="muted" label="[ + ]" onPress={() => setHours((value) => Math.min(24, value + 1))} />
            </View>
            <View style={{ marginTop: 14 }}>
              <ActionButton
                variant="primary"
                label="[ CONFIRM ENERGY ]"
                onPress={() => {
                  void purchaseEnergyHours(hours);
                  setEnergyModal(false);
                }}
              />
            </View>
            <Pressable onPress={() => setEnergyModal(false)} style={{ marginTop: 12, alignItems: "center" }}>
              <CyberText style={{ fontFamily: terminalFont, color: terminalColors.red, fontSize: 12 }}>[ CANCEL ]</CyberText>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal visible={travelModal} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: terminalColors.modalBackdrop, alignItems: "center", justifyContent: "center", padding: 24 }}>
          <View style={{ width: "100%", maxWidth: 360, borderWidth: 1, borderColor: terminalColors.cyan, borderRadius: 0, backgroundColor: terminalColors.panel, padding: 18 }}>
            <CyberText style={{ fontFamily: terminalFont, color: terminalColors.text, fontSize: 16 }}>MAP // TRAVEL ROUTES</CyberText>
            {travelling ? (
              <View style={{ marginTop: 10, borderWidth: 1, borderColor: terminalColors.amber, borderRadius: 0, padding: 10 }}>
                <CyberText style={{ fontFamily: terminalFont, color: terminalColors.amber, fontSize: 11 }}>
                  ACTIVE ROUTE // INSTANT ARRIVAL AVAILABLE
                </CyberText>
                <View style={{ marginTop: 8 }}>
                  <ActionButton
                    variant="amber"
                    label="[ INSTANT FOR 5 $OBOL (~$0.50 USD) ]"
                    onPress={() => {
                      void instantTravelWithObol();
                      setTravelModal(false);
                    }}
                  />
                </View>
              </View>
            ) : null}
            {getUnlockedLocations()
              .filter((location) => location.id !== world.currentLocationId)
              .map((location) => (
                <Pressable
                  key={location.id}
                  onPress={() => {
                    startTravel(location.id);
                    setTravelModal(false);
                  }}
                  style={{ marginTop: 10, borderWidth: 1, borderColor: terminalColors.borderDim, borderRadius: 0, padding: 12, backgroundColor: GLASS }}
                >
                  <CyberText style={{ fontFamily: terminalFont, color: terminalColors.cyan, fontSize: 14 }}>
                    {location.name.toUpperCase()} // {location.travelTime}m
                  </CyberText>
                  <CyberText style={{ marginTop: 3, fontFamily: terminalFont, color: terminalColors.muted, fontSize: 11 }}>
                    PRICE MOD x{location.priceMod.toFixed(2)}
                  </CyberText>
                </Pressable>
              ))}
            <Pressable onPress={() => setTravelModal(false)} style={{ marginTop: 12, alignItems: "center" }}>
              <CyberText style={{ fontFamily: terminalFont, color: terminalColors.red, fontSize: 12 }}>[ CANCEL ]</CyberText>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal visible={Boolean(tradeCommodity)} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: terminalColors.modalBackdrop, justifyContent: "flex-end", alignItems: "center" }}>
          <View style={{ width: frameWidth, maxWidth: 430, borderTopWidth: 1, borderLeftWidth: isWide ? 1 : 0, borderRightWidth: isWide ? 1 : 0, borderColor: terminalColors.cyan, borderTopLeftRadius: 0, borderTopRightRadius: 0, backgroundColor: terminalColors.glassStrong, padding: 18, shadowColor: terminalColors.cyan, shadowOpacity: 0.36, shadowRadius: 18 }}>
            {tradeCommodity ? (
              <>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                  <Image source={COMMODITY_ICON_MAP[tradeCommodity.ticker]} resizeMode="contain" style={{ width: 54, height: 54 }} />
                  <View style={{ flex: 1 }}>
                    <CyberText style={{ fontFamily: terminalFont, color: terminalColors.cyan, fontSize: 14 }}>{tradeCommodity.ticker}</CyberText>
                    <CyberText style={{ marginTop: 2, fontFamily: displayFont, color: terminalColors.text, fontSize: 18, fontWeight: "800" }}>{tradeCommodity.name}</CyberText>
                    <CyberText style={{ marginTop: 2, fontFamily: terminalFont, color: terminalColors.muted, fontSize: 11 }}>
                      OWNED {tradePosition?.quantity ?? 0} // AVG {tradePosition?.avgEntry?.toFixed(2) ?? "0.00"}
                    </CyberText>
                  </View>
                </View>

                <View style={{ flexDirection: "row", gap: 8, marginTop: 16 }}>
                  {(["BUY", "SELL"] as const).map((side) => (
                    <Pressable
                      key={side}
                      onPress={() => setTradeSide(side)}
                      style={{
                        flex: 1,
                        borderWidth: 1,
                        borderColor: tradeSide === side ? terminalColors.cyan : terminalColors.borderDim,
                        borderRadius: 0,
                        backgroundColor: tradeSide === side ? terminalColors.cyanFill : terminalColors.panel,
                        paddingVertical: 12,
                      }}
                    >
                      <CyberText style={{ fontFamily: terminalFont, color: tradeSide === side ? terminalColors.cyan : terminalColors.muted, textAlign: "center", fontSize: 14 }}>
                        {side}
                      </CyberText>
                    </Pressable>
                  ))}
                </View>

                <View style={{ flexDirection: "row", gap: 10, marginTop: 14 }}>
                  <TradeMetric label="PRICE" value={`${tradePrice.toFixed(2)} 0BOL`} color={terminalColors.text} />
                  <TradeMetric label="VALUE" value={`${tradeValue.toFixed(2)} 0BOL`} color={terminalColors.cyan} />
                </View>
                <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
                  <TradeMetric label="P/L PROJ" value={projectedPnl === null ? "ENTRY" : `${projectedPnl >= 0 ? "+" : ""}${projectedPnl.toFixed(2)}`} color={projectedPnl === null ? terminalColors.muted : projectedPnl >= 0 ? terminalColors.green : terminalColors.red} />
                  <TradeMetric label="RISK" value={`${tradeRisk} +${displayedHeatImpact}H`} color={riskColor(tradeRisk)} />
                </View>
                {streakRiskBonus > 0 ? (
                  <CyberText style={{ marginTop: 8, fontFamily: terminalFont, color: terminalColors.amber, fontSize: 11 }}>
                    STREAK x{streak.multiplier.toFixed(2)} // REWARD UP, SCANNER RISK +{streakRiskBonus}
                  </CyberText>
                ) : null}

                <CyberText style={{ marginTop: 14, fontFamily: terminalFont, color: terminalColors.muted, fontSize: 11 }}>QUANTITY</CyberText>
                <TextInput
                  value={String(tradeQuantity)}
                  onChangeText={(value) => setTradeQuantity(Number(value.replace(/[^0-9]/g, "")) || 1)}
                  keyboardType="number-pad"
                  style={{ height: 50, borderWidth: 1, borderColor: terminalColors.border, borderRadius: 0, color: terminalColors.text, fontFamily: terminalFont, paddingHorizontal: 14, marginTop: 6, fontSize: 18 }}
                />
                {tradeBlocked ? (
                  <CyberText style={{ marginTop: 10, fontFamily: terminalFont, color: terminalColors.red, fontSize: 11 }}>
                    TRADE BLOCKED // {travelling ? "TRAVELLING" : tradeBlockedByFlash ? "BLACKOUT" : district.state}
                  </CyberText>
                ) : null}

                <View style={{ marginTop: 16 }}>
                  <ActionButton
                    variant={tradeSide === "SELL" ? "amber" : "primary"}
                    glowing
                    disabled={!canExecuteTrade}
                    label={tradeSide === "BUY" ? "[ EXECUTE BUY ]" : "[ EXECUTE SALE ]"}
                    onPress={() => void executeTrade()}
                  />
                </View>
                <Pressable onPress={() => setTradeTicker(null)} style={{ marginTop: 12, alignItems: "center", paddingVertical: 8 }}>
                  <CyberText style={{ fontFamily: terminalFont, color: terminalColors.red, fontSize: 12 }}>[ CLOSE SHEET ]</CyberText>
                </Pressable>
              </>
            ) : null}
          </View>
        </View>
      </Modal>
    </View>
  );
}

function VitalCard({
  label,
  value,
  percent,
  color,
  tone,
  sub,
  danger = false,
  onPress,
}: {
  label: string;
  value: string;
  percent: number;
  color: string;
  tone: "cyan" | "red";
  sub?: string;
  danger?: boolean;
  onPress?: () => void;
}) {
  const Wrapper = onPress ? Pressable : View;
  return (
    <Wrapper onPress={onPress} style={{ flex: 1, alignItems: "center", borderWidth: 1, borderColor: color, borderRadius: 0, backgroundColor: terminalColors.glass, paddingVertical: 12, paddingHorizontal: 8, shadowColor: color, shadowOpacity: 0.28, shadowRadius: 16, elevation: 5 }}>
      <MetricRing label={label} value={percent} displayValue={value} tone={tone} size={106} active />
      {sub ? <CyberText style={{ marginTop: 8, fontFamily: displayFont, color: terminalColors.muted, fontSize: 10, textAlign: "center", textTransform: "uppercase" }}>{sub.toUpperCase()}</CyberText> : null}
      {danger ? (
        <CyberText style={{ marginTop: 5, fontFamily: terminalFont, color: terminalColors.red, fontSize: 9 }}>
          DANGER
        </CyberText>
      ) : null}
    </Wrapper>
  );
}

function GlassChip({ label, value, sub, color }: { label: string; value: string; sub?: string; color: string }) {
  return (
    <View style={{ flex: 1, borderWidth: 1, borderColor: terminalColors.borderDim, borderRadius: 0, backgroundColor: terminalColors.glass, padding: 12, shadowColor: color, shadowOpacity: 0.12, shadowRadius: 8 }}>
      <CyberText style={{ fontFamily: displayFont, color: terminalColors.muted, fontSize: 10, textTransform: "uppercase" }}>{label}</CyberText>
      {label === "0BOL" ? (
        <AnimatedNumber value={Number(value.replace(/[^0-9.-]/g, "")) || 0} style={{ marginTop: 5, fontFamily: terminalFont, color, fontSize: 19, fontVariant: ["tabular-nums"] }} />
      ) : (
        <CyberText style={{ marginTop: 5, fontFamily: displayFont, color, fontSize: 16, fontWeight: "700", fontVariant: ["tabular-nums"] }} numberOfLines={1}>{value}</CyberText>
      )}
      {sub ? <CyberText style={{ marginTop: 3, fontFamily: terminalFont, color: terminalColors.muted, fontSize: 9 }}>{sub}</CyberText> : null}
    </View>
  );
}

function MiniSignal({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={{ flex: 1, borderWidth: 1, borderColor: terminalColors.borderDim, borderRadius: 0, backgroundColor: "rgba(20,25,35,0.6)", padding: 10 }}>
      <CyberText style={{ fontFamily: displayFont, color, fontSize: 10, fontWeight: "800" }}>{label}</CyberText>
      <CyberText style={{ marginTop: 4, fontFamily: displayFont, color: terminalColors.text, fontSize: 12, lineHeight: 16 }} numberOfLines={2}>
        {value}
      </CyberText>
    </View>
  );
}

function PressureCard({
  label,
  value,
  detail,
  color,
  urgent = false,
}: {
  label: string;
  value: string;
  detail: string;
  color: string;
  urgent?: boolean;
}) {
  const pulse = useSharedValue(0);

  React.useEffect(() => {
    if (urgent) {
      pulse.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 420, easing: Easing.out(Easing.quad) }),
          withTiming(0, { duration: 560, easing: Easing.in(Easing.quad) }),
        ),
        -1,
        false,
      );
    } else {
      pulse.value = withTiming(0, { duration: 220 });
    }
  }, [pulse, urgent]);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: 0.82 + pulse.value * 0.14,
    transform: [{ scale: 1 + pulse.value * 0.008 }],
  }));

  return (
    <Animated.View style={[{ width: 112, minHeight: 86, borderWidth: 1, borderColor: color, borderRadius: 0, backgroundColor: terminalColors.glass, padding: 9, shadowColor: color, shadowOpacity: urgent ? 0.26 : 0.1, shadowRadius: urgent ? 12 : 5 }, pulseStyle]}>
      <CyberText style={{ fontFamily: displayFont, color: terminalColors.muted, fontSize: 9, textTransform: "uppercase" }}>{label}</CyberText>
      <CyberText style={{ marginTop: 7, fontFamily: terminalFont, color, fontSize: 18, fontVariant: ["tabular-nums"] }} numberOfLines={1}>
        {value}
      </CyberText>
      <CyberText style={{ marginTop: 6, fontFamily: displayFont, color: terminalColors.muted, fontSize: 10, lineHeight: 13 }} numberOfLines={2}>
        {detail}
      </CyberText>
    </Animated.View>
  );
}

function colorForReward(tone: string) {
  if (tone === "profit" || tone === "xp") {
    return terminalColors.green;
  }
  if (tone === "risk") {
    return terminalColors.red;
  }
  return terminalColors.cyan;
}

function SignalButton({ label, color, onPress }: { label: string; color: string; onPress: () => void }) {
  const isPrimary = label === "ACT ON SIGNAL";
  const isDanger = label === "REDUCE HEAT";
  const borderColor = isPrimary ? terminalColors.green : isDanger ? terminalColors.red : color;

  return (
    <Pressable
      onPress={onPress}
      style={{
        minHeight: isPrimary ? 52 : 48,
        minWidth: isPrimary ? 164 : 118,
        borderWidth: 1,
        borderColor,
        borderRadius: 0,
        paddingHorizontal: 18,
        paddingVertical: 12,
        backgroundColor: isPrimary ? terminalColors.greenFill : isDanger ? terminalColors.redFill : "rgba(255,255,255,0.04)",
        shadowColor: borderColor,
        shadowOpacity: isPrimary ? 0.46 : isDanger ? 0.28 : 0.12,
        shadowRadius: isPrimary ? 14 : 8,
        overflow: "hidden",
      }}
    >
      {isPrimary ? (
        <LinearGradient
          pointerEvents="none"
          colors={[terminalColors.green, terminalColors.cyan]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
        />
      ) : null}
      <CyberText style={{ fontFamily: displayFont, color: isPrimary ? terminalColors.background : borderColor, fontSize: 12, fontWeight: "800", textAlign: "center" }}>{label}</CyberText>
    </Pressable>
  );
}

function CommodityCard({
  ticker,
  name,
  price,
  changePercent,
  owned,
  onPress,
}: {
  ticker: string;
  name: string;
  price: number;
  changePercent: number;
  owned: number;
  onPress: () => void;
}) {
  const positive = changePercent > 0;
  const negative = changePercent < 0;
  const color = positive ? terminalColors.green : negative ? terminalColors.red : terminalColors.muted;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 104,
        borderWidth: 1,
        borderColor: pressed ? terminalColors.cyan : terminalColors.borderDim,
        borderRadius: 0,
        backgroundColor: pressed ? "rgba(0,229,255,0.14)" : terminalColors.glass,
        padding: 12,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        shadowColor: pressed ? terminalColors.cyan : color,
        shadowOpacity: pressed ? 0.34 : 0.12,
        shadowRadius: pressed ? 14 : 6,
        transform: [{ scale: pressed ? 1.02 : 1 }],
      })}
    >
      <View style={{ width: 58, height: 58, borderRadius: 0, backgroundColor: terminalColors.cyanFill, borderWidth: 1, borderColor: terminalColors.cyan, alignItems: "center", justifyContent: "center", shadowColor: terminalColors.cyan, shadowOpacity: 0.24, shadowRadius: 10 }}>
        <Image source={COMMODITY_ICON_MAP[ticker]} resizeMode="contain" style={{ width: 44, height: 44 }} />
      </View>
      <View style={{ flex: 1 }}>
        <CyberText style={{ fontFamily: displayFont, color: terminalColors.cyan, fontSize: 14, fontWeight: "800" }}>{ticker}</CyberText>
        <CyberText style={{ marginTop: 3, fontFamily: displayFont, color: terminalColors.text, fontSize: 15, fontWeight: "600" }} numberOfLines={1}>
          {name}
        </CyberText>
        <CyberText style={{ marginTop: 3, fontFamily: terminalFont, color: terminalColors.muted, fontSize: 10 }}>
          HELD {owned}
        </CyberText>
        <View style={{ marginTop: 8, height: 24 }}>
          <MiniGraph color={color} intensity={Math.max(0.6, Math.min(1.6, Math.abs(changePercent) / 4 + 0.6))} compact />
        </View>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <CyberText style={{ fontFamily: terminalFont, color: terminalColors.text, fontSize: 18, fontVariant: ["tabular-nums"] }}>{price.toFixed(2)}</CyberText>
        <CyberText style={{ marginTop: 5, fontFamily: terminalFont, color, fontSize: 12, fontVariant: ["tabular-nums"] }}>
          {positive ? "^" : negative ? "v" : "-"} {Math.abs(changePercent).toFixed(1)}%
        </CyberText>
      </View>
    </Pressable>
  );
}

function TradeMetric({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={{ flex: 1, borderWidth: 1, borderColor: terminalColors.borderDim, borderRadius: 0, backgroundColor: terminalColors.panel, padding: 10 }}>
      <CyberText style={{ fontFamily: terminalFont, color: terminalColors.muted, fontSize: 9 }}>{label}</CyberText>
      <CyberText style={{ marginTop: 5, fontFamily: terminalFont, color, fontSize: 13, fontVariant: ["tabular-nums"] }} numberOfLines={1}>{value}</CyberText>
    </View>
  );
}

function NavButton({ label, active = false, onPress }: { label: string; active?: boolean; onPress: () => void }) {
  const color = active ? terminalColors.green : label === "MAP" ? MAGENTA : terminalColors.cyan;
  return (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1,
        height: 52,
        borderWidth: 1,
        borderColor: active ? terminalColors.green : terminalColors.borderDim,
        borderRadius: 0,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: active ? terminalColors.greenFill : terminalColors.glass,
        shadowColor: color,
        shadowOpacity: active ? 0.42 : 0.08,
        shadowRadius: active ? 14 : 6,
        overflow: "hidden",
      }}
    >
      {active ? (
        <LinearGradient
          pointerEvents="none"
          colors={["rgba(0,255,178,0.28)", "rgba(0,229,255,0.16)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
        />
      ) : null}
      <CyberText style={{ fontFamily: displayFont, color, fontSize: 13, fontWeight: "800", letterSpacing: 1 }}>{label}</CyberText>
    </Pressable>
  );
}

function MiniGraph({ color, intensity = 1, compact = false }: { color: string; intensity?: number; compact?: boolean }) {
  const height = compact ? 24 : 42;
  const points = Array.from({ length: 9 }).map((_, index) => {
    const x = (index / 8) * 100;
    const wave = Math.sin(index * 1.45) * 5 * intensity;
    const trend = height - 7 - (index / 8) * 17 * intensity;
    return `${x.toFixed(1)},${Math.max(3, Math.min(height - 3, trend + wave)).toFixed(1)}`;
  }).join(" ");

  return (
    <Svg width="100%" height={height} viewBox={`0 0 100 ${height}`}>
      <Polyline points={points} fill="none" stroke={color} strokeWidth={compact ? 2 : 2.4} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
