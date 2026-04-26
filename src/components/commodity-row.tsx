import * as React from "react";
import { Image, Pressable, View } from "react-native";
import Svg, { Polyline } from "react-native-svg";
import CyberText from "@/components/cyber-text";
import { terminalColors } from "@/theme/terminal";

export const COMMODITY_ICON_MAP: Record<string, any> = {
  FDST: require("../assets/commodities/fractal_dust.png"),
  PGAS: require("../assets/commodities/plutonion_gas.png"),
  NGLS: require("../assets/commodities/neon_glass.png"),
  HXMD: require("../assets/commodities/helix_mud.png"),
  VBLM: require("../assets/commodities/void_bloom.png"),
  ORRS: require("../assets/commodities/oracle_resin.png"),
  SNPS: require("../assets/commodities/synapse_silk.png"),
  MTRX: require("../assets/commodities/matrix_salt.png"),
  AETH: require("../assets/commodities/aether_tabs.png"),
  BLCK: require("../assets/commodities/blacklight_serum.png"),
};

interface CommodityRowProps {
  ticker: string;
  name: string;
  price: number;
  changePercent: number;
  iconSource?: any;
  onPress: () => void;
  isSelected?: boolean;
  index?: number;
}

export default function CommodityRow({
  ticker,
  name,
  price,
  changePercent,
  iconSource,
  onPress,
  isSelected = false,
  index = 0,
}: CommodityRowProps) {
  const [pressed, setPressed] = React.useState(false);
  const isPositive = changePercent > 0;
  const isNegative = changePercent < 0;
  const prefix = isPositive ? "^" : isNegative ? "v" : "-";
  const color = isPositive
    ? terminalColors.green
    : isNegative
      ? terminalColors.red
      : terminalColors.muted;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setTimeout(() => setPressed(false), 100)}
      style={{
        minHeight: 82,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        backgroundColor: pressed
          ? terminalColors.cyanPress
          : index % 2 === 0
            ? terminalColors.panelEven
            : terminalColors.panelAlt,
        borderWidth: 1,
        borderColor: isSelected ? terminalColors.cyan : terminalColors.borderDim,
        borderRadius: 12,
        padding: 10,
        marginBottom: 8,
        shadowColor: isSelected ? terminalColors.cyan : "#000000",
        shadowOpacity: isSelected ? 0.34 : 0.18,
        shadowRadius: isSelected ? 14 : 8,
      }}
    >
      <View style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: terminalColors.cyanFill, alignItems: "center", justifyContent: "center" }}>
        <Image
          source={iconSource ?? COMMODITY_ICON_MAP[ticker]}
          resizeMode="contain"
          style={{ width: 38, height: 38 }}
        />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 8 }}>
          <CyberText size={14} weight="700" tone="cyan">
            {ticker}
          </CyberText>
          <CyberText size={15} tone="text" style={{ textAlign: "right" }}>
            {price.toFixed(2)}
          </CyberText>
        </View>
        <CyberText numberOfLines={1} size={11} tone="muted" style={{ marginTop: 3 }}>
          {name}
        </CyberText>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginTop: 8 }}>
          <View style={{ flex: 1, height: 22 }}>
            <RowSparkline changePercent={changePercent} color={color} />
          </View>
          <CyberText size={12} style={{ color, minWidth: 68, textAlign: "right" }}>
            {prefix} {Math.abs(changePercent).toFixed(1)}%
          </CyberText>
        </View>
      </View>
    </Pressable>
  );
}

export { CommodityRow };

function RowSparkline({ changePercent, color }: { changePercent: number; color: string }) {
  const direction = changePercent >= 0 ? 1 : -1;
  const amplitude = Math.min(15, Math.abs(changePercent) * 2 + 4);
  const points = Array.from({ length: 7 }).map((_, index) => {
    const x = (index / 6) * 100;
    const wave = Math.sin(index * 1.4) * 3;
    const trend = direction > 0 ? 18 - (index / 6) * amplitude : 6 + (index / 6) * amplitude;
    return `${x.toFixed(1)},${Math.max(2, Math.min(20, trend + wave)).toFixed(1)}`;
  }).join(" ");

  return (
    <Svg width="100%" height="22" viewBox="0 0 100 22">
      <Polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
