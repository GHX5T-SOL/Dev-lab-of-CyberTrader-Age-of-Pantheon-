import { Text, View } from "react-native";
import { ENABLE_OBOL_TOKEN } from "@/engine/obol-shop";
import { terminalColors, terminalFont } from "@/theme/terminal";

interface ObolBalanceDisplayProps {
  balance: number;
}

export default function ObolBalanceDisplay({ balance }: ObolBalanceDisplayProps) {
  if (!ENABLE_OBOL_TOKEN) {
    return null;
  }

  return (
    <View style={{ borderWidth: 1, borderColor: terminalColors.amber, backgroundColor: terminalColors.panel, paddingHorizontal: 10, paddingVertical: 7 }}>
      <Text style={{ fontFamily: terminalFont, color: terminalColors.muted, fontSize: 9 }}>$OBOL</Text>
      <Text style={{ marginTop: 2, fontFamily: terminalFont, color: terminalColors.amber, fontSize: 14 }}>{balance}</Text>
    </View>
  );
}

export { ObolBalanceDisplay };
