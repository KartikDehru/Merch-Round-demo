"use client";

import { useState } from "react";
import { useWorld } from "@/lib/store";
import { dateTime } from "@/lib/format";
import type { Role } from "@/lib/types";
import { RequireRole } from "@/components/require-role";
import { H1, Label, Pill, Segmented } from "@/components/ui";

export default function Emails() {
  return (
    <RequireRole role="admin">
      <Inner />
    </RequireRole>
  );
}

function Inner() {
  const { world } = useWorld();
  const [f, setF] = useState<"all" | Role>("all");
  const list = world.emails.filter((e) => f === "all" || e.audience === f);
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="mx-auto max-w-[1240px] px-5 py-12 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Label>email log · resend</Label>
          <H1 className="mt-3">Every email sent.</H1>
          <p className="mt-2 text-ash">{world.emails.length} emails. In production these go out through Resend.</p>
        </div>
        <Segmented<"all" | Role>
          value={f}
          onChange={setF}
          options={[
            { value: "all", label: "All" },
            { value: "fan", label: "Fans" },
            { value: "artist", label: "Artists" },
            { value: "admin", label: "Admin" },
          ]}
        />
      </div>
      <ul className="mt-8 divide-y divide-line border border-line bg-card">
        {list.map((e) => (
          <li key={e.id}>
            <button onClick={() => setOpen(open === e.id ? null : e.id)} className="flex w-full flex-wrap items-center gap-3 px-4 py-3 text-left hover:bg-haze/50">
              <Pill tone={e.audience === "fan" ? "live" : e.audience === "artist" ? "neutral" : "dark"}>{e.audience}</Pill>
              <span className="min-w-0 flex-1 truncate font-display text-[15px] font-bold">{e.subject}</span>
              <span className="text-[12px] text-ash">{e.to}</span>
              <span className="w-28 text-right text-[11px] text-mute">{dateTime(e.at)}</span>
            </button>
            {open === e.id && <p className="border-t border-dashed border-line bg-paper px-4 py-3 text-[13px]">{e.body}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
