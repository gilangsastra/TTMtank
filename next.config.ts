import type { NextConfig } from "next";
import path from "node:path";

/**
 * CSP — strict by default. We allow inline scripts/styles because:
 *  - Next.js injects inline hydration/RSC scripts
 *  - JSON-LD on product pages is rendered inline
 *  - Tailwind v4's arbitrary-value support uses inline style attributes
 *
 * Upgrade path: nonce-based CSP via middleware (drop 'unsafe-inline' from script-src).
 */
const cspDirectives = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://images.unsplash.com",
  "font-src 'self' data:",
  "connect-src 'self'",
  "form-action 'self'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: cspDirectives },
  // HSTS — browsers ignore this on plain HTTP, so it's safe in dev.
  // includeSubDomains tells browsers to upgrade subdomains too;
  // only enable that once you're certain every subdomain runs HTTPS.
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Anchors the build to this project, silencing the multiple-lockfile warning
  // caused by a package-lock.json at the Windows home directory level.
  outputFileTracingRoot: path.resolve(process.cwd()),
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
