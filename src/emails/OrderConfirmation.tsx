import { Body, Container, Head, Heading, Hr, Html, Preview, Section, Text, Row, Column } from "@react-email/components";
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

interface OrderConfirmationProps {
  customerName: string;
  items: OrderItem[];
  totalCents: number;
  orderId: string;
}

const formatEur = (cents: number) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(cents / 100);

export function OrderConfirmation({ customerName, items, totalCents, orderId }: OrderConfirmationProps) {
  const totalServiceFee = items.reduce((s, i) => s + i.serviceFeeCents, 0);

  return (
    <Html>
      <Head />
      <Preview>Your order is confirmed – we&apos;re purchasing your tickets now!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={logo}>Eventor BG</Heading>
          </Section>

          <Section style={content}>
            <Heading as="h2" style={h2}>Order Confirmed!</Heading>
            <Text style={text}>Hi {customerName},</Text>
            <Text style={text}>
              Thank you for your order! We&apos;ve received your payment and will purchase your tickets from the official vendor shortly. You will receive your tickets <strong>directly from the vendor to this email address</strong>.
            </Text>

            <Section style={orderBox}>
              <Heading as="h3" style={h3}>Order #{orderId.slice(-8).toUpperCase()}</Heading>

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
                <Column style={labelCol}><Text style={label}>Service fee</Text></Column>
                <Column><Text style={value}>{formatEur(totalServiceFee)}</Text></Column>
              </Row>
              <Row>
                <Column style={labelCol}><Text style={{ ...label, fontWeight: "700" }}>Total paid</Text></Column>
                <Column><Text style={{ ...value, fontWeight: "700" }}>{formatEur(totalCents)}</Text></Column>
              </Row>
            </Section>

            <Section style={infoBox}>
              <Text style={infoText}><strong>What happens next?</strong></Text>
              <Text style={infoText}>1. Our team will visit the official ticket vendor and purchase your tickets using your details.</Text>
              <Text style={infoText}>2. The vendor will send your tickets directly to <strong>this email address</strong>.</Text>
              <Text style={infoText}>3. If there are any issues, we will contact you at this address.</Text>
            </Section>

            <Text style={text}>
              Questions? Contact us at {process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@eventor.bg"}.
            </Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>© {new Date().getFullYear()} Eventor BG. All rights reserved.</Text>
            <Text style={footerText}>The service fee of {formatEur(totalServiceFee)} covers our concierge service and is non-refundable.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = { backgroundColor: "#f4f4f5", fontFamily: "Arial, sans-serif" };
const container = { maxWidth: "600px", margin: "0 auto" };
const header = { backgroundColor: "#022E66", padding: "24px 32px", borderRadius: "8px 8px 0 0" };
const logo = { color: "#ffffff", fontSize: "24px", fontWeight: "700", margin: "0" };
const content = { backgroundColor: "#ffffff", padding: "32px" };
const h2 = { fontSize: "22px", color: "#022E66", marginBottom: "16px" };
const h3 = { fontSize: "16px", color: "#022E66", marginBottom: "12px", marginTop: "0" };
const text = { fontSize: "14px", color: "#374151", lineHeight: "1.6", marginBottom: "12px" };
const orderBox = { backgroundColor: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "20px", marginBottom: "24px" };
const labelCol = { width: "40%" };
const label = { fontSize: "13px", color: "#6b7280", margin: "4px 0" };
const value = { fontSize: "13px", color: "#111827", margin: "4px 0" };
const divider = { borderColor: "#e5e7eb", margin: "12px 0" };
const infoBox = { backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "8px", padding: "16px 20px", marginBottom: "24px" };
const infoText = { fontSize: "13px", color: "#1e40af", margin: "4px 0", lineHeight: "1.5" };
const footer = { backgroundColor: "#f9fafb", padding: "20px 32px", borderRadius: "0 0 8px 8px", borderTop: "1px solid #e5e7eb" };
const footerText = { fontSize: "12px", color: "#9ca3af", textAlign: "center" as const, margin: "4px 0" };

export default OrderConfirmation;
