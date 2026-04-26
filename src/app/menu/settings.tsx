import * as React from "react";
import { router } from "expo-router";
import { Pressable, View } from "react-native";
import ActionButton from "@/components/action-button";
import ConfirmModal from "@/components/confirm-modal";
import CyberText from "@/components/cyber-text";
import MenuScreen from "@/components/menu-screen";
import NeonBorder from "@/components/neon-border";
import { useDemoStore } from "@/state/demo-store";
import { terminalColors } from "@/theme/terminal";

export default function SettingsMenuRoute() {
  const resetDemo = useDemoStore((state) => state.resetDemo);
  const resetTutorial = useDemoStore((state) => state.resetTutorial);
  const resetIntro = useDemoStore((state) => state.resetIntro);
  const [confirm, setConfirm] = React.useState(false);

  return (
    <MenuScreen title="SETTINGS">
      <NeonBorder active style={{ gap: 12 }}>
        <ActionButton
          variant="primary"
          label="[ REPLAY INTRO ]"
          onPress={() => {
            resetIntro();
            router.replace("/intro");
          }}
        />
        <CyberText tone="dim" size={11}>AUDIO: DISABLED UNTIL SOUND PACK IS FINAL</CyberText>
        <CyberText tone="dim" size={11}>HAPTICS: ENABLED BY ACTION BUTTONS</CyberText>
        <Pressable onPress={resetTutorial} style={{ borderWidth: 1, borderColor: terminalColors.borderDim, padding: 12 }}>
          <CyberText tone="amber" size={12}>RESET TUTORIAL</CyberText>
        </Pressable>
        <Pressable onPress={() => setConfirm(true)} style={{ borderWidth: 1, borderColor: terminalColors.red, padding: 12 }}>
          <CyberText tone="red" size={12}>CLEAR LOCAL DATA</CyberText>
        </Pressable>
        <View style={{ gap: 4 }}>
          <CyberText tone="muted" size={11}>FEATURE FLAGS</CyberText>
          <CyberText tone="text" size={11}>SUPABASE AUTHORITY: OFF</CyberText>
          <CyberText tone="text" size={11}>SOLANA TOKEN MODE: DESIGN STAGE</CyberText>
          <CyberText tone="dim" size={11}>APP VERSION: v0.1.3</CyberText>
        </View>
      </NeonBorder>
      <ConfirmModal
        visible={confirm}
        message="CLEAR LOCAL DEMO DATA?"
        onConfirm={() => {
          setConfirm(false);
          void resetDemo().then(() => router.replace("/intro"));
        }}
        onCancel={() => setConfirm(false)}
      />
    </MenuScreen>
  );
}
