"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const I = ({ d }: { d: ReactNode }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>
);

const LIVE = [
  { href: "/admin", label: "Overview", icon: <I d={<><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></>} /> },
  { href: "/admin/customers", label: "Customers and ID checks", icon: <I d={<><circle cx="9" cy="8" r="4" /><path d="M2 21c0-4 3-6 7-6s7 2 7 6" /><path d="M17 11l2 2 4-4" /></>} /> },
  { href: "/admin/alerts", label: "Transaction alerts", icon: <I d={<><path d="M12 3l9 16H3z" /><path d="M12 10v4M12 17v.5" /></>} /> },
];
const NEXT = [
  { label: "Transfers and payouts", icon: <I d={<path d="M4 7h13l-3-3M20 17H7l3 3" />} /> },
  { label: "Cards", icon: <I d={<><rect x="2" y="5" width="20" height="14" rx="2.5" /><path d="M2 10h20" /></>} /> },
  { label: "Loans and Lend", icon: <I d={<path d="M3 20h18M6 16V9M11 16V5M16 16v-5M21 16V8" />} /> },
  { label: "Compliance reports", icon: <I d={<><path d="M6 3h9l4 4v14H6z" /><path d="M9 12h7M9 16h7" /></>} /> },
  { label: "Ledger", icon: <I d={<path d="M4 6h16M4 12h16M4 18h10" />} /> },
  { label: "Support tickets", icon: <I d={<><path d="M21 12a9 9 0 1 1-3-6.7" /><path d="M21 4v5h-5" /></>} /> },
];
const TEAM = { href: "/admin/team", label: "Team, roles and audit", icon: <I d={<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />} /> };

export function AdminNav() {
  const path = usePathname();
  const link = (l: { href: string; label: string; icon: ReactNode }) => (
    <Link key={l.href} href={l.href} className={path === l.href ? "on" : undefined} aria-current={path === l.href ? "page" : undefined}>
      {l.icon}{l.label}
    </Link>
  );
  return (
    <nav className="adm-nav" aria-label="Admin">
      {LIVE.map(link)}
      {NEXT.map((n) => <span key={n.label} title="Designed next">{n.icon}{n.label}<em>Next</em></span>)}
      {link(TEAM)}
    </nav>
  );
}
