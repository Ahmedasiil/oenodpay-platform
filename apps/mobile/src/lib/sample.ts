/** Sample content shown until the app is signed in to a real account. */
export const sampleUser = { firstName: 'Ahmed', balanceMinor: 248_050, points: 1_240 };

export const sampleActivity = [
  { id: '1', initials: 'SK', name: 'Sara K.', meta: 'Wallet transfer · Today', amountMinor: 12_000 },
  { id: '2', initials: 'EL', name: 'Electricity bill', meta: 'Bill payment · Yesterday', amountMinor: -8_640 },
  { id: '3', initials: 'PH', name: 'Maria, Philippines', meta: 'Mobile wallet · Nov 4', amountMinor: -30_000 },
  { id: '4', initials: 'ES', name: 'eSIM Türkiye 10 GB', meta: 'Card · Nov 2', amountMinor: -1_900 },
];

export const sampleContacts = [
  { handle: 'sara', initials: 'SK', name: 'Sara', color: '#3530D9' },
  { handle: 'omar', initials: 'OM', name: 'Omar', color: '#0B7A6B' },
  { handle: 'lina', initials: 'LI', name: 'Lina', color: '#9A3412' },
  { handle: 'james', initials: 'JD', name: 'James', color: '#0B1020' },
];

export const sampleBills = [
  { id: 'b1', name: 'Electricity', due: 'Due Nov 14 · auto-pay on', amountMinor: 8_640 },
  { id: 'b2', name: 'Mobile phone', due: 'Due Nov 18', amountMinor: 6_500 },
  { id: 'b3', name: 'Home internet', due: 'Due Nov 21', amountMinor: 7_999 },
  { id: 'b4', name: 'Property tax', due: 'Due Nov 30', amountMinor: 41_200 },
];

export const sampleHoldings = [
  { code: 'CAN', name: 'Canada index ETF', meta: '42.1 shares', valueMinor: 340_210 },
  { code: 'USA', name: 'US total market ETF', meta: '18.6 shares', valueMinor: 291_155 },
  { code: 'INTL', name: 'International ETF', meta: '30.0 shares', valueMinor: 124_042 },
  { code: 'TECH', name: 'Tech company stock', meta: '3.25 shares', valueMinor: 66_000 },
];

export const sampleEsims = [
  { id: 'us', name: 'United States', plan: '10 GB · 30 days', price: '$22' },
  { id: 'gb', name: 'United Kingdom', plan: '5 GB · 15 days', price: '$14' },
  { id: 'tr', name: 'Türkiye', plan: '10 GB · 30 days', price: '$19' },
  { id: 'global', name: 'Global, 120+ countries', plan: '20 GB · 60 days', price: '$59' },
];

export const sampleFlights = [
  { id: 'f1', times: '21:40 → 19:15 +1', meta: 'Non-stop · 12h 35m', price: '$1,148', points: 'Earn 2,296 pts' },
  { id: 'f2', times: '18:05 → 22:50 +1', meta: '1 stop · 19h 45m', price: '$892', points: 'Earn 1,784 pts' },
  { id: 'f3', times: '10:30 → 14:20 +1', meta: '1 stop · 18h 50m', price: '$934', points: 'Earn 1,868 pts' },
];

export const sampleHotels = [
  { id: 'h1', name: 'Marina view hotel', meta: '4 stars · 3 nights · free cancellation', price: '$612' },
  { id: 'h2', name: 'Downtown suites', meta: '5 stars · 3 nights · breakfast', price: '$1,020' },
  { id: 'h3', name: 'Old town guesthouse', meta: '3 stars · 3 nights', price: '$318' },
];
