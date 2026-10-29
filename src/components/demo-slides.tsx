"use client";

import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { ARTIST_SLIDES, CARD_NOTE, FAILED_ROUND_EMAIL, FAN_SLIDES, SHOW_ROUND } from "@/lib/copy";
import { aud } from "@/lib/demo-math";
import { LogoMark } from "./visuals";
import { cx } from "./ui";

/**
 * Phone slides built to match Figma master frames
 * Artist: 17:2, 17:28, 17:74, 17:114, 17:164
 * Fan: 39:3, 39:57, 39:103, 39:139, 39:180, 39:229
 * Frame size in Figma: 388 × 580
 */

export function ArtistSlide({ index }: { index: number }) {
  const title = ARTIST_SLIDES[index] ?? ARTIST_SLIDES[0];
  if (index === 0) {
    return (
      <PhoneScreen>
        <TopBar />
        <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
          <h4 className="font-display text-[22px] leading-[0.95] tracking-[-0.02em]">{title}</h4>
          <p className="mt-3 text-[12px] leading-relaxed text-ash">
            This is a preview. Nothing is real money. Upload a design, set your numbers, share a link, then see what happens if the round hits — or misses.
          </p>
          <ul className="mt-4 space-y-2.5 text-[12px] text-ink">
            {["Add your design and description", "Set price, fans needed, and printer quote", "Pick how long the round runs", "Share the link and watch it fill"].map(
              (line, i) => (
                <li key={line} className="border-b border-line pb-2.5">
                  <span className="text-mute">{i + 1}.</span> {line}
                </li>
              ),
            )}
          </ul>
          <div className="mt-auto pt-4">
            <div className="rounded-[4px] bg-brick py-3 text-center text-[13px] font-bold text-ink">Start</div>
          </div>
        </div>
      </PhoneScreen>
    );
  }

  if (index === 1) {
    return (
      <PhoneScreen>
        <TopBar step="2 / 7" />
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-2 pt-2 [-webkit-overflow-scrolling:touch]">
          <h4 className="font-display text-[18px] leading-none">Set it up</h4>
          <div className="mt-2 grid grid-cols-[72px_1fr] gap-2">
            <div className="relative aspect-square overflow-hidden border border-dashed border-ink/25 bg-stone">
              <Image src="/merch/tee.jpg" alt="" fill className="object-cover opacity-90" sizes="72px" />
            </div>
            <div className="min-w-0">
              <div className="label">1 · Design</div>
              <Field label="Description" value="Merch Round Tee" compact />
            </div>
          </div>
          <div className="label mt-2">2 · Numbers</div>
          <div className="mt-1 grid grid-cols-3 gap-1.5">
            <Field label="Price (A$)" value="55" compact />
            <Field label="Fans" value="25" compact />
            <Field label="Printer (A$)" value="900" compact />
          </div>
          <div className="mt-2 rounded-[4px] border border-ink bg-brick-soft p-2 text-[10px] leading-snug">
            <div className="font-display text-[11px]">Take home</div>
            <div className="mt-1 grid grid-cols-2 gap-x-2 gap-y-0.5">
              <span>Fans pay</span>
              <span className="text-right tabular">{aud(1375)}</span>
              <span>Merch Round 10%</span>
              <span className="text-right tabular">{aud(137.5)}</span>
              <span>Printer</span>
              <span className="text-right tabular">{aud(900)}</span>
              <span className="border-t border-ink/15 pt-0.5 font-bold">You get</span>
              <span className="border-t border-ink/15 pt-0.5 text-right font-bold tabular">{aud(337.5)}</span>
            </div>
          </div>
          <div className="mt-2">
            <div className="rounded-[4px] bg-brick py-2 text-center text-[12px] font-bold text-ink">Launch the round</div>
          </div>
        </div>
      </PhoneScreen>
    );
  }

  if (index === 2) {
    return (
      <PhoneScreen>
        <TopBar step="3 / 7" />
        <div className="flex flex-1 flex-col px-4 pb-3 pt-3">
          <h4 className="font-display text-[22px] leading-none">Your round is live</h4>
          <p className="mt-2 text-[11px] text-ash">Share the link and watch the count.</p>
          <div className="mt-3 flex gap-1.5">
            <code className="flex-1 truncate border border-line bg-stone px-2 py-2 text-[9px]">merchround.com/r/demo-tee</code>
            <div className="rounded-[4px] border border-ink px-2 py-2 text-[10px] font-bold">Copy</div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Stat label="Asked for" value="17 / 25" />
            <Stat label="Time left" value="4 days" />
            <Stat label="You take home" value={aud(337.5)} />
            <Stat label="Price" value={aud(55)} />
          </div>
          <div className="label mt-3">Latest fans</div>
          <ul className="mt-1 divide-y divide-line border border-line text-[11px]">
            {["Sam T.", "Billie F.", "Tahlia C."].map((n) => (
              <li key={n} className="flex justify-between px-2 py-1.5">
                <span>{n}</span>
                <span className="text-ash">just now</span>
              </li>
            ))}
          </ul>
          <div className="mt-auto space-y-1.5 border-t border-dashed border-ink/25 pt-3">
            <div className="rounded-[4px] border border-dashed border-ink py-2 text-center text-[11px] font-semibold">It hits the number →</div>
            <div className="rounded-[4px] border border-dashed border-ink py-2 text-center text-[11px] font-semibold">It misses →</div>
          </div>
        </div>
      </PhoneScreen>
    );
  }

  if (index === 3) {
    return (
      <PhoneScreen>
        <TopBar step="4 / 7" />
        <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
          <h4 className="font-display text-[22px] leading-none">You hit the number</h4>
          <p className="mt-3 text-[12px] leading-relaxed text-ash">
            Cards are charged on the close date. Check the order, then approve so we can pay the printer.
          </p>
          <dl className="mt-4 space-y-2 border border-line p-3 text-[11px]">
            <Row label="Printer" value="Inkhouse Wollongong" />
            <Row label="Quantity" value="25 tees" />
            <Row label="Quote" value={aud(900)} />
            <Row label="Fans paid" value={aud(1375)} />
            <Row label="Your share" value={aud(337.5)} />
          </dl>
          <div className="mt-auto pt-4">
            <div className="rounded-[4px] bg-brick py-3 text-center text-[13px] font-bold text-ink">Approve the order</div>
          </div>
        </div>
      </PhoneScreen>
    );
  }

  return (
    <PhoneScreen>
      <TopBar step="5 / 7" />
      <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
        <h4 className="font-display text-[22px] leading-none">Get paid</h4>
        <p className="mt-3 text-[12px] leading-relaxed text-ash">
          The printer is paid and printing. Your share is released once the printer confirms the items are finished.
        </p>
        <div className="mt-4 border border-ink bg-brick-soft p-4">
          <div className="label">Your payout</div>
          <div className="mt-1 font-display text-[28px] leading-none">{aud(337.5)}</div>
        </div>
        <ul className="mt-4 space-y-1.5 text-[12px]">
          <li>✓ Fans charged</li>
          <li>✓ Printer invoice paid</li>
          <li>○ Printer confirms finished</li>
          <li>○ Payout to your bank</li>
        </ul>
        <div className="mt-auto pt-4">
          <div className="rounded-[4px] bg-brick py-3 text-center text-[13px] font-bold text-ink">Finish the demo</div>
        </div>
      </div>
    </PhoneScreen>
  );
}

export function FanSlide({ index }: { index: number }) {
  const title = FAN_SLIDES[index] ?? FAN_SLIDES[0];
  if (index === 0) {
    const pct = Math.round((SHOW_ROUND.progress / SHOW_ROUND.target) * 100);
    return (
      <PhoneScreen>
        <TopBar step="1 / 6" />
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-4 pb-3 pt-3">
          <h4 className="font-display text-[20px] leading-none">{SHOW_ROUND.title}</h4>
          <div className="relative mt-2.5 flex h-[220px] items-center justify-center overflow-hidden border border-line bg-stone px-4 py-3">
            <Image
              src="/merch/tee.jpg"
              alt=""
              width={200}
              height={200}
              className="h-full w-auto max-h-[180px] object-contain"
            />
            <span className="absolute left-2 top-2 rounded-full bg-brick px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide">
              Open
            </span>
          </div>
          <p className="mt-2 text-[12px] text-ash">Merch Round Tee · {SHOW_ROUND.price}</p>
          <div className="mt-2 flex justify-between text-[11px] font-semibold">
            <span>
              {SHOW_ROUND.progress} / {SHOW_ROUND.target}
            </span>
            <span className="text-ash">{SHOW_ROUND.timeLeft}</span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-line">
            <div className="h-full bg-brick" style={{ width: `${pct}%` }} />
          </div>
          <div className="label mt-2.5 mb-1.5">Size</div>
          <div className="flex gap-1.5">
            {["S", "M", "L", "XL"].map((s) => (
              <div
                key={s}
                className={cx(
                  "flex size-8 items-center justify-center rounded-[4px] border text-[11px] font-bold",
                  s === "M" ? "border-ink bg-ink text-paper" : "border-line",
                )}
              >
                {s}
              </div>
            ))}
          </div>
          <div className="mt-auto pt-3">
            <div className="rounded-[4px] bg-brick py-3 text-center text-[12px] font-bold text-ink">
              Save your card · {SHOW_ROUND.price}
            </div>
          </div>
        </div>
      </PhoneScreen>
    );
  }

  if (index === 1) {
    return (
      <PhoneScreen>
        <TopBar step="2 / 6" />
        <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
          <h4 className="font-display text-[22px] leading-none">Save your card</h4>
          <p className="mt-2 text-[10px] leading-snug text-ash">{CARD_NOTE}</p>
          <div className="mt-3 space-y-2">
            <Field label="Card number" value="4242 4242 4242 4242" />
            <div className="grid grid-cols-2 gap-2">
              <Field label="Expiry" value="12 / 29" compact />
              <Field label="CVC" value="123" compact />
            </div>
            <Field label="Name on card" value="Sam Taylor" />
          </div>
          <div className="mt-auto pt-3">
            <div className="rounded-[4px] bg-brick py-3 text-center text-[12px] font-bold text-ink">Save card · nothing charged</div>
          </div>
        </div>
      </PhoneScreen>
    );
  }

  if (index === 2) {
    return (
      <PhoneScreen>
        <TopBar step="3 / 6" />
        <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
          <h4 className="font-display text-[22px] leading-none">You&apos;re in</h4>
          <p className="mt-3 text-[12px] leading-relaxed text-ash">
            Your card is saved. Nothing is charged today. We&apos;ll email you when the round closes.
          </p>
          <div className="mt-4 border border-line bg-stone p-3">
            <div className="label">Your spot</div>
            <p className="mt-1 font-display text-[24px] leading-none">
              {SHOW_ROUND.progress + 1} / {SHOW_ROUND.target}
            </p>
            <p className="mt-2 text-[11px] text-ash">{SHOW_ROUND.title} · size M · pickup</p>
          </div>
        </div>
      </PhoneScreen>
    );
  }

  if (index === 3) {
    return (
      <PhoneScreen>
        <TopBar step="4 / 6" />
        <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
          <h4 className="font-display text-[22px] leading-none">It hit</h4>
          <p className="mt-3 text-[12px] leading-relaxed text-ash">
            The round hit its number. Your card was charged {SHOW_ROUND.price}. Collect at the show with your pickup code.
          </p>
          <div className="mt-4 border border-ink bg-brick-soft p-3 text-[12px]">
            <div className="font-semibold">Paid · {SHOW_ROUND.price}</div>
            <div className="mt-1 text-ash">{SHOW_ROUND.title} · Merch Round</div>
          </div>
          <div className="mt-auto pt-3">
            <div className="rounded-[4px] bg-brick py-3 text-center text-[12px] font-bold text-ink">Show pickup code</div>
          </div>
        </div>
      </PhoneScreen>
    );
  }

  if (index === 4) {
    return (
      <PhoneScreen>
        <TopBar step="5 / 6" />
        <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
          <h4 className="font-display text-[22px] leading-none">Pickup code</h4>
          <p className="mt-2 text-[11px] text-ash">Show this at the merch desk. Each order has its own code.</p>
          <div className="mt-4 flex flex-col items-center border border-line bg-paper p-4">
            <QRCodeSVG value="https://merchround.com/pickup/MR4821" size={140} level="M" includeMargin={false} />
            <p className="mt-3 font-mono text-[16px] font-bold tracking-[0.18em]">MR 4821</p>
            <p className="mt-1 text-[10px] text-ash">Backup if the scan fails</p>
          </div>
          <p className="sr-only">{title}</p>
        </div>
      </PhoneScreen>
    );
  }

  return (
    <PhoneScreen>
      <TopBar step="6 / 6" />
      <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
        <h4 className="font-display text-[22px] leading-none">Not this time</h4>
        <div className="mt-4 border border-line bg-stone p-3 text-[11px] leading-relaxed text-ink">
          <div className="label mb-2">Email from Merch Round</div>
          <p>{FAILED_ROUND_EMAIL}</p>
        </div>
        <p className="mt-3 text-[11px] text-ash">Nothing was printed. You haven&apos;t been charged.</p>
      </div>
    </PhoneScreen>
  );
}

function PhoneScreen({ children }: { children: React.ReactNode }) {
  return <div className="flex h-full min-h-0 flex-col overflow-hidden bg-paper text-ink">{children}</div>;
}

function TopBar({ step }: { step?: string }) {
  return (
    <div className="flex items-center justify-between border-b border-line px-3 py-2.5">
      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-tight">
        <LogoMark size={16} />
        Merch Round
      </span>
      {step && <span className="label text-[9px]">{step}</span>}
    </div>
  );
}

function Field({ label, value, compact }: { label: string; value: string; compact?: boolean }) {
  return (
    <label className={cx("mt-1.5 block", compact && "mt-0")}>
      <span className="label mb-1 block text-[8px]">{label}</span>
      <span className="block rounded-[4px] border border-line bg-paper px-2 py-1.5 text-[11px] text-ink">{value}</span>
    </label>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-line bg-stone p-2">
      <div className="label text-[8px]">{label}</div>
      <div className="mt-0.5 font-display text-[14px] leading-none">{value}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2 border-b border-line pb-1.5 last:border-0 last:pb-0">
      <dt className="text-ash">{label}</dt>
      <dd className="font-semibold">{value}</dd>
    </div>
  );
}
