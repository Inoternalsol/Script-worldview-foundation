import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { authRoutes } from './routes/auth'
import { blogRoutes } from './routes/blog'
import { eventsRoutes } from './routes/events'
import { programsRoutes } from './routes/programs'
import { pagesRoutes } from './routes/pages'
import { contactRoutes } from './routes/contacts'
import { volunteerRoutes } from './routes/volunteers'
import { newsletterRoutes } from './routes/newsletter'
import { careerRoutes } from './routes/careers'
import donationRoutes from './routes/donations'
import { campaignsRoutes } from './routes/campaigns'
import paystackWebhook from './routes/webhooks/paystack'
import { adminRoutes } from './routes/admin'
import { settingsRoutes } from './routes/settings'
import { teamRoutes } from './routes/team'
import { transparencyRoutes } from './routes/transparency'
import { revisionRoutes } from './routes/revisions'
import { backupRoutes } from './routes/backups'
import stripeWebhook from './routes/webhooks/stripe'
import { Env } from './types'

const app = new Hono<{ Bindings: Env }>()

app.use(
  '*',
  cors({
    origin: (origin) => {
      return origin || '*'
    },
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    allowHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
      'Access-Control-Request-Method',
      'Access-Control-Request-Headers',
      'Cache-Control',
      'Pragma',
    ],
    exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
    maxAge: 86400,
    credentials: true,
  }),
)

app.options('*', (c) => {
  return c.body(null, 204)
})

app.notFound((c) => {
  const origin = c.req.header('Origin') || '*'
  return c.json(
    { error: 'Not Found: Route does not exist on Worker API' },
    404,
    {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept, Origin',
    }
  )
})

app.onError((err, c) => {
  console.error(`Error on ${c.req.method} ${c.req.url}:`, err)
  const origin = c.req.header('Origin') || '*'
  return c.json(
    { error: err.message || 'Internal Server Error' },
    500,
    {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept, Origin',
    }
  )
})

app.get('/health', (c) => c.json({ ok: true }))

app.route('/api/auth', authRoutes)
app.route('/api/blog', blogRoutes)
app.route('/api/events', eventsRoutes)
app.route('/api/programs', programsRoutes)
app.route('/api/pages', pagesRoutes)
app.route('/api/contacts', contactRoutes)
app.route('/api/volunteers', volunteerRoutes)
app.route('/api/newsletter', newsletterRoutes)
app.route('/api/careers', careerRoutes)
app.route('/api/donations', donationRoutes)
app.route('/api/campaigns', campaignsRoutes)
app.route('/api/team', teamRoutes)
app.route('/api/admin/team', teamRoutes)
app.route('/api/transparency', transparencyRoutes)
app.route('/api/admin/transparency', transparencyRoutes)
app.route('/api/admin/revisions', revisionRoutes)
app.route('/api/admin/backups', backupRoutes)
app.route('/api/admin/pages', pagesRoutes)
app.route('/api/admin/settings', settingsRoutes)
app.route('/api/admin', adminRoutes)
app.route('/api/settings', settingsRoutes)
app.route('/api/webhooks/paystack', paystackWebhook)
app.route('/api/webhooks/stripe', stripeWebhook)

export default app


