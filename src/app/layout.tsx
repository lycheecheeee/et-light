import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ET Light - 你的輕盈理財夥伴",
  description: "ET Light - 經濟通全新推出的智能理財助手，以「無重力宇宙」為設計理念，透過 AI 語音助手 Net仔，為你提供輕鬆、地道、智能的財經資訊體驗。",
  keywords: ["ET Light", "經濟通", "理財", "財經", "AI助手", "Net仔", "投資", "香港", "粵語"],
  authors: [{ name: "ET Light Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "ET Light - 你的輕盈理財夥伴",
    description: "以「無重力宇宙」為設計理念的智能理財助手",
    url: "https://etlight.com",
    siteName: "ET Light",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ET Light - 你的輕盈理財夥伴",
    description: "以「無重力宇宙」為設計理念的智能理財助手",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-HK" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground overflow-x-hidden`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
