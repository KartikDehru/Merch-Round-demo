"use client";

import { useState } from "react";
import { useWorld } from "@/lib/store";
import { RoundCard } from "@/components/round-bits";
import { H1, Label, Segmented } from "@/components/ui";
import { Footer } from "@/components/footer";

type Filter = "live" | "happening" | "past";

export default function RoundsPage() {
  const { world } = useWorld();
  const [filter, setFilter] = useState<Filter>("live");
  const groups: Record<Filter, string[]> = {
    live: ["live"],
    happening: ["charging", "awaiting_decision", "confirmed", "in_production", "delivered", "paid_out"],
    past: ["completed", "failed", "cancelled"],
  };
  const list = world.rounds.filter((r) => groups[filter].includes(r.status));

  return (
    <>
      <div className="mx-auto max-w-[1240px] px-5 py-14 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Label>rounds</Label>
            <H1 className="mt-3">Back the merch.</H1>
            <p className="mt-3 max-w-[520px] text-ash">Pledge now, pay only if the round hits its number. Pick up at the show.</p>
          </div>
          <Segmented<Filter>
            value={filter}
            onChange={setFilter}
            options={[
              { value: "live", label: `Open (${world.rounds.filter((r) => r.status === "live").length})` },
              { value: "happening", label: "Being made" },
              { value: "past", label: "Past" },
            ]}
          />
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((r, i) => (
            <RoundCard key={r.id} round={r} artist={world.artists.find((a) => a.id === r.artistId)!} href={`/r/${r.slug}`} index={i} />
          ))}
        </div>
        {!list.length && <div className="mt-10 font-pixel text-mute">nothing here right now</div>}
      </div>
      <Footer />
    </>
  );
}
