import Link from "next/link";
import { SITE } from "@/lib/copy";
import { Logo } from "./visuals";

export function MarketingFooter() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-x-8 gap-y-5 px-5 py-10 sm:px-8">
        <div className="flex flex-col gap-1.5">
          <Logo size={28} />
          <span className="text-[14px] text-ash">{SITE.tagline}</span>
        </div>
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[14px] text-ink">
          <a href="/#how" className="hover:underline">
            How it works
          </a>
          <Link href="/try" className="hover:underline">
            Try the demo
          </Link>
          <Link href="/privacy" className="hover:underline">
            Privacy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
