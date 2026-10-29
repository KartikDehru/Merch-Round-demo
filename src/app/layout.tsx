import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { SiteChrome } from "@/components/site-chrome";
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
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
