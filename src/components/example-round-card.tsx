import Image from "next/image";
import Link from "next/link";
import { SHOW_ROUND } from "@/lib/copy";
import { LinkButton, Pill } from "./ui";

export function ExampleRoundCard() {
  const pct = Math.round((SHOW_ROUND.progress / SHOW_ROUND.target) * 100);
  return (
    <div className="mx-auto max-w-md">
      <Link
        href="/try"
        className="block overflow-hidden border border-line bg-card transition hover:border-ink"
      >
        <div className="relative aspect-square bg-stone">
          <Image src="/merch/tee.jpg" alt={SHOW_ROUND.title} fill className="object-cover" sizes="(max-width:768px) 100vw, 420px" />
          <div className="absolute left-3 top-3">
            <Pill tone="live" dot>
              Open
            </Pill>
          </div>
        </div>
        <div className="p-5">
          <h3 className="font-display text-[22px] leading-none">{SHOW_ROUND.title}</h3>
          <p className="mt-2 text-[15px] text-ash">
            Merch Round · {SHOW_ROUND.price}
          </p>
          <div className="mt-4">
            <div className="flex justify-between text-[13px] font-semibold">
              <span>
                {SHOW_ROUND.progress} / {SHOW_ROUND.target}
              </span>
              <span className="text-ash">{SHOW_ROUND.timeLeft}</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-line">
              <div className="h-full rounded-full bg-brick" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>
      </Link>
      <div className="mt-5 flex justify-center">
        <LinkButton href="/try" variant="primary" size="lg">
          {SHOW_ROUND.cta}
        </LinkButton>
      </div>
    </div>
  );
}
