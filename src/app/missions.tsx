import * as React from "react";
import { Pressable, Text, View } from "react-native";
import ActionButton from "@/components/action-button";
import HeistModal from "@/components/heist-modal";
import MenuScreen from "@/components/menu-screen";
import MissionBanner from "@/components/mission-banner";
import NeonBorder from "@/components/neon-border";
import { NPCS } from "@/data/npcs";
import { getPortfolioValue } from "@/engine/heist-missions";
import { useDemoStore } from "@/state/demo-store";
import { terminalColors, terminalFont } from "@/theme/terminal";

export default function MissionsRoute() {
  const clock = useDemoStore((state) => state.clock);
  const prices = useDemoStore((state) => state.prices);
  const positions = useDemoStore((state) => state.positions);
  const balance = useDemoStore((state) => state.balanceObol);
  const pendingMission = useDemoStore((state) => state.pendingMission);
  const activeMission = useDemoStore((state) => state.activeMission);
  const missionHistory = useDemoStore((state) => state.missionHistory);
  const npcReputation = useDemoStore((state) => state.npcReputation);
  const npcRelationships = useDemoStore((state) => state.npcRelationships);
  const progression = useDemoStore((state) => state.progression);
  const activeHeistMission = useDemoStore((state) => state.activeHeistMission);
  const heistMissions = useDemoStore((state) => state.heistMissions);
  const createHeistDraft = useDemoStore((state) => state.createHeistDraft);
  const acceptHeistMission = useDemoStore((state) => state.acceptHeistMission);
  const resolveActiveHeist = useDemoStore((state) => state.resolveActiveHeist);
  const acceptMission = useDemoStore((state) => state.acceptMission);
  const declineMission = useDemoStore((state) => state.declineMission);
  const [heistModalVisible, setHeistModalVisible] = React.useState(false);
  const [collateral, setCollateral] = React.useState<25 | 50 | 75>(25);
  const portfolioValue = getPortfolioValue({ balance0Bol: balance, positions, prices });
  const heistDraft = createHeistDraft(collateral);

  return (
    <MenuScreen title="MISSION CONTACTS">
      {pendingMission || activeMission ? (
        <MissionBanner
          mission={(activeMission ?? pendingMission)!}
          nowMs={clock.nowMs}
          onAccept={acceptMission}
          onDecline={declineMission}
        />
      ) : (
        <NeonBorder active>
          <Text style={{ fontFamily: terminalFont, color: terminalColors.muted, fontSize: 12 }}>
            NO ACTIVE CONTRACT. KEEP THE DECK WARM.
          </Text>
        </NeonBorder>
      )}

      <NeonBorder style={{ marginTop: 14 }}>
        <Text style={{ fontFamily: terminalFont, color: terminalColors.cyan, fontSize: 12 }}>CONTACTS</Text>
        {NPCS.map((npc) => {
          const locked = progression.level < npc.unlockedAtRank;
          const relationship = npcRelationships[npc.id];
          return (
            <View key={npc.id} style={{ marginTop: 12, borderTopWidth: 1, borderTopColor: terminalColors.borderDim, paddingTop: 10 }}>
              <Text style={{ fontFamily: terminalFont, color: locked ? terminalColors.dim : terminalColors.text, fontSize: 12 }}>
                {npc.name.toUpperCase()} // {npc.faction.toUpperCase()}
              </Text>
              <Text style={{ marginTop: 4, fontFamily: terminalFont, color: terminalColors.muted, fontSize: 10 }}>
                {locked ? `LOCKED RANK ${npc.unlockedAtRank}` : npc.personality}
              </Text>
              <Text style={{ marginTop: 4, fontFamily: terminalFont, color: terminalColors.amber, fontSize: 10 }}>
                REP {relationship?.reputation ?? npcReputation[npc.id] ?? 0} // DONE {relationship?.completedMissions ?? 0} // FAIL {relationship?.failedMissions ?? 0}
              </Text>
              {relationship?.unlockedPerks.length ? (
                <Text style={{ marginTop: 4, fontFamily: terminalFont, color: terminalColors.green, fontSize: 9 }}>
                  PERK: {relationship.unlockedPerks[0]}
                </Text>
              ) : null}
            </View>
          );
        })}
      </NeonBorder>

      <NeonBorder style={{ marginTop: 14 }}>
        <Text style={{ fontFamily: terminalFont, color: terminalColors.red, fontSize: 12 }}>HEIST MISSIONS</Text>
        <Text style={{ marginTop: 5, fontFamily: terminalFont, color: terminalColors.muted, fontSize: 10 }}>
          OPT-IN COLLATERAL RISK ONLY. ACCESSIBLE AT RANK 5 OR THROUGH BLACK MARKET CONTACTS.
        </Text>
        {activeHeistMission ? (
          <View style={{ marginTop: 10, borderTopWidth: 1, borderTopColor: terminalColors.borderDim, paddingTop: 10 }}>
            <Text style={{ fontFamily: terminalFont, color: terminalColors.amber, fontSize: 11 }}>
              ACTIVE // {activeHeistMission.riskRating.toUpperCase()} // COLLATERAL {activeHeistMission.collateralValue} 0BOL
            </Text>
            <Text style={{ marginTop: 4, fontFamily: terminalFont, color: terminalColors.muted, fontSize: 10 }}>
              DEADLINE {Math.max(0, Math.ceil((activeHeistMission.endTimestamp - clock.nowMs) / 1000))}s // DANGEROUS FLASH EVENTS ATTACHED
            </Text>
            <View style={{ marginTop: 8 }}>
              <ActionButton variant="primary" label="[ RESOLVE HEIST RUN ]" onPress={() => void resolveActiveHeist()} />
            </View>
          </View>
        ) : (
          <View style={{ marginTop: 10 }}>
            <ActionButton variant="amber" label="[ PLAN HEIST ]" onPress={() => setHeistModalVisible(true)} />
          </View>
        )}
        {heistMissions.slice(0, 3).map((heist) => (
          <Text key={heist.id} style={{ marginTop: 7, fontFamily: terminalFont, color: heist.status === "success" ? terminalColors.green : heist.status === "failed" ? terminalColors.red : terminalColors.muted, fontSize: 9 }}>
            {heist.status.toUpperCase()} // {heist.collateralPercentage}% COLLATERAL // {heist.riskRating.toUpperCase()}
          </Text>
        ))}
      </NeonBorder>

      <NeonBorder style={{ marginTop: 14 }}>
        <Text style={{ fontFamily: terminalFont, color: terminalColors.cyan, fontSize: 12 }}>ARCHIVE</Text>
        {missionHistory.length ? (
          missionHistory.slice(0, 8).map((mission) => (
            <View key={mission.id} style={{ marginTop: 10, borderTopWidth: 1, borderTopColor: terminalColors.borderDim, paddingTop: 10 }}>
              <Text style={{ fontFamily: terminalFont, color: mission.completed ? terminalColors.green : terminalColors.amber, fontSize: 11 }}>
                {(mission.completed ? "COMPLETED" : mission.failed ? "FAILED" : mission.status.toUpperCase())} // {mission.title}
              </Text>
              <Text style={{ marginTop: 4, fontFamily: terminalFont, color: terminalColors.muted, fontSize: 10 }}>
                {mission.description}
              </Text>
            </View>
          ))
        ) : (
          <Text style={{ marginTop: 10, fontFamily: terminalFont, color: terminalColors.dim, fontSize: 11 }}>NO COMPLETED CONTRACTS</Text>
        )}
      </NeonBorder>

      {pendingMission ? (
        <View style={{ flexDirection: "row", gap: 10, marginTop: 14 }}>
          <Pressable onPress={acceptMission} style={{ flex: 1, borderWidth: 1, borderColor: terminalColors.cyan, padding: 10 }}>
            <Text style={{ fontFamily: terminalFont, color: terminalColors.cyan, textAlign: "center", fontSize: 11 }}>[ ACCEPT ]</Text>
          </Pressable>
          <Pressable onPress={declineMission} style={{ flex: 1, borderWidth: 1, borderColor: terminalColors.borderDim, padding: 10 }}>
            <Text style={{ fontFamily: terminalFont, color: terminalColors.muted, textAlign: "center", fontSize: 11 }}>[ DECLINE ]</Text>
          </Pressable>
        </View>
      ) : null}
      <HeistModal
        visible={heistModalVisible}
        portfolioValue={portfolioValue}
        draftMission={heistDraft}
        selectedCollateral={collateral}
        onSelectCollateral={setCollateral}
        onAccept={() => {
          void acceptHeistMission(collateral);
          setHeistModalVisible(false);
        }}
        onClose={() => setHeistModalVisible(false)}
      />
    </MenuScreen>
  );
}
