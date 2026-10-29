import { FEE_RATE } from "./copy";

export function takeHome(price: number, target: number, printerQuote: number) {
  const fansPay = price * target;
  const fee = fansPay * FEE_RATE;
  const artist = fansPay - fee - printerQuote;
  const perExtra = price * (1 - FEE_RATE);
  return { fansPay, fee, printerQuote, artist, perExtra };
}

export function aud(n: number) {
  const fixed = Math.round(n * 100) / 100;
  return `A$${fixed.toLocaleString("en-AU", { minimumFractionDigits: fixed % 1 ? 2 : 0, maximumFractionDigits: 2 })}`;
}
