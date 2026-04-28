import * as React from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import type { RankSnapshot, TradeStreak } from "@/engine/types";
import { terminalColors, terminalFont } from "@/theme/terminal";
import CyberText from "@/components/cyber-text";

interface ProgressRailProps {
  progression: RankSnapshot;
  streak: TradeStreak;
  isNearWin?: boolean;
}

export default function ProgressRail({ progression, streak, isNearWin = false }: ProgressRailProps) {
  const pulse = useSharedValue(0);
  const nextXp = progression.nextXpRequired === null
    ? 0
    : Math.max(0, progression.nextXpRequired - progression.xp);
  const progressPercent = progression.nextXpRequired === null
    ? 100
    : Math.round(((progression.xp - progression.xpRequired) / Math.max(1, progression.nextXpRequired - progression.xpRequired)) * 100);
  React.useEffect(() => {
    pulse.value = isNearWin
      ? withRepeat(withSequence(withTiming(1, { duration: 700 }), withTiming(0, { duration: 700 })), -1, true)
      : withTiming(0, { duration: 250 });
  }, [isNearWin, pulse]);
  const railStyle = useAnimatedStyle(() => ({
    borderColor: isNearWin ? terminalColors.amber : terminalColors.cyan,
    shadowColor: terminalColors.amber,
    shadowOpacity: isNearWin ? 0.18 + pulse.value * 0.34 : 0,
    shadowRadius: isNearWin ? 8 + pulse.value * 8 : 0,
  }));
  const fillStyle = useAnimatedStyle(() => ({
    backgroundColor: isNearWin ? terminalColors.amber : terminalColors.cyan,
    opacity: isNearWin ? 0.78 + pulse.value * 0.22 : 1,
  }));

  return (
    <Animated.View style={[{ marginTop: 12, marginHorizontal: 12, borderWidth: 1, backgroundColor: terminalColors.panel, padding: 10 }, railStyle]}>
      <CyberText style={{ fontFamily: terminalFont, color: terminalColors.muted, fontSize: 9, letterSpacing: 1.4 }}>
        PROGRESS RAIL
      </CyberText>
      <CyberText style={{ marginTop: 7, fontFamily: terminalFont, color: terminalColors.cyan, fontSize: 12 }}>
        RANK: {progression.title} {"->"} {progression.nextXpRequired === null ? "MAX" : `${nextXp} XP UNTIL NEXT`}
      </CyberText>
      <View style={{ height: 5, backgroundColor: terminalColors.borderDim, marginTop: 7 }}>
        <Animated.View style={[{ height: 5, width: `${Math.max(0, Math.min(100, progressPercent))}%` }, fillStyle]} />
      </View>
      <CyberText style={{ marginTop: 7, fontFamily: terminalFont, color: streak.count >= 5 ? terminalColors.amber : terminalColors.green, fontSize: 11 }}>
        STREAK BEST: {streak.record} TRADES // CURRENT: {streak.count} // {nextStreakThreshold(streak.count)}
      </CyberText>
    </Animated.View>
  );
}

function nextStreakThreshold(count: number): string {
  const thresholds = [
    { count: 2, label: "+3% XP" },
    { count: 3, label: "+5% XP" },
    { count: 5, label: "+8% XP" },
    { count: 7, label: "+12% XP" },
    { count: 10, label: "+15% XP" },
    { count: 15, label: "+20% XP" },
  ];
  const next = thresholds.find((threshold) => count < threshold.count);
  return next ? `${next.count - count} MORE FOR ${next.label}` : "MAX STREAK BONUS ACTIVE";
}

export { ProgressRail };
