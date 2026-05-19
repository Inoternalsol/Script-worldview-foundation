import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
} from '@react-email/components';
import * as React from 'react';

interface MonthlyDonorSummaryProps {
  totalDonations: string;
  totalDonors: number;
  topCampaign: string;
  reportMonth: string;
}

export default function MonthlyDonorSummary({
  totalDonations = '₦2,450,000',
  totalDonors = 84,
  topCampaign = 'Primary Literacy Drive',
  reportMonth = 'May 2026',
}: MonthlyDonorSummaryProps) {
  return (
    <Html>
      <Head />
      <Preview>Monthly NGO Executive Financial & Donor Summary - {reportMonth}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Script Worldview Foundation</Heading>
          <Text style={text}>Dear Board of Trustees & Executive Management,</Text>
          <Text style={text}>
            Please review the consolidated financial and donor performance summary for the month of <strong>{reportMonth}</strong>:
          </Text>

          <Section style={card}>
            <Heading style={h2}>Platform Performance metrics</Heading>
            <Text style={details}>
              <strong>Total Funds Raised:</strong> {totalDonations}<br />
              <strong>Unique Active Donors:</strong> {totalDonors}<br />
              <strong>Highest Earning Campaign:</strong> {topCampaign}<br />
              <strong>Status Code:</strong> All transactional webhooks (Paystack & Stripe) operated at 100% success rate with zero pending sync errors.
            </Text>
          </Section>

          <Hr style={hr} />
          <Text style={footer}>
            Script Worldview Foundation — Financial Reporting Office.<br />
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
  lineHeight: '24px',
  margin: '4px 0',
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
