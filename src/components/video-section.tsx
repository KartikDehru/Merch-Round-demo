import Image from "next/image";
import { VIDEO } from "@/lib/copy";

export function VideoSection() {
  return (
    <section className="border-b border-line bg-ink text-paper">
      <div className="mx-auto max-w-[1100px] px-5 py-14 sm:px-8 sm:py-16">
        <div className="relative overflow-hidden rounded-[20px]">
          <div className="relative aspect-[16/9] bg-coal">
            <Image
              src="/photos/crowd.jpg"
              alt=""
              fill
              className="object-cover opacity-50 grayscale"
              sizes="1100px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
              <div
                aria-hidden
                className="flex size-16 items-center justify-center rounded-full bg-brick text-ink shadow-[0_16px_40px_rgba(0,0,0,0.4)] sm:size-[88px]"
              >
                <span className="ml-1 border-y-[11px] border-l-[18px] border-y-transparent border-l-ink sm:border-y-[14px] sm:border-l-[22px]" />
              </div>
              <p className="text-[12px] font-medium tracking-[0.08em] text-paper/60 uppercase">{VIDEO.placeholder}</p>
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <h2 className="max-w-xl font-display text-[clamp(24px,3.8vw,40px)] leading-[0.95]">{VIDEO.heading}</h2>
              <p className="mt-2 max-w-lg text-[15px] text-paper/75 sm:text-[16px]">{VIDEO.body}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
