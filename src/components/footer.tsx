import Link from "next/link";
import { Logo } from "./visuals";

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-x-8 gap-y-5 px-5 py-10 sm:px-8">
        <div className="flex flex-col gap-1.5">
          <Logo size={28} />
          <span className="text-[14px] text-ash">Know before you print.</span>
        </div>
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[14px] text-ink">
          <Link href="/rounds" className="hover:underline">
            Rounds
          </Link>
          <Link href="/demo" className="hover:underline">
            Demo accounts
          </Link>
          <span className="text-mute">Terms</span>
          <span className="text-mute">Privacy</span>
        </nav>
      </div>
    </footer>
  );
}
