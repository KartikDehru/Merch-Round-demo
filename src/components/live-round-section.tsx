import Image from "next/image";
import { LIVE, SHOW_ROUND } from "@/lib/copy";

export function LiveRoundSection() {
  const pct = Math.round((SHOW_ROUND.progress / SHOW_ROUND.target) * 100);

  return (
    <section className="border-b border-line bg-haze">
      <div className="mx-auto max-w-[1265px] px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-[clamp(28px,4.5vw,48px)] leading-none">{LIVE.heading}</h2>
          <p className="mt-4 text-[16px] leading-relaxed text-ash sm:text-[17px]">{LIVE.body}</p>
        </div>

        <div className="relative mx-auto mt-16 max-w-[920px]">
          <div className="overflow-hidden rounded-[20px] border border-line bg-paper shadow-[0_32px_80px_rgba(17,17,17,0.12)]">
            <div className="flex items-center gap-2 border-b border-line bg-stone/80 px-4 py-3">
              <span className="size-2.5 rounded-full bg-[#ff5f57]" />
              <span className="size-2.5 rounded-full bg-[#febc2e]" />
              <span className="size-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-3 truncate text-[12px] text-mute">merchround.com/r/demo-tee</span>
            </div>
            <div className="grid gap-6 p-5 sm:grid-cols-[220px_1fr] sm:p-8">
              <div className="relative mx-auto aspect-square w-full max-w-[220px] overflow-hidden rounded-[12px] bg-stone">
                <Image src="/merch/tee.jpg" alt="" fill className="object-contain p-3" sizes="220px" />
              </div>
              <div>
                <h3 className="font-display text-[26px] leading-none">{SHOW_ROUND.title}</h3>
                <p className="mt-2 text-[14px] text-ash">Merch Round · {SHOW_ROUND.price}</p>
                <div className="mt-5 flex justify-between text-[14px] font-semibold">
                  <span>
                    {SHOW_ROUND.progress} / {SHOW_ROUND.target}
                  </span>
                  <span className="text-ash">{SHOW_ROUND.timeLeft}</span>
                </div>
                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-line">
                  <div className="h-full rounded-full bg-brick" style={{ width: `${pct}%` }} />
                </div>
                <p className="label mt-6 mb-2">Orders so far</p>
                <ul className="divide-y divide-line overflow-hidden rounded-[10px] border border-line text-[13px]">
                  {[
                    ["Sam T.", "M"],
                    ["Billie F.", "L"],
                    ["Tahlia C.", "S"],
                    ["Jordan P.", "XL"],
                  ].map(([name, size]) => (
                    <li key={name} className="flex justify-between bg-paper px-3 py-2.5">
                      <span>{name}</span>
                      <span className="text-ash">Size {size}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-8 -left-3 hidden w-[210px] rotate-[-5deg] overflow-hidden rounded-[14px] border border-line bg-paper shadow-xl sm:block lg:-left-10">
            <div className="relative aspect-square bg-stone">
              <Image src="/photos/values-tee.jpg" alt="" fill className="object-cover" sizes="210px" />
            </div>
            <p className="p-3 text-[12px] font-semibold leading-snug">This Round Is On Us — join the round</p>
          </div>

          <div className="absolute -right-2 -top-6 hidden w-[180px] rotate-[4deg] overflow-hidden rounded-[14px] border border-line bg-paper p-3 shadow-xl md:block lg:-right-6">
            <p className="text-[11px] font-semibold leading-snug text-ink">The price of art is up. We need 25.</p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
              <div className="h-full w-[68%] rounded-full bg-brick" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
