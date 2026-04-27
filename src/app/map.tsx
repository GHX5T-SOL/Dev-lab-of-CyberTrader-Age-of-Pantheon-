import { Pressable, ScrollView, View } from "react-native";
import { router } from "expo-router";
import Svg, { Circle, Line, Rect } from "react-native-svg";
import CyberText from "@/components/cyber-text";
import NeonBorder from "@/components/neon-border";
import { LOCATIONS } from "@/data/locations";
import { getActiveDistrictState } from "@/engine/district-state";
import { useDemoStore } from "@/state/demo-store";
import { terminalColors } from "@/theme/terminal";

const NODE_POSITIONS: Record<string, { x: number; y: number }> = {
  neon_plaza: { x: 48, y: 42 },
  tech_valley: { x: 72, y: 24 },
  the_port: { x: 24, y: 70 },
  the_slums: { x: 32, y: 36 },
  the_lab: { x: 76, y: 58 },
  the_greenhouse: { x: 55, y: 78 },
  crypto_exchange: { x: 62, y: 38 },
  black_market: { x: 18, y: 44 },
  the_rooftop: { x: 86, y: 18 },
  undercity: { x: 46, y: 88 },
};

function stateColor(state: string) {
  if (state === "BOOM" || state === "FESTIVAL") {
    return terminalColors.green;
  }
  if (state === "LOCKDOWN" || state === "BLACKOUT" || state === "MARKET_CRASH") {
    return terminalColors.red;
  }
  if (state === "GANG_CONTROL") {
    return terminalColors.amber;
  }
  return terminalColors.cyan;
}

export default function MapRoute() {
  const clock = useDemoStore((state) => state.clock);
  const world = useDemoStore((state) => state.world);
  const districtStates = useDemoStore((state) => state.districtStates);
  const startTravel = useDemoStore((state) => state.startTravel);
  const unlocked = LOCATIONS.filter((location) => location.unlocked);
  const current = LOCATIONS.find((location) => location.id === world.currentLocationId);
  const travelling = Boolean(world.travelDestinationId && world.travelEndTime && world.travelEndTime > clock.nowMs);
  const remaining = world.travelEndTime ? Math.max(0, Math.ceil((world.travelEndTime - clock.nowMs) / 1000)) : 0;

  return (
    <ScrollView contentContainerStyle={{ minHeight: "100%", padding: 14, paddingBottom: 36, backgroundColor: "transparent" }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <Pressable onPress={() => router.back()} style={{ paddingVertical: 8, paddingRight: 14 }}>
          <CyberText tone="muted" size={12}>{"<"} BACK</CyberText>
        </Pressable>
        <CyberText tone="cyan" size={11}>NEON VOID MAP</CyberText>
      </View>

      <NeonBorder active>
        <CyberText tone="cyan" size={24} weight="700">NEON VOID MAP</CyberText>
        <CyberText tone="muted" size={11} style={{ marginTop: 5 }}>
          ROUTES // DISTRICT STATES // TRAVEL WINDOWS
        </CyberText>
        {travelling ? (
          <CyberText tone="amber" size={12} style={{ marginTop: 12, fontVariant: ["tabular-nums"] }}>
            TRAVELLING // ETA {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, "0")}
          </CyberText>
        ) : null}
      </NeonBorder>

      <NeonBorder style={{ marginTop: 14 }}>
        <View style={{ height: 300, borderWidth: 1, borderColor: terminalColors.border, backgroundColor: terminalColors.glassStrong, shadowColor: terminalColors.cyan, shadowOpacity: 0.18, shadowRadius: 12 }}>
          <Svg width="100%" height="300" viewBox="0 0 100 100" preserveAspectRatio="none">
            <Rect x="0" y="0" width="100" height="100" fill="transparent" />
            {Array.from({ length: 8 }).map((_, index) => (
              <Line key={`v-${index}`} x1={index * 14} y1="0" x2={index * 14} y2="100" stroke={terminalColors.border} strokeWidth="0.3" />
            ))}
            {Array.from({ length: 8 }).map((_, index) => (
              <Line key={`h-${index}`} x1="0" y1={index * 14} x2="100" y2={index * 14} stroke={terminalColors.border} strokeWidth="0.3" />
            ))}
            {unlocked.map((location) => {
              const point = NODE_POSITIONS[location.id] ?? { x: 50, y: 50 };
              const district = getActiveDistrictState(districtStates, location.id, clock.nowMs);
              const color = stateColor(district.state);
              return (
                <Circle
                  key={location.id}
                  cx={point.x}
                  cy={point.y}
                  r={location.id === world.currentLocationId ? 4.5 : 3.1}
                  fill={location.id === world.currentLocationId ? color : terminalColors.background}
                  stroke={color}
                  strokeWidth="1"
                />
              );
            })}
          </Svg>
        </View>
      </NeonBorder>

      <View style={{ marginTop: 14, gap: 10 }}>
        {unlocked.map((location) => {
          const district = getActiveDistrictState(districtStates, location.id, clock.nowMs);
          const color = stateColor(district.state);
          const isCurrent = location.id === world.currentLocationId;
          return (
            <Pressable
              key={location.id}
              disabled={isCurrent || travelling}
              onPress={() => startTravel(location.id)}
              style={{
                borderWidth: 1,
                borderColor: isCurrent ? terminalColors.cyan : color,
                backgroundColor: terminalColors.glass,
                padding: 12,
                opacity: isCurrent ? 1 : travelling ? 0.45 : 0.92,
                shadowColor: color,
                shadowOpacity: isCurrent ? 0.4 : 0.16,
                shadowRadius: isCurrent ? 12 : 6,
              }}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 10 }}>
                <CyberText size={13} style={{ color }}>{location.name.toUpperCase()}</CyberText>
                <CyberText tone={isCurrent ? "cyan" : "muted"} size={11}>
                  {isCurrent ? "CURRENT" : `${location.travelTime}m`}
                </CyberText>
              </View>
              <CyberText tone="muted" size={10} style={{ marginTop: 6 }}>
                STATE {district.state} // PRICE MOD x{location.priceMod.toFixed(2)}
              </CyberText>
            </Pressable>
          );
        })}
      </View>

      {!unlocked.length ? (
        <CyberText tone="muted" size={12} style={{ marginTop: 20 }}>
          Map module loading...
        </CyberText>
      ) : null}
      <CyberText tone="dim" size={10} style={{ marginTop: 18 }}>
        CURRENT: {current?.name.toUpperCase() ?? "UNKNOWN"} // TRAVEL AWAY TO COUNTER BLACKOUTS AND SCANS.
      </CyberText>
    </ScrollView>
  );
}
