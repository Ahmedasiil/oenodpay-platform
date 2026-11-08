/**
 * oenodPay app look: dark charcoal screens, cream pill buttons, glossy cards.
 * Keys match the shared brand palette so every screen picks the new look up.
 */
export const colors = {
  /** Primary action fill: cream pill with near-black label. */
  primary: '#F5F1E3',
  primaryDark: '#E4DFCD',
  onPrimary: '#111113',
  /** Quiet raised fill (secondary buttons, selected chips). */
  primarySoft: '#2C2C31',
  /** Blue accent for links, highlights and selected states. */
  accent: '#5B8CFF',
  accentLight: '#8FB0FF',
  /** Foreground text and icons. */
  ink: '#F4F2EC',
  muted: '#8E8E96',
  /** Raised panels on the charcoal screen. */
  surface: '#222226',
  surfaceHigh: '#2C2C31',
  background: '#161618',
  navy: '#222226',
  black: '#0C0C0E',
  border: '#2E2E34',
  positive: '#63D49B',
  positiveSoft: '#1D3A2C',
  mint: '#63D49B',
  danger: '#FF6B5E',
} as const;

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24 } as const;
export const radius = { md: 14, lg: 18, xl: 22, xxl: 28, hero: 32, pill: 999 } as const;
