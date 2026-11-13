import type { Metadata } from "next";
import { Anton, Bricolage_Grotesque } from "next/font/google";
import { SiteChrome } from "@/components/site-chrome";
import "./globals.css";

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Merch Round — know before you print",
  description:
    "Pre-sell your merch to fans. Print only once you've hit your number. Miss it, and nobody is charged.",
  metadataBase: new URL("https://merchround.com"),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-AU" className={`${anton.variable} ${bricolage.variable}`}>
      <body className="min-h-dvh font-sans">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
