import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from '../../db/schema';
import { eq } from 'drizzle-orm';
import { sendEmail } from '../../utils/email';
import { getDonationReceiptHtml } from '../../utils/email-templates';

import { Env } from '../../types';

const paystackWebhook = new Hono<{ Bindings: Env }>();

paystackWebhook.post('/', async (c) => {
  const signature = c.req.header('x-paystack-signature');
  if (!signature) return c.json({ ok: false }, 401);

  const body = await c.req.text();
  
  // Verify signature
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(c.env.PAYSTACK_SECRET_KEY),
    { name: 'HMAC', hash: 'SHA-512' },
    false,
    ['sign', 'verify']
  );
  
  const hmac = await crypto.subtle.sign('HMAC', key, encoder.encode(body));
  const hexSignature = Array.from(new Uint8Array(hmac))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  if (hexSignature !== signature) {
    return c.json({ ok: false }, 401);
  }

  const event = JSON.parse(body);
  const db = drizzle(c.env.DB);

  if (event.event === 'charge.success') {
    const data = event.data;
    const reference = data.reference;

    // Update donation status
    const result = await db.update(schema.donations)
      .set({ 
        status: 'completed',
        updatedAt: new Date()
      })
      .where(eq(schema.donations.id, reference))
      .returning();

    if (result.length > 0) {
      const donation = result[0];
      
      // Trigger receipt email
      const receiptHtml = getDonationReceiptHtml(donation.donorName, donation.amount, donation.currency, donation.id);
      await sendEmail(c.env, {
        to: donation.donorEmail,
        subject: 'Thank You for Your Donation - Script Worldview Foundation',
        html: receiptHtml,
      });
    }
  }

  return c.json({ ok: true });
});

export default paystackWebhook;
