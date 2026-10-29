"use client";

import Link from "next/link";
import { SITE } from "@/lib/copy";
import { Logo } from "./visuals";

export function PreviewBar() {
  return (
    <div className="bg-ink px-4 py-2 text-center text-[12px] font-medium tracking-[0.04em] text-paper sm:text-[13px]">
      {SITE.previewBar}
    </div>
  );
}

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1100px] items-center justify-between gap-4 px-5 sm:px-8">
        <Link href="/" aria-label="Merch Round home">
          <Logo size={28} />
        </Link>
        <nav className="flex items-center gap-5 text-[14px] font-medium text-ink">
          <a href="/#how" className="hidden text-ash hover:text-ink sm:inline">
            How it works
          </a>
          <a
            href="/#waitlist"
            className="rounded-[4px] border border-ink bg-ink px-3 py-1.5 text-paper hover:bg-coal"
          >
            Join the waitlist
          </a>
        </nav>
      </div>
    </header>
  );
}
