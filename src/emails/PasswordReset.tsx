import {
  Html, Head, Body, Container, Section,
  Heading, Text, Button, Hr, Preview,
} from "@react-email/components";

interface PasswordResetEmailProps {
  name: string;
  resetUrl: string;
}

export function PasswordResetEmail({ name, resetUrl }: PasswordResetEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your Eventor BG password</Preview>
      <Body style={{ backgroundColor: "#f9fafb", fontFamily: "sans-serif" }}>
        <Container style={{ maxWidth: 560, margin: "40px auto", backgroundColor: "#ffffff", borderRadius: 12, overflow: "hidden", border: "1px solid #e5e7eb" }}>
          <Section style={{ backgroundColor: "#1d4ed8", padding: "32px 40px" }}>
            <Heading style={{ color: "#ffffff", margin: 0, fontSize: 22 }}>
              Eventor BG
            </Heading>
          </Section>
          <Section style={{ padding: "40px 40px 32px" }}>
            <Heading as="h2" style={{ fontSize: 20, color: "#111827", marginTop: 0 }}>
              Reset your password
            </Heading>
            <Text style={{ color: "#374151", lineHeight: 1.6 }}>
              Hi {name},
            </Text>
            <Text style={{ color: "#374151", lineHeight: 1.6 }}>
              We received a request to reset the password for your Eventor BG account.
              Click the button below to choose a new password. This link expires in <strong>1 hour</strong>.
            </Text>
            <Button
              href={resetUrl}
              style={{
                backgroundColor: "#1d4ed8",
                color: "#ffffff",
                padding: "14px 28px",
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 15,
                textDecoration: "none",
                display: "inline-block",
                margin: "8px 0 24px",
              }}
            >
              Reset password →
            </Button>
            <Text style={{ color: "#6b7280", fontSize: 13, lineHeight: 1.6 }}>
              If the button doesn&apos;t work, copy and paste this link into your browser:
            </Text>
            <Text style={{ color: "#1d4ed8", fontSize: 12, wordBreak: "break-all" }}>
              {resetUrl}
            </Text>
            <Hr style={{ borderColor: "#e5e7eb", margin: "24px 0" }} />
            <Text style={{ color: "#9ca3af", fontSize: 12 }}>
              If you didn&apos;t request a password reset, you can safely ignore this email —
              your password will not change.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
