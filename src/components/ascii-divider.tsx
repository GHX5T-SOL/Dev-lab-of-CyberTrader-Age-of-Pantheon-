import { terminalColors } from "@/theme/terminal";
import CyberText from "@/components/cyber-text";

interface AsciiDividerProps {
  label?: string;
}

export default function AsciiDivider({ label }: AsciiDividerProps) {
  const content = label ? `──────── ${label} ────────` : "─────────────────────────────";
  return (
    <CyberText
      style={{
        fontSize: 10,
        color: terminalColors.border,
        textAlign: "center",
        marginVertical: 8,
      }}
    >
      {content}
    </CyberText>
  );
}

export { AsciiDivider };
