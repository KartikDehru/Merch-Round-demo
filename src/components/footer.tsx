import Link from "next/link";
import { Logo } from "./visuals";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <Logo />
          <p className="mt-2 text-[12px] text-mute">know before you print · Australia · demo build, no real payments</p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-[12px] uppercase tracking-[0.16em] text-ash">
          <Link href="/rounds" className="hover:text-ink">Rounds</Link>
          <Link href="/demo" className="hover:text-ink">Demo</Link>
          <Link href="/#artists" className="hover:text-ink">For artists</Link>
          <span className="text-mute">Terms · Privacy</span>
        </nav>
      </div>
    </footer>
  );
}
