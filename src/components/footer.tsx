import Link from "next/link";
import { Logo } from "./visuals";

export function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-x-8 gap-y-5 px-5 py-10 sm:px-8">
        <Logo dark size={40} />
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[16px] text-fog">
          <span>Know before you print.</span>
          <Link href="/rounds" className="hover:text-paper hover:underline">Rounds</Link>
          <Link href="/demo" className="hover:text-paper hover:underline">Demo accounts</Link>
          <span>Terms</span>
          <span>Privacy</span>
        </nav>
      </div>
    </footer>
  );
}
