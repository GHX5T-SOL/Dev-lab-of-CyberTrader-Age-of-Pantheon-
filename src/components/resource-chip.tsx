import { View } from "react-native";
import { palette } from "@/theme/colors";
import CyberText from "@/components/cyber-text";

const monoFamily = process.env.EXPO_OS === "ios" ? "Menlo" : "monospace";

interface ResourceChipProps {
  label: string;
  value: string;
  tone?: "cyan" | "acid" | "amber" | "heat";
}

const TONES = {
  cyan: palette.accent.cyan,
  acid: palette.accent.acidGreen,
  amber: palette.warn.amber,
  heat: palette.danger.heat,
} as const;

export function ResourceChip({
  label,
  value,
  tone = "cyan",
}: ResourceChipProps) {
  const accent = TONES[tone];

  return (
    <View
      style={{
        minWidth: 108,
        gap: 6,
        borderWidth: 1,
        borderColor: `${accent}40`,
        borderRadius: 0,
        borderCurve: "continuous",
        backgroundColor: palette.bg.deepGreenBlack,
        paddingVertical: 10,
        paddingHorizontal: 12,
      }}
    >
      <CyberText
        selectable
        style={{
          color: palette.fg.muted,
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: 1.6,
          fontFamily: monoFamily,
        }}
      >
        {label}
      </CyberText>
      <CyberText
        selectable
        style={{
          color: accent,
          fontSize: 18,
          fontWeight: "700",
          fontFamily: monoFamily,
          fontVariant: ["tabular-nums"],
        }}
      >
        {value}
      </CyberText>
    </View>
  );
}
