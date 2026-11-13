import Image from "next/image";
import { HOW, SHOW_ROUND } from "@/lib/copy";
import { aud } from "@/lib/demo-math";

export function HowSection() {
  return (
    <section id="how" className="scroll-mt-20 border-b border-line bg-ink text-paper">
      <div className="mx-auto max-w-[1265px] px-5 py-20 sm:px-8 sm:py-24">
        <h2 className="text-center font-display text-[clamp(32px,5vw,52px)] leading-none">{HOW.heading}</h2>
        <p className="mt-3 text-center text-[17px] text-paper/70">{HOW.subheading}</p>
        <ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {HOW.steps.map((step, i) => (
            <li key={step.title} className="flex flex-col overflow-hidden rounded-[16px] bg-[#1a1a1a]">
              <div className="relative aspect-[4/5] overflow-hidden bg-[#222]">
                <StepVisual index={i} />
                <span className="absolute left-3 top-3 rounded-full bg-brick px-2.5 py-1 font-display text-[13px] leading-none text-ink">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-2 p-5">
                <h3 className="font-display text-[22px] leading-tight">{step.title}</h3>
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
      <div className="absolute inset-0 flex flex-col p-4 pt-12">
        <div className="relative flex-1 overflow-hidden rounded-[8px] border border-dashed border-paper/25 bg-[#2a2a2a]">
          <Image src="/merch/tee.jpg" alt="" fill className="object-contain p-3 opacity-95" sizes="280px" />
        </div>
        <div className="mt-3 rounded-[6px] bg-paper/10 px-3 py-2 text-[11px] text-paper/80">Upload your design</div>
      </div>
    );
  }

  if (index === 1) {
    return (
      <div className="absolute inset-0 flex flex-col justify-end gap-2 p-4 pt-12 text-[11px]">
        <div className="rounded-[8px] border border-paper/15 bg-[#2a2a2a] p-3">
          <div className="text-paper/50">Price</div>
          <div className="mt-0.5 font-display text-[20px] text-paper">A$55</div>
        </div>
        <div className="rounded-[8px] border border-paper/15 bg-[#2a2a2a] p-3">
          <div className="text-paper/50">Fans needed</div>
          <div className="mt-0.5 font-display text-[20px] text-paper">25</div>
        </div>
        <div className="rounded-[8px] bg-brick px-3 py-2.5 font-semibold text-ink">
          Take home {aud(337.5)}
        </div>
      </div>
    );
  }

  if (index === 2) {
    const pct = Math.round((SHOW_ROUND.progress / SHOW_ROUND.target) * 100);
    return (
      <div className="absolute inset-0 flex flex-col p-4 pt-12">
        <div className="relative aspect-square overflow-hidden rounded-[8px] bg-[#2a2a2a]">
          <Image src="/merch/tee.jpg" alt="" fill className="object-cover opacity-90" sizes="220px" />
        </div>
        <div className="mt-3 flex justify-between text-[12px] font-semibold">
          <span>
            {SHOW_ROUND.progress} of {SHOW_ROUND.target}
          </span>
          <span className="text-paper/50">asked for</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-paper/15">
          <div className="h-full bg-brick" style={{ width: `${pct}%` }} />
        </div>
        <div className="mt-3 rounded-[6px] border border-dashed border-paper/30 py-2 text-center text-[11px] font-semibold">
          Post it in Stories →
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 pt-12 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-brick font-display text-[28px] leading-none text-ink">
        ✓
      </div>
      <div>
        <p className="font-display text-[22px] leading-none text-paper">25 confirmed</p>
        <p className="mt-2 text-[13px] text-paper/65">Congrats. It&apos;s good to go.</p>
      </div>
      <div className="relative mt-2 h-24 w-full overflow-hidden rounded-[8px]">
        <Image src="/photos/values-tee.jpg" alt="" fill className="object-cover" sizes="220px" />
      </div>
    </div>
  );
}
