"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cx } from "./ui";
import { left, pad } from "@/lib/format";
import type { Colorway, PrintMotif, ProductKind } from "@/lib/types";

/* ───────── Logo ───────── */

export function Logo({ className, cursor = false }: { className?: string; cursor?: boolean }) {
  return (
    <span className={cx("inline-flex items-center font-pixel text-[22px] leading-none tracking-tight", className)}>
      <span className="bg-lime px-1 pt-0.5 pb-1 text-ink">MERCH</span>
      <span className="pl-1 text-ink">ROUND</span>
      {cursor && <span className="animate-blink text-ink">_</span>}
    </span>
  );
}

/* ───────── Halftone field (animated canvas) ───────── */

export function Halftone({ className, dark = false, density = 11 }: { className?: string; dark?: boolean; density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const field = (x: number, y: number, t: number) => {
      const nx = x / w;
      const ny = y / h;
      let v =
        Math.sin(nx * 5.2 + t * 0.35) * 0.5 +
        Math.sin(ny * 4.1 - t * 0.28 + nx * 2.3) * 0.5 +
        Math.sin((nx + ny) * 7.3 + t * 0.21) * 0.35 +
        Math.cos(Math.hypot(nx - 0.62, ny - 0.45) * 9 - t * 0.5) * 0.45;
      const cx = nx - 0.6;
      const cy = ny - 0.5;
      const fall = Math.max(0, 1 - Math.hypot(cx * 1.2, cy * 1.5) * 1.55);
      v = (v + 1.8) / 3.6;
      return Math.max(0, Math.min(1, v * fall * 1.35));
    };

    const draw = (time: number) => {
      const t = time / 1000;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = dark ? "rgba(246,246,247,0.9)" : "rgba(17,18,22,0.82)";
      const step = density;
      for (let y = step / 2; y < h; y += step) {
        for (let x = step / 2; x < w; x += step) {
          const v = field(x, y, t);
          const r = v * step * 0.52;
          if (r < 0.35) continue;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      if (!reduce) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [dark, density]);

  return <canvas ref={ref} aria-hidden className={cx("block h-full w-full", className)} />;
}

/* ───────── Merch mock-up (SVG) ───────── */

const FABRIC: Record<Colorway, { base: string; shade: string; ink: string }> = {
  black: { base: "#17181c", shade: "#0c0d10", ink: "#f6f6f7" },
  bone: { base: "#ece6d8", shade: "#d9d1bf", ink: "#111216" },
  olive: { base: "#5b6142", shade: "#474c33", ink: "#f2efe4" },
  navy: { base: "#1d2640", shade: "#141b2f", ink: "#f2efe4" },
};

const SILHOUETTE: Record<ProductKind, string> = {
  tee: "M70 18 L100 8 Q120 24 140 8 L170 18 L214 52 L192 86 L172 74 L172 222 Q120 230 68 222 L68 74 L48 86 L26 52 Z",
  hoodie:
    "M76 26 Q96 4 120 4 Q144 4 164 26 L210 58 L222 196 L196 200 L184 92 L180 224 Q120 234 60 224 L56 92 L44 200 L18 196 L30 58 Z",
  tote: "M50 74 L190 74 L198 226 L42 226 Z M84 74 Q84 18 120 18 Q156 18 156 74 L146 74 Q146 30 120 30 Q94 30 94 74 Z",
  cap: "M40 150 Q40 70 120 64 Q200 70 200 150 Q160 140 120 140 Q80 140 40 150 Z M30 152 Q120 128 222 160 Q232 176 214 180 Q120 158 40 168 Q22 168 30 152 Z",
};

const PRINT_AREA: Record<ProductKind, { x: number; y: number; s: number }> = {
  tee: { x: 120, y: 112, s: 46 },
  hoodie: { x: 120, y: 112, s: 42 },
  tote: { x: 120, y: 150, s: 48 },
  cap: { x: 120, y: 106, s: 24 },
};

function Motif({ motif, x, y, s, color, pid }: { motif: PrintMotif; x: number; y: number; s: number; color: string; pid: string }) {
  const dots = `${pid}-dots`;
  const clip = `${pid}-clip`;
  let shape: React.ReactNode;
  switch (motif) {
    case "rings":
      shape = (
        <>
          <circle cx={x} cy={y} r={s} />
          <circle cx={x} cy={y} r={s * 0.62} fill="black" />
          <circle cx={x} cy={y} r={s * 0.36} />
        </>
      );
      break;
    case "wave":
      shape = (
        <path
          d={`M${x - s} ${y} q${s / 4} ${-s / 2} ${s / 2} 0 t${s / 2} 0 t${s / 2} 0 t${s / 2} 0 v${s * 0.7} h${-s * 2} z`}
        />
      );
      break;
    case "diamond":
      shape = <path d={`M${x} ${y - s} L${x + s * 0.8} ${y} L${x} ${y + s} L${x - s * 0.8} ${y} Z`} />;
      break;
    case "sun":
      shape = (
        <>
          <circle cx={x} cy={y} r={s * 0.55} />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return (
              <rect key={i} x={x - 2} y={y - s} width={4} height={s * 0.3} transform={`rotate(${(a * 180) / Math.PI} ${x} ${y})`} />
            );
          })}
        </>
      );
      break;
    case "grid":
      shape = (
        <>
          {Array.from({ length: 4 }).map((_, i) =>
            Array.from({ length: 4 }).map((__, j) => (
              <rect key={`${i}-${j}`} x={x - s + i * s * 0.5 + 2} y={y - s * 0.7 + j * s * 0.38} width={s * 0.42} height={s * 0.28} />
            )),
          )}
        </>
      );
      break;
  }
  return (
    <g>
      <defs>
        <pattern id={dots} width="4.2" height="4.2" patternUnits="userSpaceOnUse">
          <circle cx="2.1" cy="2.1" r="1.45" fill={color} />
        </pattern>
        <mask id={clip}>
          <g fill="white">{shape}</g>
        </mask>
      </defs>
      <rect x={x - s * 1.2} y={y - s * 1.2} width={s * 2.4} height={s * 2.4} fill={`url(#${dots})`} mask={`url(#${clip})`} />
    </g>
  );
}

export function MerchMock({
  product,
  colorway,
  motif,
  accent,
  label,
  back = false,
  className,
}: {
  product: ProductKind;
  colorway: Colorway;
  motif: PrintMotif;
  accent: string;
  label?: string;
  back?: boolean;
  className?: string;
}) {
  const id = useId().replace(/:/g, "");
  const f = FABRIC[colorway];
  const pa = PRINT_AREA[product];
  const printColor = colorway === "bone" ? accent : accent;
  return (
    <svg viewBox="0 0 240 240" className={cx("block h-full w-full", className)} role="img" aria-label={`${colorway} ${product}${back ? " back" : ""}`}>
      <defs>
        <linearGradient id={`${id}-g`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor={f.base} />
          <stop offset="1" stopColor={f.shade} />
        </linearGradient>
      </defs>
      <path d={SILHOUETTE[product]} fill={`url(#${id}-g)`} fillRule="evenodd" />
      {product === "hoodie" && <path d="M96 28 Q120 60 144 28" fill="none" stroke={f.shade} strokeWidth="5" />}
      {product === "tee" && <path d="M100 9 Q120 30 140 9" fill="none" stroke={f.shade} strokeWidth="4" />}
      {back ? (
        <g fill={f.ink} fontFamily="var(--font-spline-mono), monospace" textAnchor="middle">
          <text x="120" y="70" fontSize="9" letterSpacing="2" fill={printColor}>
            {(label ?? "").toUpperCase().slice(0, 22)}
          </text>
          {["17 NOV · WOLLONGONG", "21 NOV · SYDNEY", "22 NOV · NEWCASTLE", "28 NOV · MELBOURNE", "29 NOV · ADELAIDE", "05 DEC · BRISBANE"]
            .slice(0, product === "tote" ? 4 : product === "cap" ? 0 : 6)
            .map((t, i) => (
              <text key={t} x="120" y={92 + i * 15} fontSize="7.5" letterSpacing="1" opacity="0.85">
                {t}
              </text>
            ))}
        </g>
      ) : (
        <>
          <Motif motif={motif} x={pa.x} y={pa.y} s={pa.s} color={printColor} pid={id} />
          {label && product !== "cap" && (
            <text
              x={pa.x}
              y={pa.y + pa.s + 20}
              textAnchor="middle"
              fontSize="9"
              letterSpacing="2.2"
              fill={f.ink}
              fontFamily="var(--font-spline-mono), monospace"
            >
              {label.toUpperCase().slice(0, 22)}
            </text>
          )}
        </>
      )}
    </svg>
  );
}

/* ───────── Tally ───────── */

export function Tally({
  paid = 0,
  pledged,
  target,
  accent = "var(--color-lime)",
  size = "md",
  className,
}: {
  paid?: number;
  pledged: number;
  target: number;
  accent?: string;
  size?: "sm" | "md";
  className?: string;
}) {
  const total = Math.max(target, pledged);
  if (total > 120) {
    const pct = Math.min(100, (pledged / target) * 100);
    return (
      <div className={cx("h-4 border border-ink/70 bg-card", className)}>
        <div className="h-full" style={{ width: `${pct}%`, background: accent }} />
      </div>
    );
  }
  const cell = size === "sm" ? "h-2.5" : "h-5";
  return (
    <div
      className={cx("grid gap-[3px]", className)}
      style={{ gridTemplateColumns: `repeat(${Math.min(total, size === "sm" ? 40 : 25)}, minmax(0, 1fr))` }}
      aria-label={`${pledged} of ${target}`}
    >
      {Array.from({ length: total }).map((_, i) => {
        const isPaid = i < paid;
        const isPledged = i < pledged;
        const over = i >= target;
        return (
          <span
            key={i}
            className={cx(cell, "border transition-colors", isPledged ? "border-ink" : "border-ink/25 bg-transparent")}
            style={{
              background: isPaid ? "var(--color-ink)" : isPledged ? accent : undefined,
              opacity: over && !isPledged ? 0.3 : 1,
              animation: `rise .4s ${Math.min(i, 40) * 18}ms both`,
            }}
          />
        );
      })}
    </div>
  );
}

/* ───────── Countdown ───────── */

export function Countdown({ to, now, className }: { to: number; now: number; className?: string }) {
  const [t, setT] = useState(() => Date.now());
  useEffect(() => {
    const i = setInterval(() => setT(Date.now()), 1000);
    return () => clearInterval(i);
  }, [to]);
  const l = left(to, t || now);
  const urgent = l.days === 0;
  if (l.done) return <span className={cx("font-mono text-ash", className)}>closed</span>;
  return (
    <span className={cx("font-mono tabular", urgent ? "text-hold" : "text-ink", className)}>
      {l.days > 0 && (
        <>
          <b className="font-display text-[1.25em]">{l.days}</b>
          <span className="text-ash">d </span>
        </>
      )}
      <b className="font-display text-[1.25em]">{pad(l.hrs)}</b>
      <span className="text-ash">h </span>
      <b className="font-display text-[1.25em]">{pad(l.mins)}</b>
      <span className="text-ash">m</span>
    </span>
  );
}
