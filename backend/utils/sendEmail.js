import crypto from 'crypto';
import nodemailer from 'nodemailer';

export const generateResetToken = () => {
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  const resetPasswordExpire = Date.now() + 30 * 60 * 1000;
  return { resetToken, resetPasswordToken, resetPasswordExpire };
};

const createTransporter = () => {
  if (!process.env.EMAIL_HOST) return null;
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const sendEmail = async ({ to, subject, html }) => {
  const transporter = createTransporter();
  if (!transporter) {
    console.log(`Email (dev mode): To: ${to}, Subject: ${subject}`);
    return;
  }

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });
};

export const sendResetPasswordEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  await sendEmail({
    to: user.email,
    subject: 'Password Reset - Luxora',
    html: `
      <h2>Password Reset Request</h2>
      <p>Hi ${user.name},</p>
      <p>Click the link below to reset your password. This link expires in 30 minutes.</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>If you did not request this, please ignore this email.</p>
    `,
  });
};
