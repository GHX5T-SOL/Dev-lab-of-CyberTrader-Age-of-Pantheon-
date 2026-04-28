import { Pressable, View } from "react-native";
import NeonBorder from "@/components/neon-border";
import type { AwayReport } from "@/engine/types";
import { terminalColors, terminalFont } from "@/theme/terminal";
import CyberText from "@/components/cyber-text";

interface AwayReportProps {
  report: AwayReport | null;
  onDismiss: () => void;
  onPrimaryAction?: (action: NonNullable<AwayReport["primaryAction"]>["action"]) => void;
}

export default function AwayReportPanel({ report, onDismiss, onPrimaryAction }: AwayReportProps) {
  if (!report || report.dismissed) {
    return null;
  }

  return (
    <NeonBorder active style={{ marginTop: 14, marginHorizontal: 12, borderColor: terminalColors.amber }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
        <CyberText style={{ flex: 1, fontFamily: terminalFont, color: terminalColors.amber, fontSize: 12 }}>
          WHILE YOU WERE AWAY ({report.minutesAway} MIN)
        </CyberText>
        <Pressable onPress={onDismiss}>
          <CyberText style={{ fontFamily: terminalFont, color: terminalColors.muted, fontSize: 11 }}>[DISMISS]</CyberText>
        </Pressable>
      </View>
      {report.primaryAction ? (
        <Pressable
          onPress={() => onPrimaryAction?.(report.primaryAction!.action)}
          style={{ marginTop: 10, borderWidth: 1, borderColor: terminalColors.green, borderRadius: 0, backgroundColor: "rgba(0,255,178,0.12)", paddingHorizontal: 12, paddingVertical: 9 }}
        >
          <CyberText style={{ fontFamily: terminalFont, color: terminalColors.green, fontSize: 11, textAlign: "center" }}>
            [ {report.primaryAction.label} ]
          </CyberText>
          <CyberText style={{ marginTop: 4, fontFamily: terminalFont, color: terminalColors.text, fontSize: 10, textAlign: "center" }}>
            {report.primaryAction.message}
          </CyberText>
        </Pressable>
      ) : null}
      <View style={{ marginTop: 10, gap: 7 }}>
        {report.courierResults.map((result) => (
          <CyberText key={`courier-${result.id}`} style={{ fontFamily: terminalFont, color: result.result === "arrived" ? terminalColors.green : terminalColors.red, fontSize: 10 }}>
            {result.result === "arrived" ? "✓" : "x"} COURIER: {result.quantity} {result.ticker} {result.result.toUpperCase()}
          </CyberText>
        ))}
        {report.expiredMissions.map((mission) => (
          <CyberText key={`mission-${mission.id}`} style={{ fontFamily: terminalFont, color: terminalColors.amber, fontSize: 10 }}>
            ! MISSION EXPIRED: {mission.title}
          </CyberText>
        ))}
        {report.districtChanges.map((change) => (
          <CyberText key={`district-${change.locationId}-${change.newState}`} style={{ fontFamily: terminalFont, color: terminalColors.cyan, fontSize: 10 }}>
            ! DISTRICT: {change.locationId} {change.oldState} {"->"} {change.newState}
          </CyberText>
        ))}
        {report.newContacts.map((contact) => (
          <CyberText key={`contact-${contact.npcId}`} style={{ fontFamily: terminalFont, color: terminalColors.green, fontSize: 10 }}>
            ! CONTACT: {contact.message}
          </CyberText>
        ))}
        {report.claimables.map((claimable, index) => (
          <CyberText key={`claimable-${index}`} style={{ fontFamily: terminalFont, color: terminalColors.amber, fontSize: 10 }}>
            $ CLAIMABLE: {claimable.type.toUpperCase()} // {claimable.reward}
          </CyberText>
        ))}
        {report.items.map((item) => (
          <CyberText
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
          </CyberText>
        ))}
      </View>
    </NeonBorder>
  );
}

export { AwayReportPanel };
