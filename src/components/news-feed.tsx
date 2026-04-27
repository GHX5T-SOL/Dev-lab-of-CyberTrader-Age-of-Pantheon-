import { View } from "react-native";
import type { MarketNews } from "@/engine/types";
import { HoloPanel } from "@/components/holo-panel";
import { palette } from "@/theme/colors";
import CyberText from "@/components/cyber-text";

const monoFamily = process.env.EXPO_OS === "ios" ? "Menlo" : "monospace";

interface NewsFeedProps {
  news: MarketNews[];
}

export function NewsFeed({ news }: NewsFeedProps) {
  const visibleNews = news.slice(0, 3);

  return (
    <HoloPanel eyebrow="signal_feed" title="market rumors" tone={visibleNews.length ? "amber" : "cyan"}>
      {visibleNews.length === 0 ? (
        <CyberText selectable style={{ color: palette.fg.muted, lineHeight: 22 }}>
          No clean rumors on this tick. The tape is moving on raw flow.
        </CyberText>
      ) : (
        <View style={{ gap: 10 }}>
          {visibleNews.map((item) => (
            <View
              key={item.id}
              style={{
                borderLeftWidth: 2,
                borderLeftColor:
                  item.credibility >= 70 ? palette.accent.acidGreen : palette.warn.amber,
                paddingLeft: 10,
                gap: 4,
              }}
            >
              <CyberText selectable style={{ color: palette.fg.primary, lineHeight: 20 }}>
                {item.headline}
              </CyberText>
              <CyberText
                selectable
                style={{
                  color: palette.fg.muted,
                  fontFamily: monoFamily,
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                {item.affectedTickers.join(" / ")} // credibility {item.credibility}%
              </CyberText>
            </View>
          ))}
        </View>
      )}
    </HoloPanel>
  );
}
