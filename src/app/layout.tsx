import type { Metadata } from "next";
import { Anton, Bricolage_Grotesque } from "next/font/google";
import { WorldProvider } from "@/lib/store";
import { SiteHeader } from "@/components/site-header";
import { DemoDock } from "@/components/demo-dock";
import "./globals.css";

const anton = Anton({ variable: "--font-anton", weight: "400", subsets: ["latin"] });
const bricolage = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Merch Round — know before you print",
  description:
    "Find out who wants the shirt before you pay for it. Fans buy, and if the round hits the number it gets made. If not, nobody pays. Interactive demo.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-AU" className={`${anton.variable} ${bricolage.variable}`}>
      <body className="min-h-dvh">
        <WorldProvider>
          <SiteHeader />
          <main className="pb-28">{children}</main>
          <DemoDock />
        </WorldProvider>
      </body>
    </html>
  );
}
