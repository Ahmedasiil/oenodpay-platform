/**
 * OENODPAY design tokens shared by mobile and web: white-first, with dark navy and
 * black as the accents. Screens are white, text and primary actions navy, the
 * balance card navy and the debit card black.
 */
export const brand = {
  /** Primary action fill (navy button with white label). */
  primary: '#0A1B3D',
  primaryDark: '#000000',
  /** Label colour on a primary action. */
  onPrimary: '#FFFFFF',
  primarySoft: '#E8ECF5',
  /** Foreground text and icons. */
  ink: '#0A1B3D',
  muted: '#5B6680',
  /** Raised panels on the white screen. */
  surface: '#F3F5F9',
  background: '#FFFFFF',
  navy: '#0A1B3D',
  black: '#000000',
  border: '#E3E7EF',
  positive: '#0A1B3D',
  positiveSoft: '#E8ECF5',
  mint: '#0A1B3D',
  danger: '#C62828',
} as const;
