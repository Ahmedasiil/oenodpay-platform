import { m } from '@/lib/i18n';

/** Sample content shown until the app is signed in to a real account. */
export const sampleUser = { firstName: 'Ahmed', balanceMinor: 248_050, points: 1_240 };

export const sampleActivity = [
  { id: '1', initials: 'SK', name: 'Sara K.', meta: m('Wallet transfer · Today'), amountMinor: 12_000 },
  { id: '2', initials: 'EL', name: m('Electricity bill'), meta: m('Bill payment · Yesterday'), amountMinor: -8_640 },
  { id: '3', initials: 'PH', name: m('Maria, Philippines'), meta: m('Mobile wallet · Nov 4'), amountMinor: -30_000 },
  { id: '4', initials: 'ES', name: m('eSIM Türkiye 10 GB'), meta: m('Card · Nov 2'), amountMinor: -1_900 },
];

export const sampleContacts = [
  { handle: 'sara', initials: 'SK', name: 'Sara', color: '#1E3A78' },
  { handle: 'omar', initials: 'OM', name: 'Omar', color: '#000000' },
  { handle: 'lina', initials: 'LI', name: 'Lina', color: '#2C4C8C' },
  { handle: 'james', initials: 'JD', name: 'James', color: '#13295A' },
];

export const sampleBills = [
  { id: 'b1', name: m('Electricity'), due: m('Due Nov 14 · auto-pay on'), amountMinor: 8_640 },
  { id: 'b2', name: m('Mobile phone'), due: m('Due Nov 18'), amountMinor: 6_500 },
  { id: 'b3', name: m('Home internet'), due: m('Due Nov 21'), amountMinor: 7_999 },
  { id: 'b4', name: m('Property tax'), due: m('Due Nov 30'), amountMinor: 41_200 },
];

export const sampleHoldings = [
  { code: 'CAN', name: m('Canada index ETF'), shares: '42.1', valueMinor: 340_210 },
  { code: 'USA', name: m('US total market ETF'), shares: '18.6', valueMinor: 291_155 },
  { code: 'INTL', name: m('International ETF'), shares: '30.0', valueMinor: 124_042 },
  { code: 'TECH', name: m('Tech company stock'), shares: '3.25', valueMinor: 66_000 },
];

export const sampleEsims = [
  { id: 'us', name: m('United States'), gb: 10, days: 30, price: '$22' },
  { id: 'gb', name: m('United Kingdom'), gb: 5, days: 15, price: '$14' },
  { id: 'tr', name: m('Türkiye'), gb: 10, days: 30, price: '$19' },
  { id: 'global', name: m('Global, 120+ countries'), gb: 20, days: 60, price: '$59' },
];

export const sampleFlights = [
  { id: 'f1', times: '21:40 → 19:15 +1', meta: m('Non-stop'), duration: '12h 35m', price: '$1,148', points: '2,296' },
  { id: 'f2', times: '18:05 → 22:50 +1', meta: m('1 stop'), duration: '19h 45m', price: '$892', points: '1,784' },
  { id: 'f3', times: '10:30 → 14:20 +1', meta: m('1 stop'), duration: '18h 50m', price: '$934', points: '1,868' },
];

export const sampleHotels = [
  { id: 'h1', name: m('Marina view hotel'), meta: m('4 stars · 3 nights · free cancellation'), price: '$612' },
  { id: 'h2', name: m('Downtown suites'), meta: m('5 stars · 3 nights · breakfast'), price: '$1,020' },
  { id: 'h3', name: m('Old town guesthouse'), meta: m('3 stars · 3 nights'), price: '$318' },
];
