import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const GOOGLE_MAILER_WEBHOOK =
  process.env.GOOGLE_MAILER_WEBHOOK ||
  "https://script.google.com/macros/s/AKfycby9Tlp4TcmzPFq0VJbSN7z24l2xJBsTUzIaRlFWNj7rTq8HIwcJwhK17otshwoMy80/exec";

let transporter = null;

export const getMailTransporter = () => {
  if (transporter) return transporter;
  if (process.env.EMAIL && process.env.EMAIL_PASSWORD) {
    transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'Gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  return transporter;
};

/**
 * Universal email dispatcher:
 * 1. Primary: Google Apps Script HTTPS Webhook (Port 443 - 100% allowed on Render / Vercel cloud hosting)
 * 2. Fallback: Direct Nodemailer (Port 465/587 with Gmail/SMTP credentials)
 */
export const sendEmail = async ({ to, subject, text, html }) => {
  // 1. Primary: Google Apps Script Webhook
  if (GOOGLE_MAILER_WEBHOOK) {
    try {
      const response = await fetch(GOOGLE_MAILER_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to,
          subject,
          text: text || '',
          html: html || text || '',
        }),
      });

      if (response.ok) {
        const result = await response.json().catch(() => ({}));
        if (result.success !== false) {
          console.log(`✉️ Email dispatched to ${to} via Google Apps Script HTTPS`);
          return { success: true, method: 'google_apps_script' };
        }
      }
      console.warn('Google Apps Script webhook returned non-success, attempting SMTP fallback...');
    } catch (webhookErr) {
      console.warn('Google Apps Script webhook dispatch failed, attempting SMTP fallback:', webhookErr?.message || webhookErr);
    }
  }

  // 2. Fallback: Direct Nodemailer SMTP
  try {
    const mailer = getMailTransporter();
    if (!mailer) {
      throw new Error('Nodemailer transporter not configured (missing EMAIL or EMAIL_PASSWORD)');
    }
    const info = await mailer.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL,
      to,
      subject,
      text,
      html,
    });
    console.log(`✉️ Email dispatched to ${to} via Nodemailer (MessageId: ${info.messageId})`);
    return { success: true, method: 'nodemailer', messageId: info.messageId };
  } catch (err) {
    console.error(`Failed to dispatch email to ${to}:`, err);
    throw err;
  }
};

/**
 * Send branded 6-digit OTP verification email
 */
export const sendOTPEmail = async (email, otp) => {
  const subject = `Your Money Mentor verification code: ${otp}`;
  const text = `Welcome to Money Mentor! Your 6-digit verification code is: ${otp}. It is valid for 10 minutes. If you did not request this, please ignore this email.`;
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 32px 24px; background: #0f172a; border-radius: 16px; color: #f8fafc; border: 1px solid #1e293b;">
      <div style="text-align: center; margin-bottom: 28px;">
        <div style="display: inline-block; width: 52px; height: 52px; line-height: 52px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 14px; color: #ffffff; font-size: 26px; font-weight: bold; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);">
          M
        </div>
        <h2 style="color: #f8fafc; margin: 16px 0 6px 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px;">Money Mentor</h2>
        <p style="color: #94a3b8; font-size: 14px; margin: 0;">Account Verification Code</p>
      </div>

      <div style="background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
        <p style="color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; margin: 0 0 10px 0;">One-Time Password</p>
        <span style="font-size: 38px; font-weight: 800; letter-spacing: 10px; color: #10b981; font-family: monospace; display: inline-block; margin-left: 10px;">${otp}</span>
      </div>

      <p style="color: #94a3b8; font-size: 13px; line-height: 1.6; text-align: center; margin: 16px 0;">
        This code expires in <strong style="color: #f1f5f9;">10 minutes</strong>. For your security, never share this code with anyone.
      </p>

      <hr style="border: none; border-top: 1px solid #334155; margin: 28px 0 20px 0;" />
      <p style="color: #64748b; font-size: 11px; text-align: center; margin: 0; line-height: 1.5;">
        Money Mentor — Intelligent Personal & Family Finance Management<br/>
        This is an automated message, please do not reply.
      </p>
    </div>
  `;

  return sendEmail({ to: email, subject, text, html });
};

/**
 * Send branded family group invitation email
 */
export const sendInvitationEmail = async (email, familyName, link) => {
  const subject = `Invitation to Join ${familyName} on Money Mentor`;
  const text = `Hello! You have been invited to join ${familyName} on Money Mentor! Accept invitation here: ${link}`;
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 540px; margin: 0 auto; padding: 32px 24px; background: #0f172a; border-radius: 16px; color: #f8fafc; border: 1px solid #1e293b;">
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; width: 52px; height: 52px; line-height: 52px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 14px; color: #ffffff; font-size: 26px; font-weight: bold; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);">
          M
        </div>
        <h2 style="color: #f8fafc; margin: 16px 0 6px 0; font-size: 22px; font-weight: 700;">Family Group Invitation</h2>
        <p style="color: #94a3b8; font-size: 14px; margin: 0;">Collaborate on finances together</p>
      </div>

      <div style="background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 20px; margin: 20px 0;">
        <p style="color: #e2e8f0; font-size: 15px; margin: 0 0 12px 0;">
          You've been invited to join <strong style="color: #10b981;">${familyName}</strong> on Money Mentor!
        </p>
        <p style="color: #94a3b8; font-size: 13px; line-height: 1.6; margin: 0;">
          As a member, you'll be able to track shared expenses, coordinate monthly household budgets, and hit joint financial goals together.
        </p>
      </div>

      <div style="margin: 28px 0; text-align: center;">
        <a href="${link}"
           style="background-color: #10b981; 
                  color: #ffffff; 
                  padding: 14px 28px; 
                  text-decoration: none; 
                  border-radius: 10px;
                  font-weight: 700;
                  font-size: 14px;
                  display: inline-block;
                  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);">
          Accept Invitation & Join
        </a>
      </div>

      <p style="color: #64748b; font-size: 12px; text-align: center; margin: 12px 0;">
        This invitation link will expire in 7 days. If you don't have an account, you will be guided to create one.
      </p>

      <hr style="border: none; border-top: 1px solid #334155; margin: 24px 0 16px 0;" />
      <p style="color: #64748b; font-size: 11px; text-align: center; margin: 0;">
        Money Mentor — Intelligent Personal & Family Finance Management
      </p>
    </div>
  `;

  return sendEmail({ to: email, subject, text, html });
};
