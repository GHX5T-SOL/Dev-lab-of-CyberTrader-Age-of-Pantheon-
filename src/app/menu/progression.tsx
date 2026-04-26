import { View } from "react-native";
import CyberText from "@/components/cyber-text";
import MenuScreen from "@/components/menu-screen";
import NeonBorder from "@/components/neon-border";
import { useDemoStore } from "@/state/demo-store";
import { terminalColors } from "@/theme/terminal";

export default function ProgressionMenuRoute() {
  const profile = useDemoStore((state) => state.profile);
  const rank = profile?.rank ?? 1;
  const xp = rank * 125;
  const nextRank = rank + 1;
  const xpNeeded = Math.max(0, nextRank * 250 - xp);

  return (
    <MenuScreen title="OS UPGRADE PATH">
      <View style={{ gap: 12 }}>
        {[
          ["AG3NT_0S//pIRAT3", "CURRENT", "Local trades, low-heat market access, dev identity."],
          ["AgentOS", "LOCKED (rank 5)", "Missions, active eAgent pressure, token-gated systems."],
          ["PantheonOS", "LOCKED (rank 20)", "Shard reconstruction, guild control, endgame authority."],
        ].map(([name, status, body], index) => (
          <NeonBorder key={name} active={index === 0}>
            <CyberText size={13} style={{ color: index === 0 ? terminalColors.cyan : terminalColors.dim }}>{name} - {status}</CyberText>
            <CyberText tone="muted" size={11} style={{ marginTop: 8 }}>{body}</CyberText>
          </NeonBorder>
        ))}
        <NeonBorder>
          <CyberText tone="text" size={12}>RANK XP: {xp}</CyberText>
          <View style={{ height: 6, backgroundColor: terminalColors.borderDim, marginTop: 8 }}>
            <View style={{ height: 6, width: `${Math.min(100, (xp / (nextRank * 250)) * 100)}%`, backgroundColor: terminalColors.amber }} />
          </View>
          <CyberText tone="amber" size={11} style={{ marginTop: 8 }}>NEXT: RANK {nextRank} - {xpNeeded} XP REMAINING</CyberText>
        </NeonBorder>
      </View>
    </MenuScreen>
  );
}
