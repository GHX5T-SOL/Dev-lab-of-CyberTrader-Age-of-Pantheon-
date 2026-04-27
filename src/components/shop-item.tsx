import { Pressable, View } from "react-native";
import type { ShopItem } from "@/engine/types";
import { terminalColors, terminalFont } from "@/theme/terminal";
import CyberText from "@/components/cyber-text";

interface ShopItemCardProps {
  item: ShopItem;
  disabled?: boolean;
  onPress: () => void;
}

export default function ShopItemCard({ item, disabled, onPress }: ShopItemCardProps) {
  return (
    <Pressable
      disabled={disabled || !item.available}
      onPress={onPress}
      style={{
        marginTop: 10,
        borderWidth: 1,
        borderColor: disabled ? terminalColors.borderDim : terminalColors.cyan,
        backgroundColor: terminalColors.panel,
        padding: 12,
        opacity: disabled ? 0.72 : 1,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 10 }}>
        <CyberText style={{ flex: 1, fontFamily: terminalFont, color: terminalColors.text, fontSize: 12 }}>
          {item.name.toUpperCase()}
        </CyberText>
        <CyberText style={{ fontFamily: terminalFont, color: terminalColors.amber, fontSize: 12 }}>
          {item.obolPrice} $OBOL ({item.fiatEquivalent})
        </CyberText>
      </View>
      <CyberText style={{ marginTop: 6, fontFamily: terminalFont, color: terminalColors.muted, fontSize: 10 }}>
        {item.description}
      </CyberText>
      {item.zeroBolAlternative ? (
        <CyberText style={{ marginTop: 5, fontFamily: terminalFont, color: terminalColors.green, fontSize: 9 }}>
          0BOL / FREE PATH: {item.zeroBolAlternative}
        </CyberText>
      ) : null}
      {item.purchaseLimit ? (
        <CyberText style={{ marginTop: 5, fontFamily: terminalFont, color: terminalColors.amber, fontSize: 9 }}>
          LIMIT: {item.purchaseLimit}
        </CyberText>
      ) : null}
    </Pressable>
  );
}

export { ShopItemCard };
