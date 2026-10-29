"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { MarketingFooter } from "./marketing-footer";
import { MarketingHeader, PreviewBar } from "./marketing-header";
import { Logo } from "./visuals";

export function SiteChrome({ children }: { children: ReactNode }) {
  const path = usePathname() || "/";
  const inTry = path === "/try" || path.startsWith("/try/");

  return (
    <>
      <PreviewBar />
      {inTry ? <TryHeader /> : <MarketingHeader />}
      <main>{children}</main>
      {!inTry && <MarketingFooter />}
    </>
  );
}

function TryHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/95 backdrop-blur">
      <div className="mx-auto flex h-12 max-w-md items-center justify-between gap-3 px-4">
        <Link href="/" aria-label="Merch Round home">
          <Logo size={24} />
        </Link>
        <div className="flex items-center gap-3 text-[13px] font-semibold">
          <Link href="/" className="text-ash hover:text-ink">
            Exit
          </Link>
          <Link href="/#waitlist" className="rounded-[4px] border border-ink bg-ink px-2.5 py-1 text-paper">
            Waitlist
          </Link>
        </div>
      </div>
    </header>
  );
}
