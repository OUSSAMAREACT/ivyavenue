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
    Button,
    Tailwind,
} from '@react-email/components';

interface ResetPasswordEmailProps {
    resetLink: string;
    userName?: string;
}

export const ResetPasswordEmail = ({
    resetLink = 'https://ivyavenue.com/new-password?token=123',
    userName = 'Valued Customer',
}: ResetPasswordEmailProps) => {
    const previewText = `Reset your Ivy Avenue password`;

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
                            Hello {userName},
                        </Text>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Someone requested a password reset for your Ivy Avenue account. If this was you, click the button below to set a new password.
                        </Text>
                        <Section className="text-center my-[32px]">
                            <Button
                                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                                href={resetLink}
                            >
                                Reset Password
                            </Button>
                        </Section>
                        <Text className="text-black text-[14px] leading-[24px]">
                            If you didn't ask for this, you can safely ignore this email.
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

export default ResetPasswordEmail;
