import { View } from "react-native";
import CyberText from "@/components/cyber-text";
import MenuScreen from "@/components/menu-screen";
import NeonBorder from "@/components/neon-border";
import { useDemoStore } from "@/state/demo-store";
import { terminalColors } from "@/theme/terminal";

export default function NotificationsMenuRoute() {
  const systemMessage = useDemoStore((state) => state.systemMessage);
  const activeNews = useDemoStore((state) => state.activeNews);
  const notifications = useDemoStore((state) => state.notifications);
  const missedPeakLog = useDemoStore((state) => state.missedPeakLog);
  const raidRecoveryWindow = useDemoStore((state) => state.raidRecoveryWindow);
  const items = [
    { text: systemMessage.toUpperCase(), tone: "info" },
    ...(raidRecoveryWindow && !raidRecoveryWindow.restored
      ? [{ text: "RAID RECOVERY AVAILABLE: 50,000 0BOL OR 25 $OBOL ONCE THIS WEEK", tone: "warning" }]
      : []),
    ...missedPeakLog.slice(0, 5).map((entry) => ({
      text: `MISSED PEAK: ${entry.ticker} HIT ${entry.peakPrice.toFixed(2)} // MISSED +${entry.missedValue.toFixed(2)} 0BOL`,
      tone: "warning",
    })),
    ...notifications.map((item) => ({ text: item.message.toUpperCase(), tone: item.tone })),
    ...activeNews.slice(0, 4).map((news) => ({
      text: `MARKET SIGNAL: ${news.headline} // CRED ${Math.round(news.credibility * 100)}%`,
      tone: "warning",
    })),
  ];

  return (
    <MenuScreen title="SYSTEM NOTIFICATIONS">
      <NeonBorder active>
        {items.length ? (
          items.map((item, index) => {
            const color =
              item.tone === "danger"
                ? terminalColors.red
                : item.tone === "success"
                  ? terminalColors.green
                  : item.tone === "warning"
                    ? terminalColors.amber
                    : terminalColors.muted;
            return (
              <View key={`${item.text}-${index}`} style={{ borderBottomWidth: 1, borderBottomColor: terminalColors.borderDim, paddingVertical: 10 }}>
                <CyberText size={11} style={{ color }}>{item.text}</CyberText>
              </View>
            );
          })
        ) : (
          <CyberText tone="dim" size={12}>NO NOTIFICATIONS</CyberText>
        )}
      </NeonBorder>
    </MenuScreen>
  );
}
