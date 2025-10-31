import nodemailer from 'nodemailer';
import 'dotenv/config';

// 1. Create a "transporter" (email bhejne ka connection)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Ek simple email bhejta hai.
 * @param {string} to - Bhejne wale ka email (e.g., user.email)
 * @param {string} subject - Email ka subject
 * @param {string} text - Plain text body
 * @param {string} html - HTML body (zyada important)
 */
const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text,
      html,
    });
    console.log(`Email sent: ${info.messageId}`);
    // Mailtrap mein check karein, email aa gaya hoga
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export default sendEmail;