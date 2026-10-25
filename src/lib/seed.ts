import { DAY, DEMO_FAN, HOUR, ADMIN_EMAIL, hash, suggestTarget } from "./domain";
import type { Artist, Email, LogEvent, Pledge, PledgeStatus, Round, World } from "./types";

export const SEED_VERSION = 9;

const FIRST = [
  "Alex", "Jess", "Riley", "Mia", "Noah", "Ava", "Liam", "Zoe", "Ethan", "Chloe", "Ollie", "Grace", "Jack",
  "Isla", "Harper", "Lucas", "Ruby", "Mason", "Ella", "Cooper", "Sienna", "Leo", "Matilda", "Archie", "Ivy",
  "Hamish", "Freya", "Kai", "Willow", "Max", "Tahlia", "Finn", "Indi", "Jai", "Poppy", "Rory", "Maeve", "Sol",
];
const LAST = [
  "Morgan", "Lee", "Chen", "Nguyen", "Smith", "Walker", "Patel", "Kelly", "Brown", "Wilson", "Murphy", "Singh",
  "Taylor", "Ryan", "Clarke", "Hughes", "Russo", "Kaur", "Park", "Evans", "Doyle", "Ward", "Bell", "Hart",
];

export function makeCode(seed: string) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let h = hash(seed);
  let out = "";
  for (let i = 0; i < 4; i++) {
    out += chars[h % chars.length];
    h = Math.floor(h / chars.length) + hash(seed + i);
  }
  return `MR-${out}`;
}

function fanName(i: number, salt: string) {
  const h = hash(salt + i);
  return `${FIRST[h % FIRST.length]} ${LAST[(h >> 5) % LAST.length]}`;
}

function sizeFor(i: number, sizes: string[], salt: string) {
  const weights = sizes.length === 1 ? [1] : sizes.map((s) => ({ S: 3, M: 6, L: 5, XL: 3, XXL: 1 })[s] ?? 2);
  const total = weights.reduce((a, b) => a + b, 0);
  let r = hash(salt + "size" + i) % total;
  for (let k = 0; k < sizes.length; k++) {
    if (r < weights[k]) return sizes[k];
    r -= weights[k];
  }
  return sizes[0];
}

export function createSeed(now = Date.now()): World {
  const artists: Artist[] = [
    {
      id: "a-static",
      name: "Merch Round",
      slug: "merch-round",
      city: "Wollongong, NSW",
      accent: "#8CD92B",
      bio: "The Merch Round example account. Run a round from this side and see what an artist sees, without inventing a band.",
      instagram: "@merchround",
      stripe: "verified",
    },
    {
      id: "a-lowtide",
      name: "Low Tide Club",
      slug: "low-tide-club",
      city: "Perth, WA",
      accent: "#5B4C7E",
      bio: "Dream-pop for the long drive down the coast.",
      instagram: "@lowtideclub",
      stripe: "verified",
    },
    {
      id: "a-velvet",
      name: "Velvet Mile",
      slug: "velvet-mile",
      city: "Sydney, NSW",
      accent: "#8E2F45",
      bio: "Synth-heavy heartbreak, best played loud.",
      instagram: "@velvetmile",
      stripe: "verified",
    },
  ];

  const base = (r: Partial<Round> & Pick<Round, "id" | "artistId" | "title" | "price" | "printerQuote" | "minRun">): Round => ({
    slug: r.id.replace(/^r-/, ""),
    product: "tee",
    colorway: "black",
    motif: "rings",
    description: "",
    details: [],
    target: suggestTarget(r.printerQuote, r.minRun, r.price),
    leadWeeks: 3,
    showName: "",
    venue: "",
    showDate: now + 30 * DAY,
    createdAt: now - 7 * DAY,
    closesAt: now + 7 * DAY,
    status: "live",
    sizes: ["S", "M", "L", "XL"],
    delivery: true,
    deliveryFee: 10,
    printer: { name: "Inkhouse Wollongong" },
    ...r,
  });

  const rounds: Round[] = [
    base({
      id: "r-static-tour-tee",
      slug: "this-round-is-on-us-tee",
      artistId: "a-static",
      title: "This Round Is On Us Tee",
      motif: "rings",
      description: "Merch Round Tee",
      details: ["Merch Round Tee"],
      price: 45,
      printerQuote: 650,
      minRun: 25,
      showName: "Merch Round",
      venue: "The Servo, Wollongong",
      showDate: now + 38 * DAY,
      createdAt: now - 8 * DAY,
      closesAt: now + 6 * DAY + 4 * HOUR,
      delivery: false,
      printer: { name: "Inkhouse Wollongong" },
    }),
    base({
      id: "r-static-night-drive",
      artistId: "a-static",
      title: "Circle Hoodie",
      product: "hoodie",
      colorway: "black",
      motif: "rings",
      description: "Merch Round Hoodie",
      details: ["Merch Round Hoodie"],
      price: 85,
      printerQuote: 1400,
      minRun: 20,
      showName: "Merch Round",
      venue: "Oxford Art Factory, Sydney",
      showDate: now + 5 * DAY,
      createdAt: now - 45 * DAY,
      closesAt: now - 31 * DAY,
      status: "delivered",
      reachedAt: now - 34 * DAY,
      chargeDeadline: now - 28 * DAY,
      printer: {
        name: "Inkhouse Wollongong",
        sentAt: now - 27 * DAY,
        invoiceAmount: 1380,
        invoicePaidAt: now - 26 * DAY,
        expectedReadyAt: now - 2 * DAY,
        deliveredAt: now - 1 * DAY,
      },
    }),
    base({
      id: "r-static-sunburn-cap",
      artistId: "a-static",
      title: "Circle Cap",
      product: "cap",
      colorway: "black",
      motif: "rings",
      description: "Merch Round Hat",
      details: ["Merch Round Hat"],
      price: 35,
      printerQuote: 560,
      minRun: 24,
      sizes: ["One size"],
      showName: "Merch Round",
      venue: "Yours & Owls Festival, Wollongong",
      showDate: now + 60 * DAY,
      createdAt: now - 1 * DAY,
      closesAt: now + 15 * DAY,
      status: "pending_review",
    }),
    base({
      id: "r-neon-gravel-rash",
      slug: "merch-round-tee-charging",
      artistId: "a-static",
      title: "Merch Round Tee",
      colorway: "black",
      motif: "rings",
      description: "Merch Round Tee",
      details: ["Merch Round Tee"],
      price: 40,
      printerQuote: 700,
      minRun: 30,
      showName: "Merch Round",
      venue: "Corner Hotel, Melbourne",
      showDate: now + 30 * DAY,
      createdAt: now - 16 * DAY,
      closesAt: now - 22 * HOUR,
      status: "charging",
      reachedAt: now - 4 * DAY,
      chargeDeadline: now + 50 * HOUR,
      printer: { name: "Southside Screen Co." },
    }),
    base({
      id: "r-neon-gravel-cap",
      slug: "circle-cap",
      artistId: "a-static",
      title: "Circle Cap",
      product: "cap",
      colorway: "black",
      motif: "rings",
      description: "Merch Round Hat",
      details: ["Merch Round Hat"],
      price: 30,
      target: 24,
      printerQuote: 600,
      minRun: 24,
      sizes: ["One size"],
      showName: "Merch Round",
      venue: "Corner Hotel, Melbourne",
      showDate: now + 44 * DAY,
      createdAt: now - 3 * DAY,
      closesAt: now + 11 * DAY,
      printer: { name: "Southside Screen Co." },
    }),
    base({
      id: "r-salt-tidal-tee",
      slug: "merch-round-tee-decision",
      artistId: "a-static",
      title: "Merch Round Tee",
      colorway: "black",
      motif: "rings",
      description: "Merch Round Tee",
      details: ["Merch Round Tee"],
      price: 50,
      printerQuote: 900,
      minRun: 25,
      showName: "Merch Round",
      venue: "The Northern, Byron Bay",
      showDate: now + 27 * DAY,
      createdAt: now - 19 * DAY,
      closesAt: now - 5 * DAY + 2 * HOUR,
      status: "awaiting_decision",
      reachedAt: now - 6 * DAY,
      chargeDeadline: now - 18 * HOUR,
      decisionDeadline: now + 30 * HOUR,
      shortfall: 45,
      printer: { name: "Northern Rivers Print" },
    }),
    base({
      id: "r-dial-off-the-hook",
      slug: "merch-round-tee-printing",
      artistId: "a-static",
      title: "Merch Round Tee",
      colorway: "black",
      motif: "rings",
      description: "Merch Round Tee",
      details: ["Merch Round Tee"],
      price: 45,
      printerQuote: 800,
      minRun: 30,
      showName: "Merch Round",
      venue: "The Triffid, Brisbane",
      showDate: now + 24 * DAY,
      createdAt: now - 32 * DAY,
      closesAt: now - 18 * DAY,
      status: "in_production",
      reachedAt: now - 20 * DAY,
      chargeDeadline: now - 15 * DAY,
      printer: {
        name: "Brisbane Print Lab",
        sentAt: now - 6 * DAY,
        invoiceAmount: 820,
        invoicePaidAt: now - 5 * DAY,
        expectedReadyAt: now + 9 * DAY,
      },
    }),
    base({
      id: "r-lowtide-rip-current",
      artistId: "a-lowtide",
      title: "Rip Current Hoodie",
      product: "hoodie",
      colorway: "bone",
      motif: "wave",
      description: "Bone hoodie with lilac rip-current print.",
      details: ["Heavyweight hood", "Two-colour print"],
      price: 90,
      printerQuote: 1500,
      minRun: 25,
      showName: "Low Tide Club · Coastline",
      venue: "Mojos Bar, Fremantle",
      showDate: now + 20 * DAY,
      createdAt: now - 17 * DAY,
      closesAt: now - 3 * DAY,
      status: "failed",
      printer: { name: "Freo Ink" },
    }),
    base({
      id: "r-velvet-heartline",
      slug: "circle-hoodie",
      artistId: "a-static",
      title: "Circle Hoodie",
      product: "hoodie",
      colorway: "black",
      motif: "rings",
      description: "Merch Round Hoodie",
      details: ["Merch Round Hoodie"],
      price: 70,
      printerQuote: 600,
      minRun: 25,
      showName: "Merch Round",
      venue: "The Lansdowne, Sydney",
      showDate: now + 33 * DAY,
      createdAt: now - 12 * DAY,
      closesAt: now + 1 * DAY + 7 * HOUR,
      printer: { name: "Marrickville Screenworks" },
    }),
  ];

  const pledges: Pledge[] = [];
  const add = (
    roundId: string,
    n: number,
    statusFor: (i: number) => PledgeStatus,
    extra: (i: number) => Partial<Pledge> = () => ({}),
  ) => {
    const r = rounds.find((x) => x.id === roundId)!;
    for (let i = 0; i < n; i++) {
      const name = fanName(i, roundId);
      const status = statusFor(i);
      const created = r.createdAt + ((r.closesAt - r.createdAt) * (i + 1)) / (n + 2);
      const delivery = r.delivery && hash(roundId + "d" + i) % 5 === 0;
      const p: Pledge = {
        id: `p-${roundId}-${i}`,
        code: makeCode(`${roundId}-${i}`),
        roundId,
        name,
        email: `${name.toLowerCase().replace(/[^a-z]+/g, ".")}@example.com`,
        size: sizeFor(i, r.sizes, roundId),
        fulfilment: delivery ? "delivery" : "pickup",
        address: delivery ? "12 Example St, Sydney NSW 2000" : undefined,
        amount: r.price + (delivery ? r.deliveryFee : 0),
        card: { brand: hash(name) % 3 === 0 ? "Mastercard" : "Visa", last4: String(1000 + (hash(name) % 9000)) },
        status,
        attempts: ["pledged", "withdrawn", "released"].includes(status) ? 0 : 1,
        createdAt: Math.min(created, now - HOUR),
        paidAt: ["paid", "fulfilled", "refunded"].includes(status) ? (r.closesAt + HOUR) : undefined,
        ...extra(i),
      };
      if (p.status === "card_update_required") p.declineReason = "Card expired";
      if (p.status === "retry_scheduled") p.declineReason = "Insufficient funds";
      if (p.status === "action_required") p.declineReason = "Bank needs you to confirm";
      if (p.status === "unpaid") p.declineReason = "Declined after 3 attempts";
      pledges.push(p);
    }
  };

  add("r-static-tour-tee", 17, () => "pledged");
  add("r-static-night-drive", 31, () => "paid");
  add("r-neon-gravel-rash", 37, (i) =>
    i < 31 ? "paid" : i < 34 ? "retry_scheduled" : i < 35 ? "action_required" : i < 36 ? "card_update_required" : "action_required",
  );
  add("r-neon-gravel-cap", 6, () => "pledged");
  add("r-salt-tidal-tee", 23, (i) => (i < 19 ? "paid" : "unpaid"));
  add("r-dial-off-the-hook", 35, () => "paid");
  add("r-lowtide-rip-current", 13, () => "released");
  add("r-velvet-heartline", 23, () => "pledged");

  const fan = (roundId: string, status: PledgeStatus, extra: Partial<Pledge> = {}) => {
    const r = rounds.find((x) => x.id === roundId)!;
    pledges.push({
      id: `p-sam-${roundId}`,
      code: makeCode(`sam-${roundId}`),
      roundId,
      name: DEMO_FAN.name,
      email: DEMO_FAN.email,
      size: r.sizes.includes("M") ? "M" : r.sizes[0],
      fulfilment: "pickup",
      amount: r.price,
      card: { brand: "Visa", last4: "4242" },
      status,
      attempts: ["pledged", "released"].includes(status) ? 0 : 1,
      createdAt: r.createdAt + 2 * DAY,
      paidAt: ["paid", "fulfilled"].includes(status) ? r.closesAt + HOUR : undefined,
      ...extra,
    });
  };
  fan("r-static-night-drive", "paid");
  fan("r-neon-gravel-rash", "action_required", { declineReason: "Bank needs you to confirm" });
  fan("r-dial-off-the-hook", "paid", {
    fulfilment: "delivery",
    address: "4/18 Crown St, Wollongong NSW 2500",
    amount: 55,
  });
  fan("r-lowtide-rip-current", "released");

  let eid = 0;
  const events: LogEvent[] = [];
  const ev = (at: number, actor: LogEvent["actor"], text: string, roundId?: string, tone?: LogEvent["tone"]) =>
    events.push({ id: `e-seed-${eid++}`, at, actor, text, roundId, tone });

  for (const r of rounds) {
    const artist = artists.find((a) => a.id === r.artistId)!;
    ev(r.createdAt, "artist", `${artist.name} created “${r.title}”`, r.id);
    if (r.status === "pending_review") {
      ev(r.createdAt + HOUR, "artist", "Submitted for review", r.id);
      continue;
    }
    ev(r.createdAt + 3 * HOUR, "admin", "Approved and published", r.id, "good");
    const n = pledges.filter((p) => p.roundId === r.id).length;
    if (r.reachedAt) ev(r.reachedAt, "system", `Reached target of ${r.target}`, r.id, "good");
    if (r.status === "live") {
      ev(now - 2 * HOUR, "system", `${n} fans have asked for one`, r.id);
      continue;
    }
    if (r.status === "failed") {
      ev(r.closesAt, "system", `Closed at ${n} of ${r.target}. Nobody charged, cards released.`, r.id, "bad");
      continue;
    }
    ev(r.closesAt, "system", `Closed at ${n} orders. Charging saved cards.`, r.id);
    ev(r.closesAt + HOUR, "stripe", "Off-session charges created", r.id, "money");
    if (r.status === "charging") {
      ev(r.closesAt + 2 * HOUR, "stripe", "6 charges need attention: 3 soft declines, 2 need 3-D Secure, 1 expired card", r.id, "warn");
      continue;
    }
    if (r.status === "awaiting_decision") {
      ev(r.chargeDeadline!, "system", "72-hour window ended: 19 paid, 4 unpaid. Short of target.", r.id, "warn");
      ev(r.chargeDeadline! + 60000, "system", "Asked artist to cover A$45 or cancel (48h)", r.id, "warn");
      continue;
    }
    ev(r.chargeDeadline!, "system", "Round confirmed", r.id, "good");
    if (r.printer.sentAt) ev(r.printer.sentAt, "admin", `Order sent to ${r.printer.name}`, r.id);
    if (r.printer.invoicePaidAt)
      ev(r.printer.invoicePaidAt, "admin", `Printer invoice paid by bank transfer`, r.id, "money");
    if (r.printer.deliveredAt) ev(r.printer.deliveredAt, "printer", `Merch delivered to ${artist.name}`, r.id, "good");
    if (r.payout) ev(r.payout.at, "stripe", `Transfer ${r.payout.transferId} to artist`, r.id, "money");
    if (r.status === "completed") ev(r.showDate, "artist", "All items handed over at the show", r.id, "good");
  }

  const emails: Email[] = [];
  let mid = 0;
  const mail = (at: number, to: string, audience: Email["audience"], subject: string, body: string, roundId?: string) =>
    emails.push({ id: `m-seed-${mid++}`, at, to, audience, subject, body, roundId, read: true });

  mail(now - 4 * DAY, DEMO_FAN.email, "fan", "Not this time. You weren't charged.",
    "Low Tide Club's Rip Current Hoodie closed at 14 of 25. Your card was released and nothing was charged.", "r-lowtide-rip-current");
  mail(now - 21 * HOUR, DEMO_FAN.email, "fan", "Your bank wants a quick yes (A$40)",
    "The Merch Round Tee hit its number. Your bank needs you to confirm the A$40 payment. You have until the charge window closes.", "r-neon-gravel-rash");
  mail(now - 1 * DAY, "merchround@demo.band", "artist", "Your hoodies have arrived",
    "Inkhouse Wollongong marked the Circle Hoodie order as delivered. Check them over and confirm to get paid.", "r-static-night-drive");
  mail(now - 2 * HOUR, "merchround@demo.band", "artist", "17 fans are in",
    "This Round Is On Us Tee is at 17 of 25 with 6 days to go. Share the link to get it over the line.", "r-static-tour-tee");
  mail(now - 1 * DAY + HOUR, ADMIN_EMAIL, "admin", "New round to review: Circle Cap",
    "Merch Round submitted Circle Cap (A$35, target 24). Check the printer quote and approve.", "r-static-sunburn-cap");
  for (const e of emails) if (e.at > now - 3 * HOUR) e.read = false;

  return {
    version: SEED_VERSION,
    artists,
    rounds,
    pledges,
    events: events.sort((a, b) => b.at - a.at),
    emails: emails.sort((a, b) => b.at - a.at),
    issues: [],
    session: { role: null, artistId: "a-static" },
  };
}
