import { View } from "react-native";
import type { TradeStreak } from "@/engine/types";
import { terminalColors, terminalFont } from "@/theme/terminal";
import CyberText from "@/components/cyber-text";

interface StreakDisplayProps {
  streak: TradeStreak;
  nowMs: number;
}

export default function StreakDisplay({ streak, nowMs }: StreakDisplayProps) {
  const remainingMs = Math.max(0, (streak.expiresAt ?? nowMs) - nowMs);
  const remainingMinutes = Math.floor(remainingMs / 60_000);
  const remainingSeconds = Math.floor((remainingMs % 60_000) / 1000);
  const color = streak.count >= 5 ? terminalColors.amber : streak.count > 0 ? terminalColors.cyan : terminalColors.muted;
  const glow = streak.count >= 10 ? 0.8 : streak.count >= 5 ? 0.5 : 0.2;
  const nextReward = getNextReward(streak.count);

  return (
    <View
      style={{
        marginTop: 14,
        marginHorizontal: 12,
        borderWidth: 1,
        borderColor: color,
        backgroundColor: terminalColors.panel,
        padding: 10,
        shadowColor: color,
        shadowOpacity: glow,
        shadowRadius: 10,
      }}
    >
      <CyberText style={{ fontFamily: terminalFont, color, fontSize: 13 }}>
        STREAK: {streak.count} FIRE // XP x{streak.multiplier.toFixed(1)}
      </CyberText>
      <CyberText style={{ marginTop: 4, fontFamily: terminalFont, color: terminalColors.muted, fontSize: 10 }}>
        PROFIT AGAIN IN {remainingMinutes}m {remainingSeconds}s OR THE CHAIN BREAKS
      </CyberText>
      <CyberText style={{ marginTop: 4, fontFamily: terminalFont, color: terminalColors.green, fontSize: 10 }}>
        BEST: {streak.record} TRADES // CURRENT: {streak.count} // {nextReward}
      </CyberText>
    </View>
  );
}

function getNextReward(count: number): string {
  const thresholds = [
    { count: 2, label: "+3% XP" },
    { count: 3, label: "+5% XP" },
    { count: 5, label: "+8% XP + HOT HAND" },
    { count: 7, label: "+12% XP" },
    { count: 10, label: "+15% XP + PROPHET" },
    { count: 15, label: "+20% XP + ORACLE" },
  ];
  const next = thresholds.find((threshold) => count < threshold.count);
  return next ? `${next.count - count} MORE FOR ${next.label}` : "ORACLE BONUS ACTIVE";
}

export { StreakDisplay };
