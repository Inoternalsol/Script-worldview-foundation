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

interface CareerAcknowledgmentProps {
  name: string;
  jobTitle: string;
}

export default function CareerAcknowledgment({
  name = 'Applicant',
  jobTitle = 'Senior Program Coordinator',
}: CareerAcknowledgmentProps) {
  return (
    <Html>
      <Head />
      <Preview>Application Received: {jobTitle}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Script Worldview Foundation</Heading>
          <Text style={text}>Dear {name},</Text>
          <Text style={text}>
            Thank you for applying for the <strong>{jobTitle}</strong> position at Script Worldview Foundation. We have successfully received your CV and application materials.
          </Text>

          <Section style={card}>
            <Heading style={h2}>What Happens Next?</Heading>
            <Text style={details}>
              • Our HR and department heads will review your credentials against the role requirements.<br />
              • Shortlisted candidates will be contacted within 2 business weeks to schedule an initial interview.<br />
              • We appreciate your enthusiasm for joining our mission to shape minds and transform communities.
            </Text>
          </Section>

          <Hr style={hr} />
          <Text style={footer}>
            Script Worldview Foundation — HR & Talent Acquisition Division.<br />
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
