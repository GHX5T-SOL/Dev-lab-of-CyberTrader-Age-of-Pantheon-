import type { ReactNode } from "react";
import type { ViewStyle } from "react-native";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { terminalColors } from "@/theme/terminal";

interface NeonBorderProps {
  children: ReactNode;
  active?: boolean;
  style?: ViewStyle;
}

export default function NeonBorder({ children, active = false, style }: NeonBorderProps) {
  const borderColor = active ? terminalColors.cyan : terminalColors.borderDim;

  return (
    <View
      style={[
        {
          borderWidth: 1,
          borderColor,
          borderRadius: 0,
          overflow: "hidden",
          backgroundColor: terminalColors.glass,
          shadowColor: active ? terminalColors.cyan : terminalColors.purple,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: active ? 0.42 : 0.12,
          shadowRadius: active ? 12 : 5,
          elevation: active ? 4 : 2,
        },
        style,
      ]}
    >
      <LinearGradient
        pointerEvents="none"
        colors={[
          active ? "rgba(0,229,255,0.14)" : "rgba(255,255,255,0.032)",
          "rgba(255,255,255,0.01)",
          active ? "rgba(138,124,255,0.12)" : "rgba(0,0,0,0.06)",
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
      />
      <View style={{ padding: 12 }}>{children}</View>
    </View>
  );
}

export { NeonBorder };
