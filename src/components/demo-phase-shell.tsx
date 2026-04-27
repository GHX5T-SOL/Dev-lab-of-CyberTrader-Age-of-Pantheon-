import type { PropsWithChildren } from "react";
import { ScrollView, View } from "react-native";
import { palette } from "@/theme/colors";
import CyberText from "@/components/cyber-text";

const monoFamily = process.env.EXPO_OS === "ios" ? "Menlo" : "monospace";

interface DemoPhaseShellProps extends PropsWithChildren {
  eyebrow: string;
  title: string;
  description: string;
}

export function DemoPhaseShell({
  eyebrow,
  title,
  description,
  children,
}: DemoPhaseShellProps) {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: palette.bg.void }}
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingTop: 28,
        paddingBottom: 40,
        gap: 18,
      }}
    >
      <View style={{ gap: 18 }}>
        <View style={{ gap: 8 }}>
          <CyberText
            selectable
            style={{
              color: palette.accent.cyan,
              fontSize: 12,
              letterSpacing: 2.4,
              textTransform: "uppercase",
              fontFamily: monoFamily,
            }}
          >
            {eyebrow}
          </CyberText>
          <CyberText
            selectable
            style={{
              color: palette.fg.primary,
              fontSize: 30,
              fontWeight: "700",
            }}
          >
            {title}
          </CyberText>
          <CyberText
            selectable
            style={{ color: palette.fg.muted, fontSize: 15, lineHeight: 22 }}
          >
            {description}
          </CyberText>
        </View>
        {children}
      </View>
    </ScrollView>
  );
}
