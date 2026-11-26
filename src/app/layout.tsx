import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { Toaster } from "@/components/ui/toast";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wyntro — Connect smarter. Convert faster.",
  description:
    "Next-generation lead management, customer relationship management, sales conversion, and workflow automation platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-[var(--bg-app)] text-[var(--text-primary)] font-sans">
        <QueryProvider>
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
