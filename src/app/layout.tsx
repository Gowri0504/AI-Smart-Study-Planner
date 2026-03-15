import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Smart Study Planner",
  description: "Your intelligent companion for organized learning",
};

import { AuthContext } from "@/components/AuthContext";
import Navbar from "@/components/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jakarta.variable} ${inter.variable} font-inter antialiased`}
      >
        <AuthContext>
          <div className="min-h-screen flex flex-col bg-gray-50/50">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
          </div>
        </AuthContext>
      </body>
    </html>
  );
}
