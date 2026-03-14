/**
 * Email using Brevo (formerly Sendinblue)
 * Free: 300 emails/day, no domain verification, sends to any address
 * Setup: https://brevo.com → sign up free → Settings → SMTP & API → API Keys → Create API Key
 * Add to Vercel env vars: BREVO_API_KEY
 */

async function sendEmail(to: string, toName: string, subject: string, html: string): Promise<boolean> {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    console.log('[Email] BREVO_API_KEY not set — skipping email to', to);
    return false;
  }

  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: 'IIM Calcutta Silver Jubilee 2026',
          email: process.env.BREVO_FROM_EMAIL || 'noreply@iimcalumni2026.com',
        },
        to: [{ email: to, name: toName }],
        subject,
        htmlContent: html,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('[Email] Brevo error:', JSON.stringify(data));
      return false;
    }

    console.log('[Email] Sent successfully to', to, '— messageId:', data.messageId);
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
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:Georgia,serif;">
  <div style="max-width:600px;margin:40px auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1);">

    <div style="background:linear-gradient(135deg,#003366,#001a33);padding:40px 32px;text-align:center;">
      <div style="color:#C8A951;font-size:28px;font-weight:bold;letter-spacing:4px;margin-bottom:4px;">IIM CALCUTTA</div>
      <div style="color:rgba(200,169,81,0.7);font-size:11px;letter-spacing:3px;margin-bottom:16px;">SILVER JUBILEE 2026</div>
      <div style="display:inline-block;background:rgba(200,169,81,0.15);border:1px solid rgba(200,169,81,0.4);color:#C8A951;padding:6px 20px;border-radius:20px;font-size:12px;letter-spacing:2px;">BATCH 2001</div>
    </div>

    <div style="padding:40px 32px;">
      <h1 style="color:#003366;font-size:24px;margin:0 0 16px;">Welcome, ${fullName}! 🎓</h1>
      <p style="color:#444;line-height:1.7;margin-bottom:16px;">
        Great news! Your registration for the <strong>IIM Calcutta Silver Jubilee Alumni Meet 2026</strong> has been verified and approved.
      </p>
      <p style="color:#444;line-height:1.7;margin-bottom:28px;">
        You now have full access to the alumni portal — connect with batchmates, submit travel details, and stay updated on announcements.
      </p>

      <div style="text-align:center;margin:32px 0;">
        <a href="${portalUrl}/login"
           style="background:linear-gradient(135deg,#C8A951,#8a6b1a);color:#003366;padding:16px 40px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;display:inline-block;">
          Sign In to Your Portal →
        </a>
      </div>

      <div style="background:#f8f4ec;border-radius:10px;padding:20px;margin-bottom:24px;">
        <p style="color:#003366;font-weight:bold;margin:0 0 10px;">📅 Event Details</p>
        <p style="color:#555;margin:4px 0;font-size:14px;">🗓️ December 12–14, 2026</p>
        <p style="color:#555;margin:4px 0;font-size:14px;">🏫 IIM Calcutta Campus, Joka, Kolkata</p>
        <p style="color:#555;margin:4px 0;font-size:14px;">👥 Batch 2001 Silver Jubilee Reunion</p>
      </div>

      <p style="color:#888;font-size:13px;line-height:1.6;">
        Please complete your travel and accommodation details on the portal at your earliest.<br>
        For queries, contact the organising committee.
      </p>
    </div>

    <div style="background:#001a33;padding:24px 32px;text-align:center;">
      <p style="color:#8899aa;font-size:12px;margin:0;">IIM Calcutta Silver Jubilee Alumni Meet 2026</p>
      <p style="color:#8899aa;font-size:11px;margin:6px 0 0;">Diamond Harbour Road, Joka, Kolkata – 700 104</p>
    </div>
  </div>
</body>
</html>`;

  return sendEmail(to, fullName, '✅ Your IIM Calcutta Silver Jubilee Portal Access is Approved!', html);
}

export async function sendRejectionEmail(to: string, fullName: string, reason: string): Promise<boolean> {
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:Georgia,serif;max-width:600px;margin:40px auto;padding:40px 32px;background:white;border-radius:12px;">
  <div style="background:linear-gradient(135deg,#003366,#001a33);padding:24px 32px;text-align:center;border-radius:8px;margin-bottom:28px;">
    <div style="color:#C8A951;font-size:20px;font-weight:bold;letter-spacing:3px;">IIM CALCUTTA</div>
    <div style="color:rgba(200,169,81,0.7);font-size:10px;letter-spacing:2px;margin-top:4px;">SILVER JUBILEE 2026</div>
  </div>
  <p style="color:#003366;font-size:18px;font-weight:bold;margin-bottom:16px;">Dear ${fullName},</p>
  <p style="color:#444;line-height:1.7;">
    Thank you for registering for the IIM Calcutta Silver Jubilee Alumni Meet 2026.
  </p>
  <p style="color:#444;line-height:1.7;">
    After reviewing your registration, we were unable to verify your alumni status for Batch 2001.
    ${reason ? `<br><br><strong>Reason:</strong> ${reason}.` : ''}
  </p>
  <p style="color:#444;line-height:1.7;">
    If you believe this is an error, please contact the organising committee directly.
  </p>
  <p style="color:#888;margin-top:32px;font-size:13px;border-top:1px solid #eee;padding-top:20px;">
    Silver Jubilee Organising Committee<br>
    IIM Calcutta · Joka, Kolkata
  </p>
</body>
</html>`;

  return sendEmail(to, fullName, 'IIM Calcutta Silver Jubilee Portal — Registration Update', html);
}
