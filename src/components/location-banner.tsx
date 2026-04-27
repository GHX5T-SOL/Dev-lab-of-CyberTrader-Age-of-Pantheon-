import { Pressable, View } from "react-native";
import { getLocation } from "@/data/locations";
import type { DistrictState } from "@/engine/types";
import { displayFont, terminalColors, terminalFont } from "@/theme/terminal";
import CyberText from "@/components/cyber-text";

interface LocationBannerProps {
  currentLocationId: string;
  travelDestinationId: string | null;
  travelEndTime: number | null;
  nowMs: number;
  districtState?: DistrictState;
  onTravelPress: () => void;
}

export default function LocationBanner({
  currentLocationId,
  travelDestinationId,
  travelEndTime,
  nowMs,
  districtState = "NORMAL",
  onTravelPress,
}: LocationBannerProps) {
  const current = getLocation(currentLocationId);
  const destination = getLocation(travelDestinationId);
  const remainingMs = travelEndTime ? Math.max(0, travelEndTime - nowMs) : 0;
  const etaMinutes = Math.floor(remainingMs / 60_000);
  const etaSeconds = Math.floor((remainingMs % 60_000) / 1000);
  const travelling = Boolean(travelDestinationId && remainingMs > 0);
  const stateColor = getStateColor(districtState);

  return (
    <View
      style={{
        marginTop: 12,
        borderWidth: 1,
        borderColor: stateColor,
        backgroundColor: terminalColors.glass,
        padding: 12,
        shadowColor: stateColor,
        shadowOpacity: districtState === "NORMAL" ? 0.16 : 0.45,
        shadowRadius: districtState === "BLACKOUT" ? 4 : 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
      }}
    >
      <View style={{ flex: 1 }}>
        <CyberText style={{ fontFamily: displayFont, color: terminalColors.muted, fontSize: 9, textTransform: "uppercase" }}>
          LOCATION
        </CyberText>
        <CyberText style={{ fontFamily: displayFont, color: terminalColors.cyan, fontSize: 14, fontWeight: "800" }}>
          {travelling
            ? `TRAVELLING TO ${destination.name.toUpperCase()}`
            : current.name.toUpperCase()}
        </CyberText>
        <CyberText style={{ marginTop: 3, fontFamily: terminalFont, color: stateColor, fontSize: 10 }}>
          DISTRICT STATE: {districtState}
        </CyberText>
        {travelling ? (
          <CyberText style={{ marginTop: 3, fontFamily: terminalFont, color: terminalColors.amber, fontSize: 10 }}>
            ETA {etaMinutes}m {etaSeconds}s
          </CyberText>
        ) : null}
      </View>
      <Pressable
        onPress={onTravelPress}
        style={{
          borderWidth: 1,
          borderColor: terminalColors.cyan,
          paddingHorizontal: 14,
          paddingVertical: 9,
          backgroundColor: terminalColors.cyanFill,
          shadowColor: terminalColors.cyan,
          shadowOpacity: 0.22,
          shadowRadius: 8,
        }}
      >
        <CyberText style={{ fontFamily: terminalFont, color: terminalColors.cyan, fontSize: 11 }}>
          {travelling ? "[ROUTE]" : "[TRAVEL]"}
        </CyberText>
      </Pressable>
    </View>
  );
}

export { LocationBanner };

function getStateColor(state: DistrictState): string {
  if (state === "BOOM") {
    return terminalColors.green;
  }
  if (state === "LOCKDOWN") {
    return terminalColors.red;
  }
  if (state === "BLACKOUT") {
    return terminalColors.dim;
  }
  if (state === "FESTIVAL") {
    return terminalColors.amber;
  }
  if (state === "GANG_CONTROL") {
    return terminalColors.amber;
  }
  if (state === "MARKET_CRASH") {
    return terminalColors.red;
  }
  return terminalColors.borderDim;
}
