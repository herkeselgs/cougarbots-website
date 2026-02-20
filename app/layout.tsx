// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Canterbury Cougarbots • FRC Team 11436",
  description:
    "Canterbury Cougarbots (FRC Team 11436) — student-led robotics team at Canterbury School of Fort Myers. Sponsors help us build robots, engineers, and leaders.",
  metadataBase: new URL("https://cougarbots.org"),
  openGraph: {
    title: "Canterbury Cougarbots • FRC Team 11436",
    description:
      "Student-led robotics team at Canterbury School of Fort Myers. Sponsors help us build robots, engineers, and leaders.",
    url: "https://cougarbots.org",
    siteName: "Canterbury Cougarbots",
    type: "website",
    images: [
      {
        url: "/og.png", // put an image at public/og.png (1200x630 recommended)
        width: 1200,
        height: 630,
        alt: "Canterbury Cougarbots • FRC Team 11436",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Canterbury Cougarbots • FRC Team 11436",
    description:
      "Canterbury Cougarbots (FRC Team 11436) — student-led robotics team at Canterbury School of Fort Myers.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}