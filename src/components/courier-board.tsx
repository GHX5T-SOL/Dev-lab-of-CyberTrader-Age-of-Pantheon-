import { Pressable, Text, View } from "react-native";
import { getLocation, type TransitShipment } from "@/data/locations";
import { terminalColors, terminalFont } from "@/theme/terminal";

interface CourierBoardProps {
  shipments: TransitShipment[];
  nowMs: number;
  currentLocationId: string;
  onClaim: (shipmentId: string) => void;
}

export default function CourierBoard({ shipments, nowMs, currentLocationId, onClaim }: CourierBoardProps) {
  const visible = shipments.filter((shipment) => shipment.status === "transit" || shipment.status === "arrived");
  if (!visible.length) {
    return null;
  }

  return (
    <View style={{ marginTop: 14, marginHorizontal: 12, borderWidth: 1, borderColor: terminalColors.borderDim, backgroundColor: terminalColors.panel, padding: 10 }}>
      <Text style={{ fontFamily: terminalFont, color: terminalColors.amber, fontSize: 11 }}>COURIER BOARD</Text>
      {visible.map((shipment) => {
        const remainingMs = Math.max(0, shipment.arrivalTime - nowMs);
        const canClaim = shipment.status === "arrived" && shipment.destinationId === currentLocationId;
        return (
          <View key={shipment.id} style={{ marginTop: 8, borderTopWidth: 1, borderTopColor: terminalColors.borderDim, paddingTop: 8 }}>
            <Text style={{ fontFamily: terminalFont, color: terminalColors.text, fontSize: 10 }}>
              {shipment.ticker} x{shipment.quantity} // {getLocation(shipment.destinationId).name.toUpperCase()}
            </Text>
            <Text style={{ marginTop: 3, fontFamily: terminalFont, color: terminalColors.muted, fontSize: 9 }}>
              {shipment.status === "transit" ? `ETA ${formatCountdown(remainingMs)}` : "ARRIVED"} // RISK {(shipment.riskLevel ?? "medium").toUpperCase()} // {shipment.insured ? "INSURED" : "UNINSURED"}
            </Text>
            {canClaim ? (
              <Pressable onPress={() => onClaim(shipment.id)} style={{ marginTop: 5 }}>
                <Text style={{ fontFamily: terminalFont, color: terminalColors.cyan, fontSize: 10 }}>[ CLAIM ]</Text>
              </Pressable>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

function formatCountdown(ms: number): string {
  const seconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}m ${remainder}s`;
}

export { CourierBoard };
