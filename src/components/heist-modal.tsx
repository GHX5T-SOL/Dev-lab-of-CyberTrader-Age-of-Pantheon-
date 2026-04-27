import { Modal, Pressable, View } from "react-native";
import ActionButton from "@/components/action-button";
import type { HeistMission } from "@/engine/types";
import { HEIST_COLLATERAL_OPTIONS } from "@/engine/heist-missions";
import { terminalColors, terminalFont } from "@/theme/terminal";
import CyberText from "@/components/cyber-text";

interface HeistModalProps {
  visible: boolean;
  portfolioValue: number;
  draftMission: HeistMission | null;
  selectedCollateral: 25 | 50 | 75;
  onSelectCollateral: (value: 25 | 50 | 75) => void;
  onAccept: () => void;
  onClose: () => void;
}

export default function HeistModal({
  visible,
  portfolioValue,
  draftMission,
  selectedCollateral,
  onSelectCollateral,
  onAccept,
  onClose,
}: HeistModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={{ flex: 1, backgroundColor: terminalColors.modalBackdrop, alignItems: "center", justifyContent: "center", padding: 22 }}>
        <View style={{ width: "100%", maxWidth: 360, borderWidth: 1, borderColor: terminalColors.red, backgroundColor: terminalColors.panel, padding: 16 }}>
          <CyberText style={{ fontFamily: terminalFont, color: terminalColors.red, fontSize: 14 }}>
            BLACK MARKET HEIST
          </CyberText>
          <CyberText style={{ marginTop: 8, fontFamily: terminalFont, color: terminalColors.muted, fontSize: 10 }}>
            OPT-IN WIPE RISK. COLLATERAL CAN BE LOST PERMANENTLY. SUCCESS PAYS 2.5X.
          </CyberText>
          <CyberText style={{ marginTop: 12, fontFamily: terminalFont, color: terminalColors.text, fontSize: 11 }}>
            PORTFOLIO VALUE: {Math.round(portfolioValue)} 0BOL
          </CyberText>
          <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
            {HEIST_COLLATERAL_OPTIONS.map((option) => (
              <Pressable
                key={option}
                onPress={() => onSelectCollateral(option)}
                style={{ flex: 1, borderWidth: 1, borderColor: selectedCollateral === option ? terminalColors.red : terminalColors.borderDim, padding: 8 }}
              >
                <CyberText style={{ fontFamily: terminalFont, color: selectedCollateral === option ? terminalColors.red : terminalColors.muted, textAlign: "center", fontSize: 11 }}>
                  {option}%
                </CyberText>
              </Pressable>
            ))}
          </View>
          {draftMission ? (
            <View style={{ marginTop: 12 }}>
              <CyberText style={{ fontFamily: terminalFont, color: terminalColors.amber, fontSize: 11 }}>
                RISK: {draftMission.riskRating.toUpperCase()}
              </CyberText>
              <CyberText style={{ marginTop: 4, fontFamily: terminalFont, color: terminalColors.text, fontSize: 10 }}>
                COLLATERAL: {draftMission.collateralValue} 0BOL // PAYOUT: {Math.round(draftMission.collateralValue * draftMission.payoutMultiplier)} 0BOL
              </CyberText>
            </View>
          ) : null}
          <View style={{ marginTop: 14 }}>
            <ActionButton variant="primary" label="[ ACCEPT HEIST ]" onPress={onAccept} />
          </View>
          <Pressable onPress={onClose} style={{ marginTop: 12, alignItems: "center" }}>
            <CyberText style={{ fontFamily: terminalFont, color: terminalColors.muted, fontSize: 12 }}>[ CANCEL ]</CyberText>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

export { HeistModal };
