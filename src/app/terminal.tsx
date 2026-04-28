import * as React from "react";
import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import { Platform, Pressable, ScrollView, TextInput, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import ActionButton from "@/components/action-button";
import AnimatedNumber from "@/components/animated-number";
import ChartSparkline from "@/components/chart-sparkline";
import CommodityRow from "@/components/commodity-row";
import ConfirmModal from "@/components/confirm-modal";
import { MetricRing } from "@/components/metric-ring";
import NeonBorder from "@/components/neon-border";
import OpportunityRail from "@/components/opportunity-rail";
import ProgressRail from "@/components/progress-rail";
import RiskRail from "@/components/risk-rail";
import { getLocation } from "@/data/locations";
import { getActiveDistrictState, isDistrictBuyRestricted, isDistrictSellRestricted } from "@/engine/district-state";
import { DEMO_COMMODITIES, getTradeEnergyCost, getValueBasedTradeHeatDelta, roundCurrency } from "@/engine/demo-market";
import { isTradingBlockedByFlash } from "@/engine/flash-events";
import { getNextStreakTarget, getStreakRiskHeatBonus } from "@/engine/pressure";
import { useDemoBootstrap } from "@/hooks/use-demo-bootstrap";
import { useDemoStore } from "@/state/demo-store";
import { terminalColors, terminalFont } from "@/theme/terminal";
import CyberText from "@/components/cyber-text";

function pct(change: number, price: number) {
  return price ? (change / Math.max(1, price - change)) * 100 : 0;
}

function formatCountdown(expiresAt: number | null, nowMs: number): string {
  if (!expiresAt) {
    return "LIVE";
  }
  if (!Number.isFinite(expiresAt)) {
    return "OPEN ENDED";
  }
  const totalSeconds = Math.max(0, Math.ceil((expiresAt - nowMs) / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function TerminalRoute() {
  useDemoBootstrap();
  const params = useLocalSearchParams<{ ticker?: string }>();
  const scrollRef = React.useRef<ScrollView>(null);
  const selectedTicker = useDemoStore((state) => state.selectedTicker);
  const selectTicker = useDemoStore((state) => state.selectTicker);
  const prices = useDemoStore((state) => state.prices);
  const changes = useDemoStore((state) => state.changes);
  const priceHistory = useDemoStore((state) => state.priceHistory);
  const balance = useDemoStore((state) => state.balanceObol);
  const positions = useDemoStore((state) => state.positions);
  const activeNews = useDemoStore((state) => state.activeNews);
  const world = useDemoStore((state) => state.world);
  const clock = useDemoStore((state) => state.clock);
  const activeFlashEvent = useDemoStore((state) => state.activeFlashEvent);
  const pendingMission = useDemoStore((state) => state.pendingMission);
  const activeMission = useDemoStore((state) => state.activeMission);
  const marketWhispers = useDemoStore((state) => state.marketWhispers);
  const pantheonShard = useDemoStore((state) => state.pantheonShard);
  const districtStates = useDemoStore((state) => state.districtStates);
  const tradeJuice = useDemoStore((state) => state.tradeJuice);
  const resources = useDemoStore((state) => state.resources);
  const bounty = useDemoStore((state) => state.bounty);
  const playerRiskProfile = useDemoStore((state) => state.playerRiskProfile);
  const progression = useDemoStore((state) => state.progression);
  const streak = useDemoStore((state) => state.streak);
  const missedPeakLog = useDemoStore((state) => state.missedPeakLog);
  const heatWarning = useDemoStore((state) => state.heatWarning);
  const decisionContext = useDemoStore((state) => state.decisionContext);
  const orderSize = useDemoStore((state) => state.orderSize);
  const setOrderSize = useDemoStore((state) => state.setOrderSize);
  const buySelected = useDemoStore((state) => state.buySelected);
  const sellSelected = useDemoStore((state) => state.sellSelected);
  const goHome = useDemoStore((state) => state.goHome);
  const isBusy = useDemoStore((state) => state.isBusy);
  const systemMessage = useDemoStore((state) => state.systemMessage);
  const [side, setSide] = React.useState<"BUY" | "SELL">("BUY");
  const [confirmVisible, setConfirmVisible] = React.useState(false);
  const [positionsOpen, setPositionsOpen] = React.useState(true);
  const [flash, setFlash] = React.useState<"success" | "failure" | null>(null);
  const tradePulse = useSharedValue(0);
  const shakeOffset = useSharedValue(0);
  const heatPulse = useSharedValue(0);
  const signalBreath = useSharedValue(0);

  React.useEffect(() => {
    if (params.ticker) {
      selectTicker(String(params.ticker));
    }
  }, [params.ticker, selectTicker]);

  const commodity = (DEMO_COMMODITIES.find((item) => item.ticker === selectedTicker) ?? DEMO_COMMODITIES[0])!;
  const price = prices[commodity.ticker] ?? commodity.basePrice;
  const position = positions[commodity.ticker];
  const maxBuy = Math.max(1, Math.floor(balance / price));
  const maxSell = position?.quantity ?? 0;
  const maxQty = side === "BUY" ? maxBuy : Math.max(1, maxSell);
  const cost = roundCurrency(price * orderSize);
  const heatDelta = getValueBasedTradeHeatDelta(commodity.ticker, cost) + getStreakRiskHeatBonus(streak);
  const streakTarget = getNextStreakTarget(streak.count);
  const energyCost = getTradeEnergyCost(side, orderSize);
  const currentLocation = getLocation(world.currentLocationId);
  const travelling = Boolean(world.travelDestinationId && world.travelEndTime && world.travelEndTime > clock.nowMs);
  const destination = getLocation(world.travelDestinationId);
  const district = getActiveDistrictState(districtStates, world.currentLocationId, clock.nowMs);
  const districtBlocked = side === "BUY" ? isDistrictBuyRestricted(district.state) : isDistrictSellRestricted(district.state);
  const flashBlocked = isTradingBlockedByFlash(activeFlashEvent, world.currentLocationId);
  const tradeBlocked = travelling || districtBlocked || flashBlocked;
  const remainingMs = world.travelEndTime ? Math.max(0, world.travelEndTime - clock.nowMs) : 0;
  const etaMinutes = Math.floor(remainingMs / 60_000);
  const etaSeconds = Math.floor((remainingMs % 60_000) / 1000);
  const energyHours = Math.floor(resources.energySeconds / 3600);
  const energyPercent = Math.min(100, Math.round((resources.energySeconds / (72 * 3600)) * 100));
  const signalCountdown = formatCountdown(decisionContext.expiresAt, clock.nowMs);
  const signalColor = decisionContext.urgency === "critical"
    ? terminalColors.red
    : decisionContext.urgency === "high"
      ? terminalColors.amber
      : terminalColors.yellow;

  React.useEffect(() => {
    if (!tradeJuice || clock.nowMs - tradeJuice.createdAt > 2500) {
      return;
    }
    if (Platform.OS === "web") {
      return;
    }

    const type = tradeJuice.kind === "profit"
      ? Haptics.NotificationFeedbackType.Success
      : tradeJuice.kind === "loss"
        ? Haptics.NotificationFeedbackType.Error
        : Haptics.NotificationFeedbackType.Warning;
    void Haptics.notificationAsync(type);
  }, [clock.nowMs, tradeJuice]);

  React.useEffect(() => {
    if (!tradeJuice || Date.now() - tradeJuice.createdAt > 5_000) {
      return;
    }
    tradePulse.value = withSequence(
      withTiming(1, { duration: 110, easing: Easing.out(Easing.quad) }),
      withTiming(0, { duration: 900, easing: Easing.out(Easing.cubic) }),
    );
    if (tradeJuice.kind === "loss") {
      shakeOffset.value = withSequence(
        withTiming(-4, { duration: 34 }),
        withTiming(4, { duration: 34 }),
        withTiming(-3, { duration: 34 }),
        withTiming(2, { duration: 34 }),
        withTiming(0, { duration: 60 }),
      );
    }
  }, [shakeOffset, tradeJuice?.createdAt, tradeJuice?.kind, tradePulse]);

  React.useEffect(() => {
    if (!heatWarning || clock.nowMs - heatWarning.createdAt > 2500 || Platform.OS === "web") {
      return;
    }
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  }, [clock.nowMs, heatWarning]);

  React.useEffect(() => {
    if (!heatWarning || clock.nowMs - heatWarning.createdAt > 2500) {
      return;
    }
    heatPulse.value = withSequence(
      withTiming(1, { duration: 110, easing: Easing.out(Easing.quad) }),
      withTiming(0, { duration: 760, easing: Easing.out(Easing.cubic) }),
    );
  }, [clock.nowMs, heatPulse, heatWarning]);

  React.useEffect(() => {
    signalBreath.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2400, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 2600, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      false,
    );
  }, [signalBreath]);

  const orderShakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeOffset.value }],
  }));

  const tradeScreenFlashStyle = useAnimatedStyle(() => ({
    opacity: tradePulse.value * 0.28,
  }));

  const tradeFeedbackFloatStyle = useAnimatedStyle(() => ({
    opacity: tradePulse.value,
    transform: [
      { translateY: -14 * tradePulse.value },
      { scale: 0.94 + tradePulse.value * 0.14 },
    ],
  }));

  const heatFlashStyle = useAnimatedStyle(() => ({
    opacity: Math.min(0.32, heatPulse.value * 0.28 + (resources.heat >= 90 ? 0.16 : 0)),
  }));

  const terminalSignalStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + signalBreath.value * 0.004 }],
    shadowOpacity: 0.24 + signalBreath.value * 0.12,
    shadowRadius: 16 + signalBreath.value * 8,
  }));

  const execute = async () => {
    setConfirmVisible(false);
    if (side === "BUY") {
      await buySelected();
    } else {
      await sellSelected();
    }
    setFlash("success");
    setTimeout(() => setFlash(null), 700);
  };

  const handleSelectPosition = (held: NonNullable<(typeof positions)[string]>) => {
    selectTicker(held.ticker);
    setSide("SELL");
    setOrderSize(held.quantity);
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ y: 520, animated: true });
    });
  };

  const followSignal = () => {
    const action = decisionContext.recommendedAction;
    if (action.ticker) {
      selectTicker(action.ticker);
    }

    switch (action.actionType) {
      case "mission":
        router.push("/missions");
        return;
      case "claim":
      case "courier":
        router.push("/menu/inventory");
        return;
      case "challenge":
      case "rank":
        router.push("/menu/progression");
        return;
      case "plan":
        router.push("/map" as never);
        return;
      case "travel":
      case "reduce_heat":
        router.push("/home");
        return;
      case "trade":
        if (!action.ticker) {
          setFlash("success");
          setTimeout(() => setFlash(null), 700);
        }
        return;
      default:
        router.push("/home");
    }
  };

  return (
    <ScrollView ref={scrollRef} contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ padding: 14, paddingBottom: 40, backgroundColor: "transparent" }}>
      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: 7,
            backgroundColor: tradeJuice?.kind === "loss"
              ? terminalColors.red
              : tradeJuice?.kind === "breakeven"
                ? terminalColors.amber
                : terminalColors.green,
          },
          tradeScreenFlashStyle,
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
            zIndex: 8,
            borderWidth: resources.heat >= 90 ? 3 : 2,
            borderColor: terminalColors.red,
            backgroundColor: "rgba(255,59,59,0.18)",
          },
          heatFlashStyle,
        ]}
      />
      {resources.heat >= 90 ? (
        <View pointerEvents="none" style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, borderWidth: 2, borderColor: terminalColors.red, opacity: 0.35, zIndex: 5 }} />
      ) : null}
      {heatWarning && clock.nowMs - heatWarning.createdAt < 1800 ? (
        <View pointerEvents="none" style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, borderWidth: 2, borderColor: terminalColors.red, zIndex: 6 }} />
      ) : null}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
        <Pressable
          onPress={() => {
            goHome();
            router.replace("/home");
          }}
          style={{ paddingVertical: 8, paddingRight: 16 }}
        >
          <CyberText style={{ fontFamily: terminalFont, color: terminalColors.muted, fontSize: 12 }}>{"\u2190"} HOME</CyberText>
        </Pressable>
        <View style={{ flex: 1, alignItems: "flex-end" }}>
          <CyberText style={{ fontFamily: terminalFont, color: terminalColors.systemGreen, fontSize: 16 }}>S1LKROAD 4.0</CyberText>
          <CyberText style={{ fontFamily: terminalFont, color: terminalColors.muted, fontSize: 10 }}>NODE: {currentLocation.name.toUpperCase()}</CyberText>
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: 12, marginBottom: 14, alignItems: "center" }}>
        <MetricRing label="ENERGY" value={energyPercent} displayValue={`${energyHours}h`} tone="cyan" size={96} />
        <MetricRing label="HEAT" value={resources.heat} displayValue={`${resources.heat}%`} tone="red" size={96} active={resources.heat >= 25} />
        <View style={{ flex: 1, borderWidth: 1, borderColor: terminalColors.borderDim, borderRadius: 0, backgroundColor: terminalColors.glass, padding: 12 }}>
          <CyberText style={{ fontFamily: terminalFont, color: terminalColors.purple, fontSize: 10, letterSpacing: 1.2 }}>STATE</CyberText>
          <CyberText style={{ marginTop: 5, fontFamily: terminalFont, color: terminalColors.text, fontSize: 15 }} numberOfLines={2}>
            {currentLocation.name.toUpperCase()}
          </CyberText>
          <CyberText style={{ marginTop: 5, fontFamily: terminalFont, color: terminalColors.muted, fontSize: 10 }}>
            {bounty.status} // {district.state}
          </CyberText>
        </View>
      </View>

      <Animated.View style={[{ marginBottom: 14, shadowColor: signalColor }, terminalSignalStyle]}>
        <Pressable
          onPress={followSignal}
          style={{
            borderWidth: 1,
            borderColor: signalColor,
            borderRadius: 0,
            backgroundColor: terminalColors.glassStrong,
            padding: 16,
            overflow: "hidden",
          }}
        >
          <LinearGradient
            pointerEvents="none"
            colors={["rgba(255,200,87,0.16)", "rgba(0,229,255,0.05)", "rgba(138,124,255,0.06)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
          />
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <CyberText style={{ flex: 1, fontFamily: terminalFont, color: terminalColors.yellow, fontSize: 11, letterSpacing: 1.3 }}>
              PRIMARY SIGNAL
            </CyberText>
            <CyberText style={{ fontFamily: terminalFont, color: signalColor, fontSize: 22, fontVariant: ["tabular-nums"] }}>
              {signalCountdown}
            </CyberText>
          </View>
          <CyberText style={{ marginTop: 10, fontFamily: terminalFont, color: terminalColors.text, fontSize: 22, lineHeight: 28 }}>
            {decisionContext.recommendedAction.title.toUpperCase()}
          </CyberText>
          <CyberText style={{ marginTop: 7, fontFamily: terminalFont, color: terminalColors.muted, fontSize: 12, lineHeight: 17 }}>
            {decisionContext.recommendedAction.description}
          </CyberText>
          <View style={{ marginTop: 12 }}>
            <ActionButton variant="primary" glowing label="[ ACT ON SIGNAL ]" onPress={followSignal} />
          </View>
        </Pressable>
      </Animated.View>

      {travelling ? (
        <NeonBorder style={{ marginBottom: 12 }}>
          <CyberText style={{ fontFamily: terminalFont, color: terminalColors.amber, fontSize: 12 }}>
            TRAVELLING TO {destination.name.toUpperCase()}... ETA {etaMinutes}m {etaSeconds}s
          </CyberText>
          <CyberText style={{ marginTop: 6, fontFamily: terminalFont, color: terminalColors.muted, fontSize: 10 }}>
            TRADING LOCKED UNTIL ARRIVAL
          </CyberText>
        </NeonBorder>
      ) : null}

      {districtBlocked || flashBlocked ? (
        <NeonBorder style={{ marginBottom: 12 }}>
          <CyberText style={{ fontFamily: terminalFont, color: terminalColors.red, fontSize: 12 }}>
            MARKET LOCKED // {flashBlocked ? "DISTRICT BLACKOUT" : district.state}
          </CyberText>
          <CyberText style={{ marginTop: 6, fontFamily: terminalFont, color: terminalColors.muted, fontSize: 10 }}>
            TRAVEL AWAY OR WAIT FOR STATE CLEARANCE
          </CyberText>
        </NeonBorder>
      ) : null}

      <OpportunityRail
        flashEvent={activeFlashEvent}
        pendingMission={pendingMission}
        activeMission={activeMission}
        shard={pantheonShard}
        whispers={marketWhispers}
        nowMs={clock.nowMs}
      />
      <RiskRail resources={resources} bounty={bounty} district={district} riskProfile={playerRiskProfile} />
      <ProgressRail progression={progression} streak={streak} />

      <View style={{ marginTop: 14 }}>
        <ChartSparkline data={priceHistory[commodity.ticker] ?? [price]} averageEntry={position?.avgEntry} />
      </View>

      <Animated.View style={orderShakeStyle}>
        <NeonBorder
          active
          style={{
            marginTop: 16,
            borderColor: tradeJuice && clock.nowMs - tradeJuice.createdAt < 1500
              ? tradeJuice.kind === "profit"
                ? terminalColors.green
                : tradeJuice.kind === "loss"
                  ? terminalColors.red
                  : terminalColors.amber
            : undefined,
          }}
        >
        <CyberText style={{ fontFamily: terminalFont, color: terminalColors.green, fontSize: 12, letterSpacing: 1.3 }}>
          ACTION // EXECUTE TRADE
        </CyberText>
        <CyberText style={{ marginTop: 4, marginBottom: 12, fontFamily: terminalFont, color: terminalColors.muted, fontSize: 10 }}>
          {commodity.name.toUpperCase()} // {currentLocation.name.toUpperCase()}
        </CyberText>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {(["BUY", "SELL"] as const).map((ticketSide) => (
            <Pressable
              key={ticketSide}
              onPress={() => setSide(ticketSide)}
              style={{ flex: 1, borderWidth: 1, borderColor: side === ticketSide ? terminalColors.cyan : terminalColors.borderDim, padding: 10 }}
            >
              <CyberText style={{ fontFamily: terminalFont, color: side === ticketSide ? terminalColors.cyan : terminalColors.muted, textAlign: "center", fontSize: 12 }}>
                {ticketSide} [{commodity.ticker}]
              </CyberText>
            </Pressable>
          ))}
        </View>
        <AnimatedNumber
          value={price}
          formatter={(value) => `${value.toFixed(2)} 0BOL`}
          style={{ marginTop: 16, fontFamily: terminalFont, color: terminalColors.text, fontSize: 30, fontVariant: ["tabular-nums"] }}
        />
        <CyberText style={{ marginTop: 10, fontFamily: terminalFont, color: terminalColors.muted, fontSize: 11 }}>QUANTITY</CyberText>
        <TextInput
          value={String(orderSize)}
          onChangeText={(value) => setOrderSize(Number(value.replace(/[^0-9]/g, "")) || 1)}
          keyboardType="number-pad"
          style={{ height: 44, borderWidth: 1, borderColor: terminalColors.border, color: terminalColors.text, fontFamily: terminalFont, paddingHorizontal: 12, marginTop: 6 }}
        />
        <View style={{ flexDirection: "row", gap: 6, marginTop: 10 }}>
          {[0.25, 0.5, 0.75, 1].map((portion) => (
            <Pressable key={portion} onPress={() => setOrderSize(Math.max(1, Math.floor(maxQty * portion)))} style={{ flex: 1, borderWidth: 1, borderColor: terminalColors.borderDim, padding: 8 }}>
              <CyberText style={{ fontFamily: terminalFont, color: terminalColors.muted, fontSize: 11, textAlign: "center" }}>{Math.round(portion * 100)}%</CyberText>
            </Pressable>
          ))}
        </View>
        <View style={{ marginTop: 14, gap: 4 }}>
          <CyberText style={{ fontFamily: terminalFont, color: terminalColors.muted, fontSize: 11, fontVariant: ["tabular-nums"] }}>EST COST: {cost.toFixed(2)} 0BOL</CyberText>
          <CyberText style={{ fontFamily: terminalFont, color: terminalColors.amber, fontSize: 11, fontVariant: ["tabular-nums"] }}>HEAT DELTA: +{heatDelta}</CyberText>
          <CyberText style={{ fontFamily: terminalFont, color: terminalColors.systemGreen, fontSize: 11, fontVariant: ["tabular-nums"] }}>ENERGY COST: {energyCost}s</CyberText>
        </View>
        <View style={{ marginTop: 16 }}>
          <ActionButton
            variant="primary"
            glowing
            label="[ EXECUTE ]"
            disabled={tradeBlocked || isBusy || (side === "SELL" && maxSell <= 0)}
            onPress={() => setConfirmVisible(true)}
          />
        </View>
        </NeonBorder>
      </Animated.View>

      {tradeJuice && clock.nowMs - tradeJuice.createdAt < 2500 ? (
        <Animated.View style={[{ marginTop: 10, alignItems: "center" }, tradeFeedbackFloatStyle]}>
          <CyberText
            style={{
              fontFamily: terminalFont,
              color: tradeJuice.kind === "profit" ? terminalColors.green : tradeJuice.kind === "loss" ? terminalColors.red : terminalColors.amber,
              fontSize: tradeJuice.bigWin ? 18 : 12,
              textAlign: "center",
            }}
          >
            {tradeJuice.bigWin ? "BIG WIN // " : ""}
            {tradeJuice.kind.toUpperCase()}
          </CyberText>
          <AnimatedNumber
            value={tradeJuice.pnl}
            formatter={(value) => `${value >= 0 ? "+" : ""}${value.toFixed(2)} 0BOL`}
            style={{
              marginTop: 3,
              fontFamily: terminalFont,
              color: tradeJuice.kind === "profit" ? terminalColors.green : tradeJuice.kind === "loss" ? terminalColors.red : terminalColors.amber,
              fontSize: tradeJuice.bigWin ? 18 : 12,
              textAlign: "center",
              fontVariant: ["tabular-nums"],
            }}
          />
          {tradeJuice.kind === "profit" && streak.count >= 2 ? (
            <CyberText style={{ marginTop: 5, fontFamily: terminalFont, color: terminalColors.amber, fontSize: 10, textAlign: "center" }}>
              Don't break the streak. {streakTarget.tradesNeeded} more for {streakTarget.title}.
            </CyberText>
          ) : null}
        </Animated.View>
      ) : null}

      {flash ? (
        <CyberText style={{ marginTop: 10, fontFamily: terminalFont, color: flash === "success" ? terminalColors.green : terminalColors.red, fontSize: 11, textAlign: "center" }}>
          {flash === "success" ? "TRADE ACKNOWLEDGED" : "TRADE REJECTED"}
        </CyberText>
      ) : null}
      {missedPeakLog[0] ? (
        <NeonBorder style={{ marginTop: 12 }}>
          <CyberText style={{ fontFamily: terminalFont, color: terminalColors.amber, fontSize: 12 }}>
            MISSED PEAK // {missedPeakLog[0].ticker}
          </CyberText>
          <CyberText style={{ marginTop: 5, fontFamily: terminalFont, color: terminalColors.muted, fontSize: 10 }}>
            {missedPeakLog[0].ticker} HIT {missedPeakLog[0].peakPrice.toFixed(2)} EARLIER // MISSED +{missedPeakLog[0].missedValue.toFixed(2)} 0BOL
          </CyberText>
        </NeonBorder>
      ) : null}
      <CyberText style={{ marginTop: 10, fontFamily: terminalFont, color: terminalColors.muted, fontSize: 10 }}>{systemMessage}</CyberText>

      <NeonBorder active style={{ marginTop: 16 }}>
        <CyberText style={{ fontFamily: terminalFont, color: terminalColors.cyan, fontSize: 12, letterSpacing: 1.2 }}>DATA // MARKET CARDS</CyberText>
        <CyberText style={{ marginTop: 4, marginBottom: 10, fontFamily: terminalFont, color: terminalColors.muted, fontSize: 10 }}>
          TAP A COMMODITY TO LOAD THE ACTION DECK
        </CyberText>
        {DEMO_COMMODITIES.map((item, index) => {
          const itemPrice = prices[item.ticker] ?? item.basePrice;
          return (
            <CommodityRow
              key={item.ticker}
              ticker={item.ticker}
              name={item.name}
              price={itemPrice}
              changePercent={pct(changes[item.ticker] ?? 0, itemPrice)}
              index={index}
              isSelected={item.ticker === commodity.ticker}
              onPress={() => selectTicker(item.ticker)}
            />
          );
        })}
      </NeonBorder>

      <NeonBorder style={{ marginTop: 16 }}>
        <Pressable onPress={() => setPositionsOpen((value) => !value)} style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <CyberText style={{ fontFamily: terminalFont, color: terminalColors.cyan, fontSize: 12 }}>OPEN POSITIONS</CyberText>
          <CyberText style={{ fontFamily: terminalFont, color: terminalColors.muted, fontSize: 12 }}>{positionsOpen ? "v" : ">"}</CyberText>
        </Pressable>
        {positionsOpen ? (
          Object.values(positions).length ? (
            Object.values(positions).map((held) => {
              const current = prices[held.ticker] ?? held.avgEntry;
              const pnl = roundCurrency((current - held.avgEntry) * held.quantity + held.realizedPnl);
              return (
                <Pressable
                  key={held.id}
                  onPress={() => handleSelectPosition(held)}
                  style={{ marginTop: 10, borderTopWidth: 1, borderTopColor: terminalColors.borderDim, paddingTop: 10 }}
                >
                  <CyberText style={{ fontFamily: terminalFont, color: terminalColors.text, fontSize: 11 }}>
                    {held.ticker} QTY {held.quantity} AVG {held.avgEntry.toFixed(2)} NOW {current.toFixed(2)} PNL {pnl.toFixed(2)}
                  </CyberText>
                </Pressable>
              );
            })
          ) : (
            <CyberText style={{ marginTop: 10, fontFamily: terminalFont, color: terminalColors.dim, fontSize: 11 }}>NO OPEN POSITIONS</CyberText>
          )
        ) : null}
      </NeonBorder>

      <NeonBorder style={{ marginTop: 16 }}>
        <CyberText style={{ fontFamily: terminalFont, color: terminalColors.amber, fontSize: 12 }}>NEWS FEED</CyberText>
        {(activeNews.length
          ? activeNews.slice(0, 5)
          : [{ id: "quiet", headline: "NO SIGNALS. MARKET HUM IS CLEAN.", affectedTickers: [], credibility: 1, priceMultiplier: 1, tickPublished: 0, tickExpires: 0 }]
        ).map((news) => (
          <View key={news.id} style={{ marginTop: 10 }}>
            <CyberText style={{ fontFamily: terminalFont, color: terminalColors.amber, fontSize: 12 }}>{news.headline}</CyberText>
            <CyberText style={{ fontFamily: terminalFont, color: terminalColors.muted, fontSize: 10 }}>
              {news.affectedTickers.join(" ")} // CRED {Math.round(news.credibility * 100)}%
            </CyberText>
          </View>
        ))}
      </NeonBorder>

      <ConfirmModal
        visible={confirmVisible}
        message={`${side} ${orderSize} ${commodity.ticker} @ ${price.toFixed(2)} 0BOL?`}
        onConfirm={execute}
        onCancel={() => setConfirmVisible(false)}
      />
    </ScrollView>
  );
}
