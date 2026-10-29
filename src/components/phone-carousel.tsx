"use client";

import { useState, type ReactNode } from "react";
import { cx } from "./ui";

/** Frameless Figma-sized stage — no bezel, no notch. */
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
    <div className="flex w-full flex-col items-center">
      <p className="text-center text-[13px] font-medium tracking-[0.04em] text-ash uppercase">{label}</p>
      <p className="mt-2 text-center text-[15px] font-semibold text-ink">
        {index + 1} of {total} · {stepNames[index]}
      </p>
      <div
        className="mt-6 w-full max-w-[440px] touch-pan-y"
        onTouchStart={(e) => {
          const t = e.touches[0];
          (e.currentTarget as HTMLElement).dataset.tx = String(t?.clientX ?? 0);
          (e.currentTarget as HTMLElement).dataset.ty = String(t?.clientY ?? 0);
        }}
        onTouchEnd={(e) => {
          const el = e.currentTarget as HTMLElement;
          const startX = Number(el.dataset.tx || 0);
          const startY = Number(el.dataset.ty || 0);
          const endX = e.changedTouches[0]?.clientX ?? startX;
          const endY = e.changedTouches[0]?.clientY ?? startY;
          const dx = endX - startX;
          const dy = endY - startY;
          // Only change slides on clear horizontal swipes — don't fight vertical scroll
          if (Math.abs(dx) < 40 || Math.abs(dx) <= Math.abs(dy)) return;
          if (dx > 0) prev();
          else next();
        }}
      >
        {/* Squarer artboard, soft corner — matches Figma screens without device chrome */}
        <div className="aspect-square overflow-hidden rounded-[16px] border border-line bg-paper sm:aspect-[5/6]">
          {renderSlide(index)}
        </div>
      </div>
      <div className="mt-6 flex items-center gap-4">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous"
          className="flex size-10 items-center justify-center rounded-[8px] border border-ink text-[18px] font-semibold leading-none text-ink transition hover:bg-ink hover:text-paper"
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
              className={cx("h-2 rounded-[2px] transition-all", i === index ? "w-5 bg-ink" : "w-2 bg-line hover:bg-mute")}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={next}
          aria-label="Next"
          className="flex size-10 items-center justify-center rounded-[8px] border border-ink text-[18px] font-semibold leading-none text-ink transition hover:bg-ink hover:text-paper"
        >
          ›
        </button>
      </div>
    </div>
  );
}
