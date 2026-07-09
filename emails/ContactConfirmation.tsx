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

interface ContactConfirmationEmailProps {
  name: string;
}

export const ContactConfirmationEmail = ({
  name = 'Valued Supporter',
}: ContactConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>We received your message - Script Worldview Foundation</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={heading}>Script Worldview Foundation</Heading>
        </Section>
        <Section style={content}>
          <Text style={paragraph}>Hello {name},</Text>
          <Text style={paragraph}>
            Thank you for reaching out to Script Worldview Foundation. We have received your message and our team is currently reviewing it.
          </Text>
          <Text style={paragraph}>
            You can expect a response from the relevant department within 2 business days.
          </Text>
          <Text style={paragraph}>
            In the meantime, feel free to explore our latest programs and impact stories on our website.
          </Text>
          <Section style={btnContainer}>
            <Link style={button} href="https://scriptworldview.org/programs">
              Explore Our Programs
            </Link>
          </Section>
          <Text style={paragraph}>
            Best regards,<br />
            The Script Worldview Team
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            Script Worldview Foundation<br />
            Shaping Minds. Transforming Communities.<br />
            Lagos, Nigeria
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default ContactConfirmationEmail;

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
