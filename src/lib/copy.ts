/** Editable marketing + demo copy. Change here; screens read from this. */

export const SITE = {
  domain: "merchround.com",
  previewBar: "Preview · nothing here is real money",
  tagline: "Know before you print.",
};

export const HERO = {
  headline: "Know before you print.",
  sub: "Pre-sell your merch to fans. Print only once you've hit your number. Miss it, and nobody is charged.",
  tryCta: "Try a merch round",
  waitlistCta: "Join the waitlist",
};

export const HOW = {
  heading: "Don't gamble with your merchandise.",
  subheading: "Here's how a round works.",
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
      title: "Hit it, then print",
      body: "Hit the number and cards are charged, take it to print. Miss it, and no one loses a dollar.",
    },
  ] as const,
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
  heading: "See it in action",
  artistLabel: "For you, the artist",
  fanLabel: "For your fans",
};

export const ARTIST_SLIDES = [
  "Start your first round",
  "Set your number",
  "Share it and watch it fill",
  "Hit the number",
  "Get paid",
] as const;

export const FAN_SLIDES = [
  "See the round",
  "Save your card",
  "You're in",
  "It hit",
  "Pick up at the show",
  "If it misses",
] as const;

export const WAITLIST = {
  heading: "Join the waitlist",
  subheading: "Merch Round isn't open yet. Leave your details and we'll write when it is.",
  sentHeading: "You're on the list",
  sentBody: "We'll email you when Merch Round opens. No spam — just the invite.",
  privacy:
    "We'll only use your details to tell you when Merch Round opens. Read the privacy policy.",
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

export const FEE_RATE = 0.1;
