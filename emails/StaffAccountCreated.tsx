import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Button,
  Hr,
} from '@react-email/components';
import * as React from 'react';

interface StaffAccountCreatedProps {
  name: string;
  role: string;
  loginUrl: string;
}

export default function StaffAccountCreated({
  name = 'Staff Member',
  role = 'content_editor',
  loginUrl = 'https://scriptworldview.org/admin/login',
}: StaffAccountCreatedProps) {
  return (
    <Html>
      <Head />
      <Preview>Your Staff Account is Created</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Script Worldview Foundation</Heading>
          <Text style={text}>Hello {name},</Text>
          <Text style={text}>
            An administrator has successfully created a corporate staff account for you on the Script Worldview Foundation digital CMS platform.
          </Text>

          <Section style={card}>
            <Heading style={h2}>Account Profile Details</Heading>
            <Text style={details}>
              <strong>Role Assignment:</strong> {role}<br />
              <strong>Login Endpoint:</strong> {loginUrl}<br />
              <strong>Initial Setup:</strong> Click the button below to sign in and immediately configure your secure account credentials.
            </Text>
          </Section>

          <Button style={btn} href={loginUrl}>
            Sign In to Dashboard
          </Button>

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

const h2 = {
  color: '#1a3a5c',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 12px 0',
};

const text = {
  color: '#1c2833',
  fontSize: '16px',
  lineHeight: '24px',
  marginBottom: '20px',
};

const card = {
  padding: '20px',
  backgroundColor: '#f3f4f6',
  borderRadius: '8px',
  marginBottom: '25px',
};

const details = {
  color: '#1c2833',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '4px 0',
};

const btn = {
  backgroundColor: '#1a3a5c',
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
