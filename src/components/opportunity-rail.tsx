import { Pressable, ScrollView, Text, View } from "react-native";
import type { FlashEvent, MarketWhisper, Mission, PantheonShardCliffhanger } from "@/engine/types";
import { terminalColors, terminalFont } from "@/theme/terminal";

interface OpportunityRailProps {
  flashEvent: FlashEvent | null;
  pendingMission: Mission | null;
  activeMission: Mission | null;
  shard: PantheonShardCliffhanger | null;
  whispers: MarketWhisper[];
  nowMs: number;
  onPress?: () => void;
}

export default function OpportunityRail({
  flashEvent,
  pendingMission,
  activeMission,
  shard,
  whispers,
  nowMs,
  onPress,
}: OpportunityRailProps) {
  const cards: { id: string; title: string; detail: string; tone: string }[] = [];

  if (flashEvent) {
    cards.push({
      id: flashEvent.id,
      title: flashEvent.headline,
      detail: countdown(flashEvent.endTimestamp - nowMs),
      tone: terminalColors.amber,
    });
  }
  if (activeMission || pendingMission) {
    const mission = (activeMission ?? pendingMission)!;
    cards.push({
      id: mission.id,
      title: mission.title,
      detail: mission.accepted ? countdown(mission.expiresAtTimestamp - nowMs) : "ACCEPT WINDOW",
      tone: terminalColors.cyan,
    });
  }
  if (shard) {
    cards.push({
      id: "pantheon_shard",
      title: shard.headline,
      detail: countdown(shard.expiresAt - nowMs),
      tone: terminalColors.red,
    });
  }
  if (whispers[0]) {
    cards.push({
      id: whispers[0].id,
      title: "WHISPER",
      detail: whispers[0].message,
      tone: terminalColors.muted,
    });
  }
  if (!cards.length) {
    cards.push({
      id: "safe_stop",
      title: "SAFE STOP",
      detail: "Quiet window. Suggested move: scout one low-heat trade.",
      tone: terminalColors.green,
    });
  }

  return (
    <View style={{ marginTop: 14 }}>
      <Text style={{ marginHorizontal: 12, fontFamily: terminalFont, color: terminalColors.muted, fontSize: 9, letterSpacing: 1.4 }}>
        OPPORTUNITY RAIL
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12, gap: 8, paddingTop: 8 }}>
        {cards.map((card) => (
          <Pressable
            key={card.id}
            onPress={onPress}
            style={{ width: 210, borderWidth: 1, borderColor: card.tone, backgroundColor: terminalColors.panel, padding: 10 }}
          >
            <Text style={{ fontFamily: terminalFont, color: card.tone, fontSize: 11 }} numberOfLines={1}>
              {card.title.toUpperCase()}
            </Text>
            <Text style={{ marginTop: 5, fontFamily: terminalFont, color: terminalColors.text, fontSize: 10 }} numberOfLines={2}>
              {card.detail}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

function countdown(ms: number): string {
  const seconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

export { OpportunityRail };
