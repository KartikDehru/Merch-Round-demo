"use client";

import { useState, type ReactNode } from "react";
import { cx } from "./ui";
import { PhoneFrame } from "./phone-frame";

export function PhoneCarousel({
  label,
  stepNames,
  renderSlide,
}: {
  label: string;
  stepNames: readonly string[];
  renderSlide: (index: number) => ReactNode;
}) {
  const [index, setIndex] = useState(0);
  const total = stepNames.length;
  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);

  return (
    <div className="flex flex-col items-center">
      <p className="text-center text-[13px] font-medium tracking-[0.04em] text-ash uppercase">{label}</p>
      <p className="mt-2 text-center text-[15px] font-semibold text-ink">
        {index + 1} of {total} · {stepNames[index]}
      </p>
      <div
        className="mt-5 w-full touch-pan-y"
        onTouchStart={(e) => {
          const x = e.touches[0]?.clientX ?? 0;
          (e.currentTarget as HTMLElement).dataset.tx = String(x);
        }}
        onTouchEnd={(e) => {
          const start = Number((e.currentTarget as HTMLElement).dataset.tx || 0);
          const end = e.changedTouches[0]?.clientX ?? start;
          const dx = end - start;
          if (dx > 40) prev();
          if (dx < -40) next();
        }}
      >
        <PhoneFrame>{renderSlide(index)}</PhoneFrame>
      </div>
      <div className="mt-5 flex items-center gap-4">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous"
          className="flex size-10 items-center justify-center rounded-full border border-ink text-[18px] font-semibold leading-none text-ink transition hover:bg-ink hover:text-paper"
        >
          ‹
        </button>
        <div className="flex gap-2">
          {stepNames.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={cx("h-2 rounded-full transition-all", i === index ? "w-5 bg-ink" : "w-2 bg-line hover:bg-mute")}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={next}
          aria-label="Next"
          className="flex size-10 items-center justify-center rounded-full border border-ink text-[18px] font-semibold leading-none text-ink transition hover:bg-ink hover:text-paper"
        >
          ›
        </button>
      </div>
    </div>
  );
}
