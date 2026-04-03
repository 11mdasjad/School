import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Royal International Public School - Attendance Portal",
  description: "Professional school attendance management system with role-based access for Admin, Teacher, Student, and Parent.",
  keywords: ["school", "attendance", "management", "education", "portal"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans">
        <TooltipProvider>
          {children}
        </TooltipProvider>
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
