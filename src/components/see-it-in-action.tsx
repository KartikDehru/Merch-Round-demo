"use client";

import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { useState, type ReactNode } from "react";
import { ACTION, ARTIST_DEMO, FAILED_ROUND_EMAIL, FAN_DEMO, SITE } from "@/lib/copy";
import { Logo } from "./visuals";
import { cx } from "@/lib/cx";

type Tab = "artist" | "fan";

/** Figma "See it in action": Artist / Fan toggle, numbered steps, phone screen on the right. */
export function SeeItInAction() {
  const [tab, setTab] = useState<Tab>("artist");
  const [step, setStep] = useState(0);

  const steps = tab === "artist" ? ARTIST_DEMO : FAN_DEMO;
  const screens = tab === "artist" ? ARTIST_SCREENS : FAN_SCREENS;
  const total = steps.length;
  const current = steps[step]!;

  const go = (i: number) => setStep((i + total) % total);
  const switchTab = (next: Tab) => {
    setTab(next);
    setStep(0);
  };

  return (
    <section id="action" className="scroll-mt-20 bg-paper">
      <div className="mx-auto max-w-[1265px] px-5 pb-14 pt-12 sm:px-12 sm:pb-[72px] sm:pt-[22px]">
        <h2 className="mx-auto max-w-[320px] text-center font-display text-[30px] leading-[1.15] sm:max-w-none sm:text-[42px]">
          {ACTION.heading}
        </h2>
        <p className="mx-auto mt-4 max-w-[320px] text-center text-[16px] font-light text-ash sm:mt-3 sm:max-w-none sm:text-[18px]">
          {ACTION.sub}
        </p>

        <div
          role="tablist"
          aria-label="Choose a walkthrough"
          className="mx-auto mt-6 grid w-full max-w-[308px] grid-cols-2 rounded-full border border-ink/10 bg-stone p-1 sm:mt-4"
        >
          {(["artist", "fan"] as const).map((t) => (
            <button
              key={t}
              role="tab"
              type="button"
              aria-selected={tab === t}
              onClick={() => switchTab(t)}
              className={cx(
                "h-[46px] rounded-full text-[15px] font-bold transition",
                tab === t ? "bg-ink text-paper" : "text-ink hover:bg-ink/5",
              )}
            >
              {t === "artist" ? ACTION.artistTab : ACTION.fanTab}
            </button>
          ))}
        </div>

        <div className="mx-auto mt-5 grid max-w-[1073px] overflow-hidden rounded-[20px] bg-stone px-5 pt-8 sm:mt-5 sm:px-[64px] sm:pt-10 lg:h-[500px] lg:grid-cols-[1fr_280px] lg:gap-16 lg:pr-[85px] lg:pt-[41px]">
          <div className="lg:self-center lg:pb-[41px]">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ash">
              {tab === "artist" ? ACTION.artistLabel : ACTION.fanLabel}
              <span className="mx-2">·</span>
              Step {step + 1} of {total}
            </p>
            <h3 className="mt-3.5 font-display text-[28px] leading-tight sm:text-[36px]">{current.name}</h3>
            <div className="mt-3 max-w-[520px] text-[16px] font-light leading-[1.6] text-ink sm:text-[18px]">
              {current.body.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>

            <div className="mt-8 flex items-center gap-[5px] sm:mt-10 sm:gap-[7px]">
              <RoundButton label="Previous step" onClick={() => go(step - 1)}>
                <path d="M15 5 8 12l7 7" />
              </RoundButton>
              {steps.map((s, i) => (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => setStep(i)}
                  aria-label={`Step ${i + 1}: ${s.name}`}
                  aria-current={i === step ? "step" : undefined}
                  className={cx(
                    "size-[31px] shrink-0 rounded-[6px] text-[12px] font-bold transition sm:size-[40px] sm:rounded-[7px] sm:text-[13px]",
                    i === step ? "bg-brick text-ink" : "border border-ink/10 bg-paper text-ink hover:border-ink/40",
                  )}
                >
                  {i + 1}
                </button>
              ))}
              <RoundButton label="Next step" onClick={() => go(step + 1)}>
                <path d="m9 5 7 7-7 7" />
              </RoundButton>
            </div>
          </div>

          <div
            className="mx-auto mt-9 h-[470px] w-full max-w-[280px] overflow-hidden rounded-t-[16px] border border-b-0 border-ink/10 bg-paper shadow-[0_10px_40px_rgba(17,17,17,0.10)] lg:mt-0 lg:h-full"
            aria-live="polite"
          >
            <div className="flex h-[34px] items-center border-b border-ink/5 px-3">
              <Logo size={17} />
            </div>
            <p className="bg-stone px-3 py-[3px] text-[7.5px] text-ash">{SITE.previewBar}</p>
            <div key={`${tab}-${step}`} className="animate-rise px-3 pb-6 pt-3.5">
              {screens[step]}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function RoundButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex size-[33px] shrink-0 items-center justify-center rounded-full border border-ink/10 bg-paper text-ink transition hover:border-ink/40 sm:size-[44px]"
    >
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {children}
      </svg>
    </button>
  );
}

/* ───────── Phone screen pieces ───────── */

function Title({ children }: { children: ReactNode }) {
  return <h4 className="font-display text-[19px] leading-tight">{children}</h4>;
}

function Field({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={cx("min-w-0", className)}>
      <p className="text-[8px] text-ink">{label}</p>
      <p className="mt-1.5 rounded-[3px] border border-ink/10 px-2.5 py-2.5 text-[10px]">{value}</p>
    </div>
  );
}

function Help({ children }: { children: ReactNode }) {
  return <p className="mt-1.5 text-[7.5px] leading-snug text-ash">{children}</p>;
}

function Cta({ children, ghost }: { children: ReactNode; ghost?: boolean }) {
  return (
    <p
      className={cx(
        "mt-4 rounded-[3px] py-2.5 text-center text-[10px] font-bold",
        ghost ? "border border-ink/15 bg-paper" : "bg-brick text-ink",
      )}
    >
      {children}
    </p>
  );
}

function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-[2px] bg-brick px-1.5 py-[3px] text-[7px] font-bold text-ink">
      <span className="size-[5px] rounded-full border border-ink" />
      {children}
    </span>
  );
}

function Progress({ n = 17, of = 25 }: { n?: number; of?: number }) {
  return (
    <div className="mt-2 h-[6px] overflow-hidden rounded-full bg-[#e4e4e0]">
      <div className="h-full rounded-full bg-brick" style={{ width: `${(n / of) * 100}%` }} />
    </div>
  );
}

function Rows({ rows }: { rows: [string, string, boolean?][] }) {
  return (
    <div className="space-y-1.5 text-[9px]">
      {rows.map(([l, r, strong]) => (
        <div key={l} className={cx("flex justify-between gap-2", strong && "font-bold")}>
          <span>{l}</span>
          <span className="tabular">{r}</span>
        </div>
      ))}
    </div>
  );
}

function Checks({ items }: { items: [string, string, boolean][] }) {
  return (
    <div className="space-y-2.5 rounded-[6px] border border-ink/10 p-2.5">
      {items.map(([t, s, done]) => (
        <div key={t} className="flex items-start gap-2">
          <span
            className={cx(
              "mt-0.5 flex size-[13px] shrink-0 items-center justify-center rounded-full",
              done ? "bg-[#3fa24b]" : "border border-ink/25",
            )}
          >
            {done && (
              <svg viewBox="0 0 12 12" className="size-2 text-paper" aria-hidden>
                <path d="M2.5 6.2 L5 8.5 L9.5 3.5" stroke="currentColor" strokeWidth="1.8" fill="none" />
              </svg>
            )}
          </span>
          <div>
            <p className="text-[9.5px] font-semibold">{t}</p>
            <p className="text-[7.5px] text-ash">{s}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function TeeThumb({ white, className }: { white?: boolean; className?: string }) {
  return (
    <span className={cx("relative block shrink-0 overflow-hidden rounded-[3px]", white ? "bg-ink" : "bg-paper", className)}>
      <Image src={white ? "/figma/tee-price-of-art.jpg" : "/merch/tee.jpg"} alt="" fill className="object-contain" sizes="80px" />
    </span>
  );
}

const ARTIST_SCREENS: ReactNode[] = [
  <div key="a1">
    <Title>Set it up</Title>
    <div className="mt-3 border border-dashed border-ink/20 bg-stone py-5 text-center">
      <p className="text-[9px] font-semibold">Add your design</p>
      <p className="mt-0.5 text-[7px] text-ash">PNG or JPG</p>
    </div>
    <div className="mt-3 grid grid-cols-2 gap-1.5">
      <Field label="Price" value="A$55" />
      <Field label="Fans needed" value="25" />
    </div>
    <Field label="Production cost" value="A$900" className="mt-3" />
    <Help>From your printer&apos;s quote, or your own estimate if you make it yourself. Example only.</Help>
    <Field label="Show (optional)" value="The Servo, Port Kembla · 24 Nov" className="mt-3" />
    <Help>We&apos;ll suggest a close date from your production lead time.</Help>
    <p className="mt-3 text-[8px]">Round length</p>
    <div className="mt-1.5 grid grid-cols-3 gap-1.5 text-center text-[9px]">
      <span className="rounded-[3px] border border-ink/10 py-2">3 days</span>
      <span className="rounded-[3px] border border-ink bg-ink py-2 text-paper">7 days</span>
      <span className="rounded-[3px] border border-ink/10 py-2">14 days</span>
    </div>
  </div>,

  <div key="a2">
    <Title>Check what you take home</Title>
    <div className="mt-3 flex items-center gap-2.5 rounded-[6px] border border-ink/10 p-2">
      <TeeThumb white className="size-[46px]" />
      <div>
        <p className="text-[10px] font-bold">The Price of Art</p>
        <p className="text-[8px] text-ash">A$55 · 25 needed · 7 days</p>
      </div>
    </div>
    <div className="mt-3 space-y-2 rounded-[4px] bg-ink px-2.5 pb-2.5 pt-3 text-paper">
      <p className="text-[8.5px]">If 25 fans buy</p>
      <Rows
        rows={[
          ["Fans pay (25 × A$55)", "A$1,375.00"],
          ["Merch Round fee (est.)", "−A$137.50"],
          ["Production", "−A$900.00"],
        ]}
      />
      <div className="flex items-center justify-between bg-brick px-2 py-2 text-ink">
        <span className="text-[9.5px] font-bold">You get</span>
        <span className="text-[15px] font-semibold">A$337.50</span>
      </div>
    </div>
    <Help>Card fees are on us. Closes 31 Oct. Example only.</Help>
    <Cta>Approve and go live</Cta>
  </div>,

  <div key="a3">
    <div className="flex items-center justify-between">
      <Title>Share your round</Title>
      <span className="rounded-[2px] bg-brick px-1.5 py-[3px] text-[7px] font-bold">Live</span>
    </div>
    <p className="mt-3 text-[7px] font-bold uppercase tracking-[0.12em] text-ash">Share the link</p>
    <p className="mt-1.5 rounded-[3px] bg-stone px-2 py-2 text-[9px]">merchround.com/r/price-of-art</p>
    <Cta>Copy link</Cta>
    <div className="mt-4 rounded-[6px] border border-ink/10 p-2.5">
      <p className="text-[13px] font-extrabold">17 of 25 asked for</p>
      <Progress />
      <p className="mt-1.5 text-[7.5px] text-ash">8 more to go · 5 days 19 hours left</p>
    </div>
    <p className="mt-3 text-[7px] font-bold uppercase tracking-[0.12em] text-ash">Latest</p>
    <div className="mt-1 divide-y divide-ink/10 text-[9px]">
      {[
        ["Sam T.", "Tee M", "2 min ago"],
        ["Jess R.", "Tee S", "18 min ago"],
        ["Tom K.", "Tee L", "1 hr ago"],
        ["Mia P.", "Tee M", "3 hr ago"],
      ].map(([n, i, t]) => (
        <div key={n} className="flex justify-between py-1.5">
          <span className="font-bold">{n}</span>
          <span>{i}</span>
          <span className="text-ash">{t}</span>
        </div>
      ))}
    </div>
  </div>,

  <div key="a4">
    <Chip>Going ahead</Chip>
    <p className="mt-2 font-display text-[19px] leading-[1.15]">25 confirmed, Congrats. It&apos;s good to go.</p>
    <div className="mt-3">
      <Checks
        items={[
          ["Set the number", "A$55 · 25 needed", true],
          ["Share", "Link shared", true],
          ["Goes ahead", "25 of 25 · 27 Oct", true],
        ]}
      />
    </div>
    <p className="mt-3 rounded-[4px] bg-stone px-2.5 py-2 text-[9px] font-bold">Sizes: S 5 · M 11 · L 6 · XL 3</p>
    <p className="mt-2 flex justify-between rounded-[4px] bg-brick px-2.5 py-2 text-[9px] font-bold">
      <span>You get</span>
      <span>A$337.50</span>
    </p>
    <Cta>Send to production</Cta>
  </div>,

  <div key="a5">
    <Title>Getting it made</Title>
    <p className="mt-1.5 text-[9px] leading-snug text-ash">Inkhouse Wollongong has the order. 25 tees, ready for the show.</p>
    <div className="mt-3">
      <Checks
        items={[
          ["Fans charged", "25 of 25 paid", true],
          ["Production paid", "A$900 · Inkhouse Wollongong", true],
          ["Ready for pickup", "The Servo, Port Kembla · 24 Nov", false],
          ["Your share paid out", "After pickup", false],
        ]}
      />
    </div>
    <div className="mt-3 rounded-[6px] bg-brick-soft p-3">
      <p className="text-[7px] font-bold uppercase tracking-[0.12em] text-ash">Your share</p>
      <p className="mt-0.5 font-display text-[24px] leading-none">A$337.50</p>
    </div>
    <Cta ghost>See pickup list</Cta>
  </div>,
];

const FAN_SCREENS: ReactNode[] = [
  <div key="f1">
    <div className="relative mx-auto aspect-square w-[88%]">
      <Image src="/merch/tee.jpg" alt="This Round Is On Us tee" fill className="object-contain" sizes="240px" />
    </div>
    <div className="mt-2">
      <Chip>Open</Chip>
    </div>
    <p className="mt-2 font-display text-[22px] leading-[1.1]">This Round Is On Us Tee</p>
    <p className="mt-1 text-[8.5px] text-ash">A$55 · 17 of 25 asked for</p>
    <Progress />
    <p className="mt-3 text-[8px]">Size</p>
    <div className="mt-1.5 grid grid-cols-4 gap-1.5 text-center text-[9px] font-bold">
      {["S", "M", "L", "XL"].map((s) => (
        <span key={s} className={cx("rounded-[3px] border py-2", s === "M" ? "border-ink bg-ink text-paper" : "border-ink/10")}>
          {s}
        </span>
      ))}
    </div>
  </div>,

  <div key="f2">
    <Title>Join the round</Title>
    <div className="mt-3 flex items-center gap-2 rounded-[4px] bg-[#dff3c4] p-2">
      <TeeThumb className="size-[38px]" />
      <div className="min-w-0 flex-1 text-[8.5px] leading-snug">
        <p>This Round Is On Us Tee · M</p>
        <p>Pickup at The Servo · 24 Nov</p>
      </div>
      <span className="text-[9px] font-bold">A$55</span>
    </div>
    <Field label="Email" value="sam@example.com" className="mt-3" />
    <p className="mt-3 text-[8px]">Payment details</p>
    <div className="mt-1.5 rounded-[3px] border border-ink/10 text-[10px]">
      <p className="border-b border-ink/10 px-2.5 py-2.5 tracking-[0.08em]">•••• •••• •••• 4242</p>
      <div className="grid grid-cols-2">
        <p className="border-r border-ink/10 px-2.5 py-2.5">11 / 28</p>
        <p className="px-2.5 py-2.5">•••</p>
      </div>
    </div>
    <Help>Nothing is charged today. You&apos;re only charged if the round goes ahead.</Help>
    <Cta>Join the round · A$55</Cta>
  </div>,

  <div key="f3">
    <p className="text-[7px] font-bold uppercase tracking-[0.12em]">Merch Round</p>
    <p className="mt-1.5 font-display text-[24px] leading-none">You&apos;re in.</p>
    <p className="mt-2 text-[9.5px] leading-snug text-ash">You&apos;re only charged if the round goes ahead.</p>
    <div className="mt-4 rounded-[6px] border border-ink/10 p-2.5">
      <div className="flex items-center gap-2.5">
        <TeeThumb className="size-[44px]" />
        <div>
          <p className="text-[10px] font-bold">This Round Is On Us Tee</p>
          <p className="text-[8px] text-ash">Size M · Pickup at The Servo · 24 Nov</p>
        </div>
      </div>
      <p className="mt-3 text-[13px] font-extrabold">18 of 25 asked for</p>
      <Progress n={18} />
      <p className="mt-1.5 text-[7.5px] text-ash">7 more to go · 5 days 18 hours left</p>
    </div>
    <Cta>Share the round</Cta>
    <Cta ghost>See the round</Cta>
  </div>,

  <div key="f4">
    <Chip>Going ahead</Chip>
    <p className="mt-2 font-display text-[19px] leading-[1.15]">It&apos;s going ahead.</p>
    <p className="mt-1.5 text-[9.5px] leading-snug text-ash">The round hit 25. Your card has been charged and your tee is being made.</p>
    <div className="mt-3 rounded-[6px] border border-ink/10 p-2.5">
      <Rows
        rows={[
          ["This Round Is On Us Tee", "M"],
          ["Pickup", "The Servo · 24 Nov"],
          ["Paid", "A$55.00", true],
        ]}
      />
    </div>
    <div className="mt-3">
      <Checks
        items={[
          ["Round goes ahead", "25 of 25 · 27 Oct", true],
          ["Being made", "We'll email when it's ready", true],
          ["Ready to collect", "24 Nov", false],
        ]}
      />
    </div>
  </div>,

  <div key="f5">
    <Title>Your pickup code</Title>
    <div className="mt-3 rounded-[10px] border border-ink/10 p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[7px] font-bold uppercase tracking-[0.14em] text-ash">Show date</p>
          <p className="font-display text-[20px] leading-none">24 Nov</p>
        </div>
        <TeeThumb className="size-[44px]" />
      </div>
      <div className="my-3 border-t-2 border-dashed border-ink/15" />
      <div className="flex flex-col items-center">
        <QRCodeSVG value="https://merchround.com/pickup/MR4821" size={120} level="M" />
        <p className="mt-2 font-display text-[20px] leading-none">MR 4821</p>
        <p className="mt-1.5 text-[9px] font-bold">The Servo, Port Kembla</p>
        <p className="mt-1 text-center text-[8px] text-ash">Show this at the merch desk. Scan your code and collect your tee.</p>
      </div>
    </div>
  </div>,

  <div key="f6">
    <p className="text-[7px] font-bold uppercase tracking-[0.12em] text-ash">Email from Merch Round</p>
    <p className="mt-1.5 font-display text-[19px] leading-[1.15]">This round didn&apos;t go ahead.</p>
    <div className="mt-3 rounded-[6px] bg-stone p-3 text-[9.5px] leading-[1.5]">{FAILED_ROUND_EMAIL}</div>
    <div className="mt-3 rounded-[6px] border border-ink/10 p-2.5">
      <Rows
        rows={[
          ["This Round Is On Us Tee", "21 of 25"],
          ["Charged", "A$0", true],
        ]}
      />
    </div>
    <Cta ghost>See what else is on</Cta>
  </div>,
];
