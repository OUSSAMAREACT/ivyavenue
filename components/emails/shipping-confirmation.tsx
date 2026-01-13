import * as React from 'react';
import {
    Html,
    Body,
    Head,
    Heading,
    Hr,
    Container,
    Preview,
    Section,
    Text,
    Tailwind,
    Link,
} from '@react-email/components';

interface ShippingConfirmationEmailProps {
    orderId: string;
    customerName: string;
    carrier: string;
    trackingNumber: string;
}

export const ShippingConfirmationEmail = ({
    orderId = '123456',
    customerName = 'Valued Customer',
    carrier = 'DHL',
    trackingNumber = '1234567890',
}: ShippingConfirmationEmailProps) => {
    const previewText = `Your order #${orderId.slice(-8)} has shipped!`;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className="bg-white my-auto mx-auto font-serif">
                    <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
                        <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0 tracking-tight">
                            IVY AVENUE
                        </Heading>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Hello {customerName},
                        </Text>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Great news! Your order has been dispatched and is on its way to you.
                        </Text>
                        <Section className="bg-[#f9f9f9] p-[20px] rounded my-[20px]">
                            <Text className="text-black text-[14px] leading-[24px] m-0 font-bold">
                                Order #{orderId.slice(-8).toUpperCase()}
                            </Text>
                            <Hr className="border border-solid border-[#eee] my-[10px] mx-0 w-full" />
                            <Text className="text-[#666666] text-[12px] leading-[24px] m-0 mt-[8px]">
                                Carrier: <span className="text-black font-medium">{carrier}</span>
                            </Text>
                            <Text className="text-[#666666] text-[12px] leading-[24px] m-0">
                                Tracking Number: <span className="text-black font-medium">{trackingNumber}</span>
                            </Text>
                        </Section>
                        <Text className="text-black text-[14px] leading-[24px]">
                            You can track your package using the link below (if applicable) or by visiting the carrier's website.
                        </Text>
                        {/* Placeholder for actual tracking link logic if we had carrier URLs */}
                        <Text className="text-black text-[14px] leading-[24px]">
                            We hope you enjoy your stems!
                        </Text>
                        <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
                        <Text className="text-[#666666] text-[12px] leading-[24px] text-center">
                            Ivy Avenue • Handcrafted Faux Florals
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default ShippingConfirmationEmail;
