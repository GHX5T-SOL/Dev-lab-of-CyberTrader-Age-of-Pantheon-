import * as React from "react";
import { Pressable, View } from "react-native";
import CyberText from "@/components/cyber-text";
import CourierModal from "@/components/courier-modal";
import MenuScreen from "@/components/menu-screen";
import NeonBorder from "@/components/neon-border";
import { getFlashCourierCostMultiplier } from "@/engine/flash-events";
import {
  getActiveDistrictState,
  getDistrictCourierRiskBonus,
  getDistrictCourierRiskMultiplier,
  getDistrictCourierTimeMultiplier,
} from "@/engine/district-state";
import { useDemoStore } from "@/state/demo-store";
import { terminalColors } from "@/theme/terminal";

export default function InventoryMenuRoute() {
  const positions = Object.values(useDemoStore((state) => state.positions));
  const prices = useDemoStore((state) => state.prices);
  const progression = useDemoStore((state) => state.progression);
  const world = useDemoStore((state) => state.world);
  const clock = useDemoStore((state) => state.clock);
  const activeFlashEvent = useDemoStore((state) => state.activeFlashEvent);
  const districtStates = useDemoStore((state) => state.districtStates);
  const bounty = useDemoStore((state) => state.bounty);
  const transitShipments = useDemoStore((state) => state.transitShipments);
  const sendCourierShipment = useDemoStore((state) => state.sendCourierShipment);
  const used = positions.length;
  const activeCourierCount = transitShipments.filter((shipment) => shipment.status === "transit").length;
  const courierLimit = progression.level >= 10 ? 5 : 3;
  const district = getActiveDistrictState(districtStates, world.currentLocationId, clock.nowMs);
  const [courierTicker, setCourierTicker] = React.useState<string | null>(null);
  const courierPosition = positions.find((position) => position.ticker === courierTicker);

  return (
    <MenuScreen title="COMMODITY INVENTORY">
      <NeonBorder active>
        <CyberText tone="muted" size={12}>
          {used}/{progression.inventorySlots} SLOTS
        </CyberText>
        <CyberText tone="amber" size={10} style={{ marginTop: 6 }}>
          COURIERS {activeCourierCount}/{courierLimit}
        </CyberText>
        <View style={{ height: 6, backgroundColor: terminalColors.borderDim, marginTop: 8 }}>
          <View
            style={{
              height: 6,
              width: `${Math.min(100, (used / progression.inventorySlots) * 100)}%`,
              backgroundColor: terminalColors.cyan,
            }}
          />
        </View>
        {positions.length ? (
          positions.map((position) => {
            const current = prices[position.ticker] ?? position.avgEntry;
            const value = current * position.quantity;
            const pnl = (current - position.avgEntry) * position.quantity + position.realizedPnl;
            return (
              <View key={position.id} style={{ borderTopWidth: 1, borderTopColor: terminalColors.borderDim, paddingTop: 12, marginTop: 12 }}>
                <CyberText tone="cyan" size={12}>{position.ticker}</CyberText>
                <CyberText tone="text" size={11}>
                  QTY {position.quantity} AVG {position.avgEntry.toFixed(2)} VALUE {value.toFixed(2)} PNL {pnl.toFixed(2)}
                </CyberText>
                <Pressable onPress={() => setCourierTicker(position.ticker)} style={{ marginTop: 8 }}>
                  <CyberText tone="amber" size={11}>[ SEND VIA COURIER ]</CyberText>
                </Pressable>
              </View>
            );
          })
        ) : (
          <CyberText tone="dim" size={12} style={{ marginTop: 18 }}>NO COMMODITIES HELD</CyberText>
        )}
      </NeonBorder>
      {courierPosition ? (
        <CourierModal
          visible={Boolean(courierTicker)}
          ticker={courierPosition.ticker}
          maxQuantity={courierPosition.quantity}
          currentLocationId={world.currentLocationId}
          costMultiplier={getFlashCourierCostMultiplier(activeFlashEvent, world.currentLocationId)}
          arrivalTimeMultiplier={getDistrictCourierTimeMultiplier(district.state)}
          riskBonus={getDistrictCourierRiskBonus(district.state) + bounty.courierRiskBonus}
          riskMultiplier={getDistrictCourierRiskMultiplier(district.state)}
          estimatedUnitValue={prices[courierPosition.ticker] ?? courierPosition.avgEntry}
          onClose={() => setCourierTicker(null)}
          onSend={(input) => {
            void sendCourierShipment({
              ticker: courierPosition.ticker,
              quantity: input.quantity,
              destinationId: input.destinationId,
              courierId: input.courierId,
              insured: input.insured,
            });
            setCourierTicker(null);
          }}
        />
      ) : null}
    </MenuScreen>
  );
}
