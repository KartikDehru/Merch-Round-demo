"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { createSeed } from "./seed";
import type { Session, World } from "./types";

type SharedWorld = Omit<World, "session">;

const SESSION_KEY = "merchround-session";

interface Toast {
  id: number;
  text: string;
  tone: "good" | "warn" | "bad" | "neutral";
}

interface Ctx {
  world: World;
  live: boolean;
  act: (...fns: ((w: World) => void)[]) => void;
  reset: () => void;
  toast: (text: string, tone?: Toast["tone"]) => void;
  now: number;
}

const WorldCtx = createContext<Ctx | null>(null);

let toastSeq = 0;
const noopSubscribe = () => () => {};

function loadSession(): Session {
  if (typeof window === "undefined") return { role: null, artistId: "a-static" };
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) return JSON.parse(raw) as Session;
  } catch {}
  return { role: null, artistId: "a-static" };
}

function saveSession(session: Session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function WorldProvider({ children }: { children: React.ReactNode }) {
  const isClient = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const [world, setWorld] = useState<World>(() => createSeed(0));
  const [ready, setReady] = useState(false);
  const [live, setLive] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [now, setNow] = useState(() => Date.now());

  const revRef = useRef(0);
  const liveRef = useRef(false);
  const savingRef = useRef(false);
  const dirtyRef = useRef(false);
  const editGen = useRef(0);
  const timerRef = useRef<number | null>(null);

  const toast = useCallback((text: string, tone: Toast["tone"] = "neutral") => {
    const id = ++toastSeq;
    setToasts((t) => [...t, { id, text, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const applyShared = useCallback((shared: SharedWorld, rev: number) => {
    revRef.current = rev;
    setWorld((current) => ({ ...shared, session: current.session.role ? current.session : loadSession() }));
  }, []);

  const push = useCallback(async (snapshot: World, generation: number) => {
    if (!liveRef.current) return;
    savingRef.current = true;
    const shared = { ...snapshot } as Partial<World>;
    delete shared.session;
    try {
      const res = await fetch("/api/world", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ world: shared as SharedWorld }),
      });
      if (!res.ok) throw new Error("save failed");
      const data = (await res.json()) as { rev: number };
      if (generation === editGen.current) {
        revRef.current = data.rev;
        dirtyRef.current = false;
      }
    } catch {
      toast("Couldn't save to the live database", "warn");
    } finally {
      savingRef.current = false;
    }
  }, [toast]);

  const queuePush = useCallback(
    (snapshot: World) => {
      dirtyRef.current = true;
      const generation = ++editGen.current;
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        void push(snapshot, generation);
      }, 250);
    },
    [push],
  );

  useEffect(() => {
    if (!isClient) return;
    let stop = false;
    const boot = async () => {
      const session = loadSession();
      try {
        const res = await fetch("/api/world", { cache: "no-store" });
        if (!res.ok) throw new Error("offline");
        const data = (await res.json()) as { rev: number; world: SharedWorld };
        if (stop) return;
        revRef.current = data.rev;
        liveRef.current = true;
        setLive(true);
        setWorld({ ...data.world, session });
      } catch {
        if (stop) return;
        liveRef.current = false;
        setLive(false);
        setWorld({ ...createSeed(), session });
      } finally {
        if (!stop) setReady(true);
      }
    };
    void boot();

    const poll = window.setInterval(async () => {
      if (!liveRef.current || savingRef.current || dirtyRef.current) return;
      try {
        const res = await fetch("/api/world", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as { rev: number; world: SharedWorld };
        if (data.rev !== revRef.current) applyShared(data.world, data.rev);
      } catch {}
    }, 2500);

    const clock = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => {
      stop = true;
      window.clearInterval(poll);
      window.clearInterval(clock);
    };
  }, [applyShared, isClient]);

  useEffect(() => {
    if (isClient) saveSession(world.session);
  }, [world.session, isClient]);

  const act = useCallback(
    (...fns: ((w: World) => void)[]) => {
      setWorld((prev) => {
        const draft = structuredClone(prev);
        for (const fn of fns) fn(draft);
        queuePush(draft);
        return draft;
      });
      setNow(Date.now());
    },
    [queuePush],
  );

  const reset = useCallback(() => {
    void (async () => {
      dirtyRef.current = false;
      editGen.current += 1;
      if (liveRef.current) {
        const res = await fetch("/api/world", {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ reset: true }),
        });
        if (res.ok) {
          const data = (await res.json()) as { rev: number; world: SharedWorld };
          revRef.current = data.rev;
          setWorld((current) => ({ ...data.world, session: current.session }));
          return;
        }
      }
      setWorld((current) => ({ ...createSeed(), session: current.session }));
    })();
    setNow(Date.now());
  }, []);

  const value = useMemo(() => ({ world, live, act, reset, toast, now }), [world, live, act, reset, toast, now]);

  if (!isClient || !ready) {
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
                ? "border-ink bg-brick text-ink"
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
