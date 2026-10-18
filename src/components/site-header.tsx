"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useWorld } from "@/lib/store";
import { login } from "@/lib/actions";
import type { Role } from "@/lib/types";
import { Logo } from "./visuals";
import { cx } from "./ui";

const NAV: Record<Role | "guest", { href: string; label: string }[]> = {
  guest: [
    { href: "/#how", label: "How it works" },
    { href: "/#care", label: "What we care about" },
    { href: "/rounds", label: "Rounds" },
  ],
  fan: [
    { href: "/rounds", label: "Rounds" },
    { href: "/me", label: "My orders" },
    { href: "/#how", label: "How it works" },
  ],
  artist: [
    { href: "/artist", label: "Dashboard" },
    { href: "/artist/new", label: "New round" },
    { href: "/artist/settings", label: "Profile" },
  ],
  admin: [
    { href: "/admin", label: "Queue" },
    { href: "/admin/rounds", label: "Rounds" },
    { href: "/admin/ledger", label: "Ledger" },
  ],
};

export const ROLE_HOME: Record<Role, string> = { fan: "/rounds", artist: "/artist", admin: "/admin" };

export function SiteHeader() {
  const { world, act } = useWorld();
  const router = useRouter();
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const role = world.session.role;
  const links = NAV[role ?? "guest"];
  const overHero = path === "/" && !role;

  const switchRole = (r: Role) => {
    act(login(r));
    router.push(ROLE_HOME[r]);
    setOpen(false);
  };

  return (
    <header className={cx("sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur-md", overHero && "border-transparent")}>
      <div className="mx-auto flex h-[64px] max-w-[1280px] items-center gap-8 px-5 sm:px-8">
        <Link href="/" className="shrink-0" aria-label="Merch Round home">
          <Logo size={30} />
        </Link>
        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((l) => {
            const active = l.href === path || (l.href !== "/" && !l.href.includes("#") && path.startsWith(l.href) && l.href.length > 3);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cx(
                  "text-[14px] font-medium transition",
                  active ? "text-ink underline decoration-ink decoration-1 underline-offset-[10px]" : "text-ink/70 hover:text-ink",
                )}
              >
                {l.label}
              </Link>
            );
          })}
          {role === "artist" && (
            <Link href="/rounds" className="text-[14px] font-medium text-ink/70 hover:text-ink">
              Public site
            </Link>
          )}
          {role === "admin" && (
            <Link href="/admin/emails" className="text-[14px] font-medium text-ink/70 hover:text-ink">
              Emails
            </Link>
          )}
        </nav>
        <div className="ml-auto hidden items-center gap-3 md:flex">
          {!role && <span className="text-[13px] text-ash">Demo accounts</span>}
          <span className="label !tracking-[0.1em]">View as</span>
          <div className="flex items-center gap-3">
            {(["fan", "artist", "admin"] as Role[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => switchRole(r)}
                className={cx(
                  "text-[14px] font-semibold capitalize transition",
                  (role ?? "fan") === r ? "text-ink underline underline-offset-[6px]" : "text-ash hover:text-ink",
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        <button
          className="ml-auto inline-flex h-10 items-center border border-ink px-4 text-[14px] font-bold md:ml-3 lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
      {open && (
        <div className="animate-rise border-t border-line bg-paper px-5 pb-5 lg:hidden">
          <nav className="flex flex-col py-3">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="border-b border-line py-3 text-[18px] font-medium">
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="label mb-2">View as</div>
          <div className="flex gap-4">
            {(["fan", "artist", "admin"] as Role[]).map((r) => (
              <button key={r} type="button" onClick={() => switchRole(r)} className="text-[15px] font-semibold capitalize underline">
                {r}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
