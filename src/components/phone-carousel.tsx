"use client";

import { useState, type ReactNode } from "react";
import { Button, cx } from "./ui";
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
      <div className="label">{label}</div>
      <p className="mt-2 text-center text-[14px] font-semibold text-ink">
        {index + 1} of {total} · {stepNames[index]}
      </p>
      <div
        className="mt-4 w-full touch-pan-y"
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
      <div className="mt-4 flex items-center gap-3">
        <Button type="button" variant="secondary" size="sm" onClick={prev} aria-label="Previous">
          ←
        </Button>
        <div className="flex gap-1.5">
          {stepNames.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={cx("size-2 rounded-full", i === index ? "bg-ink" : "bg-line")}
            />
          ))}
        </div>
        <Button type="button" variant="secondary" size="sm" onClick={next} aria-label="Next">
          →
        </Button>
      </div>
    </div>
  );
}
