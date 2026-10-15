"use client";

import Link from "next/link";
import { useWorld } from "@/lib/store";
import { login } from "@/lib/actions";
import { DEMO_FAN } from "@/lib/domain";
import { aud, date } from "@/lib/format";
import { MerchMock } from "@/components/visuals";
import { Button, Empty, H1, Label, PledgePill, RoundPill, cx } from "@/components/ui";

export default function MyOrders() {
  const { world, act } = useWorld();
  if (world.session.role !== "fan")
    return (
      <div className="mx-auto max-w-[560px] px-5 py-24 text-center">
        <Label>my orders</Label>
        <H1 className="mt-3">Find your orders.</H1>
        <p className="mt-3 text-ash">In the real product you enter your email and get a magic link. In the demo, sign in as Sam.</p>
        <Button variant="brick" size="lg" className="mt-6" onClick={() => act(login("fan"))}>
          Continue as {DEMO_FAN.name}
        </Button>
      </div>
    );

  const mine = world.pledges.filter((p) => p.email === DEMO_FAN.email).sort((a, b) => b.createdAt - a.createdAt);
  const needs = mine.filter((p) => ["action_required", "card_update_required"].includes(p.status));

  return (
    <div className="mx-auto max-w-[1000px] px-5 py-14 sm:px-8">
      <Label>my orders · {DEMO_FAN.email}</Label>
      <H1 className="mt-3">Hey Sam.</H1>
      <p className="mt-2 text-ash">{mine.length} pledges. You only pay for rounds that hit their number.</p>

      {needs.map((p) => {
        const r = world.rounds.find((x) => x.id === p.roundId)!;
        return (
          <Link
            key={p.id}
            href={p.status === "action_required" ? `/pay/${p.id}` : `/o/${p.id}`}
            className="mt-6 flex items-center gap-4 border-2 border-hold bg-hold-soft p-4 transition hover:bg-hold-soft/70"
          >
            <span className="font-display text-2xl text-hold">!</span>
            <span className="flex-1">
              <span className="block font-display text-[17px] font-bold">
                {p.status === "action_required" ? "Your bank needs a quick yes" : "Your card was declined"}
              </span>
              <span className="block text-[13px] text-ash">
                {r.title} · {aud(p.amount)} · keep your spot by {r.chargeDeadline ? date(r.chargeDeadline) : "soon"}
              </span>
            </span>
            <span className="text-[12px] uppercase tracking-[0.14em]">Fix now →</span>
          </Link>
        );
      })}

      <div className="mt-8 divide-y divide-line border border-line bg-card">
        {mine.map((p) => {
          const r = world.rounds.find((x) => x.id === p.roundId)!;
          const a = world.artists.find((x) => x.id === r.artistId)!;
          return (
            <Link key={p.id} href={`/o/${p.id}`} className="flex items-center gap-4 p-4 transition hover:bg-haze">
              <div className="size-16 shrink-0 border border-line dotgrid">
                <MerchMock product={r.product} colorway={r.colorway} motif={r.motif} accent={a.accent} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="label">{a.name}</div>
                <div className="truncate font-display text-[17px] font-bold">{r.title}</div>
                <div className="text-[12px] text-ash">
                  {p.size} · {aud(p.amount)} · {p.fulfilment === "pickup" ? `pick up ${date(r.showDate)}` : "delivery"}
                </div>
              </div>
              <div className={cx("hidden flex-col items-end gap-1.5 sm:flex")}>
                <PledgePill status={p.status} />
                <RoundPill status={r.status} fan />
              </div>
            </Link>
          );
        })}
        {!mine.length && <Empty title="No orders yet">Buy from a live round and it shows up here.</Empty>}
      </div>
    </div>
  );
}
