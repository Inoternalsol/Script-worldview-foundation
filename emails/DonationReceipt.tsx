import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface DonationReceiptEmailProps {
  donorName: string;
  amount: string;
  currency: string;
  donationId: string;
}

export const DonationReceiptEmail = ({
  donorName = 'Valued Supporter',
  amount = '0',
  currency = 'USD',
  donationId = 'REF-123',
}: DonationReceiptEmailProps) => (
  <Html>
    <Head />
    <Preview>Receipt for your donation to Script Worldview Foundation</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={heading}>Script Worldview Foundation</Heading>
        </Section>
        <Section style={content}>
          <Text style={paragraph}>Dear {donorName},</Text>
          <Text style={paragraph}>
            Thank you for your generous donation of <strong>{currency} {amount}</strong> to Script Worldview Foundation.
          </Text>
          <Text style={paragraph}>
            Your contribution plays a vital role in our mission to shape minds and transform communities through education and humanitarian initiatives.
          </Text>
          
          <Section style={receiptBox}>
            <Text style={receiptTitle}>Donation Receipt</Text>
            <Text style={receiptDetail}><strong>Transaction ID:</strong> {donationId}</Text>
            <Text style={receiptDetail}><strong>Amount:</strong> {currency} {amount}</Text>
            <Text style={receiptDetail}><strong>Date:</strong> {new Date().toLocaleDateString()}</Text>
          </Section>

          <Text style={paragraph}>
            We are deeply grateful for your partnership. Together, we are making a lasting impact.
          </Text>
          <Section style={btnContainer}>
            <Link style={button} href="https://scriptworldviewfoundation.org/impact">
              View Our Impact Stories
            </Link>
          </Section>
          <Text style={paragraph}>
            With gratitude,<br />
            The Script Worldview Team
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            Script Worldview Foundation<br />
            Lagos, Nigeria<br />
            A registered non-profit organization.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default DonationReceiptEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const header = {
  padding: '32px',
  backgroundColor: '#1A3A5C',
  textAlign: 'center' as const,
};

const heading = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0',
};

const content = {
  padding: '40px 32px',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#1C2833',
};

const receiptBox = {
  padding: '24px',
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  border: '1px solid #e5e7eb',
  margin: '24px 0',
};

const receiptTitle = {
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 16px',
  color: '#1A3A5C',
};

const receiptDetail = {
  fontSize: '14px',
  margin: '4px 0',
  color: '#4B5563',
};

const btnContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#E65100',
  borderRadius: '4px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
  fontWeight: 'bold',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const footer = {
  color: '#5D6D7E',
  fontSize: '12px',
  lineHeight: '22px',
  textAlign: 'center' as const,
};
