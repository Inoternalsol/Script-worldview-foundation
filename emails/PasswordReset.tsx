import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Hr,
} from '@react-email/components';
import * as React from 'react';

interface PasswordResetProps {
  name: string;
  resetUrl: string;
}

export default function PasswordReset({
  name = 'Staff Member',
  resetUrl = 'https://scriptworldviewfoundation.org/admin/reset-password?token=mock_token_123',
}: PasswordResetProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset Your Admin Password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Script Worldview Foundation</Heading>
          <Text style={text}>Hello {name},</Text>
          <Text style={text}>
            We received a request to reset the password for your Script Worldview Foundation administration account. Click the button below to configure your new secure credentials:
          </Text>

          <Button style={btn} href={resetUrl}>
            Reset Account Password
          </Button>

          <Text style={textSec}>
            Note: This link is secure and will expire in 15 minutes. If you did not initiate this request, please disregard this email.
          </Text>

          <Hr style={hr} />
          <Text style={footer}>
            Script Worldview Foundation — Identity & Credentials Division.<br />
            Lagos, Nigeria.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#f9fafb',
  fontFamily: 'Inter, sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  padding: '40px 20px',
  maxWidth: '560px',
  margin: '40px auto',
  borderRadius: '8px',
  border: '1px solid #e5e7eb',
};

const h1 = {
  color: '#1a3a5c',
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  marginBottom: '30px',
};

const text = {
  color: '#1c2833',
  fontSize: '16px',
  lineHeight: '24px',
  marginBottom: '20px',
};

const textSec = {
  color: '#5d6d7e',
  fontSize: '13px',
  lineHeight: '18px',
  marginTop: '25px',
};

const btn = {
  backgroundColor: '#e65100',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '210px',
  padding: '12px 0',
  margin: '20px auto 0 auto',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '30px 0',
};

const footer = {
  color: '#5d6d7e',
  fontSize: '12px',
  textAlign: 'center' as const,
  lineHeight: '18px',
};
