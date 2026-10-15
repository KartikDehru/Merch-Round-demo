"use client";

import Link from "next/link";
import { useWorld } from "@/lib/store";
import { dateTime } from "@/lib/format";
import type { LogEvent } from "@/lib/types";
import { cx } from "./ui";

const ACTOR: Record<LogEvent["actor"], string> = {
  fan: "FAN",
  artist: "ARTIST",
  admin: "ADMIN",
  system: "SYSTEM",
  stripe: "STRIPE",
  printer: "PRINTER",
};

const TONE: Record<NonNullable<LogEvent["tone"]>, string> = {
  neutral: "bg-mute",
  good: "bg-go",
  warn: "bg-hold",
  bad: "bg-stop",
  money: "bg-brick ring-1 ring-ink",
};

export function EventFeed({ events, limit = 30, showRound = false }: { events: LogEvent[]; limit?: number; showRound?: boolean }) {
  const { world } = useWorld();
  const list = events.slice(0, limit);
  if (!list.length) return <div className="font-display text-mute">nothing yet</div>;
  return (
    <ol className="relative">
      {list.map((e, i) => {
        const r = showRound && e.roundId ? world.rounds.find((x) => x.id === e.roundId) : null;
        return (
          <li key={e.id} className="relative flex gap-3 pb-4 last:pb-0">
            {i < list.length - 1 && <span className="absolute top-3 bottom-0 left-[4px] w-px bg-line" />}
            <span className={cx("relative mt-1.5 size-[9px] shrink-0 rounded-full", TONE[e.tone ?? "neutral"])} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-2 text-[11px] text-mute">
                <span className="tracking-[0.16em] text-ash">{ACTOR[e.actor]}</span>
                <span>{dateTime(e.at)}</span>
                {r && (
                  <Link href={`/admin/rounds/${r.id}`} className="truncate underline decoration-line underline-offset-2 hover:text-ink">
                    {r.title}
                  </Link>
                )}
              </div>
              <div className="text-[13px] leading-snug">{e.text}</div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
