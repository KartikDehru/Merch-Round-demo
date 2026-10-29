import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingHeader, PreviewBar } from "@/components/marketing-header";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Merch Round — know before you print",
  description:
    "Pre-sell your merch to fans. Print only once you've hit your number. Miss it, and nobody is charged.",
  metadataBase: new URL("https://merchround.com"),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-AU" className={jakarta.variable}>
      <body className="min-h-dvh font-sans">
        <PreviewBar />
        <MarketingHeader />
        <main>{children}</main>
        <MarketingFooter />
      </body>
    </html>
  );
}
