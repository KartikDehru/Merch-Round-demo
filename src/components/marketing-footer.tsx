import Link from "next/link";
import { SITE } from "@/lib/copy";
import { Logo } from "./visuals";

export function MarketingFooter() {
  return (
    <footer className="border-t border-paper/10 bg-ink text-paper">
      <div className="mx-auto flex max-w-[1265px] flex-col gap-5 px-5 py-9 sm:flex-row sm:items-center sm:justify-between sm:px-12">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
          <Logo dark size={20} />
          <span className="text-[14px] text-paper/70">{SITE.tagline}</span>
        </div>
        <p className="text-[14px] text-paper/80">
          <a href={`mailto:${SITE.contactEmail}`} className="hover:text-paper hover:underline">
            {SITE.contactEmail}
          </a>
          <span className="mx-2.5 text-paper/50">·</span>
          <Link href="/privacy" className="hover:text-paper hover:underline">
            Privacy policy
          </Link>
        </p>
      </div>
    </footer>
  );
}
