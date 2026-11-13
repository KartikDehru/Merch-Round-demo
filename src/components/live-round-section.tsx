import Image from "next/image";
import { LIVE, SHOW_ROUND } from "@/lib/copy";

export function LiveRoundSection() {
  const pct = Math.round((SHOW_ROUND.progress / SHOW_ROUND.target) * 100);

  return (
    <section className="border-b border-line bg-stone">
      <div className="mx-auto max-w-[1265px] px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-[clamp(28px,4.5vw,44px)] leading-none">{LIVE.heading}</h2>
          <p className="mt-4 text-[16px] leading-relaxed text-ash">{LIVE.body}</p>
        </div>

        <div className="relative mx-auto mt-14 max-w-[920px]">
          <div className="overflow-hidden rounded-[16px] border border-line bg-paper shadow-[0_24px_60px_rgba(1,1,0,0.1)]">
            <div className="flex items-center gap-2 border-b border-line px-4 py-3">
              <span className="size-2.5 rounded-full bg-line" />
              <span className="size-2.5 rounded-full bg-line" />
              <span className="size-2.5 rounded-full bg-line" />
              <span className="ml-3 truncate text-[12px] text-mute">merchround.com/r/demo-tee</span>
            </div>
            <div className="grid gap-6 p-5 sm:grid-cols-[200px_1fr] sm:p-8">
              <div className="relative mx-auto aspect-square w-full max-w-[200px] overflow-hidden border border-line bg-stone">
                <Image src="/merch/tee.jpg" alt="" fill className="object-contain p-2" sizes="200px" />
              </div>
              <div>
                <h3 className="font-display text-[24px] leading-none">{SHOW_ROUND.title}</h3>
                <p className="mt-2 text-[14px] text-ash">Merch Round · {SHOW_ROUND.price}</p>
                <div className="mt-5 flex justify-between text-[14px] font-semibold">
                  <span>
                    {SHOW_ROUND.progress} / {SHOW_ROUND.target}
                  </span>
                  <span className="text-ash">{SHOW_ROUND.timeLeft}</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-line">
                  <div className="h-full bg-brick" style={{ width: `${pct}%` }} />
                </div>
                <ul className="mt-6 divide-y divide-line border border-line text-[13px]">
                  {[
                    ["Sam T.", "M"],
                    ["Billie F.", "L"],
                    ["Tahlia C.", "S"],
                    ["Jordan P.", "XL"],
                  ].map(([name, size]) => (
                    <li key={name} className="flex justify-between px-3 py-2.5">
                      <span>{name}</span>
                      <span className="text-ash">Size {size}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-6 -left-2 hidden w-[200px] rotate-[-4deg] overflow-hidden rounded-[12px] border border-line bg-paper shadow-lg sm:block lg:-left-8">
            <div className="relative aspect-square bg-stone">
              <Image src="/merch/tee.jpg" alt="" fill className="object-cover" sizes="200px" />
            </div>
            <p className="p-3 text-[12px] font-semibold leading-snug">This Round Is On Us — join the round</p>
          </div>
        </div>
      </div>
    </section>
  );
}
