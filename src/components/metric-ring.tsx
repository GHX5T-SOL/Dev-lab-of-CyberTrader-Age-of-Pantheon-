import * as React from "react";
import { Text } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { terminalColors, terminalFont } from "@/theme/terminal";

const TONES = {
  cyan: terminalColors.cyan,
  blue: "#42A5FF",
  red: terminalColors.red,
  green: terminalColors.green,
  amber: terminalColors.amber,
  purple: terminalColors.purple,
  magenta: terminalColors.magenta,
} as const;

interface MetricRingProps {
  label: string;
  value: number;
  displayValue?: string;
  suffix?: string;
  max?: number;
  tone: keyof typeof TONES;
  size?: number;
  active?: boolean;
}

export function MetricRing({
  label,
  value,
  displayValue,
  suffix = "",
  max = 100,
  tone,
  size = 118,
  active = true,
}: MetricRingProps) {
  const color = TONES[tone];
  const pulse = useSharedValue(0);
  const radius = size * 0.36;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(1, value / max));
  const center = size / 2;

  React.useEffect(() => {
    if (!active) {
      pulse.value = withTiming(0, { duration: 240 });
      return;
    }
    pulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1900, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 2100, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      false,
    );
  }, [active, pulse]);

  const pulseStyle = useAnimatedStyle(() => ({
    shadowOpacity: 0.2 + pulse.value * 0.12,
    transform: [{ scale: 1 + pulse.value * 0.01 }],
  }));

  return (
    <Animated.View
      style={[
        {
          width: size,
          height: size,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: size / 2,
          backgroundColor: terminalColors.glass,
          shadowColor: color,
          shadowRadius: 18,
          elevation: 7,
        },
        pulseStyle,
      ]}
    >
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ position: "absolute" }}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="7"
          fill="transparent"
        />
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth="7"
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={circumference - progress * circumference}
          rotation="-90"
          origin={`${center}, ${center}`}
        />
      </Svg>
      <Text
        selectable
        style={{
          color: terminalColors.text,
          fontSize: size >= 110 ? 22 : 18,
          fontWeight: "800",
          fontFamily: terminalFont,
          fontVariant: ["tabular-nums"],
        }}
      >
        {displayValue ?? `${Math.round(value)}${suffix}`}
      </Text>
      <Text
        selectable
        style={{
          color,
          fontSize: size >= 110 ? 10 : 9,
          letterSpacing: 1.4,
          textTransform: "uppercase",
          fontFamily: terminalFont,
        }}
      >
        {label}
      </Text>
    </Animated.View>
  );
}
