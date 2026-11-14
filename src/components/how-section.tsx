import Image from "next/image";
import type { ReactNode } from "react";
import { HOW, VIDEO } from "@/lib/copy";
import { cx } from "@/lib/cx";

/** Video slot + four step cards on #111 (Figma: "Video slot" + "How a Merch Round Works"). */
export function HowSection() {
  return (
    <section id="how" className="scroll-mt-20 bg-ink text-paper">
      <div className="mx-auto max-w-[1265px] px-5 pb-16 pt-6 sm:px-12 sm:pb-[70px] sm:pt-[38px]">
        <VideoSlot />

        <h2 className="mx-auto mt-9 max-w-[280px] text-center font-display text-[30px] leading-tight sm:mt-12 sm:max-w-none sm:text-[42px]">
          {HOW.heading}
        </h2>

        <div className="mt-8 grid gap-6 sm:mt-[52px] sm:grid-cols-2 lg:grid-cols-4">
          {HOW.steps.map((step, i) => (
            <article
              key={step.title}
              className="flex flex-col rounded-[24px] rounded-tr-[56px] border border-paper/[0.08] bg-panel p-5 pb-8 sm:p-6 sm:pb-10"
            >
              <div className="flex h-[290px] items-center justify-center overflow-hidden rounded-[16px] bg-panel-2 p-3.5 sm:p-3">
                {MOCKUPS[i]}
              </div>
              <div className="mt-5 flex items-center gap-3">
                <span className="flex h-[30px] min-w-[36px] items-center justify-center rounded-[4px] bg-brick px-1.5 text-[13px] font-bold text-ink">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-[22px] font-bold leading-tight">{step.title}</h3>
              </div>
              <div className="mt-5 space-y-0 text-[16px] font-light leading-[1.5] text-grey">
                {step.body.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function VideoSlot() {
  return (
    <div className="relative mx-auto aspect-[16/9] w-full max-w-[800px] overflow-hidden rounded-[10px] bg-panel">
      <Image
        src="/figma/video.jpg"
        alt="A crowd outside a stadium before a show"
        fill
        className="object-cover grayscale"
        sizes="(min-width: 860px) 800px, 100vw"
      />
      <div className="absolute inset-0 bg-ink/35" />
      <button
        type="button"
        aria-label={VIDEO.label}
        title="Explainer video coming soon"
        className="absolute left-1/2 top-1/2 flex size-[54px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brick transition hover:scale-105 sm:size-[104px]"
      >
        <svg viewBox="0 0 24 24" className="ml-1 size-5 text-ink sm:size-9" aria-hidden>
          <path d="M6 4 L20 12 L6 20 Z" fill="currentColor" />
        </svg>
      </button>
      <div className="absolute bottom-3 left-3 right-3 sm:bottom-[22px] sm:left-[34px]">
        <p className="font-display text-[16px] leading-tight sm:text-[30px]">{VIDEO.heading}</p>
        <p className="text-[10px] font-light text-paper/85 sm:mt-0.5 sm:text-[17px]">{VIDEO.body}</p>
      </div>
    </div>
  );
}

/* ───────── Card mockups ───────── */

function Box({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx("rounded-[12px] border border-paper/10 bg-panel-3", className)}>{children}</div>;
}

function DarkField({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[9px] text-grey">{label}</p>
      <p className="mt-1 rounded-[4px] border border-paper/10 bg-panel-2 px-2.5 py-[7px] text-[11px]">{value}</p>
    </div>
  );
}

const MOCKUPS: ReactNode[] = [
  <Box key="design" className="w-full max-w-[250px] p-3">
    <p className="text-center text-[12px] font-bold">Upload Your Design</p>
    <div className="relative mt-2.5 aspect-[176/148] overflow-hidden rounded-[8px] bg-ink">
      <Image src="/figma/tee-price-of-art.jpg" alt="" fill className="object-contain" sizes="240px" />
    </div>
    <p className="mt-3 text-[9px] font-bold text-grey">Short Description</p>
    <p className="mt-1.5 rounded-[6px] border border-paper/15 bg-panel-2 px-2.5 py-2 text-[11px]">The Price of Art Graphic Tee</p>
  </Box>,

  <div key="number" className="w-full max-w-[250px] space-y-2">
    <Box className="space-y-2 p-2">
      <div className="grid grid-cols-2 gap-2">
        <DarkField label="Price" value="A$55" />
        <DarkField label="Fans needed" value="25" />
      </div>
      <DarkField label="Production cost" value="A$900" />
    </Box>
    <Box className="p-1.5">
      <div className="space-y-[7px] rounded-[4px] bg-ink px-2.5 pb-2 pt-2.5 text-[8.5px]">
        <p>If 25 fans buy</p>
        <Line l="Fans pay (25 × A$55)" r="A$1,375.00" />
        <Line l="Merch Round fee (est.)" r="−A$137.50" />
        <Line l="Production" r="−A$900.00" />
        <div className="flex items-center justify-between bg-brick px-2 py-2 text-ink">
          <span className="text-[10px] font-bold">You get</span>
          <span className="text-[16px] font-semibold">A$337.50</span>
        </div>
      </div>
    </Box>
  </div>,

  <div key="share" className="w-full max-w-[250px]">
    <Box className="p-2.5 pb-4">
      <div className="relative h-[84px] overflow-hidden rounded-[8px] bg-ink">
        <Image src="/figma/tee-price-of-art.jpg" alt="" fill className="object-contain" sizes="240px" />
      </div>
      <p className="mt-3 text-[14px] font-bold">17 of 25 asked for</p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-paper/15">
        <div className="h-full w-[68%] rounded-full bg-brick" />
      </div>
      <p className="mt-2 text-[9px] text-grey">8 more to go · 5 days 19 hours left</p>
    </Box>
    <Box className="relative -mt-2 ml-4 mr-6 p-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
      <p className="text-[6.5px] font-bold uppercase tracking-[0.08em]">Merch Round</p>
      <p className="mt-1.5 text-[13px] font-bold">You&apos;re in.</p>
      <p className="mt-1 text-[8px] leading-snug text-grey">You&apos;re only charged if the round goes ahead.</p>
      <span className="mt-2 inline-block rounded-[3px] bg-brick px-2 py-1 text-[8px] font-bold text-ink">See the round</span>
    </Box>
  </div>,

  <div key="made" className="w-full max-w-[250px] space-y-2.5">
    <Box className="p-2.5">
      <span className="inline-flex items-center gap-1 rounded-[2px] bg-brick px-1.5 py-1 text-[7px] font-bold text-ink">
        <span className="size-1.5 rounded-full border border-ink" />
        Going ahead
      </span>
      <p className="mt-2 font-display text-[16px] leading-[1.2]">25 confirmed, Congrats. It&apos;s good to go.</p>
    </Box>
    <Box className="space-y-2.5 p-2.5">
      {[
        ["Set the number", "A$55 · 25 needed"],
        ["Share", "Link shared"],
        ["Goes ahead", "25 of 25 · 27 Oct"],
      ].map(([t, s]) => (
        <div key={t} className="flex items-start gap-2.5">
          <span className="mt-0.5 flex size-[14px] shrink-0 items-center justify-center rounded-full bg-[#3fa24b]">
            <svg viewBox="0 0 12 12" className="size-2 text-paper" aria-hidden>
              <path d="M2.5 6.2 L5 8.5 L9.5 3.5" stroke="currentColor" strokeWidth="1.8" fill="none" />
            </svg>
          </span>
          <div>
            <p className="text-[10px]">{t}</p>
            <p className="text-[7.5px] text-grey">{s}</p>
          </div>
        </div>
      ))}
    </Box>
  </div>,
];

function Line({ l, r }: { l: string; r: string }) {
  return (
    <div className="flex justify-between gap-2">
      <span>{l}</span>
      <span className="tabular">{r}</span>
    </div>
  );
}
