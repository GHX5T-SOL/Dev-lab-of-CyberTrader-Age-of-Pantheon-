import { Pressable, Text, View } from "react-native";
import NeonBorder from "@/components/neon-border";
import type { AwayReport } from "@/engine/types";
import { terminalColors, terminalFont } from "@/theme/terminal";

interface AwayReportProps {
  report: AwayReport | null;
  onDismiss: () => void;
}

export default function AwayReportPanel({ report, onDismiss }: AwayReportProps) {
  if (!report || report.dismissed) {
    return null;
  }

  return (
    <NeonBorder active style={{ marginTop: 14, marginHorizontal: 12, borderColor: terminalColors.amber }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
        <Text style={{ flex: 1, fontFamily: terminalFont, color: terminalColors.amber, fontSize: 12 }}>
          WHILE YOU WERE AWAY ({report.minutesAway} MIN)
        </Text>
        <Pressable onPress={onDismiss}>
          <Text style={{ fontFamily: terminalFont, color: terminalColors.muted, fontSize: 11 }}>[DISMISS]</Text>
        </Pressable>
      </View>
      <View style={{ marginTop: 10, gap: 7 }}>
        {report.courierResults.map((result) => (
          <Text key={`courier-${result.id}`} style={{ fontFamily: terminalFont, color: result.result === "arrived" ? terminalColors.green : terminalColors.red, fontSize: 10 }}>
            {result.result === "arrived" ? "✓" : "x"} COURIER: {result.quantity} {result.ticker} {result.result.toUpperCase()}
          </Text>
        ))}
        {report.expiredMissions.map((mission) => (
          <Text key={`mission-${mission.id}`} style={{ fontFamily: terminalFont, color: terminalColors.amber, fontSize: 10 }}>
            ! MISSION EXPIRED: {mission.title}
          </Text>
        ))}
        {report.districtChanges.map((change) => (
          <Text key={`district-${change.locationId}-${change.newState}`} style={{ fontFamily: terminalFont, color: terminalColors.cyan, fontSize: 10 }}>
            ! DISTRICT: {change.locationId} {change.oldState} {"->"} {change.newState}
          </Text>
        ))}
        {report.newContacts.map((contact) => (
          <Text key={`contact-${contact.npcId}`} style={{ fontFamily: terminalFont, color: terminalColors.green, fontSize: 10 }}>
            ! CONTACT: {contact.message}
          </Text>
        ))}
        {report.claimables.map((claimable, index) => (
          <Text key={`claimable-${index}`} style={{ fontFamily: terminalFont, color: terminalColors.amber, fontSize: 10 }}>
            $ CLAIMABLE: {claimable.type.toUpperCase()} // {claimable.reward}
          </Text>
        ))}
        {report.items.map((item) => (
          <Text
            key={item.id}
            style={{
              fontFamily: terminalFont,
              color: item.tone === "success"
                ? terminalColors.green
                : item.tone === "danger"
                  ? terminalColors.red
                  : item.tone === "warning"
                    ? terminalColors.amber
                    : terminalColors.muted,
              fontSize: 10,
            }}
          >
            {item.message}
          </Text>
        ))}
      </View>
    </NeonBorder>
  );
}

export { AwayReportPanel };
