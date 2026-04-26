import { View } from "react-native";
import CyberText from "@/components/cyber-text";
import MenuScreen from "@/components/menu-screen";
import NeonBorder from "@/components/neon-border";
import { useDemoStore } from "@/state/demo-store";
import { terminalColors } from "@/theme/terminal";

const SHARD = String.raw`
   /\ 
  /##\
 <####>
  \##/
   \/
  /__\
`;

export default function ProfileMenuRoute() {
  const handle = useDemoStore((state) => state.handle);
  const profile = useDemoStore((state) => state.profile);
  const positions = useDemoStore((state) => state.positions);
  const balance = useDemoStore((state) => state.balanceObol);
  const playerLore = useDemoStore((state) => state.playerLore);
  const pnl = Object.values(positions).reduce((total, item) => total + item.unrealizedPnl + item.realizedPnl, 0);

  return (
    <MenuScreen title="EIDOLON PROFILE">
      <NeonBorder active>
        <CyberText tone="cyan" size={11}>{SHARD}</CyberText>
        <View style={{ gap: 8 }}>
          <CyberText tone="text" size={12}>HANDLE: {handle || "UNCLAIMED"}</CyberText>
          <CyberText tone="muted" size={12}>WALLET: {profile?.walletAddress ? `${profile.walletAddress.slice(0, 6)}...${profile.walletAddress.slice(-4)}` : "LOCAL DEV IDENTITY"}</CyberText>
          <CyberText tone="amber" size={12}>OS TIER: {profile?.osTier ?? "PIRATE"}</CyberText>
          <CyberText tone="text" size={12}>RANK: {profile?.rank ?? 1}</CyberText>
          <CyberText tone="muted" size={12}>FACTION: {profile?.faction ?? "UNAFFILIATED"}</CyberText>
          <CyberText tone="muted" size={12}>CREATED: {profile?.createdAt ?? "LOCAL SESSION"}</CyberText>
          <CyberText tone="green" size={12}>TOTAL PNL: {pnl.toFixed(2)} 0BOL</CyberText>
          <CyberText tone="cyan" size={12}>LIQUID BALANCE: {balance.toFixed(0)} 0BOL</CyberText>
        </View>
      </NeonBorder>
      <NeonBorder style={{ marginTop: 14 }}>
        <CyberText tone="cyan" size={12}>RECOVERED MEMORIES</CyberText>
        {playerLore.length ? (
          playerLore.map((lore) => (
            <View key={lore.id} style={{ marginTop: 10, borderTopWidth: 1, borderTopColor: terminalColors.borderDim, paddingTop: 10 }}>
              <CyberText tone="amber" size={11}>
                RANK {lore.rankLevel} // {lore.title.toUpperCase()}
              </CyberText>
              <CyberText tone="text" size={10} style={{ marginTop: 5, lineHeight: 16 }}>
                {lore.body}
              </CyberText>
            </View>
          ))
        ) : (
          <CyberText tone="muted" size={10} style={{ marginTop: 10 }}>
            NO MEMORY SHARDS RECOVERED. RANK 5 WILL OPEN THE FIRST FRACTURE.
          </CyberText>
        )}
      </NeonBorder>
    </MenuScreen>
  );
}
