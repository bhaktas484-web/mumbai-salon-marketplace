import type { Metadata, Viewport } from "next";
import { Playfair_Display, DM_Sans, DM_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
// Ignore missing type declarations for CSS side-effect import in this file
// @ts-ignore
import "../styles/globals.css";
/* ── Fonts ──────────────────────────────────────────────── */
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-dm-mono",
  display: "swap",
  weight: ["300", "400", "500"],
});

/* ── Metadata ───────────────────────────────────────────── */
export const metadata: Metadata = {
  title: {
    default: "Glamr — Mumbai's Salon Marketplace",
    template: "%s | Glamr Mumbai",
  },
  description:
    "Book top-rated salons, spas, and beauty studios across Mumbai. Real-time slots, verified reviews, and instant confirmations.",
  keywords: [
    "salon booking Mumbai",
    "beauty salon Mumbai",
    "spa Mumbai",
    "hair salon Bandra",
    "salon appointment",
    "beauty services Mumbai",
  ],
  authors: [{ name: "Glamr" }],
  creator: "Glamr Technologies Pvt. Ltd.",
  metadataBase: new URL("https://glamr.in"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://glamr.in",
    siteName: "Glamr",
    title: "Glamr — Mumbai's Salon Marketplace",
    description: "Book top-rated salons & spas across Mumbai. Instant slots, verified reviews.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Glamr Mumbai" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Glamr — Mumbai's Salon Marketplace",
    description: "Book top-rated salons & spas across Mumbai.",
    images: ["/og-image.jpg"],
    creator: "@glamrin",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#0F0E0D",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

/* ── Layout ─────────────────────────────────────────────── */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${dmSans.variable} ${dmMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        {children}

        {/* Global toast notifications */}
        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#1A1916",
              color: "#F5F2EC",
              border: "1px solid #2E2C28",
              borderRadius: "12px",
              fontFamily: "var(--font-dm-sans)",
              fontSize: "14px",
              padding: "12px 16px",
            },
            success: {
              iconTheme: { primary: "#F59500", secondary: "#000" },
            },
            error: {
              iconTheme: { primary: "#EF4444", secondary: "#fff" },
            },
          }}
        />
      </body>
    </html>
  );
}