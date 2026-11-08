/** Help centre articles, grouped by topic. */
export interface HelpTopic { slug: string; title: string; blurb: string; articles: { q: string; a: string[] }[] }

export const HELP: HelpTopic[] = [
  {
    slug: "getting-started", title: "Getting started", blurb: "Opening an account and who can join.",
    articles: [
      { q: "Who can open an oenodPay account?", a: ["Anyone who lives in Canada, is 18 or older (19 in some provinces) and has a valid government photo ID. Quebec residents can join once our Quebec licence is in place."] },
      { q: "How long does it take?", a: ["About five minutes: enter your details, take a photo of your ID and a selfie, and create a passkey to sign in."] },
      { q: "Does it cost anything?", a: ["No. The account is free with no monthly fee. Some services, like international transfers, have a fee that's always shown before you pay."] },
      { q: "Can I use oenodPay on the web?", a: ["Yes. Sign in at oenodpay.com with the same account you use on iPhone or Android."] },
    ],
  },
  {
    slug: "verification", title: "Identity verification", blurb: "Which ID we accept and why we ask.",
    articles: [
      { q: "Why do you need my ID?", a: ["Canadian law requires money services businesses to verify every customer's identity before they can move money. It also protects you from someone opening an account in your name."] },
      { q: "Which ID can I use?", a: ["A valid, unexpired government photo ID: Canadian passport, driver's licence, provincial photo ID card, permanent resident card, or a foreign passport together with proof of your Canadian address."] },
      { q: "My verification failed. What now?", a: ["Make sure the photo is sharp, all four corners are visible and there's no glare, then try again. If it still fails, contact us and we'll review it by hand."] },
      { q: "Will you ask for more information later?", a: ["Sometimes. For larger or unusual payments we may ask about the source of funds or the purpose of a transfer, as the law requires."] },
    ],
  },
  {
    slug: "sending-money", title: "Sending money", blurb: "Transfers in Canada and abroad.",
    articles: [
      { q: "How long does an international transfer take?", a: ["Most mobile wallet and cash pickup transfers arrive within minutes. Some bank deposits take until the end of the same day. The expected time is shown before you send."] },
      { q: "How do I track a transfer?", a: ["Open the transfer in your activity. You'll see each step, and we notify you when it's paid out."] },
      { q: "Can I cancel?", a: ["Yes, for free, until it's paid out. Open the transfer and tap Cancel."] },
      { q: "What are the limits?", a: ["Up to $3,000 per transfer while your account is new. Limits grow with your account history. See the fees and limits page."] },
    ],
  },
  {
    slug: "card", title: "Card", blurb: "Your Visa debit card, PIN and payments.",
    articles: [
      { q: "My card is lost or stolen.", a: ["Freeze it right away in the app under Card. If you don't find it, report it lost and we'll cancel it and send a new one."] },
      { q: "A payment was declined.", a: ["Check that the card isn't frozen, that you have enough balance, and that the type of payment (online, contactless, ATM, foreign) is turned on in your card settings."] },
      { q: "How do I dispute a charge?", a: ["Open the purchase in your activity and tap Report a problem within 60 days. We'll guide you through it."] },
    ],
  },
  {
    slug: "security", title: "Security", blurb: "Keeping your account and money safe.",
    articles: [
      { q: "What is a passkey?", a: ["A passkey lets you sign in with your face, fingerprint or device PIN instead of a password. It can't be guessed or phished, because it only works on oenodPay's real app and website."] },
      { q: "I got a new phone.", a: ["Sign in on the new phone and approve it from your old one, or verify your identity again if you no longer have the old phone."] },
      { q: "How do I spot a scam?", a: ["oenodPay will never ask for your passkey, PIN or a code by phone, text or email. Be careful of anyone pressuring you to send money quickly, especially to someone you've never met."] },
    ],
  },
  {
    slug: "fees-account", title: "Fees and your account", blurb: "Fees, statements and closing your account.",
    articles: [
      { q: "Where can I see all the fees?", a: ["On the fees and limits page, and before every payment in the app."] },
      { q: "Is my money safe?", a: ["Your balance is held separately from oenodPay's own money at a Canadian financial institution, as the Retail Payment Activities Act requires. It isn't a bank deposit, so it isn't covered by CDIC."] },
      { q: "How do I close my account?", a: ["Go to Settings, then Close account. We'll send any remaining balance to a Canadian bank account in your name."] },
    ],
  },
];
