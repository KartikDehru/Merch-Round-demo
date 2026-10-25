"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useWorld } from "@/lib/store";
import { DEMO_FAN } from "@/lib/domain";
import { aud, date, weekday } from "@/lib/format";
import { DemoControls, ProgressBlock, useRound } from "@/components/round-bits";
import { MerchMock } from "@/components/visuals";
import { PledgePill, RoundPill, Stamp, cx } from "@/components/ui";
import { Footer } from "@/components/footer";

const toggle = (on: boolean) =>
  cx("min-h-[52px] border-[3px] border-ink px-5 text-[18px] font-bold transition", on ? "bg-ink text-paper" : "bg-transparent text-ink hover:bg-stone");

export default function RoundPage() {
  const { slug } = useParams<{ slug: string }>();
  const { round, artist, c } = useRound(slug);
  const { world } = useWorld();
  const router = useRouter();
  const [size, setSize] = useState<string | null>(null);
  const [mode, setMode] = useState<"pickup" | "delivery">("pickup");
  const [nudge, setNudge] = useState(false);

  if (!round || !artist || !c) return <NotFound />;

  const mine = world.pledges.filter((p) => p.roundId === round.id && p.email === DEMO_FAN.email && p.status !== "withdrawn");
  const open = round.status === "live";
  const chosen = size ?? (round.sizes.includes("M") ? "M" : round.sizes.length === 1 ? round.sizes[0] : null);
  const printInk = round.colorway === "bone" ? "#15181C" : "#F3EFE6";

  const buy = () => {
    if (!chosen) {
      setNudge(true);
      setTimeout(() => setNudge(false), 600);
      return;
    }
    router.push(`/r/${round.slug}/pledge?size=${encodeURIComponent(chosen)}&get=${mode}`);
  };

  return (
    <>
      <div className="mx-auto grid max-w-[1280px] items-start gap-12 px-5 pt-8 pb-24 sm:px-8 lg:grid-cols-2">
        {/* artwork */}
        <div className="lg:sticky lg:top-24">
          <div className="relative flex min-h-[420px] items-center justify-center bg-stone sm:min-h-[560px]">
            <div className="absolute top-4 left-4 z-10">
              <RoundPill status={round.status} fan />
            </div>
            <div className="animate-rise absolute inset-[9%]">
              <MerchMock product={round.product} colorway={round.colorway} motif={round.motif} accent={printInk} label={artist.name} fit="cover" />
            </div>
            {round.status === "failed" && (
              <div className="absolute inset-x-0 bottom-8 flex justify-center">
                <Stamp tone="stop" rot={-6} className="text-[30px]">Not this time</Stamp>
              </div>
            )}
            {["confirmed", "in_production", "delivered", "paid_out"].includes(round.status) && (
              <div className="absolute inset-x-0 bottom-8 flex justify-center">
                <Stamp tone="ink" rot={-5} className="bg-paper text-[30px]">It&apos;s happening</Stamp>
              </div>
            )}
          </div>
          <ul className="mt-4 hidden grid-cols-2 gap-x-6 gap-y-2 text-[15px] text-ash lg:grid">
            {round.details.slice(0, 4).map((d) => (
              <li key={d} className="border-t-2 border-ink/15 pt-2">
                {d}
              </li>
            ))}
          </ul>
        </div>

        {/* buy */}
        <div className="flex flex-col gap-7">
          <div className="flex flex-col gap-2">
            <Link href="/rounds" className="text-[15px] tracking-[0.14em] text-ash uppercase hover:text-ink">
              {artist.name} · {artist.city}
            </Link>
            <h1 className="font-display text-[52px] leading-[0.95] sm:text-[clamp(52px,6vw,88px)]">{round.title}</h1>
            <div className="text-[28px] font-bold tabular">{aud(round.price)}</div>
          </div>

          <div className="bg-ink p-6 text-paper">
            <ProgressBlock round={round} artist={artist} big dark />
            {open && (
              <p className="mt-3 text-[17px] leading-[1.4] text-cloud">
                This round closes {date(round.closesAt, true)}. If we reach the number, it gets made. If we don&apos;t, nobody pays.
              </p>
            )}
          </div>

          {open && !mine.length && (
            <>
              {round.sizes.length > 1 && (
                <div className="flex flex-col gap-3">
                  <div id="size-label" className="text-[15px] tracking-[0.14em] text-ash uppercase">
                    Size
                  </div>
                  <div role="group" aria-labelledby="size-label" className={cx("flex flex-wrap gap-3", nudge && "animate-[rise_.3s]")}>
                    {round.sizes.map((s) => (
                      <button key={s} type="button" aria-pressed={chosen === s} onClick={() => setSize(s)} className={cx(toggle(chosen === s), "min-w-16", nudge && !chosen && "border-stop")}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3">
                <div id="get-label" className="text-[15px] tracking-[0.14em] text-ash uppercase">
                  Get it
                </div>
                <div role="group" aria-labelledby="get-label" className="flex flex-wrap gap-3">
                  <button type="button" aria-pressed={mode === "pickup"} onClick={() => setMode("pickup")} className={toggle(mode === "pickup")}>
                    Pick up at the show
                  </button>
                  {round.delivery && (
                    <button type="button" aria-pressed={mode === "delivery"} onClick={() => setMode("delivery")} className={toggle(mode === "delivery")}>
                      Delivered <span className="font-medium opacity-70">+{aud(round.deliveryFee)}</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button type="button" onClick={buy} className="min-h-[60px] bg-brick px-8 text-[20px] font-bold text-ink transition hover:bg-brick-deep active:translate-y-px">
                  Buy now
                </button>
                <div className="text-[16px] leading-[1.4] text-ash">You&apos;re only charged if this round hits the number.</div>
              </div>
            </>
          )}

          {mine.length > 0 && (
            <div className="border-[3px] border-ink p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="font-display text-[30px] leading-none">You&apos;re in, Sam.</span>
                <PledgePill status={mine[0].status} />
              </div>
              <p className="mt-2 text-[16px] text-ash">
                {mine[0].size} · {mine[0].fulfilment === "pickup" ? "pick up at the show" : "posted to you"} · card •••• {mine[0].card.last4}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href={`/o/${mine[0].id}`} className="inline-flex min-h-12 items-center bg-ink px-5 text-[16px] font-bold text-paper hover:bg-coal">
                  Your order and ticket
                </Link>
                {mine[0].status === "action_required" && (
                  <Link href={`/pay/${mine[0].id}`} className="inline-flex min-h-12 items-center bg-brick px-5 text-[16px] font-bold text-ink hover:bg-brick-deep">
                    Confirm payment
                  </Link>
                )}
              </div>
            </div>
          )}

          {!open && !mine.length && (
            <div className="border-l-[6px] border-ink bg-stone p-5 text-[17px] leading-[1.45]">
              {round.status === "failed"
                ? `This round closed at ${c.pledgedCount + c.all.filter((p) => p.status === "released").length} of ${round.target}. Nobody was charged and nothing will be printed.`
                : round.status === "pending_review" || round.status === "draft"
                  ? "This round isn't open yet. Check back soon."
                  : round.status === "cancelled"
                    ? "This round was cancelled. Everyone who paid has been refunded."
                    : "This round has closed, and it's going ahead."}
            </div>
          )}

          <dl className="grid grid-cols-2 border-t-[3px] border-ink">
            {[
              ["Show", round.showName],
              ["When", weekday(round.showDate)],
              ["Pick up", round.venue],
              ["Delivery", round.delivery ? `+${aud(round.deliveryFee)} Australia-wide` : "Pick up only"],
            ].map(([k, v], i) => (
              <div key={k} className={cx("border-b-2 border-ink/15 py-3", i % 2 === 0 && "pr-4")}>
                <dt className="text-[13px] tracking-[0.14em] text-ash uppercase">{k}</dt>
                <dd className="mt-0.5 text-[16px] font-medium">{v}</dd>
              </div>
            ))}
          </dl>

          <section>
            <div className="text-[15px] tracking-[0.14em] text-ash uppercase">About it</div>
            <p className="mt-2 text-[17px] leading-[1.5]">{round.description}</p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-[15px] text-ash lg:hidden">
              {round.details.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
            <p className="mt-4 text-[14px] text-ash">Payments are handled by Stripe. Merch Round never sees your card number.</p>
          </section>

          <DemoControls round={round} />
        </div>
      </div>

      <section className="bg-ink text-paper">
        <div className="mx-auto grid max-w-[1280px] gap-8 px-5 py-18 sm:px-8 md:grid-cols-3">
          {[
            ["Open for a while", `This round closes on ${date(round.closesAt, true)}. After that it either goes ahead or it doesn't.`],
            ["Made once we reach the number", "When enough of us have bought, the run gets made. If not, nobody pays and nothing is left sitting in a warehouse."],
            ["Collect it at the show", `Pick it up at ${round.venue.split(",")[0]} on the night, or have it delivered if you can't make it.`],
          ].map(([t, b]) => (
            <div key={t} className="flex flex-col gap-2.5">
              <div className="font-display text-[36px] leading-none text-brick-light">{t}</div>
              <p className="text-[18px] leading-[1.45] text-cloud">{b}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
}

function NotFound() {
  return (
    <div className="mx-auto max-w-[640px] px-5 py-24 text-center">
      <div className="font-display text-[56px] leading-none">Not found</div>
      <p className="mt-3 text-[17px] text-ash">That round doesn&apos;t exist, or the demo was reset.</p>
      <Link href="/rounds" className="mt-6 inline-block text-[17px] font-bold underline">
        See open rounds
      </Link>
    </div>
  );
}
