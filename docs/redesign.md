# Merch Round — Site Redesign

Status: draft v1 · Oct 2026
Companion to `technical-plan.md`. Covers brand direction, design system, and every screen.

---

## 1. What the demo gets right and what to change

**Keep**
- The voice. "Know before you print." "Reach it and it gets made. Miss it and nobody pays." Short, confident, band-friendly.
- Gig-poster energy: heavy condensed type, black, one loud accent.
- The number as the hero. Everything revolves around "17 of 25".

**Change**
- **It is a walkthrough, not a product.** Real fans arrive from an Instagram link straight onto a round page. That page has to explain itself in one screen on a phone.
- **The product is below the fold.** On mobile the giant headline pushes the tee and the price off screen. On a round page the order is: product, price, progress, buy.
- **Platform vs artist.** Every page looks like "Merch Round". Fans care about the band. Round pages should be artist-branded with Merch Round as a quiet trust layer.
- **When will I be charged?** The demo says "only if it reaches its number", but never says the date. Show the exact charge date everywhere money is mentioned.
- **Inconsistent details**: tee named "iAccelerate Founder Tee" on a "Static Hours" round; "always two weeks" vs a calculated close date. One source of truth per fact.
- **Lime on white fails contrast.** Lime works as a fill behind black text or on black, never as text on light backgrounds.
- **Gimmicks.** The flip-the-tee button is fun but hides the back print. Replace with a simple front/back toggle and swipeable gallery.

---

## 2. Brand direction: "Tour Poster"

Merch Round should feel like the stuff around a gig: screen-printed posters, ticket stubs, setlists taped to the floor, the merch desk. Physical, a bit rough, very clear.

Three ideas carry the whole system:

1. **The Ticket.** Every pledge is a ticket stub (perforated edge, code, QR). Fans keep it, the desk scans it.
2. **The Tally.** Progress is shown as blocks, one per fan, filling up. With targets of 25–150 this is readable and feels like a crowd forming. Over 150, it collapses to a bar.
3. **The Stamp.** Status changes are rubber stamps: `PLEDGED`, `IT'S HAPPENING`, `PRINTING`, `READY AT THE SHOW`, `NOT THIS TIME`.

---

## 3. Design tokens

### 3.1 Colour

Platform palette (marketing site, dashboards, emails):

| Token | Hex | Use |
|---|---|---|
| `ink` | `#0B0B0C` | Main text on light, main background on dark |
| `paper` | `#F3F0E8` | Main light background (warm, poster-paper) |
| `bone` | `#E6E1D5` | Cards and dividers on paper |
| `smoke` | `#1C1C1F` | Cards on ink |
| `ash` | `#6B6A66` | Secondary text (passes AA on paper) |
| `signal` | `#C8F031` | Brand accent. Fills, highlights, focus rings. Text on it is always `ink` |
| `go` | `#1F9D55` | Paid, success |
| `hold` | `#E8A317` | Action needed, pending |
| `stop` | `#D7372F` | Failed, declined, cancelled |

**Artist accent.** Each artist picks one accent colour. The round page uses it in place of `signal` for the tally, buy button, and stamps. The picker only allows colours with at least 4.5:1 contrast against either `ink` or `paper`, and auto-chooses the text colour on top.

Dark mode: round pages default to dark (ink background) because that's the gig look and it photographs well in screenshots shared to Instagram. Dashboards default to light. The show-night desk is always dark (dim venue, saves battery).

### 3.2 Type (all free on Google Fonts, loaded with `next/font`)

| Role | Font | Notes |
|---|---|---|
| Display | **Anton** | Headlines, the big number, stamps. Uppercase only. Never below 28px |
| Body/UI | **Inter Tight** | Everything else. 16px minimum on mobile |
| Data | **JetBrains Mono** | Ticket codes, money in breakdowns, countdowns. Tabular numbers |

Scale (mobile → desktop): Display XL 56→112 · Display L 40→72 · H2 28→40 · H3 20→24 · Body 16→18 · Small 14 · Micro 12 (labels, uppercase, +6% tracking).

### 3.3 Shape, space, motion

- Spacing on a 4px grid; page gutters 20px mobile, 40px desktop; max content width 1200px, round page 560px column on desktop next to the gallery.
- Corners: 0 for posters, tickets, stamps; 10px for inputs and buttons (touch-friendly, not soft).
- Borders 2px ink. Shadows: a hard offset `4px 4px 0 ink` on primary cards (poster pasted on a wall), no blur.
- Motion: tally blocks fill in one by one (40ms stagger), stamps land with a quick scale 1.15 → 1 and slight rotation. Respect `prefers-reduced-motion`.

### 3.4 Accessibility

WCAG 2.2 AA. 44px minimum touch targets (56px on the desk). Visible focus ring (3px `signal` outline + 2px ink offset). Never colour alone for status: every status has a word and an icon. All money and dates readable by screen readers in full ("Charged on 3 November 2026").

---

## 4. Core components

| Component | Description |
|---|---|
| **Tally** | Grid of blocks, filled = paid or pledged. Label "17 of 25 fans". Under it: "8 more and it gets made". Variant for dashboard shows pledged (outline) vs paid (filled) during charging |
| **Countdown** | `6 DAYS 04 HRS` in mono. Turns `hold` in last 24h. After close: "Closed 3 Nov" |
| **Charge note** | One line, always next to the price or buy button: "You're only charged on 3 Nov if this hits 25. Otherwise nothing." |
| **Size picker** | Large square buttons in a row, sold-out style for disabled, links to a size chart sheet |
| **Ticket** | Perforated card: band, item, size, fan name, code `MR-7K3Q`, QR, status stamp. Saves as image / Apple Wallet later |
| **Status timeline** | Vertical steps: Pledged → Round hits → Charged → Printing → Ready at show → Collected. Current step stamped |
| **Receipt** | Money breakdown in mono, dotted leaders: `Fans paid ........ A$1,125.00`. Used for artist take-home and fan receipts |
| **Stamp** | Rotated uppercase Anton label with rough border (SVG mask) |
| **Banner** | Full-width strip for system messages ("Finish Stripe setup to publish"). Colour by severity |
| **Empty state** | Poster-style illustration area with one line and one action |

---

## 5. Screens

### 5.1 Landing page (for artists)

Goal: an artist understands the model and the money in 20 seconds and signs up.

```
┌──────────────────────────────────────────┐
│ MERCH ROUND                 Log in  [Start a round] │
├──────────────────────────────────────────┤
│ KNOW BEFORE                              │
│ YOU PRINT.                [poster-style  │
│ Set the number. Fans pledge.  tee + tally│
│ Hit it and it's made.         mock-up]   │
│ Miss it and nobody pays.                 │
│ [Start a round]  How it works ↓          │
├──────────────────────────────────────────┤
│ 01 SET YOUR NUMBER  02 FANS PLEDGE        │
│ 03 WE CHARGE + PAY THE PRINTER            │
│ 04 HAND IT OVER AT THE SHOW               │
├──────────────────────────────────────────┤
│ WHAT YOU TAKE HOME   (live calculator)    │
│ Price [45]  Printer quote [650]  Min [25] │
│ Receipt: Fans paid / Our 10% / Printer /  │
│          YOU GET  A$362.50                │
├──────────────────────────────────────────┤
│ No stock left over · No chasing payments  │
│ · Card fees on us                          │
├──────────────────────────────────────────┤
│ FAQ (What if we miss? Who pays printer?…) │
│ Footer                                   │
└──────────────────────────────────────────┘
```

### 5.2 Round page (fan, mobile first) — the most important screen

Everything above the fold on a 390×844 phone: band, product image, price, tally, countdown, buy button.

```
┌──────────────────────────┐
│ THE STATIC HOURS     ⓘ  │  artist name, accent colour bar
├──────────────────────────┤
│ [ product photo  ◀ ▶ ]   │  swipe front/back
│  • ○                      │
├──────────────────────────┤
│ LIVE / 2026 TOUR TEE     │  Display L
│ A$45  · No extra fees    │
│ ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇□□□□□□□□ │  Tally
│ 17 of 25 fans · 8 to go  │
│ 6 DAYS 04 HRS left       │
│ [   PLEDGE FOR A$45   ]  │  sticky on scroll
│ Charged 3 Nov only if it │
│ hits 25. Otherwise free. │
├──────────────────────────┤
│ Size  [S][M][L][XL] chart│
│ Pickup at The Servo,     │
│ Wollongong · 17 Nov      │
├──────────────────────────┤
│ HOW THIS WORKS (4 steps) │
│ Details · Print · Fabric │
│ Secured by Stripe · Terms│
└──────────────────────────┘
```

States: **live** (above) · **reached** (tally full, stamp `IT'S HAPPENING`, still open until close) · **closed / charging** (no buy button, "Closed. Charging pledges now") · **confirmed** (stamp `BEING MADE`) · **failed** (stamp `NOT THIS TIME`, "Nobody was charged") · **cancelled**.

Desktop: two columns, gallery left (sticky), info column right.

### 5.3 Pledge (checkout)

Single page, three short sections, no account.

```
← Back to round
YOUR PLEDGE   Live / 2026 Tour Tee · M · A$45   [change]

01 YOUR DETAILS     Name · Email · (Phone, optional)
02 HOW TO GET IT    (•) Pick up at the show — free
                    ( ) Post it to me — +A$10  → address fields
03 CARD             [ Stripe Payment Element ]
                    Apple Pay / Google Pay buttons

┌ Receipt ─────────────────────────┐
│ Tee (M) ...................... A$45 │
│ Charged on ............... 3 Nov 2026 │
│ Only if ............. 25 fans pledge  │
└──────────────────────────────────┘
[ SAVE CARD & PLEDGE ]
By pledging you authorise… (agreement text from tech plan 6.3)
```

### 5.4 Pledge confirmed / fan order page (`/o/[token]`)

```
[STAMP: PLEDGED]
YOU'RE IN, SAM.
Nothing charged yet.

[ Ticket: band · tee · M · MR-7K3Q · QR (greyed until confirmed) ]

Status timeline
  ● Pledged            10 Oct
  ○ Round hits 25      closes 3 Nov
  ○ Charged A$45
  ○ Printing
  ○ Ready at The Servo 17 Nov
  ○ Collected

Share: "Help it hit 25" [Copy link] [Instagram story image]
Change card · Cancel pledge (until 3 Nov) · Report a problem
```

The **share card** (auto-generated 1080×1920 image with the tally) is a growth feature: fans push rounds over the line.

### 5.5 Finish payment (`/pay/[token]`)

Calm, one job. `hold` colour banner: "Your bank needs you to confirm the A$45 payment for The Static Hours tee. You have until 6 Nov, 6pm." Payment Element, one button. Success → stamp `PAID`.

### 5.6 Artist dashboard

Light theme. Top banner if Stripe setup is incomplete.

```
YOUR ROUNDS                       [+ New round]
┌──────────────────────────────────────────────┐
│ LIVE / 2026 TOUR TEE        [LIVE]            │
│ ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇□□□□□□□□  17/25  6 days left │
│ Projected take-home A$362.50   [Open]          │
└──────────────────────────────────────────────┘
Past rounds (compact list with final stamp)
```

### 5.7 Create round wizard

Four steps with a live preview of the round page on the right (desktop) or a "Preview" tab (mobile).

1. **The merch** — name, description, photos (front/back), sizes.
2. **The numbers** — price, printer (pick or "new printer"), quote, minimum run, lead time. Live calculator shows suggested target and the receipt. Artist can raise the target.
3. **The show** — show name, venue, date, pickup and/or delivery. Close date auto-suggested ("Latest safe close: 20 Oct"); picker blocks unsafe dates.
4. **Review** — round page preview, receipt, terms checkbox, Submit for review.

### 5.8 Round detail (artist)

Tabs: **Overview** (tally, countdown, size breakdown bars, timeline of round states) · **Fans** (name, size, pickup/delivery, status; export CSV) · **Money** (receipt, updated live: pledged, paid, fee, printer, refunds, your share) · **Production** (printer order status, invoice, expected ready date, "Confirm delivery & quality" button).

**Decision screen** (when short after charging) is a full-page takeover:
```
YOU'RE 3 SHORT.
22 of 25 paid. To print anyway you need to cover A$54.50.
[ COVER A$54.50 AND PRINT ]     [ CANCEL AND REFUND FANS ]
Decide by Thu 6 Nov, 6:00pm. If you don't, the round is cancelled.
```

### 5.9 Show-night desk

Always dark, huge targets, works one-handed, tolerates bad venue Wi-Fi (caches the fan list on open; queues "handed over" taps and syncs when back online).

```
AT THE MERCH DESK          38 / 52 collected
[ 🔍 Search name                ] [ SCAN ]
┌──────────────────────────────────┐
│ SAM TAYLOR          M  · MR-7K3Q │
│                 [ HANDED OVER ]  │
├──────────────────────────────────┤
│ ALEX MORGAN         L  · MR-2PX9 │
│                 [ HANDED OVER ]  │
└──────────────────────────────────┘
Size counts left: S 2 · M 5 · L 4 · XL 3
```

Scan opens the camera; a valid code jumps to that fan with a green flash and haptic tick; a wrong-round code shows a red "Not for this round".

### 5.10 Admin

Plain, dense, light. A single **queue** page grouped by what needs doing (review rounds, send printer orders, pay invoices, payouts ready, issues, disputes), each row with the one action needed. Round detail shows the audit log.

### 5.11 Emails

Same tokens: paper background, ink text, Anton headline, one accent button, the ticket or receipt block. Plain-text version for each. Subject lines in the product voice:
- "You're in. Nothing charged yet."
- "It's happening: The Static Hours tee hit 25"
- "Your bank wants a quick yes (A$45)"
- "Not this time. You weren't charged."
- "Show tonight: bring this ticket"

---

## 6. Content rules

- Say dates, not durations: "charged on 3 Nov", not "charged when the round ends".
- Use "fans" and "pledge" before charging; "order" after charging.
- Money always with currency: `A$45`.
- Never say "pre-order" alone; always pair with the condition ("only if it hits 25").
- One idea per sentence. No exclamation marks except in stamps.

---

## 7. Deliverables for Phase 0

1. `tokens.css` (CSS variables) + Tailwind theme mapping.
2. shadcn/ui components restyled to tokens (Button, Input, Radio, Dialog, Sheet, Tabs, Toast).
3. Custom components: Tally, Countdown, Ticket, Stamp, Receipt, StatusTimeline, ChargeNote.
4. A `/styleguide` page (dev-only) rendering every component in light and dark with an artist accent switcher.
5. High-fidelity mock-ups of the round page (mobile + desktop) and the desk before building the rest.
