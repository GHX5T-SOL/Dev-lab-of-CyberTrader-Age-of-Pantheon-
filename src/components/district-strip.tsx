import { ScrollView, View } from "react-native";
import { getLocationDescription, getUnlockedLocations } from "@/data/locations";
import type { DistrictStateRecord } from "@/engine/types";
import { terminalColors, terminalFont } from "@/theme/terminal";
import CyberText from "@/components/cyber-text";

interface DistrictStripProps {
  districtStates: Record<string, DistrictStateRecord>;
}

export default function DistrictStrip({ districtStates }: DistrictStripProps) {
  return (
    <View style={{ marginTop: 12 }}>
      <CyberText style={{ marginHorizontal: 12, fontFamily: terminalFont, color: terminalColors.muted, fontSize: 9, letterSpacing: 1.4 }}>
        DISTRICT STRIP
      </CyberText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12, gap: 8, paddingTop: 8 }}>
        {getUnlockedLocations().map((location) => {
          const state = districtStates[location.id]?.state ?? "NORMAL";
          const color = colorForState(state);
          return (
            <View key={location.id} style={{ width: 160, borderWidth: 1, borderColor: color, backgroundColor: terminalColors.panel, padding: 9 }}>
              <CyberText style={{ fontFamily: terminalFont, color, fontSize: 10 }}>{location.name.toUpperCase()}</CyberText>
              <CyberText style={{ marginTop: 4, fontFamily: terminalFont, color: terminalColors.text, fontSize: 10 }}>{state}</CyberText>
              <CyberText style={{ marginTop: 4, fontFamily: terminalFont, color: terminalColors.muted, fontSize: 8 }} numberOfLines={2}>
                {getLocationDescription(location.id, state)}
              </CyberText>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

function colorForState(state: string): string {
  if (state === "BOOM") {
    return terminalColors.green;
  }
  if (state === "BLACKOUT" || state === "LOCKDOWN" || state === "MARKET_CRASH") {
    return terminalColors.red;
  }
  if (state === "FESTIVAL" || state === "GANG_CONTROL") {
    return terminalColors.amber;
  }
  return terminalColors.cyan;
}

export { DistrictStrip };
