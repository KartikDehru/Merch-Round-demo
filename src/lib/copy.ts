/** Editable marketing + demo copy. Change here; screens read from this. */

export const FEE_RATE = 0.1;

export const SITE = {
  domain: "merchround.com",
  previewBar: "Preview · nothing here is real money",
  tagline: "Know before you print.",
};

export const HERO = {
  headline: "Know before you print.",
  sub: "Let fans buy merch before you print. Produce only what's been asked for. Miss your number, and nobody is charged.",
  earlyAccessCta: "Get early access",
  tryCta: "Try the demo",
  waitlistCta: "Get early access",
};

export const PROBLEM = {
  heading: "Our industry has a problem",
  theyLabel: "They get it",
  weLabel: "So do we",
  bubbles: [
    "I've been waiting in this merch line for twenty minutes and they just ran out of my size.",
    "Sold out of the good sizes again. Always the same story.",
    "I'd buy it if I knew it was actually going to get made.",
  ] as const,
  ticket: {
    showDate: "24 Nov",
    item: "This Round Is On Us Tee",
    size: "Size M",
    code: "MR 4821",
  },
};

export const VIDEO = {
  heading: "A new way of thinking.",
  body: "Less waste, smarter production — let the fans decide what's next.",
  placeholder: "Explainer video coming soon",
};

export const HOW = {
  heading: "How a Merch Round works",
  subheading: "Four steps from design to the desk.",
  steps: [
    {
      title: "Add your design",
      body: "Upload your mock-up and a short description.",
    },
    {
      title: "Set your number",
      body: "Add your printer's quote and how many shirts make it worth printing. We show what you take home.",
    },
    {
      title: "Share your round",
      body: "Pick the length of the round, then share the link and watch it grow.",
    },
    {
      title: "Then it gets made",
      body: "Hit the number and cards are charged. Miss it, and no one loses a dollar.",
    },
  ] as const,
};

export const LIVE = {
  heading: "Your round is live, you're moving forwards.",
  body: "Share it with fans, watch the count climb, and see orders roll in before anything goes to print.",
};

export const SHOW_ROUND = {
  heading: "Show it",
  subheading: "A live example round",
  cta: "Start your own round",
  title: "This Round Is On Us Tee",
  price: "A$45",
  progress: 17,
  target: 25,
  timeLeft: "4 days left",
};

export const ACTION = {
  heading: "See how artists and fans work together",
  artistTab: "I'm an Artist",
  fanTab: "I'm a Fan",
  artistLabel: "The artist",
  fanLabel: "The fan",
};

export const ARTIST_DEMO = [
  {
    name: "Set up a round",
    body: "Add your design, choose the item, set the price and enter the number of customers that makes production worthwhile.",
  },
  {
    name: "Share and watch it fill",
    body: "Copy the link, post it to your fans, and watch pledges come in. Nothing is charged until you hit the number.",
  },
  {
    name: "Hit it, then print",
    body: "When the round hits, cards are charged and you take the order to print. Miss it, and nobody pays a dollar.",
  },
] as const;

export const FAN_DEMO = [
  {
    name: "See the round",
    body: "Open the link, pick your size, and see how close the round is to its number.",
  },
  {
    name: "Save your card",
    body: "Your card is authorised, not charged. You can cancel before the round closes.",
  },
  {
    name: "Pick up if it hits",
    body: "If the round hits, you're charged and get a pickup code for the show. If it misses, nothing happens.",
  },
] as const;

/** @deprecated Prefer ARTIST_DEMO / FAN_DEMO for the new landing demo */
export const ARTIST_SLIDES = [
  "Start your first round",
  "Set your number",
  "Share it and watch it fill",
  "Hit the number",
  "Get paid",
] as const;

/** @deprecated Prefer ARTIST_DEMO / FAN_DEMO for the new landing demo */
export const FAN_SLIDES = [
  "See the round",
  "Save your card",
  "You're in",
  "It hit",
  "Pick up at the show",
  "If it misses",
] as const;

export const FAQ = {
  heading: "FAQ",
  items: [
    {
      q: "What is a Merch Round?",
      a: "A Merch Round is a short pre-order window. Fans save a card for a design. If enough people join, cards are charged and you print. If not, nobody is charged and nothing is printed.",
    },
    {
      q: "When do fans get charged?",
      a: "Only if the round hits its number before it closes. Until then the card is saved, not charged. Fans can cancel before the close.",
    },
    {
      q: "What if we miss the number?",
      a: "Nothing is printed and nobody is charged. Fans get a short note saying thanks — no invoice, no leftover stock.",
    },
    {
      q: "How do I set my take-home?",
      a: "You enter price, fans needed, and your printer quote. Merch Round takes 10%. We show what you take home before you launch.",
    },
    {
      q: "How do fans pick up?",
      a: "When a round hits, each fan gets a pickup code (and QR) to show at the merch desk. Each order has its own code.",
    },
    {
      q: "Is this live yet?",
      a: "Not yet — we're inviting people from the waitlist. Join early access and we'll write when your spot opens.",
    },
    {
      q: "Who holds the money?",
      a: "Legal wording for payments and custody is being finalised with the team. We'll publish it here before launch.",
      pendingLegal: true,
    },
    {
      q: "What are the artist terms?",
      a: "Artist agreement copy is being finalised. We'll publish clear terms before anyone can launch a live round.",
      pendingLegal: true,
    },
    {
      q: "What about refunds and cancellations?",
      a: "Refund and cancellation rules are part of the legal pack still in review. Product intent: cancel free before close; after a hit, contact support with your pickup code.",
      pendingLegal: true,
    },
    {
      q: "Where is my data stored?",
      a: "We use your waitlist details only to invite you when Merch Round opens. Full privacy wording is on the privacy page; payment cards go to Stripe — we never store full card numbers.",
    },
  ] as const,
};

export const WAITLIST = {
  heading: "Get early access",
  subheading: "Merch Round isn't open yet. Leave your details and we'll write when it is.",
  sentHeading: "You're on the list",
  sentBody: "We'll email you when Merch Round opens. No spam — just the invite.",
  privacy: "We'll only use your details to tell you when Merch Round opens. Read the privacy policy.",
  submit: "Join the waitlist",
  roles: [
    { value: "artist", label: "I am an artist" },
    { value: "fan", label: "I am a fan" },
    { value: "other", label: "Other" },
  ] as const,
};

export const FAILED_ROUND_EMAIL =
  "You showed up, and we're grateful. We didn't reach our number this time, so nothing was printed and you haven't been charged. We'd still love to see you at the show, to say thanks in person and hear your story.";

export const DEMO_END = {
  heading: "That was a preview",
  body: "Merch Round isn't open yet. Tell us if you'd use it, then join the waitlist.",
  question: "Would you use this for your next merch run?",
  blockerLabel: "What would stop you? (optional)",
};

export const CARD_NOTE =
  "Your card details go straight to Stripe, the payment company. We never see or store your full card number. Nothing is charged today, and you can cancel before the round closes.";
