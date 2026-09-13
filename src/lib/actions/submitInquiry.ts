// src/lib/actions/submitInquiry.ts
'use server';

import { getPayload } from 'payload';
import config from '@/payload.config';

export type InquiryInput = {
  firstName: string;
  surname: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
};

const sanitizeInput = (val: string): string => {
  return val
    .replace(/<[^>]*>/g, '') // Strip standard HTML tags
    .replace(/javascript:/gi, '')
    .trim();
};

export async function submitInquiry(data: InquiryInput) {
  try {
    // 1. Inputs Validation Check
    if (!data.firstName || !data.surname || !data.email || !data.subject || !data.message) {
      return { success: false, error: 'All required fields must be fully populated.' };
    }

    // 2. Strict Input Sanitization
    const cleanFirstName = sanitizeInput(data.firstName);
    const cleanSurname = sanitizeInput(data.surname);
    const cleanEmail = sanitizeInput(data.email).toLowerCase();
    const cleanPhone = data.phone ? sanitizeInput(data.phone) : '';
    const cleanSubject = sanitizeInput(data.subject);
    const cleanMessage = sanitizeInput(data.message);

    // 3. Initialize Payload on the Server
    const payload = await getPayload({ config });

    // 4. Automatically write the clean entry to your local database leads archive [1.1]
    const newLead = await payload.create({
      collection: 'leads',
      data: {
        firstName: cleanFirstName,
        surname: cleanSurname,
        email: cleanEmail,
        phone: cleanPhone,
        subject: cleanSubject,
        message: cleanMessage,
      },
    });

    // 5. Fire Automated Email Alert via Resend REST API
    const resendApiKey = process.env.RESEND_API_KEY;
    const notificationEmail = process.env.NOTIFICATION_EMAIL;

    if (resendApiKey && notificationEmail) {
      const htmlEmailBody = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e4e4e7; color: #000000; background-color: #ffffff;">
          <h2 style="font-size: 20px; font-weight: bold; text-transform: uppercase; letter-spacing: -0.03em; border-bottom: 2px solid #000000; padding-bottom: 10px; margin-top: 0;">
            [MGK INBOX]: NEW CLIENT INQUIRY
          </h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px;">
            <tr style="border-bottom: 1px solid #e4e4e7;">
              <td style="padding: 10px 0; font-weight: bold; text-transform: uppercase; width: 30%;">SENDER:</td>
              <td style="padding: 10px 0; text-transform: uppercase;">${cleanFirstName} ${cleanSurname}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e4e4e7;">
              <td style="padding: 10px 0; font-weight: bold; text-transform: uppercase;">EMAIL:</td>
              <td style="padding: 10px 0;"><a href="mailto:${cleanEmail}" style="color: #000000; text-decoration: underline;">${cleanEmail}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #e4e4e7;">
              <td style="padding: 10px 0; font-weight: bold; text-transform: uppercase;">PHONE:</td>
              <td style="padding: 10px 0;">${cleanPhone || 'NOT PROVIDED'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e4e4e7;">
              <td style="padding: 10px 0; font-weight: bold; text-transform: uppercase;">SUBJECT:</td>
              <td style="padding: 10px 0; text-transform: uppercase; font-weight: bold;">${cleanSubject}</td>
            </tr>
          </table>
          <div style="margin-top: 30px;">
            <h3 style="font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; color: #71717a; margin-bottom: 8px;">MESSAGE DETAILS:</h3>
            <p style="font-size: 15px; line-height: 1.6; color: #151515; white-space: pre-line; background-color: #f4f4f5; padding: 15px; border-left: 3px solid #000000; margin: 0;">
              ${cleanMessage}
            </p>
          </div>
          <div style="margin-top: 40px; border-top: 1px solid #e4e4e7; padding-top: 15px; font-size: 10px; color: #a1a1aa; font-family: monospace; text-transform: uppercase; letter-spacing: 0.1em;">
            AUTOMATED TRANSMISSION VIA MGK-ARCHITECTS ENGINE. RECORD BACKED UP IN PAYLOAD LEADS DATABASE.
          </div>
        </div>
      `;

      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendApiKey}`,
            'User-Agent': 'mgk-architects/1.0',
          },
          body: JSON.stringify({
            from: 'MGK Architects <onboarding@resend.dev>',
            to: [notificationEmail],
            subject: `[MGK INBOX]: ${cleanSubject} - ${cleanFirstName} ${cleanSurname}`,
            html: htmlEmailBody,
          }),
        });

        if (!response.ok) {
          const errorDetails = await response.text();
          console.warn('RESEND API WARNING: Failed to send email alert ->', errorDetails);
        }
      } catch (emailError) {
        console.error('RESEND EXCEPTION: Failed to connect to Resend servers ->', emailError);
      }
    }

    // 6. Asynchronously Push Lead Data to Third-Party CRM (Monday.com / HubSpot / Slack) [1.1]
    const crmWebhookUrl = process.env.CRM_WEBHOOK_URL;
    if (crmWebhookUrl) {
      try {
        const crmResponse = await fetch(crmWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'mgk-architects/1.0',
          },
          body: JSON.stringify({
            firstName: cleanFirstName,
            surname: cleanSurname,
            email: cleanEmail,
            phone: cleanPhone,
            subject: cleanSubject,
            message: cleanMessage,
            source: 'MGK Architects Website',
          }),
        });

        if (!crmResponse.ok) {
          const crmErrorText = await crmResponse.text();
          console.warn('CRM SYNC WARNING: Webhook response returned non-ok status ->', crmErrorText);
        }
      } catch (crmError) {
        // Enclosed in try/catch so if their CRM webhook fails or is misconfigured, your form submission still succeeds [1.1]
        console.error('CRM SYNC EXCEPTION: Failed to connect to CRM webhook ->', crmError);
      }
    }

    return { success: true, leadId: newLead.id };

  } catch (error: unknown) {
  console.error('SERVER ACTION ERROR: submitInquiry failed ->', error);
  return { success: false, error: 'An unexpected transmission error occurred. Please try again.' };
}
}
