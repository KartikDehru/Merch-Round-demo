import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { WorldProvider } from "@/lib/store";
import { SiteHeader } from "@/components/site-header";
import { DemoDock } from "@/components/demo-dock";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Merch Round — know before you print",
  description:
    "Don't gamble with your merchandise. Fans buy before the show, artists make only what's needed. Interactive demo.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-AU" className={jakarta.variable}>
      <body className="min-h-dvh font-sans">
        <WorldProvider>
          <SiteHeader />
          <main className="pb-28">{children}</main>
          <DemoDock />
        </WorldProvider>
      </body>
    </html>
  );
}
