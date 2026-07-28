export type Env = {
  DB: D1Database;
  ENVIRONMENT: string;
  PAYSTACK_SECRET_KEY: string;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  FRONTEND_URL: string;
  RESEND_API_KEY: string;
  EMAIL_FROM: string;
  JWT_SECRET: string;
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
  RATE_LIMITER_KV: KVNamespace;
};
