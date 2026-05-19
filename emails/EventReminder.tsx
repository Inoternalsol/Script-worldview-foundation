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

interface EventReminderProps {
  name: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
}

export default function EventReminder({
  name = 'Guest',
  eventTitle = 'Primary Literacy Drive Kickoff',
  eventDate = 'August 30, 2026',
  eventLocation = 'Lagos Headquarters & Virtual Stream',
}: EventReminderProps) {
  return (
    <Html>
      <Head />
      <Preview>Reminder: {eventTitle} is in 48 hours!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Script Worldview Foundation</Heading>
          <Text style={text}>Hello {name},</Text>
          <Text style={text}>
            This is a friendly 48-hour reminder that the following upcoming event you registered for is just around the corner:
          </Text>

          <Section style={card}>
            <Heading style={h2}>{eventTitle}</Heading>
            <Text style={details}>
              <strong>Date:</strong> {eventDate}
            </Text>
            <Text style={details}>
              <strong>Venue:</strong> {eventLocation}
            </Text>
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
  color: '#1a3a5c',
  fontSize: '18px',
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
  color: '#5d6d7e',
  fontSize: '14px',
  lineHeight: '20px',
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
