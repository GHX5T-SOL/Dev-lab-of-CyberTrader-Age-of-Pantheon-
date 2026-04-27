import * as React from "react";
import { router } from "expo-router";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useDemoBootstrap } from "@/hooks/use-demo-bootstrap";
import { useDemoStore } from "@/state/demo-store";
import CyberText from "@/components/cyber-text";
import { terminalColors } from "@/theme/terminal";

export default function IndexRoute() {
  const isHydrated = useDemoBootstrap();
  const phase = useDemoStore((state) => state.phase);
  const introSeen = useDemoStore((state) => state.introSeen);
  const opacity = useSharedValue(1);

  React.useEffect(() => {
    opacity.value = withRepeat(
      withSequence(withTiming(0.5, { duration: 500 }), withTiming(1, { duration: 500 })),
      -1,
    );
  }, [opacity]);

  React.useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const timeout = setTimeout(() => {
      if (!introSeen) {
        router.replace("/video-intro");
      } else if (phase === "boot") {
        router.replace("/boot");
      } else if (phase === "home") {
        router.replace("/home");
      } else if (phase === "handle" || phase === "login") {
        router.replace("/login");
      } else if (phase === "terminal") {
        router.replace("/terminal");
      } else {
        router.replace("/login");
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [introSeen, isHydrated, phase]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Animated.View style={animatedStyle}>
        <CyberText tone="muted" size={12}>
          INITIALIZING...
        </CyberText>
      </Animated.View>
    </View>
  );
}
