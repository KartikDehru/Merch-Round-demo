"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { takeHome } from "./demo-math";

export type RoundLengthHours = 24 | 48 | 168 | 336;

export type TryState = {
  imageUrl: string | null;
  description: string;
  price: number;
  target: number;
  printerQuote: number;
  venue: string;
  showDate: string;
  lengthHours: RoundLengthHours;
  pledged: number;
};

type TryContextValue = {
  state: TryState;
  set: (patch: Partial<TryState>) => void;
  math: ReturnType<typeof takeHome>;
  shareUrl: string;
};

const defaults: TryState = {
  imageUrl: null,
  description: "Merch Round Tee",
  price: 55,
  target: 25,
  printerQuote: 900,
  venue: "The Corner Hotel, Melbourne",
  showDate: "",
  lengthHours: 168,
  pledged: 17,
};

const TryContext = createContext<TryContextValue | null>(null);

export function TryProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TryState>(() => ({
    ...defaults,
    showDate: defaultShowDate(),
  }));

  const value = useMemo<TryContextValue>(() => {
    const math = takeHome(state.price, state.target, state.printerQuote);
    return {
      state,
      set: (patch) => setState((s) => ({ ...s, ...patch })),
      math,
      shareUrl: "https://merchround.com/r/demo-tee",
    };
  }, [state]);

  return <TryContext.Provider value={value}>{children}</TryContext.Provider>;
}

export function useTry() {
  const ctx = useContext(TryContext);
  if (!ctx) throw new Error("useTry must be used inside TryProvider");
  return ctx;
}

function defaultShowDate() {
  const d = new Date();
  d.setDate(d.getDate() + 28);
  return d.toISOString().slice(0, 10);
}

export const LENGTH_OPTIONS: { hours: RoundLengthHours; label: string; hint?: string }[] = [
  { hours: 24, label: "24 hrs" },
  { hours: 48, label: "48 hrs" },
  { hours: 168, label: "7 days", hint: "Recommended" },
  { hours: 336, label: "14 days" },
];
