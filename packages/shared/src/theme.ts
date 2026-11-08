/**
 * oenodPay design tokens shared by the mobile app and the website.
 * Light grey screens with white panels, dark navy and black for the hero
 * surfaces (balance card, debit card, tab bar), and one blue accent.
 * The website mirrors these in apps/web/src/app/globals.css.
 */
export const brand = {
  /** Primary action fill (navy button with white label). */
  primary: '#0A1633',
  primaryDark: '#05070D',
  /** Label colour on a primary action. */
  onPrimary: '#FFFFFF',
  primarySoft: '#E7EDFC',
  /** Blue accent for links, highlights and selected states. */
  accent: '#2252D1',
  accentLight: '#7C9BFF',
  /** Foreground text and icons. */
  ink: '#0B1B3F',
  muted: '#5A6480',
  /** Raised white panels on the grey screen. */
  surface: '#FFFFFF',
  background: '#F6F7FA',
  navy: '#0A1633',
  black: '#05070D',
  border: '#E2E6EE',
  positive: '#0F8A5F',
  positiveSoft: '#E3F4EC',
  mint: '#4CC796',
  danger: '#C2352B',
} as const;
