import { Text, View } from "react-native";
import type { MarketWhisper } from "@/engine/types";
import { terminalColors, terminalFont } from "@/theme/terminal";

interface MarketWhisperProps {
  whispers: MarketWhisper[];
}

export default function MarketWhisperPanel({ whispers }: MarketWhisperProps) {
  if (!whispers.length) {
    return null;
  }

  return (
    <View style={{ marginTop: 12, marginHorizontal: 12, borderWidth: 1, borderColor: terminalColors.borderDim, backgroundColor: terminalColors.panel, padding: 10 }}>
      <Text style={{ fontFamily: terminalFont, color: terminalColors.muted, fontSize: 9, letterSpacing: 1.5 }}>
        MARKET WHISPERS
      </Text>
      {whispers.slice(0, 5).map((whisper) => (
        <Text key={whisper.id} style={{ marginTop: 6, fontFamily: terminalFont, color: terminalColors.cyan, fontSize: 10 }}>
          {whisper.message}
        </Text>
      ))}
    </View>
  );
}

export { MarketWhisperPanel };
