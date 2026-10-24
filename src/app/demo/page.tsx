"use client";

import { useRouter } from "next/navigation";
import { useWorld } from "@/lib/store";
import { login } from "@/lib/actions";
import { counts } from "@/lib/domain";
import { DemoAccounts } from "@/components/demo-accounts";
import { Button, H1, Label, RoundPill } from "@/components/ui";

export default function DemoPage() {
  const { world, act, reset, toast } = useWorld();
  const router = useRouter();

  return (
    <div className="mx-auto max-w-[1240px] px-5 py-14 sm:px-8">
      <Label>demo accounts</Label>
      <H1 className="mt-3">Pick who you are.</H1>
      <p className="mt-4 max-w-[640px] text-ash">
        No real cards, no real emails. Every email the system would send lands in the <b className="text-ink">Inbox</b> on the bottom bar,
        and every action is written to <b className="text-ink">Activity</b>. Switch roles any time from the header.
      </p>

      <DemoAccounts />

      <div className="mt-14 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <section>
          <Label>other example accounts</Label>
          <p className="mt-2 text-[13px] text-ash">Merch Round is the main example. The others sit at different stages, so you can see every screen.</p>
          <div className="mt-4 divide-y divide-line border border-line bg-card">
            {world.artists.map((a) => {
              const rounds = world.rounds.filter((r) => r.artistId === a.id);
              return (
                <button
                  key={a.id}
                  onClick={() => {
                    act(login("artist", a.id));
                    router.push("/artist");
                  }}
                  className="flex w-full items-center gap-4 px-4 py-3 text-left transition hover:bg-haze"
                >
                  <span className="size-4 shrink-0 border border-ink" style={{ background: a.accent }} />
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-[16px] font-bold">{a.name}</span>
                    <span className="block text-[12px] text-mute">{a.city}</span>
                  </span>
                  <span className="hidden flex-wrap justify-end gap-1.5 sm:flex">
                    {rounds.map((r) => (
                      <RoundPill key={r.id} status={r.status} />
                    ))}
                  </span>
                  <span className="text-ash">→</span>
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <Label>suggested walkthrough</Label>
          <ol className="mt-4 space-y-3 text-[13px]">
            {[
              ["Fan", "Open Velvet Mile's Heartline Tee and buy one. It's 2 away from the number."],
              ["Fan", "In My orders, confirm the Gravel Rash payment your bank flagged."],
              ["Merch Round", "Open the Live / 2026 Tour Tee and use the demo controls to fill and close it."],
              ["Admin", "Approve the Sunburn Cap, then send the Tour Tee to the printer."],
              ["Merch Round", "Night Drive Hoodie → confirm delivery → get paid → open the merch desk."],
              ["Merch Round", "From the list below, open Saltwater Choir and make the shortfall decision."],
            ].map(([who, text], i) => (
              <li key={i} className="flex gap-3 border border-line bg-card p-3">
                <span className="font-display text-[16px] text-mute">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="label mr-2">{who}</span>
                  {text}
                </span>
              </li>
            ))}
          </ol>
          <div className="mt-6 flex items-center justify-between border border-dashed border-line p-4">
            <div className="text-[13px] text-ash">
              {world.rounds.length} rounds · {world.pledges.length} pledges ·{" "}
              {world.rounds.reduce((s, r) => s + counts(r, world.pledges).paidCount, 0)} paid
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                reset();
                toast("Demo reset to starting data", "good");
              }}
            >
              Reset demo
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
