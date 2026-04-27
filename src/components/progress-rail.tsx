import { View } from "react-native";
import type { RankSnapshot, TradeStreak } from "@/engine/types";
import { terminalColors, terminalFont } from "@/theme/terminal";
import CyberText from "@/components/cyber-text";

interface ProgressRailProps {
  progression: RankSnapshot;
  streak: TradeStreak;
}

export default function ProgressRail({ progression, streak }: ProgressRailProps) {
  const nextXp = progression.nextXpRequired === null
    ? 0
    : Math.max(0, progression.nextXpRequired - progression.xp);
  const progressPercent = progression.nextXpRequired === null
    ? 100
    : Math.round(((progression.xp - progression.xpRequired) / Math.max(1, progression.nextXpRequired - progression.xpRequired)) * 100);

  return (
    <View style={{ marginTop: 12, marginHorizontal: 12, borderWidth: 1, borderColor: terminalColors.cyan, backgroundColor: terminalColors.panel, padding: 10 }}>
      <CyberText style={{ fontFamily: terminalFont, color: terminalColors.muted, fontSize: 9, letterSpacing: 1.4 }}>
        PROGRESS RAIL
      </CyberText>
      <CyberText style={{ marginTop: 7, fontFamily: terminalFont, color: terminalColors.cyan, fontSize: 12 }}>
        RANK: {progression.title} {"->"} {progression.nextXpRequired === null ? "MAX" : `${nextXp} XP UNTIL NEXT`}
      </CyberText>
      <View style={{ height: 5, backgroundColor: terminalColors.borderDim, marginTop: 7 }}>
        <View style={{ height: 5, width: `${Math.max(0, Math.min(100, progressPercent))}%`, backgroundColor: terminalColors.cyan }} />
      </View>
      <CyberText style={{ marginTop: 7, fontFamily: terminalFont, color: streak.count >= 5 ? terminalColors.amber : terminalColors.green, fontSize: 11 }}>
        STREAK BEST: {streak.record} TRADES // CURRENT: {streak.count} // {nextStreakThreshold(streak.count)}
      </CyberText>
    </View>
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
