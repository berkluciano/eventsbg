import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Events BG – Concierge Ticket Service",
    template: "%s | Events BG",
  },
  description:
    "Events BG is your trusted concierge ticket service. Browse events, pay online, and we purchase your ticket from the official vendor on your behalf.",
  keywords: ["tickets", "events", "Bulgaria", "concerts", "sports", "concierge"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="min-h-screen flex flex-col bg-white">{children}</body>
      </html>
    </ClerkProvider>
  );
}
