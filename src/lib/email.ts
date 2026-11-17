import nodemailer from "nodemailer";

export function getEmailTransporter() {
  const host = process.env.SMTP_HOST || "smtp.hostinger.com";
  const port = Number(process.env.SMTP_PORT) || 465;
  const user = process.env.SMTP_USER || "info@hangubrandedshoes.com";
  const pass = process.env.SMTP_PASS || "";

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
  });
}

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams): Promise<boolean> {
  try {
    const transporter = getEmailTransporter();
    const from = process.env.SMTP_FROM || `"Hangu Branded Shoes" <info@hangubrandedshoes.com>`;
    await transporter.sendMail({
      from,
      to,
      subject,
      html,
    });
    return true;
  } catch (err: any) {
    console.error("Failed to send email via SMTP:", err.message);
    return false;
  }
}

export async function sendPasswordResetAlert(
  recipientEmail: string,
  username: string,
  action: "RECOVERED" | "CHANGED"
): Promise<boolean> {
  const now = new Date().toLocaleString("en-PK", { timeZone: "Asia/Karachi" });
  const actionText = action === "RECOVERED" ? "Reset via Recovery Key" : "Updated via Dashboard Settings";

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Security Alert - Password Updated</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 30px 15px;">
        <tr>
          <td align="center">
            <table width="100%" max-width="580" style="max-width: 580px; background-color: #ffffff; border-radius: 20px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
              <!-- Header -->
              <tr>
                <td style="background-color: #0f172a; padding: 30px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 800; letter-spacing: 0.5px;">HANGU BRANDED SHOES</h1>
                  <p style="margin: 6px 0 0; color: #10b981; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px;">Operations Control Center</p>
                </td>
              </tr>
              <!-- Content -->
              <tr>
                <td style="padding: 35px 30px;">
                  <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 14px 18px; margin-bottom: 24px;">
                    <p style="margin: 0; color: #065f46; font-size: 14px; font-weight: 700;">
                      🔒 Admin Password Successfully ${action === "RECOVERED" ? "Reset" : "Changed"}
                    </p>
                  </div>
                  
                  <p style="margin: 0 0 16px; font-size: 14px; line-height: 1.6; color: #334155;">
                    Assalam-o-Alaikum <strong>Admin</strong>,
                  </p>
                  <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6; color: #334155;">
                    The password for your administrator account (<strong>${username}</strong> / <strong>${recipientEmail}</strong>) has been successfully updated on the Hangu Branded Shoes Portal.
                  </p>

                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; border-radius: 12px; padding: 16px; margin-bottom: 24px; font-size: 13px;">
                    <tr>
                      <td style="padding: 6px 0; color: #64748b; font-weight: 600; width: 140px;">Action Type:</td>
                      <td style="padding: 6px 0; color: #0f172a; font-weight: 700;">${actionText}</td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Time (PKT):</td>
                      <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${now}</td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Status:</td>
                      <td style="padding: 6px 0; color: #059669; font-weight: 700;">Active & Verified</td>
                    </tr>
                  </table>

                  <p style="margin: 0 0 24px; font-size: 13px; line-height: 1.6; color: #475569;">
                    If you initiated this change, no further action is required. You can now securely log in with your updated password.
                  </p>

                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center">
                        <a href="https://hangubrandedshoes.com/dashboard" target="_blank" style="display: inline-block; background-color: #0f172a; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 700; padding: 14px 30px; border-radius: 12px; letter-spacing: 0.3px;">
                          Open Admin Dashboard →
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 30px; text-align: center;">
                  <p style="margin: 0; font-size: 11px; color: #94a3b8; line-height: 1.5;">
                    This is an automated security notification sent to <strong>${recipientEmail}</strong> from Hangu Branded Shoes.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  return await sendEmail({
    to: recipientEmail,
    subject: `🔒 Security Alert: Hangu Admin Password ${action === "RECOVERED" ? "Reset" : "Changed"}`,
    html,
  });
}
