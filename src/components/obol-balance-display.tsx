import { View } from "react-native";
import { ENABLE_OBOL_TOKEN } from "@/engine/obol-shop";
import { terminalColors, terminalFont } from "@/theme/terminal";
import CyberText from "@/components/cyber-text";

interface ObolBalanceDisplayProps {
  balance: number;
}

export default function ObolBalanceDisplay({ balance }: ObolBalanceDisplayProps) {
  if (!ENABLE_OBOL_TOKEN) {
    return null;
  }

  return (
    <View style={{ borderWidth: 1, borderColor: terminalColors.amber, backgroundColor: terminalColors.panel, paddingHorizontal: 10, paddingVertical: 7 }}>
      <CyberText style={{ fontFamily: terminalFont, color: terminalColors.muted, fontSize: 9 }}>$OBOL</CyberText>
      <CyberText style={{ marginTop: 2, fontFamily: terminalFont, color: terminalColors.amber, fontSize: 14 }}>{balance}</CyberText>
    </View>
  );
}

export { ObolBalanceDisplay };
