import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { TicketsDashboard } from "@/components/TicketsDashboard";

export const metadata = { title: "Моите билети" };

export default async function TicketsPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/account/login");

  const orders = await prisma.order.findMany({
    where: { customerEmail: session.user.email },
    include: { event: true, ticketType: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <Navbar />
      <TicketsDashboard
        orders={orders.map((o) => ({
          id: o.id,
          createdAt: o.createdAt,
          status: o.status,
          qty: o.qty,
          totalCents: o.totalCents,
          eventName: o.event.name,
          eventSlug: o.event.slug,
          eventStartsAt: o.event.startsAt,
          ticketTypeName: o.ticketType.name,
        }))}
        userName={session.user.name ?? ""}
      />
      <Footer />
    </>
  );
}
