import { Pressable, Text, View } from "react-native";
import type { ShopItem } from "@/engine/types";
import { terminalColors, terminalFont } from "@/theme/terminal";

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
        <Text style={{ flex: 1, fontFamily: terminalFont, color: terminalColors.text, fontSize: 12 }}>
          {item.name.toUpperCase()}
        </Text>
        <Text style={{ fontFamily: terminalFont, color: terminalColors.amber, fontSize: 12 }}>
          {item.obolPrice} $OBOL ({item.fiatEquivalent})
        </Text>
      </View>
      <Text style={{ marginTop: 6, fontFamily: terminalFont, color: terminalColors.muted, fontSize: 10 }}>
        {item.description}
      </Text>
      {item.zeroBolAlternative ? (
        <Text style={{ marginTop: 5, fontFamily: terminalFont, color: terminalColors.green, fontSize: 9 }}>
          0BOL / FREE PATH: {item.zeroBolAlternative}
        </Text>
      ) : null}
      {item.purchaseLimit ? (
        <Text style={{ marginTop: 5, fontFamily: terminalFont, color: terminalColors.amber, fontSize: 9 }}>
          LIMIT: {item.purchaseLimit}
        </Text>
      ) : null}
    </Pressable>
  );
}

export { ShopItemCard };
