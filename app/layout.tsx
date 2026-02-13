import type { Metadata } from "next";
import { Inter, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import ConfigureAmplify from "@/lib/amplify-config";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Fonzi.ai - Elite AI Talent Marketplace",
  description: "Get hired by the world's best AI companies. Monthly Match Day connects top AI/ML engineers with leading tech companies.",
  keywords: ["AI jobs", "ML jobs", "AI talent", "machine learning careers", "Match Day", "tech hiring"],
  openGraph: {
    title: "Fonzi.ai - Elite AI Talent Marketplace",
    description: "Get hired by the world's best AI companies",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fonzi.ai",
    description: "Get hired by the world's best AI companies",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${dmSerif.variable} font-sans antialiased`}>
        <ConfigureAmplify />
        {children}
      </body>
    </html>
  );
}
