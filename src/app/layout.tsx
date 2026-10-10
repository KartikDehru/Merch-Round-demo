import type { Metadata } from "next";
import { Bricolage_Grotesque, Pixelify_Sans, Spline_Sans_Mono } from "next/font/google";
import { WorldProvider } from "@/lib/store";
import { SiteHeader } from "@/components/site-header";
import { DemoDock } from "@/components/demo-dock";
import "./globals.css";

const bricolage = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"] });
const splineMono = Spline_Sans_Mono({ variable: "--font-spline-mono", subsets: ["latin"] });
const pixelify = Pixelify_Sans({ variable: "--font-pixelify", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Merch Round — know before you print",
  description:
    "Artists set the number. Fans pledge. Hit it and it gets made. Miss it and nobody pays. Interactive demo.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-AU" className={`${bricolage.variable} ${splineMono.variable} ${pixelify.variable}`}>
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
