import * as React from "react";
import {
  JetBrainsMono_400Regular,
  JetBrainsMono_600SemiBold,
  JetBrainsMono_700Bold,
  useFonts,
} from "@expo-google-fonts/jetbrains-mono";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BurgerMenu } from "@/components/burger-menu";
import { TerminalShell } from "@/components/terminal-shell";
import { MenuContext } from "@/context/menu-context";
import { useDemoBootstrap } from "@/hooks/use-demo-bootstrap";
import { useGameLoop } from "@/hooks/use-game-loop";
import { useDemoStore } from "@/state/demo-store";
import { terminalColors } from "@/theme/terminal";

const cyberNavigationTheme = {
  ...DarkTheme,
  dark: true,
  colors: {
    ...DarkTheme.colors,
    primary: terminalColors.cyan,
    background: "transparent",
    card: "transparent",
    text: terminalColors.text,
    border: terminalColors.borderDim,
    notification: terminalColors.amber,
  },
};

export default function RootLayout() {
  const [menuVisible, setMenuVisible] = React.useState(false);
  const [fontsLoaded] = useFonts({
    JetBrainsMono_400Regular,
    JetBrainsMono_600SemiBold,
    JetBrainsMono_700Bold,
  });
  const markInteraction = useDemoStore((state) => state.markInteraction);
  useDemoBootstrap();
  useGameLoop();

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView
      onTouchStart={markInteraction}
      style={{ flex: 1, backgroundColor: terminalColors.background }}
    >
      <StatusBar style="light" />
      <MenuContext.Provider
        value={{
          openMenu: () => setMenuVisible(true),
          closeMenu: () => setMenuVisible(false),
        }}
      >
        <TerminalShell>
          <ThemeProvider value={cyberNavigationTheme}>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: "transparent" },
                animation: "fade",
              }}
            />
          </ThemeProvider>
          <BurgerMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
        </TerminalShell>
      </MenuContext.Provider>
    </GestureHandlerRootView>
  );
}
