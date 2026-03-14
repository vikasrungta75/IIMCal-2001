/**
 * Email utility using Resend (free tier: 100 emails/day)
 * Setup: https://resend.com → get API key → add RESEND_API_KEY to Vercel env vars
 * From address: use your verified domain or onboarding@resend.dev for testing
 */

export async function sendApprovalEmail(to: string, fullName: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log('[Email] RESEND_API_KEY not set — skipping email to', to);
    return false;
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
  const portalUrl = process.env.NEXTAUTH_URL || 'https://iim-cal-2001.vercel.app';

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `IIM Calcutta Silver Jubilee <${fromEmail}>`,
        to: [to],
        subject: '✅ Your Silver Jubilee Portal Access is Approved!',
        html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Georgia, serif; background: #f5f0e8; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #003366, #001a33); padding: 40px 32px; text-align: center;">
      <div style="color: #C8A951; font-size: 32px; font-weight: bold; letter-spacing: 4px; margin-bottom: 4px;">IIM</div>
      <div style="color: white; font-size: 13px; letter-spacing: 3px; margin-bottom: 16px;">CALCUTTA</div>
      <div style="display: inline-block; background: rgba(200,169,81,0.15); border: 1px solid rgba(200,169,81,0.4); color: #C8A951; padding: 6px 20px; border-radius: 20px; font-size: 12px; letter-spacing: 2px;">SILVER JUBILEE 2027</div>
    </div>
    <!-- Body -->
    <div style="padding: 40px 32px;">
      <h1 style="color: #003366; font-size: 24px; margin: 0 0 16px;">Welcome to the Portal, ${fullName}! 🎓</h1>
      <p style="color: #444; line-height: 1.7; margin-bottom: 20px;">
        Great news! Your registration for the <strong>IIM Calcutta Silver Jubilee Alumni Meet 2027</strong> has been verified and approved by the organising committee.
      </p>
      <p style="color: #444; line-height: 1.7; margin-bottom: 28px;">
        You now have full access to the alumni portal — connect with batchmates, submit your travel details, and stay updated on event announcements.
      </p>
      <!-- CTA Button -->
      <div style="text-align: center; margin: 32px 0;">
        <a href="${portalUrl}/login" 
           style="background: linear-gradient(135deg, #C8A951, #8a6b1a); color: #003366; padding: 16px 40px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">
          Sign In to Your Portal →
        </a>
      </div>
      <!-- Event details -->
      <div style="background: #f8f4ec; border-radius: 10px; padding: 20px; margin-bottom: 24px;">
        <p style="color: #003366; font-weight: bold; margin: 0 0 8px;">📅 Event Details</p>
        <p style="color: #555; margin: 4px 0; font-size: 14px;">📍 December 12–14, 2027</p>
        <p style="color: #555; margin: 4px 0; font-size: 14px;">🏫 IIM Calcutta Campus, Joka, Kolkata</p>
      </div>
      <p style="color: #888; font-size: 13px; line-height: 1.6;">
        Please complete your travel details and profile on the portal at your earliest convenience.<br>
        For any queries, reach out to the organising committee.
      </p>
    </div>
    <!-- Footer -->
    <div style="background: #001a33; padding: 24px 32px; text-align: center;">
      <p style="color: #8899aa; font-size: 12px; margin: 0;">IIM Calcutta Silver Jubilee Alumni Meet 2027</p>
      <p style="color: #8899aa; font-size: 11px; margin: 6px 0 0;">Diamond Harbour Road, Joka, Kolkata – 700 104</p>
    </div>
  </div>
</body>
</html>
        `,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('[Email] Resend error:', err);
      return false;
    }
    console.log('[Email] Approval email sent to', to);
    return true;
  } catch (err) {
    console.error('[Email] Failed to send:', err);
    return false;
  }
}

export async function sendRejectionEmail(to: string, fullName: string, reason: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `IIM Calcutta Silver Jubilee <${fromEmail}>`,
        to: [to],
        subject: 'IIM Calcutta Silver Jubilee Portal — Registration Update',
        html: `
<div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 32px; background: white;">
  <div style="color: #003366; font-size: 22px; font-weight: bold; margin-bottom: 20px;">Dear ${fullName},</div>
  <p style="color: #444; line-height: 1.7;">
    Thank you for registering for the IIM Calcutta Silver Jubilee Alumni Meet 2027.
  </p>
  <p style="color: #444; line-height: 1.7;">
    After reviewing your registration, we were unable to verify your alumni status for Batch 2001. ${reason ? `Reason: ${reason}.` : ''}
  </p>
  <p style="color: #444; line-height: 1.7;">
    If you believe this is an error, please contact the organising committee at silverjubilee2027@iimcal.ac.in.
  </p>
  <p style="color: #888; margin-top: 32px; font-size: 13px;">Silver Jubilee Organising Committee<br>IIM Calcutta</p>
</div>
        `,
      }),
    });
    return res.ok;
  } catch { return false; }
}
