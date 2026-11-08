/**
 * Legal agreements and policies. These are working drafts written for Canadian requirements
 * (FINTRAC, the Retail Payment Activities Act, PIPEDA and Quebec Law 25, provincial consumer law).
 * Every page shows that it is a draft until counsel approves it and it comes into force at launch.
 */
export interface LegalDoc {
  slug: string;
  title: string;
  group: "Agreements" | "Privacy" | "Compliance" | "Product terms" | "Company";
  summary: string;
  sections: { h: string; p: string[] }[];
}

const CONTACT = "You can reach us in the app under Help, or through the contact page at oenodpay.com/contact.";

export const LEGAL: LegalDoc[] = [
  {
    slug: "terms", group: "Agreements", title: "Terms of use",
    summary: "The rules for using the oenodPay website and apps.",
    sections: [
      { h: "Who we are", p: ["oenodPay is a financial app made by OENOD. In these terms, \"we\" means the oenodPay company that provides the service, and \"you\" means the person using it. The legal name and registered address of that company will be shown here before launch."] },
      { h: "Who can use oenodPay", p: ["You must be at least 18 (or the age of majority in your province), live in Canada and be able to enter a binding contract. Some features have extra requirements, which we explain on each feature's page."] },
      { h: "Your account", p: ["You must give true, current information, keep it up to date and keep your sign-in methods safe. Tell us right away if you think someone else has accessed your account.", "We verify your identity before you can move money, as Canadian law requires. We may refuse, limit or close an account if we can't verify it, if we suspect fraud, or if the law requires it."] },
      { h: "Acceptable use", p: ["You agree not to use oenodPay for anything illegal, to break our acceptable use policy, or to interfere with the service or other people's accounts."] },
      { h: "Our service", p: ["We work hard to keep oenodPay available and secure, but we can't promise it will never be interrupted. We may change or stop features, and we'll give notice when the change affects you."] },
      { h: "Other agreements", p: ["Using a specific product means you also agree to its own terms, such as the account agreement, the cardholder agreement or the Lend terms. If those terms conflict with these, the product terms apply."] },
      { h: "Liability", p: ["Nothing in these terms limits rights you have under consumer protection law in your province. Otherwise, we're not responsible for indirect losses, and our total responsibility is limited to the fees you paid us in the 12 months before the claim."] },
      { h: "Changes and contact", p: ["We'll give you at least 30 days' notice before changes to these terms take effect, as provincial law requires. " + CONTACT] },
    ],
  },
  {
    slug: "account-agreement", group: "Agreements", title: "Account agreement",
    summary: "How your oenodPay balance works, including adding, holding and sending money.",
    sections: [
      { h: "What your account is", p: ["Your oenodPay account is a prepaid payment account, not a bank account. The money in it is not a deposit and is not covered by the Canada Deposit Insurance Corporation (CDIC).", "As a payment service provider, we hold your money in trust or in a separate safeguarding account at a Canadian financial institution, apart from our own money, as the Retail Payment Activities Act requires."] },
      { h: "Adding money", p: ["You can add money by bank transfer, direct deposit, Interac e-Transfer or debit card. Money is available once we receive it. We don't pay interest on your balance."] },
      { h: "Sending money", p: ["Before every payment we show the amount, fees, exchange rate (if any) and when it should arrive. A payment is authorized when you confirm it with your passkey, fingerprint, face or PIN.", "You can cancel an international transfer until it has been paid out. Payments to other oenodPay users are instant and final."] },
      { h: "Limits", p: ["We set limits on how much you can add, hold and send, and they may change as your account history grows. Current limits are on the fees and limits page and in the app."] },
      { h: "Errors and unauthorized payments", p: ["If a payment you didn't authorize leaves your account, tell us as soon as you can. If you weren't grossly negligent and you told us promptly, we'll refund it.", "If we make a mistake, we'll correct it and refund any fees caused by it."] },
      { h: "Statements and records", p: ["Your full history is always in the app, and monthly statements are available to download. We keep transaction records for at least five years, as FINTRAC requires."] },
      { h: "Closing your account", p: ["You can close your account at any time in the app, and we'll send your remaining balance to a Canadian bank account in your name. We may close an account with 30 days' notice, or sooner if the law requires or we suspect fraud."] },
      { h: "Dormant accounts", p: ["If your account has no activity for 12 months we'll contact you. We never charge inactivity fees. Unclaimed balances are handled under the applicable unclaimed property law."] },
    ],
  },
  {
    slug: "cardholder-agreement", group: "Agreements", title: "Cardholder agreement",
    summary: "The terms for your oenodPay Visa debit card.",
    sections: [
      { h: "The card", p: ["The oenodPay Visa debit card is issued by our Canadian issuing partner under licence from Visa. The issuer's name will be shown here and on the card. Purchases are paid from your oenodPay balance, so you can't spend more than you have."] },
      { h: "Keeping it safe", p: ["Keep your card, PIN and phone safe. Don't share your PIN. Freeze the card in the app if it's lost, and tell us if it was stolen or used without permission."] },
      { h: "Unauthorized use", p: ["Under Visa's zero liability policy, you're not responsible for unauthorized purchases you report promptly, unless you were grossly negligent or acted fraudulently."] },
      { h: "Fees", p: ["No monthly fee. Foreign currency purchases cost the Visa rate plus 1.5%. ATM withdrawals: 2 free per month in Canada, then $2.00; $3.00 outside Canada. ATM owners may charge their own fee. A replacement card is free the first time, then $10."] },
      { h: "Disputes and refunds", p: ["If a merchant charges you wrongly, try to resolve it with them first. If that fails, dispute the charge in the app within 60 days of the statement date and we'll raise it through Visa."] },
      { h: "Expiry and cancellation", p: ["The card is valid until the date shown on it. You can cancel it at any time in the app. Your balance stays in your oenodPay account."] },
    ],
  },
  {
    slug: "privacy", group: "Privacy", title: "Privacy policy",
    summary: "What personal information we collect, why, and the choices you have.",
    sections: [
      { h: "Our commitment", p: ["We follow Canada's Personal Information Protection and Electronic Documents Act (PIPEDA), Quebec's Law 25 and other provincial privacy laws. We collect only what we need, protect it carefully and never sell it."] },
      { h: "What we collect", p: ["Identity information: name, date of birth, address, ID documents and a selfie for verification.", "Contact information: email and phone number.", "Financial information: your transactions, balances, the people you pay and, for some features, your income and employment.", "Device information: device type, app version, IP address and security signals used to protect your account."] },
      { h: "Why we use it", p: ["To open and run your account and process your payments.", "To verify your identity and meet anti-money-laundering, sanctions and tax laws.", "To prevent fraud and keep accounts secure.", "To improve oenodPay and, only with your consent, to send you marketing."] },
      { h: "Who we share it with", p: ["Service providers that help us run oenodPay, such as identity verification, payment, card and cloud partners, under contracts that protect your information.", "Regulators, law enforcement and courts when the law requires it, including reports to FINTRAC.", "Credit bureaus, only for features you turn on that need them."] },
      { h: "Where we store it", p: ["We store personal information in Canada. If a service provider processes it outside Canada, it stays protected by contract, and we tell you in this policy."] },
      { h: "How long we keep it", p: ["We keep records for as long as your account is open and then for the periods the law requires, usually five years for financial records. Then we securely delete or anonymize them."] },
      { h: "Your rights", p: ["You can ask to see, correct or delete your information, withdraw consent for optional uses, and ask how an automated decision about you was made. Ask in the app or on the contact page. We reply within 30 days."] },
      { h: "Our privacy officer", p: ["Our privacy officer is responsible for this policy. If you're not satisfied with our answer, you can complain to the Office of the Privacy Commissioner of Canada or, in Quebec, the Commission d'accès à l'information."] },
    ],
  },
  {
    slug: "cookies", group: "Privacy", title: "Cookie policy",
    summary: "How the website uses cookies and similar technology.",
    sections: [
      { h: "Essential cookies", p: ["We use secure, HttpOnly cookies to keep you signed in and to protect against fraud and forged requests. The site can't work without them, so they can't be turned off."] },
      { h: "Analytics", p: ["With your consent, we use privacy-friendly analytics to understand which pages help people. We don't use advertising cookies or sell browsing data."] },
      { h: "Your choices", p: ["You can change your choice at any time from the cookie settings link in the footer, or block cookies in your browser."] },
    ],
  },
  {
    slug: "electronic-communications", group: "Agreements", title: "Electronic communications consent",
    summary: "Your agreement to receive documents and notices electronically.",
    sections: [
      { h: "What you agree to", p: ["By opening an account you agree that we can give you agreements, statements, receipts, disclosures and notices electronically, in the app or by email."] },
      { h: "Paper copies", p: ["You can ask for a paper copy of any document at no cost, and you can withdraw this consent. If you do, we may need to close your account, because oenodPay is an app-based service."] },
    ],
  },
  {
    slug: "acceptable-use", group: "Agreements", title: "Acceptable use policy",
    summary: "What oenodPay can't be used for.",
    sections: [
      { h: "Not allowed", p: ["Anything illegal, including money laundering, terrorist financing, fraud and scams.", "Payments to or for people or countries under Canadian sanctions.", "Unlicensed gambling, illegal drugs, weapons trafficking, and adult content involving non-consent or minors.", "Using someone else's identity or account, or letting others use yours.", "Buying or selling on behalf of a business without a business account."] },
      { h: "What happens if the policy is broken", p: ["We may stop a payment, freeze funds while we investigate, close the account and report activity to FINTRAC or the police, as the law requires."] },
    ],
  },
  {
    slug: "complaints", group: "Company", title: "Complaints",
    summary: "How to raise a complaint and how we handle it.",
    sections: [
      { h: "Step 1: Tell us", p: ["Contact support in the app or on the contact page. Most issues are solved in the first conversation. We confirm every complaint within 2 business days."] },
      { h: "Step 2: Our complaints officer", p: ["If you're not satisfied, ask for your complaint to be escalated. Our complaints officer reviews it and gives you a written answer within 30 days."] },
      { h: "Step 3: Outside help", p: ["If you're still not satisfied, you can contact the external complaints body named in our final answer. For privacy concerns, you can contact the Office of the Privacy Commissioner of Canada. In Quebec, you can also contact the Autorité des marchés financiers."] },
      { h: "How we use complaints", p: ["We record every complaint, look for patterns and fix their causes. Complaint records are kept as regulators require."] },
    ],
  },
  {
    slug: "aml-sanctions", group: "Compliance", title: "Anti-money laundering and sanctions statement",
    summary: "How we prevent money laundering, terrorist financing and sanctions breaches.",
    sections: [
      { h: "Our obligations", p: ["oenodPay will be registered with the Financial Transactions and Reports Analysis Centre of Canada (FINTRAC) as a money services business before launch, and will follow the Proceeds of Crime (Money Laundering) and Terrorist Financing Act and its regulations."] },
      { h: "Our compliance program", p: ["A named compliance officer, written policies and procedures, a documented risk assessment, ongoing staff training, and an independent effectiveness review at least every two years."] },
      { h: "Knowing our customers", p: ["We verify every customer's identity using government ID and biometric checks before they can move money, check for politically exposed persons, and keep records as required."] },
      { h: "Monitoring and reporting", p: ["We monitor transactions for unusual activity and report to FINTRAC as required, including suspicious transactions, large cash and large virtual currency transactions, and international electronic funds transfers of $10,000 or more."] },
      { h: "Sanctions", p: ["We screen customers and recipients against Canadian sanctions lists and ministerial directives, and block payments that would break them."] },
    ],
  },
  {
    slug: "regulatory", group: "Compliance", title: "Licences and registrations",
    summary: "The registrations oenodPay is obtaining, and their status.",
    sections: [
      { h: "Current status", p: ["oenodPay has not launched. We will not accept customer money until the registrations below are in place. This page will list each registration number once issued."] },
      { h: "Money services business", p: ["FINTRAC registration as a money services business, for money transfers and foreign exchange. Status: application in preparation."] },
      { h: "Payment service provider", p: ["Bank of Canada registration under the Retail Payment Activities Act, covering safeguarding of customer funds and operational risk. Status: application in preparation."] },
      { h: "Quebec", p: ["Licence from the Autorité des marchés financiers to operate a money services business in Quebec. Status: planned before serving Quebec residents."] },
      { h: "Partners for other features", p: ["Cards are issued by a Canadian issuing partner. Investing is offered through a dealer registered with the Canadian Investment Regulatory Organization (CIRO). Travel is sold by registered travel partners. Lending and Lend will follow provincial lending and securities rules. Each partner is named on its feature page before launch."] },
    ],
  },
  {
    slug: "lend-terms", group: "Product terms", title: "Lend terms and risk disclosure",
    summary: "How oenodPay Lend works and the risks of lending.",
    sections: [
      { h: "Important risks", p: ["Lending money carries risk. Borrowers can pay late or not at all, and you can lose some or all of the money you lend. Target returns are not guaranteed. Lend is not a deposit and is not covered by CDIC or any investor protection fund."] },
      { h: "How it works", p: ["You choose an amount and a term. We split it across many small loans to checked oenodPay members. As borrowers repay, principal and interest come back to your balance monthly, minus a 1% yearly service fee."] },
      { h: "Who can lend", p: ["Lend will be offered only where provincial securities rules allow it and to people who meet the eligibility rules for their province, which may include investment limits."] },
      { h: "Getting your money back", p: ["Your money is committed for the term you choose. You may be able to sell your loan parts to other lenders, but this isn't guaranteed."] },
    ],
  },
  {
    slug: "loan-disclosures", group: "Product terms", title: "Loan disclosures",
    summary: "What we tell you before you borrow.",
    sections: [
      { h: "Cost of borrowing", p: ["Before you accept any loan we show the annual percentage rate (APR), every payment amount and date, any fees, and the total cost of borrowing, as federal and provincial cost-of-borrowing rules require."] },
      { h: "Your rights", p: ["You can repay early at any time without a penalty. In most provinces you can cancel a loan within 2 business days of signing. Every rate stays under Canada's criminal interest rate limit."] },
      { h: "Credit reporting", p: ["We report loan payments to credit bureaus. On-time payments can help your score; missed payments can hurt it."] },
    ],
  },
  {
    slug: "investing-disclosures", group: "Product terms", title: "Investing disclosures",
    summary: "Important information about investing through oenodPay.",
    sections: [
      { h: "Who provides the service", p: ["Investing accounts are offered by a dealer registered with the Canadian Investment Regulatory Organization (CIRO) and a member of the Canadian Investor Protection Fund (CIPF). The dealer will be named here before launch."] },
      { h: "Risks", p: ["The value of investments goes up and down and you can lose money. Past performance doesn't predict future returns. Part shares may not be transferable to other dealers."] },
      { h: "Protection", p: ["CIPF protects eligible accounts within defined limits if a member firm becomes insolvent. It doesn't cover losses from market changes."] },
    ],
  },
  {
    slug: "travel-terms", group: "Product terms", title: "Travel terms",
    summary: "Terms for flights and hotels booked in oenodPay.",
    sections: [
      { h: "Who sells the travel", p: ["Travel is sold by registered travel agencies (including registration with the Travel Industry Council of Ontario where required). The seller's name and registration number appear at checkout and on your confirmation."] },
      { h: "Fares and changes", p: ["Each fare and rate has its own change and refund rules, shown before you book. Airline passenger rights under the Air Passenger Protection Regulations still apply."] },
    ],
  },
  {
    slug: "esim-terms", group: "Product terms", title: "eSIM terms",
    summary: "Terms for travel data plans.",
    sections: [
      { h: "The service", p: ["eSIM data plans are provided by our connectivity partner using local networks. Speeds and coverage depend on the local network."] },
      { h: "Refunds", p: ["You can get a full refund for a plan that hasn't been installed. Once installed or activated, plans can't be refunded unless the service didn't work."] },
    ],
  },
  {
    slug: "rewards-terms", group: "Product terms", title: "Rewards terms",
    summary: "How you earn and use points.",
    sections: [
      { h: "Earning", p: ["1 point per $1 on eligible card purchases, plus bonuses we announce in the app. Refunded purchases lose their points."] },
      { h: "Using points", p: ["100 points are worth $1 toward travel, eSIM or your balance. Points have no cash value outside oenodPay and can't be transferred."] },
      { h: "Expiry and changes", p: ["Points expire after 24 months with no account activity. We'll give 30 days' notice before changing how points are earned or used."] },
    ],
  },
  {
    slug: "accessibility", group: "Company", title: "Accessibility statement",
    summary: "Our commitment to an app and website everyone can use.",
    sections: [
      { h: "Our goal", p: ["We design oenodPay to meet the Web Content Accessibility Guidelines (WCAG) 2.2 at level AA, and to work with screen readers, larger text and keyboard navigation."] },
      { h: "Tell us", p: ["If something is hard to use, contact us and we'll help you complete your task another way and fix the problem."] },
    ],
  },
  {
    slug: "responsible-disclosure", group: "Company", title: "Responsible disclosure",
    summary: "How security researchers can report a vulnerability.",
    sections: [
      { h: "Reporting", p: ["If you find a security vulnerability, report it through the contact page and choose Security. Include steps to reproduce it. Don't access other people's data, disrupt the service or make the issue public before we fix it."] },
      { h: "Our promise", p: ["We'll confirm your report within 2 business days, keep you updated, and won't take legal action against good-faith research that follows these rules."] },
    ],
  },
];

export const LEGAL_GROUPS = ["Agreements", "Privacy", "Compliance", "Product terms", "Company"] as const;
export const legalBySlug = (slug: string) => LEGAL.find((d) => d.slug === slug);
