"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { TryScreen } from "@/components/try-chrome";
import { Button, LinkButton } from "@/components/ui";
import { aud } from "@/lib/demo-math";
import { useTry } from "@/lib/try-store";

const FANS = ["Sam T.", "Billie F.", "Tahlia C.", "Noah R.", "Zoe M."];

export default function TryLivePage() {
  const router = useRouter();
  const { state, math, shareUrl, set } = useTry();
  const [copied, setCopied] = useState(false);
  const pledged = Math.min(state.pledged, state.target);

  async function copy() {
    try {
      await navigator.clipboard?.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <TryScreen step={3} title="Your round is live">
      <p className="text-[14px] text-ash">Demo only — nothing is published. Share the link and watch the count.</p>

      <div className="mt-4 flex gap-2">
        <code className="flex-1 truncate border border-line bg-stone px-3 py-2.5 text-[12px]">{shareUrl}</code>
        <Button type="button" variant="secondary" size="sm" onClick={copy}>
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Stat label="Asked for" value={`${pledged} / ${state.target}`} />
        <Stat label="Time left" value={timeLeftLabel(state.lengthHours)} />
        <Stat label="You take home" value={aud(math.artist)} />
        <Stat label="Price" value={aud(state.price)} />
      </div>

      <div className="mt-6">
        <div className="label">Latest fans</div>
        <ul className="mt-2 divide-y divide-line border border-line">
          {FANS.slice(0, Math.min(5, pledged)).map((name) => (
            <li key={name} className="flex justify-between px-3 py-2 text-[13px]">
              <span>{name}</span>
              <span className="text-ash">just now</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 space-y-3 border-t border-dashed border-ink/30 pt-6">
        <p className="text-[13px] font-semibold text-ash">Demo paths — pick one</p>
        <Button
          type="button"
          variant="secondary"
          className="w-full border-dashed"
          onClick={() => {
            set({ pledged: state.target });
            router.push("/try/hit");
          }}
        >
          It hits the number →
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="w-full border-dashed"
          onClick={() => {
            set({ pledged: Math.max(1, Math.floor(state.target * 0.68)) });
            router.push("/try/miss");
          }}
        >
          It misses →
        </Button>
        <LinkButton href="/try/fan" variant="ghost" className="w-full">
          See the fan side
        </LinkButton>
      </div>
    </TryScreen>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-line bg-stone p-3">
      <div className="label text-[10px]">{label}</div>
      <div className="mt-1 font-display text-[20px] leading-none">{value}</div>
    </div>
  );
}

function timeLeftLabel(hours: number) {
  if (hours <= 24) return "23h left";
  if (hours <= 48) return "1 day left";
  if (hours <= 168) return "4 days left";
  return "11 days left";
}
