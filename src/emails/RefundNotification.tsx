import {
  Html, Head, Body, Container, Section,
  Heading, Text, Hr, Preview, Row, Column,
} from "@react-email/components";

interface RefundNotificationProps {
  customerName: string;
  eventName: string;
  ticketTypeName: string;
  qty: number;
  refundCents: number;
  orderId: string;
  supportEmail: string;
}

function formatCents(cents: number) {
  return `€${(cents / 100).toFixed(2)}`;
}

export function RefundNotification({
  customerName,
  eventName,
  ticketTypeName,
  qty,
  refundCents,
  orderId,
  supportEmail,
}: RefundNotificationProps) {
  return (
    <Html>
      <Head />
      <Preview>Your refund for {eventName} — {formatCents(refundCents)}</Preview>
      <Body style={{ backgroundColor: "#f9fafb", fontFamily: "sans-serif" }}>
        <Container style={{ maxWidth: 560, margin: "40px auto", backgroundColor: "#ffffff", borderRadius: 12, overflow: "hidden", border: "1px solid #e5e7eb" }}>
          <Section style={{ backgroundColor: "#1d4ed8", padding: "32px 40px" }}>
            <Heading style={{ color: "#ffffff", margin: 0, fontSize: 22 }}>
              Eventor BG
            </Heading>
          </Section>

          <Section style={{ padding: "40px 40px 32px" }}>
            <Heading as="h2" style={{ fontSize: 20, color: "#111827", marginTop: 0 }}>
              We&apos;re sorry — your order has been refunded
            </Heading>

            <Text style={{ color: "#374151", lineHeight: 1.6 }}>
              Hi {customerName},
            </Text>
            <Text style={{ color: "#374151", lineHeight: 1.6 }}>
              Unfortunately the tickets you ordered are <strong>no longer available</strong>.
              We have issued a full refund to your original payment method.
            </Text>

            {/* Order summary box */}
            <Section style={{ backgroundColor: "#f9fafb", borderRadius: 8, padding: "16px 20px", margin: "24px 0", border: "1px solid #e5e7eb" }}>
              <Row>
                <Column>
                  <Text style={{ margin: "4px 0", fontSize: 13, color: "#6b7280" }}>Order</Text>
                  <Text style={{ margin: "4px 0", fontSize: 14, fontWeight: 600, color: "#111827" }}>
                    #{orderId.slice(-8).toUpperCase()}
                  </Text>
                </Column>
                <Column>
                  <Text style={{ margin: "4px 0", fontSize: 13, color: "#6b7280" }}>Event</Text>
                  <Text style={{ margin: "4px 0", fontSize: 14, fontWeight: 600, color: "#111827" }}>
                    {eventName}
                  </Text>
                </Column>
              </Row>
              <Row style={{ marginTop: 12 }}>
                <Column>
                  <Text style={{ margin: "4px 0", fontSize: 13, color: "#6b7280" }}>Tickets</Text>
                  <Text style={{ margin: "4px 0", fontSize: 14, fontWeight: 600, color: "#111827" }}>
                    {ticketTypeName} × {qty}
                  </Text>
                </Column>
                <Column>
                  <Text style={{ margin: "4px 0", fontSize: 13, color: "#6b7280" }}>Refund amount</Text>
                  <Text style={{ margin: "4px 0", fontSize: 16, fontWeight: 700, color: "#16a34a" }}>
                    {formatCents(refundCents)}
                  </Text>
                </Column>
              </Row>
            </Section>

            <Text style={{ color: "#374151", lineHeight: 1.6 }}>
              The refund typically appears on your card within <strong>5–10 business days</strong>,
              depending on your bank.
            </Text>

            <Hr style={{ borderColor: "#e5e7eb", margin: "24px 0" }} />

            <Text style={{ color: "#6b7280", fontSize: 13, lineHeight: 1.6 }}>
              We apologise for the inconvenience. If you have any questions, reply to this email
              or contact us at{" "}
              <a href={`mailto:${supportEmail}`} style={{ color: "#1d4ed8" }}>
                {supportEmail}
              </a>.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
