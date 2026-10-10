export function aud(n: number, opts: { cents?: boolean } = {}) {
  const whole = Number.isInteger(Math.round(n * 100) / 100);
  const digits = opts.cents || !whole ? 2 : 0;
  const sign = n < 0 ? "−" : "";
  return `${sign}A$${Math.abs(n).toLocaleString("en-AU", { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
}

export function date(ts: number, withYear = false) {
  return new Date(ts).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    ...(withYear ? { year: "numeric" } : {}),
  });
}

export function dateTime(ts: number) {
  return new Date(ts).toLocaleString("en-AU", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function weekday(ts: number) {
  return new Date(ts).toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short" });
}

export function ago(ts: number, now = Date.now()) {
  const d = now - ts;
  const m = Math.round(d / 60000);
  if (Math.abs(m) < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.round(h / 24);
  return `${days}d ago`;
}

export function left(ts: number, now = Date.now()) {
  const d = Math.max(0, ts - now);
  const days = Math.floor(d / 86_400_000);
  const hrs = Math.floor((d % 86_400_000) / 3_600_000);
  const mins = Math.floor((d % 3_600_000) / 60000);
  return { days, hrs, mins, done: d === 0 };
}

export function pad(n: number) {
  return String(n).padStart(2, "0");
}
