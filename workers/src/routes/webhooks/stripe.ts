import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from '../../../../lib/db/schema';
import { eq } from 'drizzle-orm';
import { sendEmail } from '../../utils/email';
import { getDonationReceiptHtml } from '../../utils/email-templates';

import { Env } from '../../types';

const stripeWebhook = new Hono<{ Bindings: Env }>();

stripeWebhook.post('/', async (c) => {
  const signature = c.req.header('stripe-signature');
  if (!signature) return c.json({ ok: false }, 401);

  const body = await c.req.text();
  const webhookSecret = c.env.STRIPE_WEBHOOK_SECRET;

  // Manual Stripe Signature Verification
  try {
    const parts = signature.split(',');
    const timestampPart = parts.find((p) => p.startsWith('t='));
    const signaturePart = parts.find((p) => p.startsWith('v1='));
    
    if (!timestampPart || !signaturePart) throw new Error('Invalid signature format');
    
    const timestamp = timestampPart.split('=')[1];
    const sig = signaturePart.split('=')[1];
    
    const signedPayload = `${timestamp}.${body}`;
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(webhookSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign', 'verify']
    );
    
    const hmac = await crypto.subtle.sign('HMAC', key, encoder.encode(signedPayload));
    const expectedSig = Array.from(new Uint8Array(hmac))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    if (expectedSig !== sig) {
      return c.json({ ok: false }, 401);
    }
  } catch (err) {
    console.error('Stripe signature verification failed:', err);
    return c.json({ ok: false }, 401);
  }

  const event = JSON.parse(body);
  const db = drizzle(c.env.DB);

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const donationId = paymentIntent.metadata.donationId;

    if (donationId) {
      const result = await db.update(schema.donations)
        .set({ 
          status: 'completed',
          updatedAt: new Date()
        })
        .where(eq(schema.donations.id, donationId))
        .returning();

      if (result.length > 0) {
        const donation = result[0];
        
        const receiptHtml = getDonationReceiptHtml(donation.donorName, donation.amount, donation.currency, donation.id);
        await sendEmail(c.env, {
          to: donation.donorEmail,
          subject: 'Thank You for Your Donation - Script Worldview Foundation',
          html: receiptHtml,
        });
      }
    }
  }

  return c.json({ ok: true });
});

export default stripeWebhook;
