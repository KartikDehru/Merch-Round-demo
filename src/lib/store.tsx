"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { SEED_VERSION, createSeed } from "./seed";
import type { World } from "./types";

const KEY = "merchround-demo";

interface Toast {
  id: number;
  text: string;
  tone: "good" | "warn" | "bad" | "neutral";
}

interface Ctx {
  world: World;
  act: (...fns: ((w: World) => void)[]) => void;
  reset: () => void;
  toast: (text: string, tone?: Toast["tone"]) => void;
  now: number;
}

const WorldCtx = createContext<Ctx | null>(null);

let toastSeq = 0;
const noopSubscribe = () => () => {};

function loadWorld(): World {
  if (typeof window === "undefined") return createSeed(0);
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as World;
      if (parsed.version === SEED_VERSION) return parsed;
    }
  } catch {}
  return createSeed();
}

export function WorldProvider({ children }: { children: React.ReactNode }) {
  const isClient = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const [world, setWorld] = useState<World>(loadWorld);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30_000);
    const onStorage = (e: StorageEvent) => {
      if (e.key !== KEY || !e.newValue) return;
      try {
        const next = JSON.parse(e.newValue) as World;
        if (next.version === SEED_VERSION) setWorld(next);
      } catch {}
    };
    window.addEventListener("storage", onStorage);
    return () => {
      clearInterval(t);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  useEffect(() => {
    if (isClient) localStorage.setItem(KEY, JSON.stringify(world));
  }, [world, isClient]);

  const act = useCallback((...fns: ((w: World) => void)[]) => {
    setWorld((prev) => {
      const draft = structuredClone(prev);
      for (const fn of fns) fn(draft);
      return draft;
    });
    setNow(Date.now());
  }, []);

  const reset = useCallback(() => {
    localStorage.removeItem(KEY);
    setWorld(createSeed());
    setNow(Date.now());
  }, []);

  const toast = useCallback((text: string, tone: Toast["tone"] = "neutral") => {
    const id = ++toastSeq;
    setToasts((t) => [...t, { id, text, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const value = useMemo(() => ({ world, act, reset, toast, now }), [world, act, reset, toast, now]);

  if (!isClient) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <span className="font-display text-lg text-mute">
          Loading<span className="animate-blink">…</span>
        </span>
      </div>
    );
  }

  return (
    <WorldCtx.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-20 z-[60] flex flex-col items-center gap-2 px-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`animate-rise pointer-events-auto border px-4 py-2 text-[13px] ${
              t.tone === "good"
                ? "border-ink bg-brick text-paper"
                : t.tone === "bad"
                  ? "border-ink bg-stop text-white"
                  : t.tone === "warn"
                    ? "border-ink bg-hold-soft text-ink"
                    : "border-ink bg-card text-ink"
            }`}
          >
            {t.text}
          </div>
        ))}
      </div>
    </WorldCtx.Provider>
  );
}

export function useWorld() {
  const ctx = useContext(WorldCtx);
  if (!ctx) throw new Error("useWorld outside WorldProvider");
  return ctx;
}
