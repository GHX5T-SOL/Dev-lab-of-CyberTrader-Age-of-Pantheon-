import * as React from "react";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import CyberText from "@/components/cyber-text";
import Scanlines from "@/components/scanlines";
import { terminalColors } from "@/theme/terminal";

export interface TerminalShellProps {
  children: React.ReactNode;
  showStatusBar?: boolean;
}

function formatClock(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function TerminalShell({ children, showStatusBar = true }: TerminalShellProps) {
  const [clock, setClock] = React.useState(() => formatClock(new Date()));
  const scanlineOffset = useSharedValue(0);
  const shellFlicker = useSharedValue(0);
  const fogShift = useSharedValue(0);

  React.useEffect(() => {
    const interval = setInterval(() => setClock(formatClock(new Date())), 30000);
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    scanlineOffset.value = withRepeat(
      withTiming(16, { duration: 1400, easing: Easing.linear }),
      -1,
      false,
    );
  }, [scanlineOffset]);

  React.useEffect(() => {
    shellFlicker.value = withRepeat(
      withTiming(1, { duration: 2600, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
  }, [shellFlicker]);

  React.useEffect(() => {
    fogShift.value = withRepeat(
      withTiming(1, { duration: 8000, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
  }, [fogShift]);

  const animatedScanlines = useAnimatedStyle(() => ({
    transform: [{ translateY: scanlineOffset.value }],
  }));

  const animatedFlicker = useAnimatedStyle(() => ({
    opacity: 0.035 + shellFlicker.value * 0.04,
  }));

  const animatedFog = useAnimatedStyle(() => ({
    opacity: 0.24 + fogShift.value * 0.12,
    transform: [{ translateX: -18 + fogShift.value * 36 }],
  }));

  return (
    <View style={{ flex: 1, backgroundColor: terminalColors.background }}>
      <LinearGradient
        pointerEvents="none"
        colors={["#05060C", "#081426", "#120A20", "#05060C"]}
        locations={[0, 0.38, 0.72, 1]}
        start={{ x: 0.05, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
      />
      <Animated.View pointerEvents="none" style={[{ position: "absolute", top: 58, right: -70, left: -70, height: 220 }, animatedFog]}>
        <LinearGradient
          colors={["transparent", "rgba(0,240,255,0.1)", "rgba(255,43,214,0.075)", "transparent"]}
          start={{ x: 0, y: 0.2 }}
          end={{ x: 1, y: 0.8 }}
          style={{ flex: 1, transform: [{ skewY: "-8deg" }] }}
        />
      </Animated.View>
      <View pointerEvents="none" style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 220, opacity: 0.22 }}>
        {Array.from({ length: 9 }).map((_, index) => (
          <View
            key={index}
            style={{
              position: "absolute",
              left: `${index * 12}%`,
              bottom: 0,
              width: 2,
              height: 70 + (index % 4) * 34,
              backgroundColor: index % 3 === 0 ? terminalColors.magenta : terminalColors.cyan,
            }}
          />
        ))}
      </View>
      {showStatusBar ? (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            height: 32,
            paddingHorizontal: 12,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: terminalColors.status,
            borderBottomWidth: 1,
            borderBottomColor: terminalColors.borderDim,
          }}
        >
          <CyberText tone="cyan" size={11}>
            AG3NT_OS//PIRAT3
          </CyberText>
          <CyberText tone="muted" size={11}>
            {clock}
          </CyberText>
        </View>
      ) : null}
      <View style={{ flex: 1, paddingTop: showStatusBar ? 32 : 0 }}>
        {children}
        <CyberText
          tone="dim"
          size={10}
          style={{
            textAlign: "center",
            paddingBottom: 8,
          }}
        >
          //PIRATE OS v0.1.3
        </CyberText>
      </View>
      <Animated.View pointerEvents="none" style={[{ position: "absolute", top: -16, right: 0, bottom: 0, left: 0 }, animatedScanlines]}>
        {Array.from({ length: 200 }).map((_, index) => (
          <View
            key={index}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: index * 4,
              height: 1,
              backgroundColor: terminalColors.scanline,
            }}
          />
        ))}
      </Animated.View>
      <LinearGradient
        pointerEvents="none"
        colors={["rgba(0,0,0,0.08)", "transparent", terminalColors.vignette]}
        locations={[0, 0.46, 1]}
        start={{ x: 0.5, y: 0.5 }}
        end={{ x: 1, y: 1 }}
        style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
      />
      <Animated.View
        pointerEvents="none"
        style={[
          { position: "absolute", top: 0, right: 0, bottom: 0, left: 0, backgroundColor: terminalColors.cyan },
          animatedFlicker,
        ]}
      />
      <Scanlines />
    </View>
  );
}

export default TerminalShell;
