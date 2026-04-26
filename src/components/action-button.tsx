import * as React from "react";
import { Pressable, View } from "react-native";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { terminalColors, terminalFont } from "@/theme/terminal";
import CyberText from "@/components/cyber-text";

interface ActionButtonProps {
  label: string;
  onPress: () => void;
  variant: "primary" | "amber" | "muted";
  disabled?: boolean;
  glowing?: boolean;
}

export default function ActionButton({
  label,
  onPress,
  variant,
  disabled = false,
  glowing = false,
}: ActionButtonProps) {
  const pulse = useSharedValue(0);
  const baseColor =
    variant === "primary" ? terminalColors.green : variant === "amber" ? terminalColors.amber : terminalColors.border;
  const pressedColor = variant === "amber" ? terminalColors.amber : terminalColors.cyan;
  const gradientColors: readonly [string, string] =
    variant === "primary"
      ? ["rgba(57,255,20,0.24)", "rgba(0,240,255,0.13)"]
      : variant === "amber"
        ? ["rgba(255,184,0,0.18)", "rgba(255,43,214,0.1)"]
        : ["rgba(255,255,255,0.045)", "rgba(0,240,255,0.035)"];

  React.useEffect(() => {
    if (variant === "primary" && glowing && !disabled) {
      pulse.value = withRepeat(
        withSequence(withTiming(1, { duration: 1800 }), withTiming(0, { duration: 1800 })),
        -1,
      );
      return;
    }
    pulse.value = withTiming(0, { duration: 220 });
  }, [disabled, glowing, pulse, variant]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + pulse.value * 0.004 }],
    borderColor:
      disabled
        ? terminalColors.borderDim
        : interpolateColor(pulse.value, [0, 1], [baseColor, terminalColors.cyanDark]),
  }));

  return (
    <Animated.View
      style={[
        {
          width: "100%",
          minHeight: 56,
          borderWidth: 1,
          borderRadius: 12,
          overflow: "hidden",
          backgroundColor: terminalColors.glassStrong,
          opacity: disabled ? 0.4 : 1,
          shadowColor: disabled ? "transparent" : baseColor,
          shadowOpacity: glowing && !disabled ? 0.34 : 0.16,
          shadowRadius: glowing && !disabled ? 16 : 7,
          elevation: glowing && !disabled ? 8 : 2,
        },
        animatedStyle,
      ]}
    >
      <LinearGradient
        pointerEvents="none"
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
      />
      <View pointerEvents="none" style={{ position: "absolute", left: 10, right: 10, top: 0, height: 1, backgroundColor: "rgba(255,255,255,0.26)" }} />
      <Pressable
        disabled={disabled}
        onPress={() => {
          if (!disabled) {
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => undefined);
            onPress();
          }
        }}
        style={({ pressed }) => ({
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          borderColor: pressed ? pressedColor : baseColor,
        })}
      >
        {({ pressed }) => (
          <CyberText
            size={16}
            style={{
              fontFamily: terminalFont,
              textTransform: "uppercase",
              letterSpacing: 2,
              color: pressed ? pressedColor : baseColor,
              textAlign: "center",
            }}
          >
            {label}
          </CyberText>
        )}
      </Pressable>
    </Animated.View>
  );
}

export { ActionButton };
