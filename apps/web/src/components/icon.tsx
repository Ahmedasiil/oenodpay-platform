/** Small line-icon set (24px grid, 1.75 stroke), drawn for oenodPay. */
const P: Record<string, React.ReactNode> = {
  send: <><path d="M4 12h13" /><path d="m12 6 6 6-6 6" /><path d="M20 4v16" opacity=".35" /></>,
  wallet: <><rect x="3" y="6" width="18" height="13" rx="3" /><path d="M3 10h18" /><circle cx="16.5" cy="14.5" r="1.2" /></>,
  bill: <><path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" /><path d="M9 8h6M9 12h6" /></>,
  card: <><rect x="2.5" y="5" width="19" height="14" rx="3" /><path d="M2.5 10h19M6.5 15h4" /></>,
  plane: <><path d="M2 13.5 22 6l-6.5 14-3-6.5z" /><path d="m12.5 13.5 3-3" /></>,
  sim: <><path d="M7 3h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" /><rect x="8.5" y="11" width="7" height="6" rx="1" /></>,
  gift: <><rect x="3.5" y="9" width="17" height="11" rx="2" /><path d="M2.5 9h19v-2.5h-19zM12 6.5V20" /><path d="M12 6.5C10 3 6.5 3.5 7.5 6.5M12 6.5c2-3.5 5.5-3 4.5 0" /></>,
  gauge: <><path d="M4 17a8 8 0 1 1 16 0" /><path d="m12 17 4-5" /><circle cx="12" cy="17" r="1.2" /></>,
  chart: <><path d="M3 20h18" /><path d="m5 15 4-4 3 3 6-7" /><path d="M15 7h3v3" /></>,
  coins: <><ellipse cx="9" cy="7" rx="6" ry="3" /><path d="M3 7v5c0 1.7 2.7 3 6 3s6-1.3 6-3V7" /><path d="M15 11.5c3.3 0 6 1.3 6 3v3c0 1.7-2.7 3-6 3-1.9 0-3.6-.4-4.7-1.1" /></>,
  handshake: <><path d="m2 11 4-4 4 2 3-2 4 1 5 4" /><path d="m6 13 4 4c.8.8 2 .8 2.8 0l4.7-4.7" /><path d="m9 11 3 3" /></>,
  shield: <><path d="M12 3 4.5 6v5.5c0 4.6 3.1 8.3 7.5 9.5 4.4-1.2 7.5-4.9 7.5-9.5V6z" /><path d="m8.5 12 2.5 2.5 4.5-5" /></>,
  lock: <><rect x="4.5" y="10.5" width="15" height="10" rx="2.5" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /><circle cx="12" cy="15.5" r="1.2" /></>,
  key: <><circle cx="8" cy="15" r="4" /><path d="m11 12 8.5-8.5M16 7l2.5 2.5M14 9l2 2" /></>,
  bell: <><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z" /><path d="M10 20.5a2 2 0 0 0 4 0" /></>,
  eye: <><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>,
  server: <><rect x="3.5" y="4" width="17" height="7" rx="2" /><rect x="3.5" y="13" width="17" height="7" rx="2" /><path d="M7.5 7.5h.01M7.5 16.5h.01" /></>,
  bank: <><path d="M3 9.5 12 4l9 5.5z" /><path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20.5h18" /></>,
  check: <><circle cx="12" cy="12" r="9" /><path d="m8 12.5 2.8 2.8L16.5 9.5" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.6 3.7 5.6 3.7 9s-1.2 6.4-3.7 9c-2.5-2.6-3.7-5.6-3.7-9S9.5 5.6 12 3z" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c1.2-4 4.3-6 8-6s6.8 2 8 6" /></>,
  briefcase: <><rect x="3" y="7" width="18" height="13" rx="2.5" /><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3 13h18" /></>,
  alert: <><path d="M12 3.5 22 20H2z" /><path d="M12 10v4.5M12 17.5h.01" /></>,
  doc: <><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4M9 12h6M9 16h6" /></>,
  chat: <><path d="M4 5h16v11H9l-5 4z" /><path d="M8 9.5h8M8 12.5h5" /></>,
  pulse: <><path d="M2 12h4l2.5-6 4 12 2.5-6H22" /></>,
  phone: <><rect x="6.5" y="2.5" width="11" height="19" rx="2.5" /><path d="M11 18.5h2" /></>,
  leaf: <><path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15" /><path d="M5 19c3-4 6-6 10-8" /></>,
  scale: <><path d="M12 3v18M7 21h10M4 7h16" /><path d="m4 7-2.5 6a3 3 0 0 0 5 0zM20 7l-2.5 6a3 3 0 0 0 5 0z" /></>,
  arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
};
export type IconName = keyof typeof P;

export function Icon({ name, size = 22 }: { name: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {P[name] ?? P.check}
    </svg>
  );
}

export function IconChip({ name, dark }: { name: string; dark?: boolean }) {
  return <span className={`ichip${dark ? " dk" : ""}`}><Icon name={name} /></span>;
}
