import * as React from "react";
import { router } from "expo-router";
import { Pressable, ScrollView, TextInput, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from "react-native-reanimated";
import ActionButton from "@/components/action-button";
import AsciiDivider from "@/components/ascii-divider";
import CyberText from "@/components/cyber-text";
import Scanlines from "@/components/scanlines";
import { useDemoBootstrap } from "@/hooks/use-demo-bootstrap";
import { useDemoStore } from "@/state/demo-store";
import { terminalColors, terminalFont } from "@/theme/terminal";

const LOGO = String.raw`
      /\      
     /  \     
    /_/\_\    
   /\_||_/\   
  /__\||/__\  
     [__]     
   _/____\_   
  /_/____\_\  
`;

export default function LoginRoute() {
  useDemoBootstrap();
  const setHandle = useDemoStore((state) => state.setHandle);
  const [handle, setLocalHandle] = React.useState("");
  const [focused, setFocused] = React.useState(false);
  const [error, setError] = React.useState("");
  const cursorOpacity = useSharedValue(1);

  React.useEffect(() => {
    cursorOpacity.value = withRepeat(withSequence(withTiming(0, { duration: 500 }), withTiming(1, { duration: 500 })), -1);
  }, [cursorOpacity]);

  const cursorStyle = useAnimatedStyle(() => ({ opacity: cursorOpacity.value }));
  const enter = () => {
    if (!/^[A-Za-z0-9_]{3,20}$/.test(handle)) {
      setError("INVALID HANDLE. 3-20 ALPHANUMERIC CHARS.");
      return;
    }
    setError("");
    setHandle(handle);
    router.replace("/boot");
  };

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ minHeight: "100%", paddingHorizontal: 24, backgroundColor: terminalColors.background }}>
      <Scanlines />
      <View style={{ alignItems: "center", marginTop: 80 }}>
        <CyberText tone="cyan" size={11} style={{ lineHeight: 14 }}>{LOGO}</CyberText>
        <CyberText tone="muted" size={10} style={{ letterSpacing: 3, textAlign: "center" }}>
          CYBERTRADER: AGE OF PANTHEON
        </CyberText>
      </View>
      <View style={{ marginTop: 60, gap: 4 }}>
        {[
          "AG3NT_0S//pIRAT3 v4.0.7",
          "SIGNAL INTEGRITY: 78%",
          "eAGENT CLOAK: ACTIVE (UNSTABLE)",
          "CONNECTION: LOCAL LOOP // NO UPLINK",
        ].map((line) => (
          <CyberText key={line} size={11} style={{ color: terminalColors.systemGreen }}>
            {line}
          </CyberText>
        ))}
        <AsciiDivider label="LOCAL IDENTITY" />
      </View>
      <View style={{ marginTop: 24 }}>
        <CyberText tone="muted" size={12} style={{ marginBottom: 8 }}>EIDOLON HANDLE:</CyberText>
        <View
          style={{
            borderWidth: 1,
            borderColor: focused ? terminalColors.cyan : terminalColors.border,
            backgroundColor: terminalColors.panel,
            height: 44,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 12,
            shadowColor: focused ? terminalColors.cyan : terminalColors.background,
            shadowOpacity: focused ? 0.3 : 0,
            shadowRadius: 4,
          }}
        >
          <TextInput
            value={handle}
            onChangeText={setLocalHandle}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="_"
            placeholderTextColor={terminalColors.dim}
            autoCapitalize="characters"
            maxLength={20}
            style={{ flex: 1, color: terminalColors.text, fontFamily: terminalFont, fontSize: 16 }}
          />
          <Animated.View style={[{ width: 7, height: 18, backgroundColor: terminalColors.cyan }, cursorStyle]} />
        </View>
        {error ? <CyberText tone="red" size={11} style={{ marginTop: 8 }}>{error}</CyberText> : null}
        <View style={{ marginTop: 24 }}>
          <ActionButton variant="primary" label="[ ENTER LOCAL DEMO ]" glowing onPress={enter} />
        </View>
      </View>
      <Pressable onPress={() => router.replace("/intro")} style={{ marginTop: 22, alignSelf: "center" }}>
        <CyberText tone="dim" size={9}>REPLAY INTRO SIGNAL</CyberText>
      </Pressable>
      <CyberText tone="dim" size={9} style={{ textAlign: "center", marginTop: 40 }}>
        Local demo login. No wallet required. This locks your handle.
      </CyberText>
    </ScrollView>
  );
}
