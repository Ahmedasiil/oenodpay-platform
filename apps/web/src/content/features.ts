/**
 * Every product page on the website is built from this list. Fees and limits here are the
 * planned launch values and must match the fee schedule in legal.ts before launch.
 */
export interface Feature {
  slug: string;
  group: "Move money" | "Spend & travel" | "Grow your money";
  name: string;
  tagline: string;
  intro: string;
  steps: { t: string; b: string }[];
  facts: { k: string; v: string }[];
  needs: string[];
  faq: { q: string; a: string }[];
  legal?: { label: string; href: string }[];
  status: "At launch" | "Coming after launch";
}

export const FEATURES: Feature[] = [
  {
    slug: "send-money-abroad", group: "Move money", status: "At launch",
    name: "Send money abroad", tagline: "Send money home, with the price shown before you pay.",
    intro: "Send money from Canada to family and friends in seven countries. Pick how they receive it: a bank account, a mobile wallet or cash pickup. You see the exchange rate, the fee and the arrival time before you confirm, and you can track every transfer until it arrives.",
    steps: [
      { t: "Choose the country and amount", b: "Enter how much you want to send in Canadian dollars. The amount they receive updates as you type." },
      { t: "Pick how they get it", b: "Bank deposit, mobile wallet or cash pickup, depending on the country. Each option shows its own fee and speed." },
      { t: "Add the recipient", b: "Their full legal name as it appears on their ID, plus the account or phone number for the payout method." },
      { t: "Confirm and track", b: "Approve with Face ID or your fingerprint. You and the recipient get updates until the money arrives." },
    ],
    facts: [
      { k: "Countries", v: "Philippines, India, Pakistan, Nigeria, Egypt, Mexico, United Kingdom" },
      { k: "Fees", v: "From $1.99 to $4.99 per transfer, depending on country and payout method" },
      { k: "Exchange rate", v: "Shown before you send and locked for 30 minutes after you confirm" },
      { k: "Limit per transfer", v: "$3,000 CAD while your account is new" },
      { k: "Arrival", v: "Within minutes for most wallets and cash pickup; same day for some banks" },
    ],
    needs: ["A verified oenodPay account (government photo ID and a selfie)", "The recipient's full legal name", "The recipient's bank account, wallet number or pickup details", "The reason for the transfer, which Canadian law requires us to ask"],
    faq: [
      { q: "Can I cancel a transfer?", a: "Yes, free of charge, until the payout partner has paid it out. After that it cannot be reversed." },
      { q: "Why do you ask why I'm sending money?", a: "Canadian anti-money-laundering rules require money services businesses to understand the purpose of international transfers." },
      { q: "What if the details are wrong?", a: "If the bank or wallet rejects the payment, the full amount, including the fee, goes back to your oenodPay balance." },
    ],
    legal: [{ label: "Fees and limits", href: "/pricing" }, { label: "Countries and requirements", href: "/send-money" }, { label: "Account terms", href: "/legal/account-agreement" }],
  },
  {
    slug: "wallet-transfers", group: "Move money", status: "At launch",
    name: "Pay friends and banks", tagline: "Free and instant between oenodPay users.",
    intro: "Send money to anyone with oenodPay using their @handle, phone number or email. It arrives instantly and it's free. You can also move money to any Canadian bank account by Interac e-Transfer or electronic funds transfer.",
    steps: [
      { t: "Find the person", b: "Search by @handle, phone number or email, or scan their oenodPay code." },
      { t: "Enter the amount and a note", b: "Add a note so you both remember what it was for." },
      { t: "Approve", b: "Confirm with Face ID or your fingerprint. The money arrives instantly." },
    ],
    facts: [
      { k: "oenodPay to oenodPay", v: "Free and instant" },
      { k: "To a Canadian bank", v: "Interac e-Transfer or EFT; free for your first 5 each month, then $1.00" },
      { k: "Add money", v: "Free by bank transfer, direct deposit or Interac e-Transfer" },
      { k: "Limit per transfer", v: "$3,000 CAD while your account is new" },
    ],
    needs: ["A verified oenodPay account to send", "The other person's @handle, phone number or email"],
    faq: [
      { q: "Can I request money?", a: "Yes. Send a request and the other person can pay it in one tap." },
      { q: "Can I get my pay deposited into oenodPay?", a: "Yes. Your account comes with a Canadian institution, transit and account number for direct deposit." },
    ],
    legal: [{ label: "Account terms", href: "/legal/account-agreement" }, { label: "Fees and limits", href: "/pricing" }],
  },
  {
    slug: "pay-bills", group: "Move money", status: "At launch",
    name: "Pay bills", tagline: "Every Canadian bill in one list.",
    intro: "Pay your hydro, phone, internet, insurance, credit card and property tax bills from oenodPay. Add a biller once, then pay it in seconds, schedule it, or turn on autopay so it's paid two days before it's due.",
    steps: [
      { t: "Add a biller", b: "Search thousands of Canadian billers and enter your account number from the bill." },
      { t: "Pay or schedule", b: "Pay now, pick a date, or turn on autopay." },
      { t: "Get reminders", b: "We remind you before each due date, and confirm when each bill is paid." },
    ],
    facts: [
      { k: "Fee", v: "Free" },
      { k: "Billers", v: "Utilities, telecom, insurance, credit cards, government and property tax" },
      { k: "Delivery", v: "Most billers receive payment in 1 to 3 business days, so pay before the due date" },
    ],
    needs: ["A verified oenodPay account", "Your account number with the biller, printed on your bill"],
    faq: [{ q: "What if a bill payment is late?", a: "Billers credit payments when they receive them. Pay at least 3 business days before the due date. Autopay does this for you." }],
    legal: [{ label: "Account terms", href: "/legal/account-agreement" }],
  },
  {
    slug: "debit-card", group: "Spend & travel", status: "At launch",
    name: "Visa debit card", tagline: "Spend your balance anywhere Visa is accepted.",
    intro: "Get a virtual card the moment your account is verified and add it to Apple Pay or Google Pay. A physical card follows by mail. You control it in the app: freeze it, block online or foreign payments, set spending limits, and see every purchase the second it happens.",
    steps: [
      { t: "Get your virtual card", b: "Ready instantly after verification. Add it to Apple Pay or Google Pay." },
      { t: "Order the physical card", b: "Delivered to your Canadian address in 7 to 10 business days." },
      { t: "Control it in the app", b: "Freeze, unfreeze, set limits and turn on or off online, contactless and ATM use." },
    ],
    facts: [
      { k: "Monthly fee", v: "None" },
      { k: "Foreign purchases", v: "Visa exchange rate plus 1.5%" },
      { k: "ATM withdrawals", v: "2 free per month in Canada, then $2.00; $3.00 outside Canada" },
      { k: "Replacement card", v: "First one free, then $10" },
      { k: "Rewards", v: "1% back in points on eligible purchases" },
    ],
    needs: ["A verified oenodPay account", "A Canadian mailing address for the physical card"],
    faq: [
      { q: "Is it a credit card?", a: "No. It spends money from your oenodPay balance, so you can't go into debt with it." },
      { q: "What if someone uses my card without permission?", a: "Freeze it in the app and tell us. Under the cardholder agreement you're not responsible for unauthorized transactions you report promptly." },
    ],
    legal: [{ label: "Cardholder agreement", href: "/legal/cardholder-agreement" }, { label: "Fees and limits", href: "/pricing" }],
  },
  {
    slug: "travel", group: "Spend & travel", status: "Coming after launch",
    name: "Flights & hotels", tagline: "Book trips in the app and pay with points.",
    intro: "Search flights and hotels from trusted travel partners, book in the app, and pay with your balance, your reward points or both. Your bookings and boarding passes live in one place.",
    steps: [
      { t: "Search", b: "Compare flights and hotels by price, time and stops." },
      { t: "Book", b: "Pay with your balance, points or both. Your booking is confirmed by the travel partner." },
      { t: "Travel", b: "Find your itinerary, check-in links and receipts in the app." },
    ],
    facts: [
      { k: "Booking fee", v: "None" },
      { k: "Points value", v: "100 points = $1 toward travel" },
      { k: "Changes and refunds", v: "Follow the airline or hotel's own fare rules, shown before you book" },
    ],
    needs: ["A verified oenodPay account", "Names exactly as on each traveller's passport"],
    faq: [{ q: "Who sells the travel?", a: "Bookings are sold by licensed travel partners. Their name and registration are shown at checkout." }],
    legal: [{ label: "Travel terms", href: "/legal/travel-terms" }],
  },
  {
    slug: "esim", group: "Spend & travel", status: "Coming after launch",
    name: "Travel eSIM", tagline: "Mobile data that works the moment you land.",
    intro: "Buy a data plan for 150+ destinations before you leave. Install it in a few taps and it turns on when you arrive. No physical SIM card and no roaming bill from your Canadian carrier.",
    steps: [
      { t: "Pick a destination and plan", b: "Plans by country or region, from 1 GB to unlimited." },
      { t: "Install", b: "Scan the code or install directly in the app before you travel." },
      { t: "Land and connect", b: "Turn on the eSIM line when you arrive. Top up anytime." },
    ],
    facts: [
      { k: "Price", v: "From $5" },
      { k: "Coverage", v: "150+ countries and regions" },
      { k: "Phones", v: "Works on unlocked phones that support eSIM" },
    ],
    needs: ["An unlocked phone that supports eSIM", "An oenodPay account"],
    faq: [{ q: "Can I keep my Canadian number?", a: "Yes. The eSIM adds a data line; your normal number stays on your phone for calls and texts." }],
    legal: [{ label: "eSIM terms", href: "/legal/esim-terms" }],
  },
  {
    slug: "rewards", group: "Spend & travel", status: "At launch",
    name: "Rewards", tagline: "Points on everyday spending.",
    intro: "Earn points when you use your card, pay bills and invite friends. Use them for travel, eSIM data or to lower a purchase.",
    steps: [
      { t: "Earn", b: "1% back in points on eligible card purchases, plus bonuses for bills and referrals." },
      { t: "Track", b: "See your points and what each one is worth in the app." },
      { t: "Redeem", b: "Use points for flights, hotels and eSIM, or as credit to your balance." },
    ],
    facts: [{ k: "Earn rate", v: "1 point per $1 on eligible card purchases" }, { k: "Value", v: "100 points = $1" }, { k: "Expiry", v: "Points expire after 24 months with no account activity" }],
    needs: ["An oenodPay account in good standing"],
    faq: [{ q: "What isn't eligible?", a: "Cash withdrawals, transfers, gambling, money orders and refunded purchases don't earn points." }],
    legal: [{ label: "Rewards terms", href: "/legal/rewards-terms" }],
  },
  {
    slug: "credit-score", group: "Grow your money", status: "Coming after launch",
    name: "Credit score", tagline: "Your score for free. Checking never lowers it.",
    intro: "See your Canadian credit score and report in the app, updated monthly. Get alerts when something changes, and clear tips on what will raise it.",
    steps: [
      { t: "Turn it on", b: "Agree to a soft check. It never affects your score." },
      { t: "See your score and report", b: "On the Canadian 300 to 900 scale, with each factor explained." },
      { t: "Improve it", b: "Follow tips, and use the credit builder to add on-time payments to your history." },
    ],
    facts: [{ k: "Price", v: "Free" }, { k: "Updates", v: "Monthly" }, { k: "Effect on your score", v: "None. It's a soft check." }],
    needs: ["A verified oenodPay account", "Your consent to a soft credit check"],
    faq: [{ q: "Which bureau do you use?", a: "We work with a Canadian credit bureau. Its name is shown when you turn on the feature." }],
    legal: [{ label: "Privacy policy", href: "/legal/privacy" }],
  },
  {
    slug: "invest", group: "Grow your money", status: "Coming after launch",
    name: "Stocks & ETFs", tagline: "Invest in Canadian and US companies from $1.",
    intro: "Buy and sell Canadian and US stocks and ETFs, including part shares, through a registered investment dealer partner. Track your portfolio next to the rest of your money.",
    steps: [
      { t: "Open an investing account", b: "Answer a few questions about your goals and experience, as dealer rules require." },
      { t: "Pick what to buy", b: "Search stocks and ETFs, see prices and key facts." },
      { t: "Buy any amount", b: "Start with $1 using part shares." },
    ],
    facts: [{ k: "Commission", v: "None on Canadian and US stocks and ETFs" }, { k: "Currency exchange", v: "1.5% on US trades" }, { k: "Accounts", v: "Personal, with TFSA and RRSP planned" }],
    needs: ["A verified oenodPay account", "Answers to the dealer's suitability questions"],
    faq: [{ q: "Is my investment protected?", a: "Accounts are held by our registered dealer partner and are eligible for CIPF protection within its limits. Investments can lose value." }],
    legal: [{ label: "Investing disclosures", href: "/legal/investing-disclosures" }],
  },
  {
    slug: "loans", group: "Grow your money", status: "Coming after launch",
    name: "Loans", tagline: "Credit builder, personal loans and pay later.",
    intro: "Borrow with clear costs. A credit builder helps you start a history, personal loans cover bigger needs, and pay-later splits a purchase into four payments. You always see the annual percentage rate and total cost of borrowing before you agree.",
    steps: [
      { t: "Check your rate", b: "A soft check that doesn't affect your score." },
      { t: "See the full cost", b: "APR, every payment and the total cost of borrowing, before you sign." },
      { t: "Repay your way", b: "Automatic payments, early repayment with no penalty." },
    ],
    facts: [{ k: "Credit builder", v: "From $10 a month, reported to credit bureaus" }, { k: "Personal loans", v: "$1,000 to $15,000, terms of 12 to 60 months" }, { k: "Early repayment", v: "Always free" }],
    needs: ["A verified oenodPay account", "Proof of income for personal loans"],
    faq: [{ q: "What's the highest rate you charge?", a: "Every loan stays under Canada's federal criminal interest rate limit, and your exact APR is shown before you accept." }],
    legal: [{ label: "Loan disclosures", href: "/legal/loan-disclosures" }],
  },
  {
    slug: "lend", group: "Grow your money", status: "Coming after launch",
    name: "oenodPay Lend", tagline: "Fund loans to members and earn interest.",
    intro: "Put spare money to work. Your amount is split across many small loans to checked oenodPay members, and you receive the interest they pay, minus a service fee. You choose the amount and the term.",
    steps: [
      { t: "Choose an amount and term", b: "From $25, for 6, 12 or 24 months." },
      { t: "We spread it out", b: "Your money is split across many loans so one missed payment has a small effect." },
      { t: "Get paid monthly", b: "Repayments and interest flow back to your balance every month." },
    ],
    facts: [{ k: "Target returns", v: "6.1% to 8.4% a year, depending on term (not guaranteed)" }, { k: "Minimum", v: "$25" }, { k: "Service fee", v: "1% a year of the amount outstanding" }],
    needs: ["A verified oenodPay account", "Meeting securities rules for eligible lenders in your province"],
    faq: [{ q: "Can I lose money?", a: "Yes. Borrowers can miss payments or default. Returns are not guaranteed and Lend is not covered by deposit insurance." }],
    legal: [{ label: "Lend risk disclosure", href: "/legal/lend-terms" }],
  },
];

export const featureBySlug = (slug: string) => FEATURES.find((f) => f.slug === slug);

export const FEATURE_ICON: Record<string, string> = {
  "send-money-abroad": "send", "wallet-transfers": "wallet", "pay-bills": "bill", "debit-card": "card", travel: "plane",
  esim: "sim", rewards: "gift", "credit-score": "gauge", invest: "chart", loans: "coins", lend: "handshake",
};
