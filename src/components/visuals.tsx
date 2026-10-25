"use client";

import Image from "next/image";
import { useEffect, useId, useState } from "react";
import { cx } from "./ui";
import { left, pad } from "@/lib/format";
import type { Colorway, PrintMotif, ProductKind } from "@/lib/types";

/* ───────── Logo ───────── */

const TEE_PATH = "M42 36 L52 32 Q60 42 68 32 L78 36 L90 50 L80 58 L74 53 L74 88 L46 88 L46 53 L40 58 L30 50 Z";

/** Open ring, tee, and lime dot from the Figma round mark. */
export function LogoMark({ size = 36, className }: { size?: number; dot?: string | null; className?: string; inverted?: boolean }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} aria-hidden className={cx("shrink-0", className)}>
      <circle
        cx="60"
        cy="60"
        r="46"
        fill="none"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray="236 54"
        transform="rotate(28 60 60)"
      />
      <circle cx="98" cy="28" r="9" fill="#8CD92B" />
      <path transform="translate(60 62) scale(0.72) translate(-60 -60)" fill="currentColor" d={TEE_PATH} />
    </svg>
  );
}

export function TeeGlyph({ size = 150, className }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} aria-hidden className={className}>
      <path transform="translate(60 60) scale(1.12) translate(-60 -60)" fill="currentColor" d={TEE_PATH} />
    </svg>
  );
}

export function Logo({ className, dark = false, size = 32 }: { className?: string; dark?: boolean; size?: number; cursor?: boolean }) {
  return (
    <span className={cx("inline-flex items-center gap-2.5", dark ? "text-paper" : "text-ink", className)}>
      <LogoMark size={size} />
      <span className="font-display leading-none whitespace-nowrap tracking-[-0.03em]" style={{ fontSize: size * 0.55 }}>
        Merch Round
      </span>
    </span>
  );
}

/** Decorative ring kept for desk/viewfinder accents. */
export function Ring({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden className={cx("pointer-events-none", className)}>
      <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="6" />
      <path transform="translate(60 60) scale(0.7) translate(-60 -60)" fill="currentColor" d={TEE_PATH} />
    </svg>
  );
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

const PRODUCT_PHOTO: Partial<Record<ProductKind, string>> = {
  tee: "/merch/tee.jpg",
  cap: "/merch/cap.jpg",
  hoodie: "/merch/hoodie.jpg",
};

export function MerchMock({
  product,
  colorway,
  motif,
  accent,
  label,
  back = false,
  fit = "contain",
  className,
}: {
  product: ProductKind;
  colorway: Colorway;
  motif: PrintMotif;
  accent: string;
  label?: string;
  back?: boolean;
  fit?: "contain" | "cover";
  className?: string;
}) {
  const id = useId().replace(/:/g, "");
  const photo = PRODUCT_PHOTO[product];
  if (photo) {
    return (
      <span className={cx("relative block h-full w-full", className)}>
        <Image
          src={photo}
          alt=""
          fill
          className={fit === "cover" ? "object-cover" : "object-contain"}
          sizes="(max-width: 768px) 90vw, 480px"
        />
      </span>
    );
  }
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
  size = "md",
  dark = false,
  className,
}: {
  paid?: number;
  pledged: number;
  target: number;
  accent?: string;
  size?: "sm" | "md";
  dark?: boolean;
  className?: string;
}) {
  const pct = (n: number) => `${Math.min(100, (n / Math.max(1, target)) * 100)}%`;
  return (
    <div
      role="img"
      aria-label={`${pledged} of ${target}`}
      className={cx("relative overflow-hidden", size === "sm" ? "h-1" : "h-1.5", dark ? "bg-paper/20" : "bg-track", className)}
    >
      <div className="absolute inset-y-0 left-0 bg-brick transition-[width] duration-700" style={{ width: pct(pledged) }} />
      {paid > 0 && (
        <div className="absolute inset-y-0 left-0 bg-brick-deep transition-[width] duration-700" style={{ width: pct(paid) }} />
      )}
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
  if (l.done) return <span className={cx("text-ash", className)}>closed</span>;
  return (
    <span className={cx("tabular", urgent ? "text-hold" : "text-ink", className)}>
      {l.days > 0 && (
        <>
          <b className="font-display text-[1.25em]">{l.days}</b>
          <span className="opacity-60">d </span>
        </>
      )}
      <b className="font-display text-[1.25em]">{pad(l.hrs)}</b>
      <span className="opacity-60">h </span>
      <b className="font-display text-[1.25em]">{pad(l.mins)}</b>
      <span className="opacity-60">m</span>
    </span>
  );
}
