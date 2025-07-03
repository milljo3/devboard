import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {Toaster} from "sonner";
import SignOutButton from "@/components/SignOutButton";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevBoard",
  description: "Track your job applications!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-primary text-primary-foreground`}
      >
        <div className="flex justify-between items-center absolute top-0 left-0 w-full p-4">
            <Link
                href="/"
                className="text-primary-foreground text-lg"
            >
                Dev<span className="text-secondary">Board</span>
            </Link>
            <SignOutButton />
        </div>
        {children}
        <Toaster position="top-center" theme="dark" richColors={true} />
      </body>
    </html>
  );
}
