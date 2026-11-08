import type { MetadataRoute } from "next";
import { FEATURES } from "@/content/features";
import { COUNTRIES } from "@/content/countries";
import { LEGAL } from "@/content/legal";
import { HELP } from "@/content/help";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://oenodpay.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "", "/features", "/send-money", "/pricing", "/security", "/trust", "/status", "/newcomers", "/business", "/scams", "/about", "/careers", "/press", "/contact", "/help", "/legal",
    ...FEATURES.map((f) => `/features/${f.slug}`),
    ...COUNTRIES.map((c) => `/send-money/${c.slug}`),
    ...HELP.map((h) => `/help/${h.slug}`),
    ...LEGAL.map((d) => `/legal/${d.slug}`),
  ];
  return paths.map((p) => ({ url: `${BASE}${p}` }));
}
