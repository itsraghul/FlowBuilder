import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppProviders from "@/components/providers/AppProviders";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Data Forge",
  description: "Generate DataSet for your ML models.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl={"/sign-in"} appearance={{
      elements: {
        formButtonBattery: "bg-primary hover:bg-primary/90 text-sm !shadow-nowx"
      }
    }}>
      <html lang="en">
        <head>
          <title>Data Forge</title>
        </head>
        <body className={inter.className}>
          <AppProviders>
            {children}
          </AppProviders>
        </body>
        <Toaster />
      </html>
    </ClerkProvider>
  );
}
