"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useWorld } from "@/lib/store";
import { login } from "@/lib/actions";
import type { Role } from "@/lib/types";
import { Logo } from "./visuals";
import { Segmented, cx } from "./ui";

const NAV: Record<Role | "guest", { href: string; label: string }[]> = {
  guest: [
    { href: "/#how", label: "How it works" },
    { href: "/#care", label: "What we care about" },
    { href: "/rounds", label: "Rounds" },
    { href: "/demo", label: "Demo accounts" },
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
    { href: "/rounds", label: "Public site" },
  ],
  admin: [
    { href: "/admin", label: "Queue" },
    { href: "/admin/rounds", label: "Rounds" },
    { href: "/admin/ledger", label: "Ledger" },
    { href: "/admin/emails", label: "Emails" },
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

  const switchRole = (r: Role) => {
    act(login(r));
    router.push(ROLE_HOME[r]);
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-paper">
      <div className="mx-auto flex h-[72px] max-w-[1280px] items-center gap-8 px-5 sm:px-8">
        <Link href="/" className="shrink-0" aria-label="Merch Round home">
          <Logo size={42} />
        </Link>
        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((l) => {
            const active = l.href === path || (l.href !== "/" && !l.href.includes("#") && path.startsWith(l.href) && l.href.length > 3);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cx(
                  "text-[16px] font-medium transition hover:underline",
                  active ? "text-ink underline decoration-brick decoration-[3px] underline-offset-[8px]" : "text-ink/80",
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto hidden items-center gap-3 md:flex">
          <span className="label hidden xl:inline">View as</span>
          <Segmented<Role>
            value={(role ?? "fan") as Role}
            onChange={switchRole}
            options={[
              { value: "fan", label: "Fan" },
              { value: "artist", label: "Artist" },
              { value: "admin", label: "Admin" },
            ]}
            className={role ? "" : "opacity-70"}
          />
        </div>
        <button
          className="ml-auto inline-flex h-10 items-center border-2 border-ink px-4 text-[14px] font-bold lg:hidden md:ml-0"
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
          <Segmented<Role>
            value={(role ?? "fan") as Role}
            onChange={switchRole}
            options={[
              { value: "fan", label: "Fan" },
              { value: "artist", label: "Artist" },
              { value: "admin", label: "Admin" },
            ]}
          />
        </div>
      )}
    </header>
  );
}
