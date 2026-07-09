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

interface NewBlogPostProps {
  articleTitle: string;
  articleExcerpt: string;
  articleUrl: string;
}

export default function NewBlogPost({
  articleTitle = 'Rebuilding Communities: Lessons from Flood Interventions',
  articleExcerpt = 'In our latest field report, we explore community resilience models and rapid humanitarian response frameworks deployed in Shiroro.',
  articleUrl = 'https://scriptworldview.org/blog/rebuilding-communities-lessons',
}: NewBlogPostProps) {
  return (
    <Html>
      <Head />
      <Preview>Read Our Latest Article: {articleTitle}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Script Worldview Foundation</Heading>
          <Text style={text}>Hello valued supporter,</Text>
          <Text style={text}>
            We have just published a new article on our official platform! Dive in to read about our field findings and community milestones.
          </Text>

          <Section style={card}>
            <Heading style={h2}>{articleTitle}</Heading>
            <Text style={details}>{articleExcerpt}</Text>
          </Section>

          <Button style={btn} href={articleUrl}>
            Read the Full Article
          </Button>

          <Hr style={hr} />
          <Text style={footer}>
            You received this because you are subscribed to Script Worldview Foundation alerts.<br />
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
  color: '#5d6d7e',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '4px 0',
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
