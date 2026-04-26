import * as React from "react";
import { Text, type TextProps, type TextStyle } from "react-native";
import { terminalColors, terminalFont } from "@/theme/terminal";

interface CyberTextProps extends TextProps {
  tone?: "text" | "muted" | "dim" | "cyan" | "green" | "amber" | "red" | "purple" | "magenta" | "yellow";
  size?: number;
  weight?: TextStyle["fontWeight"];
}

export default function CyberText({
  tone = "text",
  size = 12,
  weight,
  style,
  children,
  ...props
}: CyberTextProps) {
  const fontFamily = weight === "700" ? "JetBrainsMono_700Bold" : weight === "600" ? "JetBrainsMono_600SemiBold" : terminalFont;

  return (
    <Text
      {...props}
      style={[
        {
          fontFamily,
          color: terminalColors[tone],
          fontSize: size,
          fontWeight: weight,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

export { CyberText };
