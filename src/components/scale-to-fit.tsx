"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { cx } from "@/lib/cx";

/** Renders a fixed-size design canvas and scales it down to the container width. */
export function ScaleToFit({
  width,
  height,
  maxScale = 1,
  className,
  children,
}: {
  width: number;
  height: number;
  maxScale?: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setScale(Math.min(maxScale, el.clientWidth / width));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [width, maxScale]);

  return (
    <div ref={ref} className={cx("w-full", className)} style={{ height: height * scale }}>
      <div
        className="relative origin-top-left"
        style={{ width, height, transform: `scale(${scale})`, marginLeft: `max(0px, calc((100% - ${width * scale}px) / 2))` }}
      >
        {children}
      </div>
    </div>
  );
}
