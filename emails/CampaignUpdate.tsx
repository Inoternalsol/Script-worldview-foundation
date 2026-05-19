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

interface CampaignUpdateProps {
  campaignTitle: string;
  milestonePercentage: number;
  updateMessage: string;
}

export default function CampaignUpdate({
  campaignTitle = 'Primary Literacy Drive',
  milestonePercentage = 75,
  updateMessage = 'Thanks to your immense generosity, we have successfully reached 75% of our fundraising target! We are now equipping 12 additional schools with libraries.',
}: CampaignUpdateProps) {
  return (
    <Html>
      <Head />
      <Preview>{`Milestone Reached! ${campaignTitle} is ${milestonePercentage}% funded!`}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Script Worldview Foundation</Heading>
          <Text style={text}>Hello Supporter,</Text>
          <Text style={text}>
            We have a thrilling milestone update to share regarding the <strong>{campaignTitle}</strong> campaign that you so generously supported!
          </Text>

          <Section style={card}>
            <Heading style={h2}>{`${milestonePercentage}% Milestone Reached!`}</Heading>

            <Text style={details}>{updateMessage}</Text>
          </Section>

          <Hr style={hr} />
          <Text style={footer}>
            Script Worldview Foundation — Faith-Inspired Community Transformation.<br />
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
  color: '#2e7d32',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
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
