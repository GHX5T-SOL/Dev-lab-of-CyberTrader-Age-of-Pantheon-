import { View } from "react-native";
import type { BountySnapshot, DistrictStateRecord, PlayerRiskProfile, Resources } from "@/engine/types";
import { terminalColors, terminalFont } from "@/theme/terminal";
import CyberText from "@/components/cyber-text";

interface RiskRailProps {
  resources: Resources;
  bounty: BountySnapshot;
  district: DistrictStateRecord;
  riskProfile: PlayerRiskProfile;
}

export default function RiskRail({ resources, bounty, district, riskProfile }: RiskRailProps) {
  return (
    <View style={{ marginTop: 12, marginHorizontal: 12, borderWidth: 1, borderColor: colorForHeat(resources.heat), backgroundColor: terminalColors.panel, padding: 10 }}>
      <CyberText style={{ fontFamily: terminalFont, color: terminalColors.muted, fontSize: 9, letterSpacing: 1.4 }}>
        RISK RAIL
      </CyberText>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
        <RiskPill label="HEAT" value={`${resources.heat}%`} color={colorForHeat(resources.heat)} />
        <RiskPill label="BOUNTY" value={bounty.status} color={bounty.level >= 2 ? terminalColors.red : bounty.level === 1 ? terminalColors.amber : terminalColors.green} />
        <RiskPill label="SCAN" value={`${riskProfile.scannerAttention}%`} color={riskProfile.scannerAttention >= 70 ? terminalColors.red : terminalColors.cyan} />
        <RiskPill label="DISTRICT" value={district.state} color={district.state === "NORMAL" ? terminalColors.green : terminalColors.amber} />
      </View>
    </View>
  );
}

function RiskPill({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={{ borderWidth: 1, borderColor: color, paddingHorizontal: 8, paddingVertical: 5 }}>
      <CyberText style={{ fontFamily: terminalFont, color: terminalColors.muted, fontSize: 8 }}>{label}</CyberText>
      <CyberText style={{ marginTop: 2, fontFamily: terminalFont, color, fontSize: 10 }}>{value}</CyberText>
    </View>
  );
}

function colorForHeat(heat: number): string {
  if (heat >= 70) {
    return terminalColors.red;
  }
  if (heat >= 30) {
    return terminalColors.amber;
  }
  return terminalColors.green;
}

export { RiskRail };
