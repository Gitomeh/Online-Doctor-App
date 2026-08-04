import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ToastProvider } from "@/components/ui/toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DocBook - Book Doctor Appointments Online",
  description: "Find and book appointments with doctors online. Search by specialty, location, and availability.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-neutral-50 dark:bg-neutral-900">
        <ToastProvider>
          <Header />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
