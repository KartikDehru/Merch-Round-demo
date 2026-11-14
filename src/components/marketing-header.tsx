import Link from "next/link";
import { NAV, SITE } from "@/lib/copy";
import { Logo } from "./visuals";

export function PreviewBar() {
  return (
    <div className="bg-ink px-4 py-[9px] text-center text-[13px] leading-none text-paper">{SITE.previewBar}</div>
  );
}

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/5 bg-paper/95 backdrop-blur">
      <div className="mx-auto flex h-[68px] max-w-[1265px] items-center justify-between gap-4 px-5 sm:h-[84px] sm:px-12">
        <Link href="/" aria-label="Merch Round home" className="shrink-0">
          <Logo size={30} className="sm:!h-[38px]" />
        </Link>
        <nav className="flex items-center gap-7 text-[15px] text-ink sm:gap-8">
          <Link href="/#how" className="hidden hover:underline sm:inline">
            {NAV.how}
          </Link>
          <Link href="/#faq" className="hidden hover:underline sm:inline">
            {NAV.faq}
          </Link>
          <Link
            href="/#waitlist"
            className="whitespace-nowrap rounded-[4px] bg-ink px-4 py-2.5 text-[14px] font-bold text-paper transition hover:bg-ink/85 sm:px-6 sm:py-3.5 sm:text-[15px]"
          >
            {NAV.cta}
          </Link>
        </nav>
      </div>
    </header>
  );
}
