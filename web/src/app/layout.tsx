import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CyberTrader Dev Lab",
  description: "Virtual studio workspace for CyberTrader: Age of Pantheon.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#050608",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-void text-chrome">{children}</body>
    </html>
  );
}
