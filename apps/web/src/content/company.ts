export const PROVINCES = [
  { name: "Ontario", status: "At launch" }, { name: "British Columbia", status: "At launch" }, { name: "Alberta", status: "At launch" },
  { name: "Manitoba", status: "At launch" }, { name: "Saskatchewan", status: "At launch" }, { name: "Nova Scotia", status: "At launch" },
  { name: "New Brunswick", status: "At launch" }, { name: "Newfoundland and Labrador", status: "At launch" }, { name: "Prince Edward Island", status: "At launch" },
  { name: "Yukon, Northwest Territories and Nunavut", status: "At launch" }, { name: "Quebec", status: "After our AMF licence" },
] as const;

export const VALUES = [
  { t: "Clear prices", b: "Every fee and rate is shown before you pay. No hidden markups." },
  { t: "Security first", b: "Passkeys, device approval and fraud monitoring from day one." },
  { t: "Built for newcomers too", b: "For people who send money home, build credit in Canada and need one app that does it all." },
  { t: "Play by the rules", b: "We register with every regulator that oversees what we do, before we do it." },
];

export const ROLES = [
  { t: "Senior Backend Engineer, Payments", team: "Engineering", where: "Toronto or remote in Canada" },
  { t: "Mobile Engineer, React Native", team: "Engineering", where: "Toronto or remote in Canada" },
  { t: "Security Engineer", team: "Security", where: "Toronto" },
  { t: "Chief Compliance Officer (AML)", team: "Compliance", where: "Toronto" },
  { t: "Customer Support Specialist (English, Tagalog, Hindi, Urdu or Spanish)", team: "Support", where: "Remote in Canada" },
  { t: "Product Designer", team: "Design", where: "Toronto or remote in Canada" },
];

export const PRICING = [
  { group: "Account", rows: [["Opening an account", "Free"], ["Monthly fee", "None"], ["Add money (bank transfer, direct deposit, Interac e-Transfer)", "Free"], ["Inactivity fee", "None"]] },
  { group: "Sending in Canada", rows: [["To another oenodPay user", "Free, instant"], ["To a Canadian bank (first 5 each month)", "Free"], ["To a Canadian bank (after 5)", "$1.00"]] },
  { group: "Sending abroad", rows: [["United Kingdom, bank", "$1.99"], ["India, bank (NEFT)", "$1.99"], ["India, bank (UPI or IMPS)", "$2.99"], ["Mobile wallets", "$2.99 to $3.49"], ["Other bank deposits", "$2.99 to $3.99"], ["Cash pickup", "$4.99"], ["Exchange rate", "Shown before you send, locked 30 minutes"]] },
  { group: "Card", rows: [["Card fee", "None"], ["Foreign currency purchases", "Visa rate + 1.5%"], ["ATM in Canada", "2 free a month, then $2.00"], ["ATM outside Canada", "$3.00"], ["Replacement card", "First free, then $10"]] },
  { group: "Limits while your account is new", rows: [["Per transfer", "$3,000"], ["Sent abroad per 30 days", "$10,000"], ["Card spending per day", "$2,500"], ["ATM per day", "$500"]] },
] as const;
