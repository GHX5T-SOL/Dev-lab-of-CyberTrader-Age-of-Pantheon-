import { ScrollView, Text, View } from "react-native";
import { getLocationDescription, getUnlockedLocations } from "@/data/locations";
import type { DistrictStateRecord } from "@/engine/types";
import { terminalColors, terminalFont } from "@/theme/terminal";

interface DistrictStripProps {
  districtStates: Record<string, DistrictStateRecord>;
}

export default function DistrictStrip({ districtStates }: DistrictStripProps) {
  return (
    <View style={{ marginTop: 12 }}>
      <Text style={{ marginHorizontal: 12, fontFamily: terminalFont, color: terminalColors.muted, fontSize: 9, letterSpacing: 1.4 }}>
        DISTRICT STRIP
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12, gap: 8, paddingTop: 8 }}>
        {getUnlockedLocations().map((location) => {
          const state = districtStates[location.id]?.state ?? "NORMAL";
          const color = colorForState(state);
          return (
            <View key={location.id} style={{ width: 160, borderWidth: 1, borderColor: color, backgroundColor: terminalColors.panel, padding: 9 }}>
              <Text style={{ fontFamily: terminalFont, color, fontSize: 10 }}>{location.name.toUpperCase()}</Text>
              <Text style={{ marginTop: 4, fontFamily: terminalFont, color: terminalColors.text, fontSize: 10 }}>{state}</Text>
              <Text style={{ marginTop: 4, fontFamily: terminalFont, color: terminalColors.muted, fontSize: 8 }} numberOfLines={2}>
                {getLocationDescription(location.id, state)}
              </Text>
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
