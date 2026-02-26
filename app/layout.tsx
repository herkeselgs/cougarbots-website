// app/layout.tsx
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";

// Force per-request evaluation (needed for device detection)
export const dynamic = "force-dynamic";

function isMobileUA(ua: string) {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
}

export async function generateMetadata(): Promise<Metadata> {
  const ua = (await headers()).get("user-agent") ?? "";
  const mobile = isMobileUA(ua);

  const title = mobile
    ? "Cougarbots • FRC 11436"
    : "Canterbury Cougarbots • FRC Team 11436";

  const description = mobile
    ? "Canterbury Cougarbots (FRC 11436) — student-led robotics team. Tap to explore sponsorship opportunities."
    : "Canterbury Cougarbots (FRC Team 11436) — student-led robotics team at Canterbury School of Fort Myers. Sponsors help us build robots, engineers, and leaders.";

  const ogImage = mobile ? "/og-mobile.png" : "/og.png";

  return {
    title,
    description,
    metadataBase: new URL("https://cougarbots.org"),
    openGraph: {
      title,
      description,
      url: "https://cougarbots.org",
      siteName: "Canterbury Cougarbots",
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    icons: {
      icon: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
  };
}

// Mobile-safe viewport settings (applies to both)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0B1FA8" },
    { media: "(prefers-color-scheme: dark)", color: "#050A18" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}