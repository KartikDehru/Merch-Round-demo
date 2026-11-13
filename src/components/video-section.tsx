import Image from "next/image";
import { VIDEO } from "@/lib/copy";

export function VideoSection() {
  return (
    <section className="border-b border-line bg-ink text-paper">
      <div className="mx-auto max-w-[1100px] px-5 py-16 sm:px-8 sm:py-20">
        <div className="relative overflow-hidden rounded-[16px]">
          <div className="relative aspect-[16/9] bg-coal">
            <Image src="/photos/crowd.jpg" alt="" fill className="object-cover opacity-55 grayscale" sizes="1100px" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
              <div
                aria-hidden
                className="flex size-16 items-center justify-center rounded-full bg-brick text-ink shadow-[0_12px_32px_rgba(0,0,0,0.35)] sm:size-20"
              >
                <span className="ml-1 border-y-[10px] border-l-[16px] border-y-transparent border-l-ink sm:border-y-[12px] sm:border-l-[20px]" />
              </div>
              <p className="text-[13px] font-medium tracking-[0.04em] text-paper/70 uppercase">{VIDEO.placeholder}</p>
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-6 sm:p-8">
              <h2 className="max-w-xl font-display text-[clamp(22px,3.5vw,34px)] leading-tight">{VIDEO.heading}</h2>
              <p className="mt-2 max-w-lg text-[15px] text-paper/80">{VIDEO.body}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
