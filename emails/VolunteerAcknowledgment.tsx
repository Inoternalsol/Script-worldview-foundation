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

interface VolunteerAcknowledgmentEmailProps {
  name: string;
}

export const VolunteerAcknowledgmentEmail = ({
  name = 'Valued Volunteer',
}: VolunteerAcknowledgmentEmailProps) => (
  <Html>
    <Head />
    <Preview>Your Volunteer Application - Script Worldview Foundation</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={heading}>Script Worldview Foundation</Heading>
        </Section>
        <Section style={content}>
          <Text style={paragraph}>Hello {name},</Text>
          <Text style={paragraph}>
            Thank you for applying to volunteer with Script Worldview Foundation. We are inspired by your desire to contribute to our mission of shaping minds and transforming communities.
          </Text>
          <Text style={paragraph}>
            Our HR team is currently reviewing your application and skills. We will get in touch with you shortly to discuss potential opportunities that align with your profile.
          </Text>
          <Text style={paragraph}>
            In the meantime, you can follow us on social media to stay updated on our latest activities.
          </Text>
          <Section style={btnContainer}>
            <Link style={button} href="https://scriptworldview.org/about">
              Learn More About Us
            </Link>
          </Section>
          <Text style={paragraph}>
            Thank you for your patience and your heart for service.
          </Text>
          <Text style={paragraph}>
            Best regards,<br />
            The HR Team, Script Worldview Foundation
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            Script Worldview Foundation<br />
            Lagos, Nigeria
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default VolunteerAcknowledgmentEmail;

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

const btnContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#2E7D32',
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
