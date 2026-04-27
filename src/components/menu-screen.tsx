import * as React from "react";
import { router } from "expo-router";
import { Pressable, ScrollView, useWindowDimensions, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import CyberText from "@/components/cyber-text";
import NeonBorder from "@/components/neon-border";
import { terminalColors } from "@/theme/terminal";

interface MenuScreenProps {
  title: string;
  children: React.ReactNode;
}

export default function MenuScreen({ title, children }: MenuScreenProps) {
  const { width } = useWindowDimensions();
  const frameWidth = width >= 620 ? 430 : "100%";

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        minHeight: "100%",
        alignItems: "center",
        paddingHorizontal: 14,
        paddingTop: 10,
        paddingBottom: 34,
        backgroundColor: "transparent",
      }}
    >
      <View style={{ width: frameWidth, maxWidth: 430 }}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
          <Pressable onPress={() => router.back()} style={{ paddingVertical: 8, paddingRight: 14 }}>
            <CyberText size={12} tone="muted">{"<"} BACK</CyberText>
          </Pressable>
          <CyberText size={11} tone="purple" style={{ flex: 1, textAlign: "right", letterSpacing: 1.4 }}>
            STATE // EMPIRE DECK
          </CyberText>
        </View>
        <NeonBorder active style={{ marginBottom: 14, borderColor: terminalColors.purple }}>
          <LinearGradient
            pointerEvents="none"
            colors={["rgba(138,124,255,0.18)", "rgba(0,229,255,0.08)", "transparent"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
          />
          <CyberText size={24} weight="700" tone="text" style={{ letterSpacing: 0.5 }}>
            {title}
          </CyberText>
          <CyberText size={11} tone="muted" style={{ marginTop: 5 }}>
            SIGNAL // PRESSURE // ACTION // DATA
          </CyberText>
        </NeonBorder>
        {children}
      </View>
    </ScrollView>
  );
}
