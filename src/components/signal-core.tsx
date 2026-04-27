import { Image, View } from "react-native";
import { palette } from "@/theme/colors";
import CyberText from "@/components/cyber-text";

const monoFamily = process.env.EXPO_OS === "ios" ? "Menlo" : "monospace";

export function SignalCore({
  label = "eidolon_shard",
  detail = "fractured memory core // unstable but responsive",
  size = "hero",
}: {
  label?: string;
  detail?: string;
  size?: "hero" | "compact";
}) {
  const frameSize = size === "hero" ? 260 : 176;
  const imageSize = size === "hero" ? 224 : 144;

  return (
    <View
      style={{
        alignItems: "center",
        gap: 10,
      }}
    >
      <View
        style={{
          width: frameSize,
          height: frameSize,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 1,
          borderColor: `${palette.accent.cyan}3a`,
          borderRadius: 0,
          borderCurve: "continuous",
          backgroundColor: palette.bg.deepGreenBlack,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            position: "absolute",
            width: frameSize - 52,
            height: frameSize - 52,
            borderRadius: 0,
            backgroundColor: `${palette.accent.cyan}10`,
          }}
        />
        <Image
          source={require("@/assets/ui/eidolon_shard_core.png")}
          resizeMode="contain"
          style={{ width: imageSize, height: imageSize }}
        />
      </View>
      <CyberText
        selectable
        style={{
          color: palette.accent.cyan,
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: 2,
          fontFamily: monoFamily,
        }}
      >
        {label}
      </CyberText>
      <CyberText
        selectable
        style={{
          maxWidth: size === "hero" ? 300 : 240,
          color: palette.fg.muted,
          fontSize: 13,
          lineHeight: 20,
          textAlign: "center",
        }}
      >
        {detail}
      </CyberText>
    </View>
  );
}
