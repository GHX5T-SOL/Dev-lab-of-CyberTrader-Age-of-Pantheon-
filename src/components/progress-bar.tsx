import Svg, { Rect } from "react-native-svg";
import { terminalColors } from "@/theme/terminal";

interface ProgressBarProps {
  value: number;
  color?: string;
  height?: number;
}

export default function ProgressBar({
  value,
  color = terminalColors.cyan,
  height = 6,
}: ProgressBarProps) {
  const width = Math.max(0, Math.min(100, value));

  return (
    <Svg width="100%" height={height} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none">
      <Rect x="0" y="0" width="100" height={height} fill={terminalColors.border} />
      <Rect x="0" y="0" width={width} height={height} fill={color} />
    </Svg>
  );
}

export { ProgressBar };
