/**
 * Email utility using Resend
 * Free tier: 100 emails/day to any address when using onboarding@resend.dev
 * For custom from address, verify your domain at resend.com/domains
 */

async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log('[Email] RESEND_API_KEY not set — skipping');
    return false;
  }

  // Use verified from email if set, otherwise use Resend's default
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
  const fromName = 'IIM Calcutta Silver Jubilee';

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${fromName} <${fromEmail}>`,
        to: [to],
        subject,
        html,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('[Email] Resend error:', data);
      return false;
    }

    console.log('[Email] Sent successfully to', to, '— ID:', data.id);
    return true;
  } catch (err) {
    console.error('[Email] Failed:', err);
    return false;
  }
}

export async function sendApprovalEmail(to: string, fullName: string): Promise<boolean> {
  const portalUrl = process.env.NEXTAUTH_URL || 'https://iim-cal-2001.vercel.app';

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:Georgia,serif;">
  <div style="max-width:600px;margin:40px auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1);">
    
    <div style="background:linear-gradient(135deg,#003366,#001a33);padding:40px 32px;text-align:center;">
      <div style="color:#C8A951;font-size:28px;font-weight:bold;letter-spacing:4px;margin-bottom:4px;">IIM CALCUTTA</div>
      <div style="color:rgba(200,169,81,0.7);font-size:11px;letter-spacing:3px;margin-bottom:16px;">SILVER JUBILEE 2026</div>
      <div style="display:inline-block;background:rgba(200,169,81,0.15);border:1px solid rgba(200,169,81,0.4);color:#C8A951;padding:6px 20px;border-radius:20px;font-size:12px;letter-spacing:2px;">BATCH 2001</div>
    </div>

    <div style="padding:40px 32px;">
      <h1 style="color:#003366;font-size:24px;margin:0 0 16px;">Welcome, ${fullName}! 🎓</h1>
      <p style="color:#444;line-height:1.7;margin-bottom:20px;">
        Your registration for the <strong>IIM Calcutta Silver Jubilee Alumni Meet 2026</strong> has been verified and approved by the organising committee.
      </p>
      <p style="color:#444;line-height:1.7;margin-bottom:28px;">
        You now have full access to the alumni portal — connect with batchmates, submit your travel details, and stay updated on event announcements.
      </p>

      <div style="text-align:center;margin:32px 0;">
        <a href="${portalUrl}/login"
           style="background:linear-gradient(135deg,#C8A951,#8a6b1a);color:#003366;padding:16px 40px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;display:inline-block;">
          Sign In to Your Portal →
        </a>
      </div>

      <div style="background:#f8f4ec;border-radius:10px;padding:20px;margin-bottom:24px;">
        <p style="color:#003366;font-weight:bold;margin:0 0 8px;">📅 Event Details</p>
        <p style="color:#555;margin:4px 0;font-size:14px;">📍 December 12–14, 2026</p>
        <p style="color:#555;margin:4px 0;font-size:14px;">🏫 IIM Calcutta Campus, Joka, Kolkata</p>
      </div>

      <p style="color:#888;font-size:13px;line-height:1.6;">
        Please complete your travel details on the portal at your earliest convenience.<br>
        For queries, reach out to the organising committee.
      </p>
    </div>

    <div style="background:#001a33;padding:24px 32px;text-align:center;">
      <p style="color:#8899aa;font-size:12px;margin:0;">IIM Calcutta Silver Jubilee Alumni Meet 2026</p>
      <p style="color:#8899aa;font-size:11px;margin:6px 0 0;">Diamond Harbour Road, Joka, Kolkata – 700 104</p>
    </div>
  </div>
</body>
</html>`;

  return sendEmail(to, '✅ Your IIM Calcutta Silver Jubilee Portal Access is Approved!', html);
}

export async function sendRejectionEmail(to: string, fullName: string, reason: string): Promise<boolean> {
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:Georgia,serif;max-width:600px;margin:40px auto;padding:40px 32px;background:white;border-radius:12px;">
  <div style="color:#003366;font-size:20px;font-weight:bold;margin-bottom:20px;">Dear ${fullName},</div>
  <p style="color:#444;line-height:1.7;">
    Thank you for registering for the IIM Calcutta Silver Jubilee Alumni Meet 2026.
  </p>
  <p style="color:#444;line-height:1.7;">
    After reviewing your registration, we were unable to verify your alumni status for Batch 2001.
    ${reason ? `<br><br>Reason: ${reason}.` : ''}
  </p>
  <p style="color:#444;line-height:1.7;">
    If you believe this is an error, please contact the organising committee.
  </p>
  <p style="color:#888;margin-top:32px;font-size:13px;">
    Silver Jubilee Organising Committee<br>IIM Calcutta
  </p>
</body>
</html>`;

  return sendEmail(to, 'IIM Calcutta Silver Jubilee Portal — Registration Update', html);
}
