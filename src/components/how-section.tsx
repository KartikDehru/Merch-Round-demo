import Image from "next/image";
import { HOW, SHOW_ROUND } from "@/lib/copy";
import { aud } from "@/lib/demo-math";

export function HowSection() {
  return (
    <section id="how" className="scroll-mt-20 border-b border-line bg-paper">
      <div className="mx-auto max-w-[1265px] px-5 py-20 sm:px-8 sm:py-24">
        <h2 className="text-center font-display text-[clamp(32px,5vw,52px)] leading-none">{HOW.heading}</h2>
        <p className="mx-auto mt-3 max-w-lg text-center text-[16px] text-ash sm:text-[17px]">{HOW.subheading}</p>
        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HOW.steps.map((step, i) => (
            <li key={step.title} className="flex flex-col overflow-hidden rounded-[20px] bg-ink text-paper">
              <div className="relative h-[250px] bg-[#171717] p-3 pt-12">
                <span className="absolute left-3 top-3 rounded-full bg-brick px-2.5 py-1 text-[12px] font-bold leading-none text-ink">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="h-full overflow-hidden rounded-[12px] bg-paper text-ink">
                  <StepVisual index={i} />
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-2 px-5 py-5">
                <h3 className="text-[18px] font-semibold leading-tight normal-case tracking-normal">{step.title}</h3>
                <p className="text-[14px] leading-relaxed text-paper/65">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function StepVisual({ index }: { index: number }) {
  if (index === 0) {
    return (
      <div className="flex h-full flex-col p-3">
        <div className="relative min-h-0 flex-1 overflow-hidden rounded-[8px] bg-stone">
          <Image src="/merch/tee.jpg" alt="" fill className="object-contain p-2" sizes="240px" />
        </div>
        <p className="mt-2 text-center text-[11px] font-semibold text-ash">Design uploaded</p>
      </div>
    );
  }

  if (index === 1) {
    return (
      <div className="flex h-full flex-col justify-center gap-2 p-3 text-[12px]">
        <Row k="Price" v="A$55" />
        <Row k="Fans needed" v="25" />
        <div className="rounded-[8px] bg-brick px-3 py-2 font-semibold">You get {aud(337.5)}</div>
      </div>
    );
  }

  if (index === 2) {
    const pct = Math.round((SHOW_ROUND.progress / SHOW_ROUND.target) * 100);
    return (
      <div className="flex h-full flex-col justify-center gap-3 p-4">
        <div className="flex items-baseline justify-between">
          <span className="font-display text-[28px] leading-none">
            {SHOW_ROUND.progress}
            <span className="text-[16px] text-ash"> / {SHOW_ROUND.target}</span>
          </span>
          <span className="text-[11px] text-ash">asked for</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-line">
          <div className="h-full rounded-full bg-brick" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-center text-[12px] font-semibold">Share the link</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-4 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-brick text-[22px] font-bold text-ink">✓</div>
      <div>
        <p className="text-[16px] font-semibold">25 confirmed</p>
        <p className="mt-1 text-[12px] text-ash">Congrats. It&apos;s good to go.</p>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between rounded-[8px] border border-line px-3 py-2">
      <span className="text-ash">{k}</span>
      <span className="font-semibold">{v}</span>
    </div>
  );
}
