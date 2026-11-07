/**
 * OENODPAY design tokens shared by mobile and web: the "Navy, Black & White" look.
 * Screens are navy, raised panels a lighter navy, text white, primary actions white
 * with navy text, and the debit card black.
 */
export const brand = {
  /** Primary action fill (white button with navy label). */
  primary: '#FFFFFF',
  primaryDark: '#E6EAF2',
  /** Label colour on a primary action. */
  onPrimary: '#0A1B3D',
  primarySoft: '#1E3A78',
  /** Foreground text and icons. */
  ink: '#FFFFFF',
  muted: '#A7B3CC',
  /** Raised panels on the navy screen. */
  surface: '#13295A',
  background: '#0A1B3D',
  navy: '#0A1B3D',
  black: '#000000',
  border: '#22396E',
  positive: '#FFFFFF',
  positiveSoft: '#1E3A78',
  mint: '#FFFFFF',
  danger: '#FF6B6B',
} as const;
