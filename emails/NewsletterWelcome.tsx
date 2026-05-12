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

interface NewsletterWelcomeEmailProps {
  firstName?: string;
}

export const NewsletterWelcomeEmail = ({
  firstName,
}: NewsletterWelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to the Script Worldview Newsletter!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={heading}>Script Worldview Foundation</Heading>
        </Section>
        <Section style={content}>
          <Text style={paragraph}>Hello {firstName || 'there'},</Text>
          <Text style={paragraph}>
            Welcome to the Script Worldview Foundation newsletter! We're thrilled to have you as part of our community.
          </Text>
          <Text style={paragraph}>
            By subscribing, you'll receive regular updates on our education programs, humanitarian efforts, and community development projects. We'll also share inspiring stories of transformation from the field.
          </Text>
          <Text style={paragraph}>
            You can manage your preferences or unsubscribe at any time using the link in the footer below.
          </Text>
          <Section style={btnContainer}>
            <Link style={button} href="https://scriptworldviewfoundation.org/blog">
              Read Our Latest Stories
            </Link>
          </Section>
          <Text style={paragraph}>
            Thank you for joining us in our mission to shape minds and transform communities.
          </Text>
          <Text style={paragraph}>
            Warmly,<br />
            The Script Worldview Team
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            Script Worldview Foundation<br />
            Lagos, Nigeria<br />
            <Link href="https://scriptworldviewfoundation.org/newsletter/unsubscribe" style={link}>Unsubscribe</Link>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default NewsletterWelcomeEmail;

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
  backgroundColor: '#1A3A5C',
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

const link = {
  color: '#5D6D7E',
  textDecoration: 'underline',
};
