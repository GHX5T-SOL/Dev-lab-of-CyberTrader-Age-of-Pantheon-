import * as React from "react";
import { ScrollView, View } from "react-native";
import ConfirmModal from "@/components/confirm-modal";
import MenuScreen from "@/components/menu-screen";
import NeonBorder from "@/components/neon-border";
import ObolBalanceDisplay from "@/components/obol-balance-display";
import ShopItemCard from "@/components/shop-item";
import { SHOP_ITEMS } from "@/data/shop-items";
import { ENABLE_OBOL_TOKEN } from "@/engine/obol-shop";
import type { ShopItem } from "@/engine/types";
import { useDemoStore } from "@/state/demo-store";
import { terminalColors, terminalFont } from "@/theme/terminal";
import CyberText from "@/components/cyber-text";

export default function ShopRoute() {
  const obolBalance = useDemoStore((state) => state.obolBalance);
  const systemMessage = useDemoStore((state) => state.systemMessage);
  const purchaseShopItem = useDemoStore((state) => state.purchaseShopItem);
  const [selectedItem, setSelectedItem] = React.useState<ShopItem | null>(null);

  return (
    <MenuScreen title="$ SHOP">
      <NeonBorder active>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
          <CyberText style={{ flex: 1, fontFamily: terminalFont, color: terminalColors.cyan, fontSize: 12 }}>
            FIXED-PRICE CONVENIENCE AND COSMETIC ITEMS
          </CyberText>
          <ObolBalanceDisplay balance={obolBalance} />
        </View>
        <CyberText style={{ marginTop: 10, fontFamily: terminalFont, color: terminalColors.amber, fontSize: 10 }}>
          THIS IS A GAME, NOT AN INVESTMENT.
        </CyberText>
        <CyberText style={{ marginTop: 5, fontFamily: terminalFont, color: terminalColors.muted, fontSize: 10 }}>
          $OBOL NEVER GATES PROGRESSION. EVERY POWER-RELEVANT OPTION HAS A 0BOL OR TIME PATH.
        </CyberText>
        {!ENABLE_OBOL_TOKEN ? (
          <CyberText style={{ marginTop: 8, fontFamily: terminalFont, color: terminalColors.muted, fontSize: 10 }}>
            TOKEN FEATURE FLAG OFF. CATALOG SHOWN FOR DESIGN REVIEW.
          </CyberText>
        ) : null}
      </NeonBorder>

      <ScrollView style={{ marginTop: 4 }}>
        {SHOP_ITEMS.map((item) => (
          <ShopItemCard
            key={item.id}
            item={item}
            disabled={!ENABLE_OBOL_TOKEN || obolBalance < item.obolPrice}
            onPress={() => setSelectedItem(item)}
          />
        ))}
      </ScrollView>

      <CyberText style={{ marginTop: 14, fontFamily: terminalFont, color: terminalColors.muted, fontSize: 10 }}>
        {systemMessage}
      </CyberText>

      <ConfirmModal
        visible={Boolean(selectedItem)}
        message={
          selectedItem
            ? `Purchase ${selectedItem.name} for ${selectedItem.obolPrice} $OBOL (${selectedItem.fiatEquivalent})? Fixed price. No randomized reward.`
            : ""
        }
        confirmLabel="PURCHASE"
        cancelLabel="CANCEL"
        onConfirm={() => {
          if (selectedItem) {
            void purchaseShopItem(selectedItem.id);
          }
          setSelectedItem(null);
        }}
        onCancel={() => setSelectedItem(null)}
      />
    </MenuScreen>
  );
}
