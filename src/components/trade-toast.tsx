import { View } from "react-native";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import CyberText from "@/components/cyber-text";
import { terminalColors } from "@/theme/terminal";

interface TradeToastProps {
  visible: boolean;
  title: string;
  value: string;
  detail?: string;
  tone?: "success" | "danger" | "amber" | "cyan";
}

export default function TradeToast({
  visible,
  title,
  value,
  detail,
  tone = "success",
}: TradeToastProps) {
  if (!visible) {
    return null;
  }

  const color =
    tone === "danger"
      ? terminalColors.red
      : tone === "amber"
        ? terminalColors.amber
        : tone === "cyan"
          ? terminalColors.cyan
          : terminalColors.green;

  return (
    <Animated.View
      entering={FadeInDown.duration(180)}
      exiting={FadeOutDown.duration(180)}
      pointerEvents="none"
      style={{
        position: "absolute",
        left: 18,
        right: 18,
        bottom: 18,
        zIndex: 60,
        borderWidth: 1,
        borderColor: color,
        backgroundColor: "rgba(10,10,10,0.94)",
        padding: 14,
        shadowColor: color,
        shadowOpacity: 0.38,
        shadowRadius: 6,
        elevation: 4,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
        <CyberText tone={tone === "danger" ? "red" : tone === "amber" ? "amber" : tone === "cyan" ? "cyan" : "green"} size={12} weight="700">
          {title}
        </CyberText>
        <CyberText size={12} style={{ color, fontVariant: ["tabular-nums"] }}>
          {value}
        </CyberText>
      </View>
      {detail ? (
        <CyberText tone="muted" size={10} style={{ marginTop: 6 }}>
          {detail}
        </CyberText>
      ) : null}
    </Animated.View>
  );
}

export { TradeToast };
