import type { ReactNode } from "react";
import { palette } from "@/theme/colors";
import CyberText from "@/components/cyber-text";

interface SystemLineProps {
  children: ReactNode;
  tone?: "cyan" | "acid" | "amber" | "heat" | "muted";
}

const TONES = {
  cyan: palette.accent.cyan,
  acid: palette.accent.acidGreen,
  amber: palette.warn.amber,
  heat: palette.danger.heat,
  muted: palette.fg.muted,
} as const;

export function SystemLine({ children, tone = "cyan" }: SystemLineProps) {
  return (
    <CyberText
      selectable
      style={{
        color: TONES[tone],
        fontSize: 14,
        lineHeight: 21,
      }}
    >
      {children}
    </CyberText>
  );
}
