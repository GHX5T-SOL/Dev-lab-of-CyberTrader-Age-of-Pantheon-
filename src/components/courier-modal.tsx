import * as React from "react";
import { Modal, Pressable, View } from "react-native";
import ActionButton from "@/components/action-button";
import { COURIER_SERVICES, getUnlockedLocations, type CourierService } from "@/data/locations";
import { ENABLE_OBOL_TOKEN } from "@/engine/obol-shop";
import { terminalColors, terminalFont } from "@/theme/terminal";
import CyberText from "@/components/cyber-text";

interface CourierModalProps {
  visible: boolean;
  ticker: string;
  maxQuantity: number;
  currentLocationId: string;
  costMultiplier?: number;
  arrivalTimeMultiplier?: number;
  riskBonus?: number;
  riskMultiplier?: number;
  estimatedUnitValue?: number;
  onClose: () => void;
  onSend: (input: {
    quantity: number;
    destinationId: string;
    courierId: CourierService["id"];
    insured?: boolean;
  }) => void;
}

export default function CourierModal({
  visible,
  ticker,
  maxQuantity,
  currentLocationId,
  costMultiplier = 1,
  arrivalTimeMultiplier = 1,
  riskBonus = 0,
  riskMultiplier = 1,
  estimatedUnitValue = 0,
  onClose,
  onSend,
}: CourierModalProps) {
  const destinations = getUnlockedLocations().filter((location) => location.id !== currentLocationId);
  const [quantity, setQuantity] = React.useState(1);
  const [destinationId, setDestinationId] = React.useState(destinations[0]?.id ?? currentLocationId);
  const [courierId, setCourierId] = React.useState<CourierService["id"]>("shadow_haul");
  const [insured, setInsured] = React.useState(false);

  React.useEffect(() => {
    if (visible) {
      setQuantity(Math.max(1, Math.min(maxQuantity, 1)));
      setDestinationId(destinations[0]?.id ?? currentLocationId);
      setCourierId("shadow_haul");
      setInsured(false);
    }
  }, [currentLocationId, destinations, maxQuantity, visible]);

  const selectedService = COURIER_SERVICES.find((service) => service.id === courierId) ?? COURIER_SERVICES[1]!;
  const selectedLossChance = Math.min(0.95, selectedService.lossChance * riskMultiplier + riskBonus);
  const selectedRiskPercent = Math.round(selectedLossChance * 100);
  const selectedCost = Math.round(selectedService.cost * costMultiplier);
  const selectedDestination = destinations.find((location) => location.id === destinationId);
  const selectedEta = Math.max(1, Math.ceil((selectedDestination?.travelTime ?? 1) * arrivalTimeMultiplier));
  const insuranceObolCost = Math.min(10, Math.max(2, Math.ceil(selectedRiskPercent / 10)));
  const potentialLoss = Math.round(Math.max(estimatedUnitValue, 1) * quantity);
  const potentialProfit = Math.round(potentialLoss * 0.1);
  const effectiveRiskPercent = insured ? 0 : selectedRiskPercent;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={{ flex: 1, backgroundColor: terminalColors.modalBackdrop, alignItems: "center", justifyContent: "center", padding: 22 }}>
        <View style={{ width: "100%", maxWidth: 360, borderWidth: 1, borderColor: terminalColors.cyan, backgroundColor: terminalColors.panel, padding: 16 }}>
          <CyberText style={{ fontFamily: terminalFont, color: terminalColors.cyan, fontSize: 13 }}>
            SEND {ticker} VIA COURIER
          </CyberText>
          <CyberText style={{ marginTop: 12, fontFamily: terminalFont, color: terminalColors.muted, fontSize: 11 }}>
            QUANTITY {quantity}/{maxQuantity}
          </CyberText>
          <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
            <ActionButton variant="muted" label="[ - ]" onPress={() => setQuantity((value) => Math.max(1, value - 1))} />
            <ActionButton variant="muted" label="[ + ]" onPress={() => setQuantity((value) => Math.min(maxQuantity, value + 1))} />
          </View>

          <CyberText style={{ marginTop: 14, fontFamily: terminalFont, color: terminalColors.muted, fontSize: 11 }}>
            DESTINATION
          </CyberText>
          <View style={{ gap: 7, marginTop: 8 }}>
            {destinations.map((location) => (
              <Pressable
                key={location.id}
                onPress={() => setDestinationId(location.id)}
                style={{ borderWidth: 1, borderColor: destinationId === location.id ? terminalColors.cyan : terminalColors.borderDim, padding: 8 }}
              >
                <CyberText style={{ fontFamily: terminalFont, color: terminalColors.text, fontSize: 11 }}>
                  {location.name.toUpperCase()} // {location.travelTime}m
                </CyberText>
              </Pressable>
            ))}
          </View>

          <CyberText style={{ marginTop: 14, fontFamily: terminalFont, color: terminalColors.muted, fontSize: 11 }}>
            SERVICE
          </CyberText>
          <View style={{ gap: 7, marginTop: 8 }}>
            {COURIER_SERVICES.map((service) => (
              <Pressable
                key={service.id}
                onPress={() => setCourierId(service.id)}
                style={{ borderWidth: 1, borderColor: courierId === service.id ? terminalColors.amber : terminalColors.borderDim, padding: 8 }}
              >
                {(() => {
                  const adjustedLossChance = Math.min(0.95, service.lossChance * riskMultiplier + riskBonus);
                  const riskPercent = Math.round(adjustedLossChance * 100);
                  const effectiveCost = Math.round(service.cost * costMultiplier);
                  const riskColor = riskPercent >= 30 ? terminalColors.red : riskPercent >= 10 ? terminalColors.amber : terminalColors.green;
                  return (
                    <>
                <CyberText style={{ fontFamily: terminalFont, color: terminalColors.text, fontSize: 11 }}>
                  {service.name.toUpperCase()} // {effectiveCost} 0BOL // RISK {riskPercent}%
                </CyberText>
                <CyberText style={{ marginTop: 3, fontFamily: terminalFont, color: terminalColors.muted, fontSize: 9 }}>
                  ETA x{arrivalTimeMultiplier.toFixed(1)}
                </CyberText>
                <View style={{ height: 4, backgroundColor: terminalColors.borderDim, marginTop: 5 }}>
                  <View style={{ height: 4, width: `${riskPercent}%`, backgroundColor: riskColor }} />
                </View>
                    </>
                  );
                })()}
              </Pressable>
            ))}
          </View>

          <View style={{ marginTop: 14, borderWidth: 1, borderColor: terminalColors.borderDim, padding: 9 }}>
            <CyberText style={{ fontFamily: terminalFont, color: terminalColors.cyan, fontSize: 11 }}>
              ROUTE RISK // {effectiveRiskPercent}% LOSS PROBABILITY
            </CyberText>
            <CyberText style={{ marginTop: 4, fontFamily: terminalFont, color: terminalColors.muted, fontSize: 10 }}>
              COST {selectedCost} 0BOL // ETA {selectedEta}m // POTENTIAL UPSIDE +{potentialProfit} 0BOL
            </CyberText>
            <CyberText style={{ marginTop: 3, fontFamily: terminalFont, color: terminalColors.red, fontSize: 10 }}>
              POTENTIAL LOSS {potentialLoss} 0BOL IF INTERCEPTED
            </CyberText>
            <View style={{ height: 5, backgroundColor: terminalColors.borderDim, marginTop: 7 }}>
              <View
                style={{
                  height: 5,
                  width: `${effectiveRiskPercent}%`,
                  backgroundColor: effectiveRiskPercent >= 30 ? terminalColors.red : effectiveRiskPercent >= 10 ? terminalColors.amber : terminalColors.green,
                }}
              />
            </View>
            <Pressable
              onPress={() => ENABLE_OBOL_TOKEN && setInsured((value) => !value)}
              style={{
                marginTop: 9,
                borderWidth: 1,
                borderColor: insured ? terminalColors.green : terminalColors.borderDim,
                padding: 8,
                opacity: ENABLE_OBOL_TOKEN ? 1 : 0.55,
              }}
            >
              <CyberText style={{ fontFamily: terminalFont, color: insured ? terminalColors.green : terminalColors.amber, fontSize: 10 }}>
                {insured ? "[ INSURED ] " : "[ INSURE ] "}
                {insuranceObolCost} $OBOL (~${(insuranceObolCost * 0.1).toFixed(2)} USD) // GUARANTEED DELIVERY
              </CyberText>
              {!ENABLE_OBOL_TOKEN ? (
                <CyberText style={{ marginTop: 3, fontFamily: terminalFont, color: terminalColors.muted, fontSize: 9 }}>
                  TOKEN FEATURE FLAG OFF. STANDARD 0BOL ROUTE AVAILABLE.
                </CyberText>
              ) : null}
            </Pressable>
          </View>

          <View style={{ marginTop: 14 }}>
            <ActionButton
              variant="primary"
              label="[ SEND ]"
              onPress={() => onSend({ quantity, destinationId, courierId, insured })}
            />
          </View>
          <Pressable onPress={onClose} style={{ marginTop: 12, alignItems: "center" }}>
            <CyberText style={{ fontFamily: terminalFont, color: terminalColors.red, fontSize: 12 }}>[ CANCEL ]</CyberText>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

export { CourierModal };
