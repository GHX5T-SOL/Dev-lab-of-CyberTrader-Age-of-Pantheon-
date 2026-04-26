import { View } from "react-native";
import CyberText from "@/components/cyber-text";
import MenuScreen from "@/components/menu-screen";
import NeonBorder from "@/components/neon-border";

export default function LegalMenuRoute() {
  return (
    <MenuScreen title="LEGAL DISCLOSURES">
      <NeonBorder active>
        <View style={{ gap: 12 }}>
          <CyberText tone="red" size={14}>THIS IS A GAME. NOT FINANCIAL ADVICE.</CyberText>
          <CyberText tone="amber" size={12} style={{ lineHeight: 18 }}>
            THIS IS A GAME, NOT AN INVESTMENT. $OBOL ITEMS ARE FIXED PRICE, OPTIONAL, AND NEVER RANDOMIZED.
          </CyberText>
          <CyberText tone="text" size={11} style={{ lineHeight: 18 }}>
            0BOL is a soft in-game currency for progression and local demo trading. It is non-withdrawable and has no cash value.
          </CyberText>
          <CyberText tone="text" size={11} style={{ lineHeight: 18 }}>
            $OBOL is an optional Solana token layer planned for supported regions and compliant flows only. The Phase 1 demo does not require a wallet.
          </CyberText>
          <CyberText tone="green" size={11} style={{ lineHeight: 18 }}>
            No gambling loops. No loot boxes. Demo trades use deterministic local simulation and fictional commodities.
          </CyberText>
        </View>
      </NeonBorder>
    </MenuScreen>
  );
}
