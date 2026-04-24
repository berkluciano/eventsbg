import { Body, Container, Head, Heading, Hr, Html, Preview, Section, Text, Row, Column, Button } from "@react-email/components";
import * as React from "react";

interface OrderItem {
  eventName: string;
  ticketTypeName: string;
  qty: number;
  priceCents: number;
  serviceFeeCents: number;
  eventDate: string;
  eventVenue: string;
  eventCity: string;
}

interface AdminNotificationProps {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  totalCents: number;
  siteUrl: string;
}

const formatEur = (cents: number) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(cents / 100);

export function AdminNotification({ orderId, customerName, customerEmail, customerPhone, items, totalCents, siteUrl }: AdminNotificationProps) {
  const adminOrderUrl = `${siteUrl}/admin/orders/${orderId}`;

  return (
    <Html>
      <Head />
      <Preview>NEW ORDER #{orderId.slice(-8).toUpperCase()} – {items.length} item(s) – {customerName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={logo}>Eventor BG — New Order</Heading>
          </Section>

          <Section style={content}>
            <Section style={alertBanner}>
              <Text style={alertText}>ACTION REQUIRED: A new order needs to be purchased from the vendor.</Text>
            </Section>

            <Button href={adminOrderUrl} style={ctaButton}>View Order in Admin Panel →</Button>

            <Heading as="h2" style={h2}>Customer Details</Heading>
            <Section style={detailBox}>
              <Row>
                <Column style={labelCol}><Text style={label}>Name</Text></Column>
                <Column><Text style={value}><strong>{customerName}</strong></Text></Column>
              </Row>
              <Row>
                <Column style={labelCol}><Text style={label}>Email</Text></Column>
                <Column><Text style={value}>{customerEmail}</Text></Column>
              </Row>
              <Row>
                <Column style={labelCol}><Text style={label}>Phone</Text></Column>
                <Column><Text style={value}>{customerPhone}</Text></Column>
              </Row>
            </Section>

            <Heading as="h2" style={h2}>Order #{orderId.slice(-8).toUpperCase()}</Heading>
            <Section style={detailBox}>
              {items.map((item, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <Hr style={divider} />}
                  <Row>
                    <Column style={labelCol}><Text style={label}>Event</Text></Column>
                    <Column><Text style={value}>{item.eventName}</Text></Column>
                  </Row>
                  <Row>
                    <Column style={labelCol}><Text style={label}>Date</Text></Column>
                    <Column><Text style={value}>{item.eventDate}</Text></Column>
                  </Row>
                  <Row>
                    <Column style={labelCol}><Text style={label}>Venue</Text></Column>
                    <Column><Text style={value}>{item.eventVenue}, {item.eventCity}</Text></Column>
                  </Row>
                  <Row>
                    <Column style={labelCol}><Text style={label}>Ticket</Text></Column>
                    <Column><Text style={value}>{item.ticketTypeName} × {item.qty}</Text></Column>
                  </Row>
                  <Row>
                    <Column style={labelCol}><Text style={label}>Subtotal</Text></Column>
                    <Column><Text style={value}>{formatEur(item.priceCents * item.qty + item.serviceFeeCents)}</Text></Column>
                  </Row>
                </React.Fragment>
              ))}
              <Hr style={divider} />
              <Row>
                <Column style={labelCol}><Text style={{ ...label, fontWeight: "700" }}>Total Paid</Text></Column>
                <Column><Text style={{ ...value, fontWeight: "700", color: "#022E66" }}>{formatEur(totalCents)}</Text></Column>
              </Row>
            </Section>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>Eventor BG Admin Notification</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = { backgroundColor: "#f4f4f5", fontFamily: "Arial, sans-serif" };
const container = { maxWidth: "600px", margin: "0 auto" };
const header = { backgroundColor: "#022E66", padding: "24px 32px", borderRadius: "8px 8px 0 0" };
const logo = { color: "#ffffff", fontSize: "22px", fontWeight: "700", margin: "0" };
const content = { backgroundColor: "#ffffff", padding: "32px" };
const alertBanner = { backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "12px 16px", marginBottom: "20px" };
const alertText = { fontSize: "13px", color: "#dc2626", fontWeight: "700", margin: "0", textAlign: "center" as const };
const ctaButton = { backgroundColor: "#022E66", color: "#ffffff", padding: "12px 24px", borderRadius: "6px", fontSize: "14px", fontWeight: "600", textDecoration: "none", display: "block", textAlign: "center" as const, marginBottom: "28px" };
const h2 = { fontSize: "16px", color: "#022E66", marginBottom: "8px", marginTop: "24px" };
const detailBox = { backgroundColor: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "16px" };
const labelCol = { width: "38%" };
const label = { fontSize: "13px", color: "#6b7280", margin: "4px 0" };
const value = { fontSize: "13px", color: "#111827", margin: "4px 0" };
const divider = { borderColor: "#e5e7eb", margin: "10px 0" };
const footer = { backgroundColor: "#f9fafb", padding: "16px 32px", borderRadius: "0 0 8px 8px", borderTop: "1px solid #e5e7eb" };
const footerText = { fontSize: "12px", color: "#9ca3af", textAlign: "center" as const, margin: "0" };

export default AdminNotification;
