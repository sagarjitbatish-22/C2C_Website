// server/mailer.js — Handles automated email notifications
const nodemailer = require('nodemailer');

const createTransporter = () => {
  const user = process.env.EMAIL_USER || process.env.SMTP_USER;
  const pass = process.env.EMAIL_PASS || process.env.SMTP_PASS;

  if (user && pass) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass }
    });
  }
  return null;
};

// Escape user-supplied text before putting it into the HTML email body
const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
));

const sendRegistrationEmail = async (toEmail, rawUserName) => {
  const userName = escapeHtml(rawUserName);
  toEmail = String(toEmail).replace(/[\r\n]/g, '');
  const transporter = createTransporter();
  const mailOptions = {
    from: `"Code2Chill Tech Club" <${process.env.EMAIL_USER || 'code2chill.chitkara@gmail.com'}>`,
    to: toEmail,
    subject: `🎉 Registration Successful - Welcome to Code2Chill, ${String(rawUserName).replace(/[\r\n]/g, ' ')}!`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #08090D; color: #ffffff; padding: 32px 16px; min-height: 100%;">
        <div style="max-width: 580px; margin: 0 auto; background-color: #10121F; border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.5);">
          <!-- Header Banner -->
          <div style="background: linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%); padding: 32px 24px; text-align: center;">
            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">Code2Chill</h1>
            <p style="margin: 6px 0 0 0; color: rgba(255,255,255,0.85); font-size: 13px; font-weight: 500;">Official Tech & Coding Club · Chitkara University, Rajpura</p>
          </div>

          <!-- Body Content -->
          <div style="padding: 32px 28px;">
            <h2 style="margin: 0 0 12px 0; color: #ffffff; font-size: 20px; font-weight: 700;">Welcome to the Community, ${userName}! 🚀</h2>
            <p style="margin: 0 0 20px 0; color: #94A3B8; font-size: 14px; line-height: 1.6;">
              Congratulations! Your member account at <strong style="color: #ffffff;">Code2Chill (C2C)</strong> has been successfully registered. You are now part of Chitkara University's fastest-growing builder community.
            </p>

            <!-- Account Details Box -->
            <div style="background-color: #181B2E; border: 1px solid rgba(99, 102, 241, 0.2); border-radius: 14px; padding: 18px 20px; margin-bottom: 24px;">
              <p style="margin: 0 0 8px 0; color: #818CF8; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Your Account Details</p>
              <p style="margin: 0 0 4px 0; color: #E2E8F0; font-size: 14px;"><strong>Full Name:</strong> ${userName}</p>
              <p style="margin: 0; color: #E2E8F0; font-size: 14px;"><strong>Registered Email:</strong> ${toEmail}</p>
            </div>

            <!-- Perks Info -->
            <p style="margin: 0 0 12px 0; color: #CBD5E1; font-size: 13px; line-height: 1.6;">
              <strong>What's Next?</strong>
            </p>
            <ul style="margin: 0 0 28px 0; padding-left: 20px; color: #94A3B8; font-size: 13px; line-height: 1.8;">
              <li>Stay tuned for flagship 24-hour hackathons and cash prize contests.</li>
              <li>Participate in hands-on Generative AI and Full-Stack workshops.</li>
              <li>Network with student mentors, CP leads, and top builders on campus.</li>
            </ul>

            <!-- Action Button -->
            <div style="text-align: center;">
              <a href="https://sagarjitbatish-22.github.io/C2C_Website/" 
                 style="display: inline-block; background: linear-gradient(135deg, #6366F1 0%, #06B6D4 100%); color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 12px; font-size: 14px; font-weight: 600; box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);">
                Open Code2Chill Portal ↗
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="border-top: 1px solid rgba(255,255,255,0.06); padding: 20px; text-align: center; background-color: #0B0D17;">
            <p style="margin: 0; color: #64748B; font-size: 11px;">
              © 2026 Code2Chill, Chitkara University Rajpura. All rights reserved.
            </p>
            <p style="margin: 4px 0 0 0; color: #475569; font-size: 10px; font-family: monospace;">
              build(); chill(); ship();
            </p>
          </div>
        </div>
      </div>
    `
  };

  if (transporter) {
    try {
      await transporter.sendMail(mailOptions);
      console.log(`📧 Confirmation email successfully delivered to ${toEmail}`);
      return { success: true };
    } catch (err) {
      console.warn(`⚠️ Could not send email via transporter: ${err.message}`);
      return { success: false, error: err.message };
    }
  } else {
    console.log(`ℹ️ EMAIL_USER & EMAIL_PASS not configured in environment. [Simulated Email] Sent confirmation to ${toEmail}.`);
    return { success: true, simulated: true };
  }
};

module.exports = { sendRegistrationEmail };
