import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from '../../../lib/db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { authMiddleware, requireRole } from '../middleware/auth';

import { Env } from '../types';

import { rateLimit } from '../middleware/rateLimit';

const donations = new Hono<{ Bindings: Env }>();

const initializeDonationSchema = z.object({
  amount: z.number().positive(),
  currency: z.enum(['NGN', 'USD', 'GBP', 'EUR']),
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  type: z.enum(['one-time', 'monthly']),
  campaignId: z.string().optional(),
  isAnonymous: z.boolean().default(false),
  paymentGateway: z.enum(['paystack', 'stripe']),
});

// Initialize a donation
donations.post('/', rateLimit({ windowMs: 600000, maxRequests: 10, endpointLabel: 'donation initialization' }), zValidator('json', initializeDonationSchema), async (c) => {
  const db = drizzle(c.env.DB);
  const data = c.req.valid('json');
  const donationId = nanoid();

  try {
    // 1. Record the pending donation in D1
    await db.insert(schema.donations).values({
      id: donationId,
      amount: Math.round(data.amount),
      currency: data.currency,
      donorEmail: data.email,
      donorName: `${data.firstName} ${data.lastName}`,
      donorPhone: data.phone,
      status: 'pending',
      campaignId: data.campaignId || null,
      anonymous: data.isAnonymous,
      paymentRef: donationId, // Use our own ID as initial ref
      gateway: data.paymentGateway,
    });

    // 2. Interface with the payment gateway
    if (data.paymentGateway === 'paystack') {
      // Paystack expects amount in Kobo
      const amountKobo = Math.round(data.amount * 100);
      
      const response = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${c.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          amount: amountKobo,
          reference: donationId,
          callback_url: `${c.env.FRONTEND_URL}/donate/verify`,
          metadata: {
            donationId,
            donorName: `${data.firstName} ${data.lastName}`,
          },
        }),
      });

      const result: any = await response.json();
      if (!result.status) {
        throw new Error(result.message || 'Paystack initialization failed');
      }

      return c.json({
        ok: true,
        donationId,
        paymentData: {
          authorization_url: result.data.authorization_url,
          reference: result.data.reference,
        },
      });
    } else {
      // Stripe implementation (simplified for worker)
      // For Stripe, we usually create a PaymentIntent and return the client secret
      // Stripe's Node library might not work in Worker, so we use fetch
      const amountCents = Math.round(data.amount * 100);
      
      const stripeResponse = await fetch('https://api.stripe.com/v1/payment_intents', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${c.env.STRIPE_SECRET_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          amount: amountCents.toString(),
          currency: data.currency.toLowerCase(),
          'metadata[donationId]': donationId,
          'metadata[donorName]': `${data.firstName} ${data.lastName}`,
          receipt_email: data.email,
        }).toString(),
      });

      const stripeResult: any = await stripeResponse.json();
      if (stripeResult.error) {
        throw new Error(stripeResult.error.message || 'Stripe initialization failed');
      }

      return c.json({
        ok: true,
        donationId,
        paymentData: {
          clientSecret: stripeResult.client_secret,
        },
      });
    }
  } catch (error: any) {
    console.error('Donation initialization error:', error);
    return c.json({ ok: false, error: error.message }, 500);
  }
});

// Admin: Get all donations (excluding soft-deleted)
donations.get('/', authMiddleware, requireRole(['super_admin', 'dept_admin']), async (c) => {
  const db = drizzle(c.env.DB);
  const result = await db.select()
    .from(schema.donations)
    .where(isNull(schema.donations.deletedAt))
    .orderBy(schema.donations.createdAt);
  return c.json({ ok: true, data: result });
});

// Admin: DELETE a donation (soft-delete)
donations.delete('/:id', authMiddleware, requireRole(['super_admin', 'dept_admin']), async (c) => {
  const id = c.req.param('id') || '';
  const db = drizzle(c.env.DB);
  
  const result = await db.update(schema.donations)
    .set({
      deletedAt: new Date(),
      updatedAt: new Date()
    })
    .where(and(eq(schema.donations.id, id), isNull(schema.donations.deletedAt)))
    .returning();

  if (!result.length) {
    return c.json({ error: 'Donation not found or already deleted' }, 404);
  }

  return c.json({ ok: true, data: result[0] });
});

export default donations;
