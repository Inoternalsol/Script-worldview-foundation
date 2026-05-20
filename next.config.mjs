/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatar.vercel.sh',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://api.paystack.co; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' blob: data: https://avatar.vercel.sh https://images.unsplash.com https://api.paystack.co; font-src 'self' data: https://fonts.gstatic.com; frame-src 'self' https://js.stripe.com; connect-src 'self' http://localhost:3000 http://localhost:8787 http://localhost:8788 https://api.paystack.co https://api.stripe.com https://api.scriptworldviewfoundation.org http://127.0.0.1:8788 http://127.0.0.1:8787;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
