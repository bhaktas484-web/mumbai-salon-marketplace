import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* ── Images ─────────────────────────────────────────────── */
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/glamr/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/glamr-mumbai/**",
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  /* ── Compiler ───────────────────────────────────────────── */
  compiler: {
    removeConsole: process.env.NODE_ENV === "production"
      ? { exclude: ["error", "warn"] }
      : false,
  },

  /* ── Headers ────────────────────────────────────────────── */
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options",       value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy",        value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy",     value: "camera=(), microphone=(), geolocation=(self)" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://maps.googleapis.com https://checkout.razorpay.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://images.unsplash.com https://res.cloudinary.com https://lh3.googleusercontent.com https://storage.googleapis.com https://maps.gstatic.com https://maps.googleapis.com",
              "connect-src 'self' http://localhost:5000 https://api.glamr.in https://maps.googleapis.com https://api.razorpay.com",
              "frame-src https://checkout.razorpay.com https://api.razorpay.com",
            ].join("; "),
          },
        ],
      },
      {
        source: "/(_next/static|fonts|icons)/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/(images|og-image.jpg|apple-touch-icon.png)(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" },
        ],
      },
    ];
  },

  /* ── Redirects ──────────────────────────────────────────── */
  async redirects() {
    return [
      {
        source: "/salons",
        destination: "/explore",
        permanent: true,
      },
      {
        source: "/book/:salonSlug",
        destination: "/salon/:salonSlug/book",
        permanent: true,
      },
    ];
  },

  /* ── Rewrites (API proxy to avoid CORS in dev) ──────────── */
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://localhost:5000/api/:path*"  // ✅ Fixed: was 4000
            : "https://api.glamr.in/api/:path*",
      },
    ];
  },

  /* ── Experimental ───────────────────────────────────────── */
  experimental: {
    typedRoutes: true,              // ✅ Fixed: moved here from top level
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-dialog",
      "@radix-ui/react-select",
      "@radix-ui/react-tabs",
      "framer-motion",
    ],
  },

  /* ── Misc ───────────────────────────────────────────────── */
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  output: "standalone",
};

export default nextConfig;