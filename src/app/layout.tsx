import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/layout/Header";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Puffit",
  description: "シーシャレビューアプリ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={`${inter.variable} antialiased`}>
        <Providers>
          <Header />
          <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
