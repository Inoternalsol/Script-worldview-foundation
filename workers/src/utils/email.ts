type SendEmailOptions = {
  to: string | string[]
  subject: string
  html: string
  from?: string
  replyTo?: string
}

/**
 * Sends an email using the Resend API via fetch.
 * This is designed to run in Cloudflare Workers.
 */
export async function sendEmail(env: { RESEND_API_KEY: string; EMAIL_FROM: string }, options: SendEmailOptions) {
  const { to, subject, html, from, replyTo } = options

  if (!env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set')
    return { success: false, error: 'Email service not configured' }
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: from || env.EMAIL_FROM || 'Script Worldview Foundation <noreply@scriptworldview.org>',
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        reply_to: replyTo,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Resend API error:', error)
      return { success: false, error }
    }

    const data = await response.json()
    return { success: true, data }
  } catch (err) {
    console.error('Failed to send email:', err)
    return { success: false, error: String(err) }
  }
}
