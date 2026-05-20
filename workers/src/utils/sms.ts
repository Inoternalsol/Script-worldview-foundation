export interface SmsPayload {
  to: string;
  message: string;
}

export interface SmsEnv {
  SMS_GATEWAY?: string;
  TERMII_API_KEY?: string;
  TERMII_SENDER_ID?: string;
  TWILIO_ACCOUNT_SID?: string;
  TWILIO_AUTH_TOKEN?: string;
  TWILIO_FROM_NUMBER?: string;
  EMERGENCY_COORDINATOR_PHONE?: string;
}

/**
 * Sends a real-time SMS alert using either Termii (Nigeria/West Africa leader) or Twilio.
 * Fails gracefully with warning logs if no API credentials are bound.
 */
export async function sendSms(env: SmsEnv, payload: SmsPayload): Promise<boolean> {
  const gateway = env.SMS_GATEWAY || (env.TERMII_API_KEY ? 'termii' : env.TWILIO_AUTH_TOKEN ? 'twilio' : null);

  if (!gateway) {
    console.warn('SMS Gateway warning: No credentials configured (TERMII_API_KEY or TWILIO_AUTH_TOKEN missing). SMS dispatch skipped.');
    return false;
  }

  const to = payload.to.replace(/[^0-9]/g, ''); // Ensure raw digits
  const message = payload.message;

  if (!to) {
    console.error('SMS Dispatch error: Recipient phone number is empty.');
    return false;
  }

  try {
    if (gateway === 'termii') {
      const apiKey = env.TERMII_API_KEY;
      const senderId = env.TERMII_SENDER_ID || 'ScriptWF';

      if (!apiKey) {
        console.error('SMS Termii error: TERMII_API_KEY is not defined.');
        return false;
      }

      console.log(`SMS Dispatching via Termii to ${to}...`);
      
      const res = await fetch('https://api.ng.termii.com/api/sms/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to,
          from: senderId,
          sms: message,
          type: 'plain',
          channel: 'generic',
          api_key: apiKey,
        }),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => '');
        console.error(`SMS Termii error code ${res.status}:`, errText);
        return false;
      }

      console.log(`SMS successfully dispatched via Termii to ${to}.`);
      return true;
    } 
    
    if (gateway === 'twilio') {
      const accountSid = env.TWILIO_ACCOUNT_SID;
      const authToken = env.TWILIO_AUTH_TOKEN;
      const fromNumber = env.TWILIO_FROM_NUMBER;

      if (!accountSid || !authToken || !fromNumber) {
        console.error('SMS Twilio error: Missing AccountSid, AuthToken, or FromNumber.');
        return false;
      }

      console.log(`SMS Dispatching via Twilio to ${to}...`);

      const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
      const basicAuth = btoa(`${accountSid}:${authToken}`);

      // Twilio requires application/x-www-form-urlencoded
      const formData = new URLSearchParams();
      // Ensure Twilio recipient has a leading '+'
      formData.append('To', payload.to.startsWith('+') ? payload.to : `+${payload.to}`);
      formData.append('From', fromNumber);
      formData.append('Body', message);

      const res = await fetch(twilioUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${basicAuth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => '');
        console.error(`SMS Twilio error code ${res.status}:`, errText);
        return false;
      }

      console.log(`SMS successfully dispatched via Twilio to ${to}.`);
      return true;
    }

    return false;
  } catch (err) {
    console.error('SMS Dispatch exception:', err);
    return false;
  }
}
