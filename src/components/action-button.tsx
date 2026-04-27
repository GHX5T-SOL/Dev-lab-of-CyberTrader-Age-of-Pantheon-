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
  variant: "primary" | "amber" | "danger" | "muted";
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
    variant === "primary"
      ? terminalColors.green
      : variant === "amber"
        ? terminalColors.amber
        : variant === "danger"
          ? terminalColors.red
          : terminalColors.border;
  const pressedColor = variant === "danger" ? terminalColors.red : variant === "amber" ? terminalColors.amber : terminalColors.cyan;
  const gradientColors: readonly [string, string] =
    variant === "primary"
      ? [terminalColors.green, terminalColors.cyan]
      : variant === "amber"
        ? ["rgba(255,200,87,0.22)", "rgba(138,124,255,0.1)"]
        : variant === "danger"
          ? ["rgba(255,59,59,0.22)", "rgba(5,7,13,0.92)"]
        : ["rgba(255,255,255,0.055)", "rgba(0,229,255,0.045)"];

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
          borderRadius: 0,
          overflow: "hidden",
          backgroundColor: terminalColors.glassStrong,
          opacity: disabled ? 0.4 : 1,
          shadowColor: disabled ? "transparent" : baseColor,
          shadowOpacity: variant === "primary" && !disabled ? 0.44 : glowing && !disabled ? 0.32 : 0.16,
          shadowRadius: variant === "primary" && !disabled ? 14 : glowing && !disabled ? 10 : 4,
          elevation: glowing && !disabled ? 7 : 2,
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
              color: variant === "primary" ? terminalColors.background : pressed ? pressedColor : baseColor,
              fontWeight: "800",
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
