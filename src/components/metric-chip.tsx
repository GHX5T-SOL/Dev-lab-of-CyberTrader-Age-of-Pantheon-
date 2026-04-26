import { Pressable, View } from "react-native";
import Svg, { Rect } from "react-native-svg";
import CyberText from "@/components/cyber-text";
import NeonBorder from "@/components/neon-border";
import { terminalColors } from "@/theme/terminal";

interface MetricChipProps {
  label: string;
  value: string;
  subValue?: string;
  progressValue?: number;
  progressColor?: "green" | "amber" | "red";
  icon?: string;
  accentColor?: string;
  onPress?: () => void;
}

const PROGRESS_COLORS = {
  green: terminalColors.green,
  amber: terminalColors.amber,
  red: terminalColors.red,
};

export default function MetricChip({
  label,
  value,
  subValue,
  progressValue,
  progressColor = "green",
  icon,
  accentColor,
  onPress,
}: MetricChipProps) {
  const active = Boolean(accentColor || onPress);
  const Wrapper = onPress ? Pressable : View;
  const fillWidth = Math.max(0, Math.min(100, progressValue ?? 0));
  const fillColor = PROGRESS_COLORS[progressColor];

  return (
    <Wrapper onPress={onPress} style={{ width: "48%" }}>
      <NeonBorder active={active} style={accentColor ? { borderColor: accentColor } : undefined}>
        <View style={{ minHeight: 116, justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 8 }}>
            <CyberText size={10} tone="muted" style={{ letterSpacing: 1, textTransform: "uppercase" }}>
              {label}
            </CyberText>
            {icon ? <CyberText style={{ color: accentColor ?? terminalColors.cyan }}>{icon}</CyberText> : null}
          </View>
          <CyberText numberOfLines={2} size={28} tone="text" weight="600">
            {value}
          </CyberText>
          {subValue ? (
            <CyberText numberOfLines={1} size={10} tone="muted">
              {subValue}
            </CyberText>
          ) : null}
          {progressValue !== undefined ? (
            <View style={{ marginTop: 8, shadowColor: fillColor, shadowOpacity: 0.5, shadowRadius: 4 }}>
              <Svg width="100%" height={6} viewBox="0 0 100 6" preserveAspectRatio="none">
                <Rect x="0" y="0" width="100" height="6" fill={terminalColors.borderDim} />
                <Rect x="0" y="0" width={fillWidth} height="6" fill={fillColor} />
              </Svg>
            </View>
          ) : null}
        </View>
      </NeonBorder>
    </Wrapper>
  );
}

export { MetricChip };
