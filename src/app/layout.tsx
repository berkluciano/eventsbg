import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Eventor BG – Concierge Ticket Service",
    template: "%s | Eventor BG",
  },
  description:
    "Eventor BG is your trusted concierge ticket service. Browse events, pay online, and we purchase your ticket from the official vendor on your behalf.",
  keywords: ["tickets", "events", "Bulgaria", "concerts", "sports", "concierge"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="bg">
        <body className="min-h-screen flex flex-col bg-white">
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
