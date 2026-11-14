import type { Metadata } from "next";
import { Assistant } from "next/font/google";
import { SiteChrome } from "@/components/site-chrome";
import "./globals.css";

const assistant = Assistant({
  variable: "--font-assistant",
  subsets: ["latin"],
  weight: "variable",
});

export const metadata: Metadata = {
  title: "Merch Round · Know before you print",
  description:
    "Let fans buy merch before you print. Produce only what's been asked for. Miss your number, and nobody is charged.",
  metadataBase: new URL("https://merchround.com"),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-AU" className={assistant.variable}>
      <body className="min-h-dvh font-sans">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
