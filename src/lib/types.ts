export type Role = "fan" | "artist" | "admin";

export type RoundStatus =
  | "draft"
  | "pending_review"
  | "live"
  | "charging"
  | "awaiting_decision"
  | "confirmed"
  | "in_production"
  | "delivered"
  | "paid_out"
  | "completed"
  | "failed"
  | "cancelled";

export type PledgeStatus =
  | "pledged"
  | "withdrawn"
  | "released"
  | "paid"
  | "retry_scheduled"
  | "action_required"
  | "card_update_required"
  | "unpaid"
  | "refunded"
  | "fulfilled";

export type ProductKind = "tee" | "hoodie" | "tote" | "cap";
export type Colorway = "black" | "bone" | "olive" | "navy";
export type PrintMotif = "rings" | "wave" | "diamond" | "sun" | "grid";

export interface Artist {
  id: string;
  name: string;
  slug: string;
  city: string;
  accent: string;
  bio: string;
  instagram: string;
  stripe: "verified" | "pending" | "not_started";
}

export interface PrinterJob {
  name: string;
  sentAt?: number;
  invoiceAmount?: number;
  invoicePaidAt?: number;
  expectedReadyAt?: number;
  deliveredAt?: number;
}

export interface Round {
  id: string;
  slug: string;
  artistId: string;
  title: string;
  product: ProductKind;
  colorway: Colorway;
  motif: PrintMotif;
  description: string;
  details: string[];
  price: number;
  target: number;
  printerQuote: number;
  minRun: number;
  leadWeeks: number;
  showName: string;
  venue: string;
  showDate: number;
  createdAt: number;
  closesAt: number;
  status: RoundStatus;
  sizes: string[];
  delivery: boolean;
  deliveryFee: number;
  reachedAt?: number;
  chargeDeadline?: number;
  decisionDeadline?: number;
  shortfall?: number;
  decision?: "cover" | "proceed" | "cancel" | "expired";
  printer: PrinterJob;
  qcConfirmedAt?: number;
  payout?: { amount: number; at: number; transferId: string };
  reviewNote?: string;
}

export interface Pledge {
  id: string;
  code: string;
  roundId: string;
  name: string;
  email: string;
  size: string;
  fulfilment: "pickup" | "delivery";
  address?: string;
  amount: number;
  card: { brand: "Visa" | "Mastercard" | "Amex"; last4: string };
  status: PledgeStatus;
  attempts: number;
  declineReason?: string;
  createdAt: number;
  paidAt?: number;
  refundedAt?: number;
  handedOverAt?: number;
  shippedAt?: number;
}

export type Actor = "fan" | "artist" | "admin" | "system" | "stripe" | "printer";

export interface LogEvent {
  id: string;
  at: number;
  actor: Actor;
  roundId?: string;
  pledgeId?: string;
  text: string;
  tone?: "neutral" | "good" | "warn" | "bad" | "money";
}

export interface Email {
  id: string;
  at: number;
  to: string;
  audience: Role;
  subject: string;
  body: string;
  roundId?: string;
  pledgeId?: string;
  read?: boolean;
}

export interface Issue {
  id: string;
  pledgeId: string;
  roundId: string;
  type: "faulty" | "not_received" | "wrong_size" | "other";
  text: string;
  status: "open" | "refunded" | "replaced" | "rejected";
  at: number;
  resolvedAt?: number;
}

export interface Session {
  role: Role | null;
  artistId: string;
}

export interface World {
  version: number;
  artists: Artist[];
  rounds: Round[];
  pledges: Pledge[];
  events: LogEvent[];
  emails: Email[];
  issues: Issue[];
  session: Session;
}
