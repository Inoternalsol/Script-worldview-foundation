import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.warn('STRIPE_SECRET_KEY is missing from environment variables');
}

export const stripe = new Stripe(stripeSecretKey || '', {
  apiVersion: '2025-01-27.acacia' as any, // Using latest stable version
  typescript: true,
});

export const stripeUtils = {
  /**
   * Create a payment intent for a single donation
   */
  async createPaymentIntent(data: {
    amount: number; // in cents (e.g., 5000 = $50.00)
    currency: string;
    email: string;
    metadata?: any;
  }) {
    return stripe.paymentIntents.create({
      amount: data.amount,
      currency: data.currency,
      receipt_email: data.email,
      metadata: data.metadata,
    });
  },

  /**
   * Create or retrieve a customer
   */
  async getOrCreateCustomer(email: string, name?: string) {
    const customers = await stripe.customers.list({ email });
    if (customers.data.length > 0) {
      return customers.data[0];
    }
    return stripe.customers.create({
      email,
      name,
    });
  },

  /**
   * Create a subscription for recurring donations
   */
  async createSubscription(data: {
    customerId: string;
    priceId: string;
    metadata?: any;
  }) {
    return stripe.subscriptions.create({
      customer: data.customerId,
      items: [{ price: data.priceId }],
      metadata: data.metadata,
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });
  },
};
