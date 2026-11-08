import type { NextConfig } from "next";

// Strict security headers on every page of the oenodPay website and web app.
const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(self)" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

// Content Security Policy: only our own origin may load code, styles, fonts or be called from the page.
// 'unsafe-inline' scripts are needed by statically rendered Next.js pages; 'unsafe-eval' only in development.
const dev = process.env.NODE_ENV !== "production";
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self'${dev ? " ws:" : ""}`,
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  ...(dev ? [] : ["upgrade-insecure-requests"]),
].join("; ");
securityHeaders.push({ key: "Content-Security-Policy", value: csp });

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  transpilePackages: ["@oenodpay/shared"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // The mobile app preview is a single-page web export: every screen path loads its index.html.
  async rewrites() {
    return {
      // Screen paths go to the app's index.html before any website route can claim them
      // (for example /mobile-preview/security would otherwise hit the [lang]/security page).
      beforeFiles: [
        { source: "/mobile-preview", destination: "/mobile-preview/index.html" },
        { source: "/mobile-preview/:path((?!_expo/|assets/|favicon\\.ico|metadata\\.json|index\\.html).*)", destination: "/mobile-preview/index.html" },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
