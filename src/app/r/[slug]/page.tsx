"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useWorld } from "@/lib/store";
import { DEMO_FAN } from "@/lib/domain";
import { aud, date, weekday } from "@/lib/format";
import { DemoControls, ProgressBlock, useRound } from "@/components/round-bits";
import { MerchMock } from "@/components/visuals";
import { Button, H3, Label, PixelNum, PledgePill, RoundPill, Stamp, cx } from "@/components/ui";
import { Footer } from "@/components/footer";

export default function RoundPage() {
  const { slug } = useParams<{ slug: string }>();
  const { round, artist, c } = useRound(slug);
  const { world } = useWorld();
  const router = useRouter();
  const [side, setSide] = useState<"front" | "back">("front");
  const [size, setSize] = useState<string | null>(null);
  const [nudge, setNudge] = useState(false);

  if (!round || !artist || !c) return <NotFound />;

  const mine = world.pledges.filter((p) => p.roundId === round.id && p.email === DEMO_FAN.email && p.status !== "withdrawn");
  const open = round.status === "live";
  const chosen = size ?? (round.sizes.length === 1 ? round.sizes[0] : null);

  const pledge = () => {
    if (!chosen) {
      setNudge(true);
      setTimeout(() => setNudge(false), 600);
      return;
    }
    router.push(`/r/${round.slug}/pledge?size=${encodeURIComponent(chosen)}`);
  };

  return (
    <>
      <div className="h-1.5" style={{ background: artist.accent }} />
      <div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-8 sm:px-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14 lg:py-12">
        {/* gallery */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="relative aspect-square overflow-hidden border border-line dotgrid bg-card">
            <div className="absolute top-4 left-4 z-10">
              <RoundPill status={round.status} fan />
            </div>
            <div className="absolute top-4 right-4 z-10 flex border border-ink/70 bg-card text-[11px] uppercase tracking-[0.14em]">
              {(["front", "back"] as const).map((s) => (
                <button key={s} onClick={() => setSide(s)} className={cx("px-3 py-1.5", side === s ? "bg-ink text-paper" : "text-ash hover:text-ink")}>
                  {s}
                </button>
              ))}
            </div>
            <div key={side} className="animate-rise absolute inset-[8%]">
              <MerchMock product={round.product} colorway={round.colorway} motif={round.motif} accent={artist.accent} label={artist.name} back={side === "back"} />
            </div>
            {round.status === "failed" && (
              <div className="absolute inset-x-0 bottom-8 flex justify-center">
                <Stamp tone="stop" rot={-6} className="bg-card text-2xl">Not this time</Stamp>
              </div>
            )}
            {["confirmed", "in_production", "delivered", "paid_out"].includes(round.status) && (
              <div className="absolute inset-x-0 bottom-8 flex justify-center">
                <Stamp tone="lime" rot={-5} className="text-2xl">It&apos;s happening</Stamp>
              </div>
            )}
          </div>
          <div className="mt-3 hidden grid-cols-4 gap-3 lg:grid">
            {round.details.slice(0, 4).map((d, i) => (
              <div key={d} className="border border-line bg-card p-3 text-[11px] leading-snug text-ash">
                <PixelNum className="block text-base">{String(i + 1).padStart(2, "0")}</PixelNum>
                {d}
              </div>
            ))}
          </div>
        </div>

        {/* info */}
        <div>
          <Link href={`/rounds`} className="label hover:text-ink">
            ← {artist.name} · {artist.city}
          </Link>
          <h1 className="mt-3 font-display text-[40px] leading-[0.95] font-bold tracking-tight uppercase sm:text-[52px]">{round.title}</h1>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="font-display text-[32px] font-bold tabular">{aud(round.price)}</span>
            <span className="label">the full price · no extra fees</span>
          </div>

          <div className="mt-7 border border-line bg-card p-5">
            <ProgressBlock round={round} artist={artist} big />
          </div>

          {open && !mine.length && (
            <div className="mt-6">
              {round.sizes.length > 1 && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="label">size</span>
                    <span className="text-[12px] text-ash underline decoration-line underline-offset-4">size chart</span>
                  </div>
                  <div className={cx("mt-2 grid grid-cols-4 gap-2", nudge && "animate-[rise_.3s]")}>
                    {round.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSize(s)}
                        className={cx(
                          "h-12 border font-display text-[16px] font-bold transition",
                          chosen === s ? "border-ink bg-ink text-paper" : nudge ? "border-stop bg-stop-soft" : "border-line bg-card hover:border-ink",
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </>
              )}
              <Button variant="lime" size="lg" className="mt-4 w-full text-[14px]" onClick={pledge}>
                Pledge for {aud(round.price)} →
              </Button>
              <p className="mt-3 border-l-[3px] border-lime pl-3 text-[13px] leading-relaxed">
                You&apos;re only charged on <b>{date(round.closesAt, true)}</b> if this hits <b>{round.target}</b>. Otherwise nothing is
                charged.
              </p>
            </div>
          )}

          {mine.length > 0 && (
            <div className="mt-6 border-2 border-ink bg-lime-soft p-5">
              <div className="flex items-center justify-between">
                <span className="font-display text-[20px] font-bold">You&apos;re in, Sam.</span>
                <PledgePill status={mine[0].status} />
              </div>
              <p className="mt-1 text-[13px] text-ash">
                {mine[0].size} · {mine[0].fulfilment === "pickup" ? "pick up at the show" : "posted to you"} · card •••• {mine[0].card.last4}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href={`/o/${mine[0].id}`} className="inline-flex h-10 items-center border border-ink bg-ink px-4 text-[12px] uppercase tracking-[0.14em] text-paper">
                  View order & ticket
                </Link>
                {mine[0].status === "action_required" && (
                  <Link href={`/pay/${mine[0].id}`} className="inline-flex h-10 items-center border border-ink bg-lime px-4 text-[12px] uppercase tracking-[0.14em]">
                    Confirm payment
                  </Link>
                )}
              </div>
            </div>
          )}

          {!open && !mine.length && (
            <div className="mt-6 border border-line bg-haze p-4 text-[13px] text-ash">
              {round.status === "failed"
                ? `This round closed at ${c.pledgedCount + c.all.filter((p) => p.status === "released").length} of ${round.target}. Nobody was charged and nothing will be printed.`
                : round.status === "pending_review" || round.status === "draft"
                  ? "This round isn't open yet."
                  : round.status === "cancelled"
                    ? "This round was cancelled. Everyone who paid has been refunded."
                    : "Pledging has closed for this round."}
            </div>
          )}

          <div className="mt-8 grid grid-cols-2 border-t border-l border-line">
            {[
              ["show", round.showName],
              ["when", weekday(round.showDate)],
              ["pick up", round.venue],
              ["delivery", round.delivery ? `+${aud(round.deliveryFee)} Australia-wide` : "Pick up only"],
            ].map(([k, v]) => (
              <div key={k} className="scanlines border-r border-b border-line p-3">
                <div className="label">{k}</div>
                <div className="mt-1 text-[13px]">{v}</div>
              </div>
            ))}
          </div>

          <section className="mt-8">
            <Label>about</Label>
            <p className="mt-2 text-[14px] leading-relaxed">{round.description}</p>
            <ul className="mt-3 space-y-1 text-[13px] text-ash lg:hidden">
              {round.details.map((d) => (
                <li key={d}>◇ {d}</li>
              ))}
            </ul>
          </section>

          <section className="mt-8">
            <Label>how this works</Label>
            <ol className="mt-3 grid gap-px border border-line bg-line sm:grid-cols-2">
              {[
                ["Pledge", "Save your card. Nothing is charged."],
                [`Hits ${round.target}?`, `Cards are charged on ${date(round.closesAt)}.`],
                ["Misses?", "Nobody pays. Card released."],
                ["Pick up", `Show your QR at ${round.venue.split(",")[0]}.`],
              ].map(([t, b], i) => (
                <li key={t} className="bg-card p-4">
                  <PixelNum className="text-lg">{String(i + 1).padStart(2, "0")}</PixelNum>
                  <H3 className="mt-1 !text-[17px]">{t}</H3>
                  <p className="text-[12px] text-ash">{b}</p>
                </li>
              ))}
            </ol>
            <p className="mt-3 text-[11px] text-mute">Payments secured by Stripe. Merch Round never sees your card number.</p>
          </section>

          <div className="mt-8">
            <DemoControls round={round} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

function NotFound() {
  return (
    <div className="mx-auto max-w-[640px] px-5 py-24 text-center">
      <div className="font-pixel text-3xl text-mute">404_</div>
      <p className="mt-3 text-ash">That round doesn&apos;t exist (or the demo was reset).</p>
      <Link href="/rounds" className="mt-6 inline-block underline">
        Browse rounds
      </Link>
    </div>
  );
}
