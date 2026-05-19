/**
 * Utility functions for generating beautiful, responsive HTML email templates
 * designed to match Script Worldview Foundation HSL branding and theme.
 */

interface EmailTemplateProps {
  title: string
  previewText: string
  contentHtml: string
}

/**
 * Standard Email Wrapper Template providing consistent high-end header, body container, HSL palette styling,
 * typography, button accents, horizontal rules, and a clean professional footer.
 */
function wrapEmailTemplate(props: EmailTemplateProps): string {
  const { title, previewText, contentHtml } = props

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      background-color: #f6f9fc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    .wrapper {
      width: 100%;
      background-color: #f6f9fc;
      padding: 40px 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }
    .header {
      background-color: #1A3A5C;
      padding: 32px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      font-size: 24px;
      font-weight: 700;
      margin: 0;
      letter-spacing: 0.5px;
    }
    .content {
      padding: 40px 32px;
      color: #1C2833;
    }
    .paragraph {
      font-size: 16px;
      line-height: 26px;
      color: #1C2833;
      margin: 0 0 16px;
    }
    .btn-container {
      text-align: center;
      margin: 32px 0;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      font-size: 16px;
      font-weight: bold;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 4px;
      transition: background-color 0.2s ease;
    }
    .button-primary {
      background-color: #E65100;
    }
    .button-primary:hover {
      background-color: #BF360C;
    }
    .button-success {
      background-color: #2E7D32;
    }
    .button-success:hover {
      background-color: #1B5E20;
    }
    .receipt-box {
      padding: 24px;
      background-color: #f9fafb;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
      margin: 24px 0;
    }
    .receipt-title {
      font-size: 18px;
      font-weight: bold;
      margin: 0 0 16px;
      color: #1A3A5C;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 8px;
    }
    .receipt-detail {
      font-size: 14px;
      margin: 6px 0;
      color: #4B5563;
    }
    .receipt-detail strong {
      color: #1C2833;
    }
    .hr {
      border: 0;
      border-top: 1px solid #e6ebf1;
      margin: 24px 0;
    }
    .footer {
      color: #5D6D7E;
      font-size: 12px;
      line-height: 22px;
      text-align: center;
      margin-top: 24px;
    }
    .footer-highlight {
      font-weight: 600;
      color: #1A3A5C;
    }
  </style>
</head>
<body>
  <!-- Hidden preheader text for screen readers/inboxes -->
  <div style="display: none; max-height: 0px; overflow: hidden;">
    ${previewText}
  </div>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1>Script Worldview Foundation</h1>
      </div>
      <div class="content">
        ${contentHtml}
        <hr class="hr" />
        <div class="footer">
          <span class="footer-highlight">Script Worldview Foundation</span><br />
          Shaping Minds. Transforming Communities.<br />
          Lagos, Nigeria<br />
          <span style="font-size: 11px;">A registered non-profit organization.</span>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`
}

/**
 * HTML Template: Contact Confirmation acknowledgment
 */
export function getContactConfirmationHtml(name: string): string {
  const previewText = "We received your message - Script Worldview Foundation"
  const contentHtml = `
    <p class="paragraph">Hello ${name},</p>
    <p class="paragraph">
      Thank you for reaching out to Script Worldview Foundation. We have successfully received your inquiry and our team is currently reviewing it.
    </p>
    <p class="paragraph">
      You can expect a response from the relevant department within 2 business days. We appreciate your patience and interest in our work.
    </p>
    <p class="paragraph">
      In the meantime, feel free to explore our active programs and read recent stories of impact from our communities on our website.
    </p>
    <div class="btn-container">
      <a class="button button-primary" href="https://scriptworldviewfoundation.org/programs" target="_blank">Explore Our Programs</a>
    </div>
    <p class="paragraph" style="margin-top: 24px;">
      Best regards,<br />
      <strong>The Script Worldview Team</strong>
    </p>
  `
  return wrapEmailTemplate({ title: "Inquiry Received", previewText, contentHtml })
}

/**
 * HTML Template: Admin notification for new Contact Form submissions
 */
export function getContactAdminNotificationHtml(data: {
  name: string
  email: string
  phone?: string
  subject?: string
  department: string
  message: string
}): string {
  const previewText = `New Contact Form Inquiry: [${data.department}] from ${data.name}`
  const contentHtml = `
    <p class="paragraph">Hello Admin,</p>
    <p class="paragraph">
      A new contact form inquiry has been submitted on the public portal. Please review the details below and follow up accordingly:
    </p>
    
    <div class="receipt-box">
      <div class="receipt-title">Submission Details</div>
      <div class="receipt-detail"><strong>Name:</strong> ${data.name}</div>
      <div class="receipt-detail"><strong>Email:</strong> ${data.email}</div>
      <div class="receipt-detail"><strong>Phone:</strong> ${data.phone || 'N/A'}</div>
      <div class="receipt-detail"><strong>Department:</strong> ${data.department.toUpperCase()}</div>
      <div class="receipt-detail"><strong>Subject:</strong> ${data.subject || 'General Inquiry'}</div>
      <div class="receipt-detail" style="margin-top: 12px; border-top: 1px dashed #e5e7eb; padding-top: 8px;">
        <strong>Message:</strong><br />
        <span style="font-style: italic; white-space: pre-wrap;">${data.message}</span>
      </div>
    </div>

    <div class="btn-container">
      <a class="button button-primary" href="https://scriptworldviewfoundation.org/admin" target="_blank">Access Admin Dashboard</a>
    </div>
  `
  return wrapEmailTemplate({ title: "New Contact Submission", previewText, contentHtml })
}

/**
 * HTML Template: Volunteer Acknowledgment details
 */
export function getVolunteerAcknowledgmentHtml(name: string): string {
  const previewText = "Your Volunteer Application - Script Worldview Foundation"
  const contentHtml = `
    <p class="paragraph">Hello ${name},</p>
    <p class="paragraph">
      Thank you for applying to volunteer with Script Worldview Foundation! We are deeply inspired by your desire to contribute your skills, heart, and time to our mission of shaping minds and transforming communities.
    </p>
    <p class="paragraph">
      Our HR and community development teams are currently reviewing your availability and background profile. We will get in touch with you shortly to schedule an onboarding call and discuss potential roles that fit your availability and skillset.
    </p>
    <p class="paragraph">
      Thank you for your commitment to make a lasting difference in our communities.
    </p>
    <div class="btn-container">
      <a class="button button-success" href="https://scriptworldviewfoundation.org/about" target="_blank">Learn More About Us</a>
    </div>
    <p class="paragraph" style="margin-top: 24px;">
      Best regards,<br />
      <strong>The HR Team, Script Worldview Foundation</strong>
    </p>
  `
  return wrapEmailTemplate({ title: "Volunteer Application Received", previewText, contentHtml })
}

/**
 * HTML Template: Career Application Acknowledgment details
 */
export function getCareerAcknowledgmentHtml(name: string, jobTitle: string): string {
  const previewText = `Application Received: ${jobTitle} - Script Worldview Foundation`
  const contentHtml = `
    <p class="paragraph">Hello ${name},</p>
    <p class="paragraph">
      Thank you for submitting your application and CV for the open position of <strong>${jobTitle}</strong> at Script Worldview Foundation.
    </p>
    <p class="paragraph">
      We appreciate the time you took to share your credentials and professional journey with us. Our recruiting team is reviewing your profile against the job specifications and will contact you directly if your qualifications align with the requirements for this role.
    </p>
    <p class="paragraph">
      We wish you the very best in your job search and professional endeavors.
    </p>
    <p class="paragraph" style="margin-top: 24px;">
      Best regards,<br />
      <strong>Careers & HR, Script Worldview Foundation</strong>
    </p>
  `
  return wrapEmailTemplate({ title: "Job Application Received", previewText, contentHtml })
}

/**
 * HTML Template: Event Registration Confirmation details
 */
export function getEventConfirmationHtml(
  name: string,
  eventTitle: string,
  eventDateStr: string,
  eventLocation?: string
): string {
  const previewText = `Registration Confirmed: ${eventTitle} - Script Worldview Foundation`
  const contentHtml = `
    <p class="paragraph">Hello ${name},</p>
    <p class="paragraph">
      Your registration for our upcoming event, <strong>${eventTitle}</strong>, has been successfully confirmed!
    </p>
    <p class="paragraph">
      We are excited to have you join us. Please find the scheduled date, time, and location specifications below for your reference:
    </p>

    <div class="receipt-box">
      <div class="receipt-title">Event Schedule & Access</div>
      <div class="receipt-detail"><strong>Event Name:</strong> ${eventTitle}</div>
      <div class="receipt-detail"><strong>Date & Time:</strong> ${eventDateStr}</div>
      <div class="receipt-detail"><strong>Location / Link:</strong> ${eventLocation || 'Online / Link to be sent'}</div>
    </div>

    <p class="paragraph">
      If you have any questions or require special accommodations prior to the event date, please respond directly to this email.
    </p>
    <p class="paragraph" style="margin-top: 24px;">
      Warm regards,<br />
      <strong>Events Team, Script Worldview Foundation</strong>
    </p>
  `
  return wrapEmailTemplate({ title: "Event Registration Confirmed", previewText, contentHtml })
}

/**
 * HTML Template: Rich Donation Receipt details
 */
export function getDonationReceiptHtml(
  donorName: string,
  amount: string | number,
  currency: string,
  donationId: string
): string {
  const previewText = `Receipt for your generous donation - Script Worldview Foundation`
  const contentHtml = `
    <p class="paragraph">Dear ${donorName},</p>
    <p class="paragraph">
      Thank you for your generous contribution of <strong>${currency} ${Number(amount).toLocaleString()}</strong> to Script Worldview Foundation.
    </p>
    <p class="paragraph">
      Your support plays a vital role in our ongoing mission to advance education, provide active humanitarian response, and build sustainable community projects.
    </p>

    <div class="receipt-box">
      <div class="receipt-title">Donation Details</div>
      <div class="receipt-detail"><strong>Transaction Reference ID:</strong> ${donationId}</div>
      <div class="receipt-detail"><strong>Amount Contributed:</strong> ${currency} ${Number(amount).toLocaleString()}</div>
      <div class="receipt-detail"><strong>Date of Transaction:</strong> ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
    </div>

    <p class="paragraph">
      We are deeply grateful for your partnership. Together, we are creating tangible positive shifts.
    </p>
    <div class="btn-container">
      <a class="button button-primary" href="https://scriptworldviewfoundation.org/impact" target="_blank">View Our Impact Stories</a>
    </div>
    <p class="paragraph" style="margin-top: 24px;">
      With immense gratitude,<br />
      <strong>The Script Worldview Foundation Team</strong>
    </p>
  `
  return wrapEmailTemplate({ title: "Donation Receipt", previewText, contentHtml })
}
