import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Text,
    Section,
    Hr,
    Button,
} from "@react-email/components";
import * as React from "react";

interface OrderConfirmationEmailProps {
    orderId: string;
    customerName: string;
    total: number;
}

export const OrderConfirmationEmail = ({
    orderId,
    customerName,
    total,
}: OrderConfirmationEmailProps) => (
    <Html>
        <Head />
        <Preview>Your order #{orderId.slice(-8).toUpperCase()} is confirmed</Preview>
        <Body style={main}>
            <Container style={container}>
                <Section style={header}>
                    <Heading style={brand}>IVY AVENUE</Heading>
                </Section>

                <Text style={paragraph}>Dear {customerName},</Text>
                <Text style={paragraph}>
                    Thank you for your order. We are preparing your faux florals with care and will notify you once they have been shipped.
                </Text>

                <Section style={orderInfo}>
                    <Text style={label}>Order Reference</Text>
                    <Heading as="h2" style={orderIdText}>#{orderId.slice(-8).toUpperCase()}</Heading>

                    <Hr style={hr} />

                    <Text style={label}>Total Paid</Text>
                    <Text style={totalText}>${(total / 100).toFixed(2)}</Text>
                </Section>

                <Text style={paragraph}>
                    If you have any questions, simply reply to this email.
                </Text>

                <Section style={footer}>
                    <Text style={footerText}>Ivy Avenue • Timeless Faux Florals</Text>
                </Section>
            </Container>
        </Body>
    </Html>
);

// Styles
const main = {
    backgroundColor: "#ffffff",
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
};

const container = {
    margin: "0 auto",
    padding: "40px 20px",
    maxWidth: "560px",
};

const header = {
    textAlign: "center" as const,
    marginBottom: "30px",
};

const brand = {
    fontFamily: '"Playfair Display", serif',
    fontSize: "24px",
    letterSpacing: "0.05em",
    color: "#000000",
    textTransform: "uppercase" as const,
};

const paragraph = {
    fontSize: "16px",
    lineHeight: "26px",
    color: "#333333",
    marginBottom: "20px",
};

const orderInfo = {
    backgroundColor: "#f9f9f9",
    padding: "24px",
    borderRadius: "4px",
    margin: "24px 0",
};

const label = {
    fontSize: "12px",
    color: "#666666",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    marginBottom: "4px",
};

const orderIdText = {
    fontSize: "20px",
    margin: "0 0 16px 0",
    color: "#000000",
};

const totalText = {
    fontSize: "24px",
    fontWeight: "bold",
    margin: "0",
    color: "#000000",
};

const hr = {
    borderColor: "#e5e5e5",
    margin: "16px 0",
};

const footer = {
    textAlign: "center" as const,
    marginTop: "40px",
};

const footerText = {
    fontSize: "12px",
    color: "#999999",
};
