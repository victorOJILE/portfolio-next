import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

type ResponseData = {
 success: boolean;
 message: string;
};

type ContactFormData = {
 fullName: string;
 email: string;
 subject: string;
 message: string;
};

// Rate limiting (simple in-memory store, use Redis in production)
const rateLimitMap = new Map<string,
 number[]>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 3; // 3 emails per hour per IP

function checkRateLimit(ip: string): boolean {
 const now = Date.now();
 const requests = rateLimitMap.get(ip) || [];
 
 // Filter out old requests outside the window
 const recentRequests = requests.filter(time => now - time < RATE_LIMIT_WINDOW);
 
 if (recentRequests.length >= MAX_REQUESTS) return false;
 
 recentRequests.push(now);
 rateLimitMap.set(ip, recentRequests);
 return true;
}

export default async function handler(
 req: NextApiRequest,
 res: NextApiResponse<ResponseData>
) {
 // Only allow POST requests
 if (req.method !== 'POST') {
  return res.status(405).json({
   success: false,
   message: 'Method not allowed',
  });
 }
 
 // Rate limiting
 const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.socket.remoteAddress ||
  'unknown';
 
 if (!checkRateLimit(clientIp)) {
  return res.status(429).json({
   success: false,
   message: 'Too many requests. Please try again later.',
  });
 }
 
 try {
  const { fullName, email, subject, message }: ContactFormData = req.body;
  
  // Validation
  if (!email || !message) {
   return res.status(400).json({
    success: false,
    message: 'Email and message are required',
   });
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
   return res.status(400).json({
    success: false,
    message: 'Invalid email format'
   });
  }
  
  // Create transporter
  const transporter = nodemailer.createTransport({
   service: 'gmail',
   auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
   }
  });
  
  // Email to yourself
  const mailToYou = {
   from: process.env.EMAIL_USER,
   to: process.env.EMAIL_TO || process.env.EMAIL_USER,
   subject: `Portfolio Contact: ${subject || 'No Subject'}`,
   html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ef4444;">New Contact Form Submission</h2>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>From:</strong> ${fullName || 'Not provided'}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject || 'No subject'}</p>
          </div>
          <div style="margin: 20px 0;">
            <h3 style="color: #374151;">Message:</h3>
            <p style="white-space: pre-wrap; background-color: #f9fafb; padding: 15px; border-left: 4px solid #ef4444; border-radius: 4px;">
              ${message}
            </p>
          </div>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          <p style="color: #6b7280; font-size: 12px;">
            This email was sent from your portfolio contact form.
          </p>
        </div>
      `,
   replyTo: email
  };
  
  // Auto-reply to the sender
  const mailToSender = {
   from: process.env.EMAIL_USER,
   to: email,
   subject: 'Thanks for reaching out!',
   html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ef4444;">Thank You for Your Message!</h2>
          <p>Hi ${fullName || 'there'},</p>
          <p>Thank you for reaching out through my portfolio. I've received your message and will get back to you as soon as possible.</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Your message:</strong></p>
            <p style="white-space: pre-wrap; margin: 10px 0 0 0;">${message}</p>
          </div>
          <p>Best regards,<br><strong>Victor Ojile</strong></p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          <p style="color: #6b7280; font-size: 12px;">
            This is an automated response. Please do not reply to this email.
          </p>
        </div>
      `
  };
  
  // Send both emails
  await Promise.all([
   transporter.sendMail(mailToYou),
   transporter.sendMail(mailToSender)
  ]);
  
  return res.status(200).json({
   success: true,
   message: 'Email sent successfully!'
  });
 } catch (error) {
  console.error('Error sending email:', error);
  return res.status(500).json({
   success: false,
   message: 'Failed to send email. Please try again later.'
  });
 }
}