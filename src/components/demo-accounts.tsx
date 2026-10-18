"use client";

import { useRouter } from "next/navigation";
import { useWorld } from "@/lib/store";
import { login } from "@/lib/actions";
import type { Role } from "@/lib/types";
import { Button, Cell } from "./ui";

export function DemoAccounts() {
  const { act, world } = useWorld();
  const router = useRouter();
  const enter = (role: Role, href: string, artistId?: string) => {
    act(login(role, artistId));
    router.push(href);
  };
  const cards: { role: Role; who: string; meta: string; tag: string; bullets: string[]; href: string; artistId?: string }[] = [
    {
      role: "fan",
      who: "Sam Taylor",
      meta: "sam.taylor@demo.fan",
      tag: "fan",
      href: "/rounds",
      bullets: ["Buy from a live round", "Confirm a payment your bank flagged", "Show your QR ticket", "See a round that missed (not charged)"],
    },
    {
      role: "artist",
      who: world.artists[0].name,
      meta: "Wollongong · Stripe verified",
      tag: "artist",
      href: "/artist",
      artistId: world.artists[0].id,
      bullets: ["Watch a live round fill up", "Create a round with the calculator", "Confirm delivery and get paid", "Run the show-night merch desk"],
    },
    {
      role: "admin",
      who: "Priya · Ops",
      meta: "ops@merchround.com.au",
      tag: "admin",
      href: "/admin",
      bullets: ["Approve a new round", "Send orders to printers", "Record invoices and payouts", "Read the full money ledger"],
    },
  ];
  return (
    <div className="mt-10 grid gap-5 md:grid-cols-3">
      {cards.map((c) => (
        <Cell key={c.role} className="flex flex-col border border-line p-6 sm:p-8">
          <span className="label">{c.tag}</span>
          <div className="mt-4 text-[22px] font-bold">{c.who}</div>
          <div className="mt-1 text-[13px] text-mute">{c.meta}</div>
          <ul className="mt-5 flex-1 space-y-2.5 text-[14px] text-ash">
            {c.bullets.map((b) => (
              <li key={b} className="flex gap-2">
                <span className="mt-0.5 text-go">✓</span>
                {b}
              </li>
            ))}
          </ul>
          <Button className="mt-6 w-full" variant="secondary" onClick={() => enter(c.role, c.href, c.artistId)}>
            Enter as {c.tag}
          </Button>
        </Cell>
      ))}
    </div>
  );
}
