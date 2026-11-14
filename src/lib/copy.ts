/**
 * Editable marketing + demo copy. Change here; screens read from this.
 * Source of truth: Figma "Master / Landing" (Desktop 1265 + Mobile 390).
 * Wording: say "buy", "asked for", "the number needed", "round".
 * Never "pledge", "sell", "threshold" or "crowdfunding".
 */

export const FEE_RATE = 0.1;

export const SITE = {
  domain: "merchround.com",
  previewBar: "Preview · nothing here is real money",
  tagline: "Know before you print.",
  contactEmail: "hello@merchround.com",
};

export const NAV = {
  how: "How it works",
  faq: "FAQ",
  cta: "Get early access",
};

export const HERO = {
  headline: "Know before you print.",
  sub: "Let fans buy merch before you print. Produce only what's been asked for.",
  sub2: "Miss your number, and nobody is charged.",
  earlyAccessCta: "Get early access",
  tryCta: "Try the demo",
  waitlistCta: "Get early access",
};

export const PROBLEM = {
  heading: "Our Industry Has A Problem",
  theyLabel: "They get it",
  weLabelLead: "So do",
  weLabelCircled: "we",
  bubbles: [
    "…a lot of people waited in line for hours. … Once we got in, the L, M & S […] Shirts were sold out.",
    "…they would have been better off adding the merch to the app, so people could see what was available and were able to pre purchase in advance … Then the correct amount of Merch could have been produced",
    "I think for all concerts the merch, at the very least, should be viewable online so people can at least make their purchase decision before getting to the head of the line … Even better if we could purchase online to pick up at the event.",
  ] as const,
  caption: "Some of many comments seen online about outdated merchandise handling.",
  ticket: {
    showDate: "24 Nov",
    item: "This Round Is On Us Tee",
    size: "Size M",
    code: "MR 4821",
    venue: "The Servo, Port Kembla",
    note: ["Show this at the merch desk.", "Scan your code and collect your tee."],
  },
};

export const VIDEO = {
  heading: "A new way of thinking.",
  body: "Less waste, smarter production, let the fans control what's next.",
  label: "Play the explainer video",
};

export const HOW = {
  heading: "How a Merch Round Works",
  steps: [
    {
      title: "Add your design",
      body: ["Upload your mock-up and a short description."],
    },
    {
      title: "Set your number",
      body: [
        "Choose how many items make it worth making.",
        "Add your production quote or costs and we show an example of what you take home.",
      ],
    },
    {
      title: "Share your round",
      body: ["Pick the length of the round, then share the link with fans and watch it grow."],
    },
    {
      title: "Then it gets made",
      body: ["A round goes ahead when it hits the number.", "Fans are only charged if it goes ahead."],
    },
  ],
};

export const LIVE = {
  heading: "Your round is live, you're moving forwards.",
  body: "Share your round, watch who's joined, and see what happens when it closes.",
};

export const SHOW_ROUND = {
  heading: "Show it",
  subheading: "A live example round",
  cta: "Start your own round",
  title: "This Round Is On Us Tee",
  price: "A$55",
  progress: 17,
  target: 25,
  timeLeft: "5 days 19 hours left",
};

export const ACTION = {
  heading: "See how Artists and Fans work together",
  sub: "Whether you're making the merch or buying it, here's what to expect.",
  artistTab: "I'm an Artist",
  fanTab: "I'm a Fan",
  artistLabel: "The artist",
  fanLabel: "The fan",
};

export const ARTIST_DEMO = [
  {
    name: "Set up a round",
    body: [
      "Add your design, choose the item, set the price and enter the number of purchases that makes production worthwhile.",
      "You see your production quote or costs and approve them before the round goes live.",
    ],
  },
  {
    name: "Check what you take home",
    body: [
      "Before anything goes live you see what fans pay, the Merch Round fee and your production cost.",
      "Pick how long the round runs, then approve it.",
    ],
  },
  {
    name: "Share your round",
    body: [
      "Copy your link and post it wherever your fans are.",
      "Watch who's joined, what sizes they asked for, and how close you are to the number.",
    ],
  },
  {
    name: "It hits the number",
    body: [
      "When the round reaches the number needed before it closes, it goes ahead and fans are charged.",
      "Miss it, and nobody is charged.",
    ],
  },
  {
    name: "Get it made",
    body: [
      "Your printer, DIY or a production partner makes the merch.",
      "Fans collect at the show with a pickup code or get it sent, and your share is paid out.",
    ],
  },
] as const;

export const FAN_DEMO = [
  {
    name: "Find the merch",
    body: [
      "A fan opens the artist's link and sees the item, price, sizes and how the round is going. They pick a size and how they'd like to get it: collect at the show or have it sent, where the artist offers that.",
    ],
  },
  {
    name: "Join as a guest",
    body: [
      "No account needed. Add a name, email and card details.",
      "Nothing is charged today. You're only charged if the round goes ahead.",
    ],
  },
  {
    name: "You're in",
    body: [
      "You get a confirmation email and a link to follow the round.",
      "Share it with friends to help it reach the number.",
    ],
  },
  {
    name: "It goes ahead",
    body: [
      "The round hits its number, your card is charged and the merch goes into production.",
      "We'll keep you posted on when it's ready.",
    ],
  },
  {
    name: "Collect your merch",
    body: [
      "Show your pickup code at the merch desk and collect your tee.",
      "If you chose delivery, it's sent to you instead.",
    ],
  },
  {
    name: "If it falls short",
    body: [
      "If the round doesn't reach its number and the artist doesn't cover the gap, it's cancelled.",
      "Nothing is made and nobody is charged.",
    ],
  },
] as const;

export const WHO = {
  heading: "We all play our part.",
  sub: ["Merch Round runs the round. You decide how it gets made.", "The Fans decide before you print."],
  cards: [
    {
      label: "Artist",
      title: "Sets up the round",
      body: "Creates the round. Sets the item, the price and the number needed, chooses how it gets made, and shares the link. Responsible for getting successful orders to fans.",
    },
    {
      label: "Fan",
      title: "Buys as a guest",
      body: "No account. Picks a size and how to get it. Only pays if the round goes ahead.",
    },
    {
      label: "Your printer",
      title: "Makes it",
      body: "Makes the merch once the round goes ahead. Your own printer, DIY, or a production partner takes it from here.",
    },
    {
      label: "Merch Round",
      title: "Runs the round",
      body: "We run the platform, the fan purchase and the updates, and where we're involved, coordinate the production and payment steps. We don't print or hold stock.",
    },
  ],
};

export const COSTS = {
  heading: "What it costs.",
  sub: "How Merch Round keeps going.",
  items: [
    {
      label: "Our fee",
      value: "About 10%",
      body: [
        "of what fans pay.",
        "That's how Merch Round can keep supporting the industry and sustainable practice.",
      ],
    },
    {
      label: "Card fees",
      value: "On us",
      body: [
        "We cover the card fees out of our share.",
        "They don't come out of the Artist share or have fans charged unnecessarily.",
      ],
    },
    {
      label: "If a round doesn't go ahead",
      value: "A$0",
      body: ["charged to fans. Nothing is made.", "Eliminating risk and landfill all at once."],
    },
  ],
};

export const FAQ = {
  heading: "Common questions.",
  sub: "The short answers.",
  items: [
    {
      q: "What if a round doesn't reach its number?",
      a: "Fans are only charged if the round goes ahead. If it falls short, the artist can choose to cover the additional production cost and go ahead. If they decline or don't pay within 48 hours, the round is cancelled.",
    },
    {
      q: "Can an Artist still go ahead if a round falls short?",
      a: "Yes. The artist can choose to cover the additional production cost and go ahead. They have 48 hours to decide, otherwise the round is cancelled.",
    },
    {
      q: "When does a fan pay?",
      a: "Only if the round goes ahead. Joining a round doesn't charge your card. You're charged when the round hits its number, or when the artist chooses to cover the gap and go ahead.",
    },
    {
      q: "What happens if a round is cancelled?",
      a: "Nothing is made and nobody is charged. Everyone who joined gets an email letting them know the round didn't go ahead.",
    },
    {
      q: "Do artists have to use a Merch Round printer?",
      a: "No. Use your own printer, make it yourself, or work with a production partner. You add your production quote or costs when you set up the round.",
    },
    {
      q: "Can fans collect merchandise at a show?",
      a: "Yes, where the artist offers it. Each fan gets a pickup code to show at the merch desk.",
    },
    {
      q: "Can merchandise be delivered?",
      a: "Yes, where the artist offers it. Fans choose to collect at the show or have it sent when they join the round.",
    },
    {
      q: "What does it cost an Artist?",
      a: "Nothing to set up a round. Merch Round's fee is about 10% of what fans pay, and we cover the card fees out of our share. If a round doesn't go ahead, nobody pays anything.",
    },
    {
      q: "What about sizes?",
      a: "The artist chooses which sizes to offer. Fans pick a size when they join, and the artist sees the sizes asked for before anything is made.",
    },
    {
      q: "What about returns and refunds?",
      a: "Decision pending.",
      pendingLegal: true,
    },
  ] as { q: string; a: string; pendingLegal?: boolean }[],
};

export const WAITLIST = {
  heading: "Sound like a good fit?",
  subheading: [
    "We're opening Merch Round to a small group of Artists first.",
    "Leave your details and we'll be in touch when it's ready.",
  ],
  sentHeading: "You're on the list",
  sentBody: "We'll be in touch when Merch Round is ready. No spam, just the invite.",
  privacy: ["We'll only use your details to contact you about Merch Round.", "Read our privacy policy."],
  submit: "Get Early Access",
  roles: [
    { value: "artist", label: "I am an artist" },
    { value: "fan", label: "I am a fan" },
    { value: "other", label: "Other" },
  ] as const,
};

export const FAILED_ROUND_EMAIL =
  "You showed up, and we're grateful. We didn't reach our number this time, so nothing was made and you haven't been charged. We'd still love to see you at the show, to say thanks in person and hear your story.";

export const DEMO_END = {
  heading: "That was a preview",
  body: "Merch Round isn't open yet. Tell us if you'd use it, then join the waitlist.",
  question: "Would you use this for your next merch run?",
  blockerLabel: "What would stop you? (optional)",
};

export const CARD_NOTE =
  "Your card details go straight to Stripe, the payment company. We never see or store your full card number. Nothing is charged today. You're only charged if the round goes ahead.";
