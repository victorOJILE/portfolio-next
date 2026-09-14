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

function isValidEmail(email: string): boolean {
 return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidName(name: string): boolean {
 return name.trim().length >= 2 && name.trim().length <= 30 && /^[a-zA-Z\s'-]+$/.test(name.trim());
}

function isValidSubject(text: string) {
 // No newlines allowed here — subject goes straight into an email header,
 // and a newline could enable header injection (e.g. smuggled Bcc:).
 return text.trim().length >= 5 && /^[\p{L}\p{N}\s.,!?'"()\-:;@#&/]+$/u.test(text.trim());
}

function isValidMessage(text: string) {
 return text.trim().length >= 5 && /^[\p{L}\p{N}\s.,!?'"()\-:;@#&/\n]+$/u.test(text.trim());
}

function escapeHtml(text: string): string {
 // Defense in depth: even though the regexes above already block <, >, etc.,
 // never trust a single layer when interpolating user input into HTML.
 return text
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');
}

export default async function handler(
 req: NextApiRequest,
 res: NextApiResponse<ResponseData>
) {
 // Only allow POST requests
 if (req.method !== 'POST') {
  return res.status(405).json({
   success: false,
   message: 'Method not allowed'
  });
 }
 
 // Rate limiting
 const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.socket.remoteAddress ||
  'unknown';
 
 if (!checkRateLimit(clientIp)) {
  return res.status(429).json({
   success: false,
   message: 'Too many requests. Please try again later.'
  });
 }
 
 try {
  const { fullName, email, subject, message }: ContactFormData = req.body;
  
  // Validation
  if (!email || !message || !fullName) {
   return res.status(400).json({
    success: false,
    message: 'Bad Request'
   });
  }
  
  let err = false;
  
  if (!isValidName(fullName)) err = true;
  if(!email.trim() || !isValidEmail(email)) err = true;
  
  if(subject != "" && !isValidSubject(subject)) err = true;
  if(!isValidMessage(message)) err = true;
  
  if(err) {
   return res.status(400).json({
    success: false,
    message: 'Bad Request'
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
   from: `"Victor Ojile" <${process.env.EMAIL_USER}>`,
   to: process.env.EMAIL_TO || process.env.EMAIL_USER,
   subject: `${subject || 'New Contact - Victor Ojile Portfolio'}`,
   html: (`
   <div style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <style type="text/css">
     table {
      border-collapse: collapse;
     }
    </style>
    <header style="background-color: #0F1622; padding: 10px 20px">
     <div style="width: 60%; margin: 0 auto;">
      <img style="width: 100%;" src="${process.env.VERCEL_URL || "https://victorojile.vercel.app"}/images/website_logo.png" alt="Victor Ojile's website logo" />
     </div>
    </header>
    
    <main role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #f5f5f5;">
     <section style="height: 4px; background-color: #818000; font-size: 0; line-height: 0;">&nbsp;
     </section>
     
     <!-- Status Bar -->
     <section style="background-color: #ffffff; padding: 20px; border-bottom: 1px solid #eeeeee;">
      <h1 style="display: inline-block; background-color: #dbeafe; border-radius: 12px; padding: 6px 14px; color: #1e40af; font-size: 13px; font-weight: bold;">🔵 New Inquiry</h1>
     </section>
     
     <!-- Visitor Info Card -->
     <section style="background-color: #ffffff; padding: 20px; color: #0F1622; font-size: 20px; font-weight: bold">
      ${escapeHtml(fullName) || "NO NAME"}
     </section>
     
     <!-- Message Section -->
     <section style="background-color: #ffffff; padding: 20px 20px 40px;">
      <h2 style="color: #888888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 12px;">
       Message
      </h2>
      <div role="presentation" style="border-left: 4px solid #818000; background-color: #FEFFF5; padding: 10px 25px; border-radius: 0 8px 8px 0;">
       <p style="color: #333333; font-size: 16px; line-height: 1.7; font-style: italic;">
        "${escapeHtml(message)}"
       </p>
      </div>
     </section>
     
     <!-- Quick Action -->
     <section style="background-color: #ffffff; padding: 0 20px 30px">
      <div style="background-color: #f97316; border-radius: 6px; max-width: 280px; text-align: center; margin: 0 auto;">
       <a href="https://victorojile.vercel.app" target="_blank" style="display: block; padding: 12px 20px; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 14px;">
        View Portfolio
       </a>
      </div>
     </section>
     
     <!-- Pro Tip Box -->
     <section style="background-color: #ffffff; padding: 0 20px 30px">
      <div style="background-color: #fef3c7; border-radius: 8px; padding: 15px 20px;">
       <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
         <td width="30" style="vertical-align: top; font-size: 16px;">💡</td>
         <td style="color: #92400e; font-size: 13px; line-height: 1.5;">
          <strong>Pro tip:</strong> Reply within 2 hours for 80% higher response rates. Even a quick "Got it, I'll review and get back to you by [day]" builds trust.
         </td>
        </tr>
       </table>
      </div>
     </section>
    </main>
    
    <footer style="background-color: #0F1622; padding: 20px 40px; text-align: center;">
     <p style="color: #888888; font-size: 12px; line-height: 1.5;">
      This is an automated notification from your portfolio contact form. Click "Reply" below to message the sender.
     </p
     <p style="color: #555555; font-size: 11px; padding-top: 8px;">
      © ${new Date().getFullYear()} Victor Ojile
     </p>
    </footer>
   </div>
   `),
   replyTo: email
  };
  
  // Auto-reply to the sender
  const mailToSender = {
   from: `"Victor Ojile" <${process.env.EMAIL_USER}>`,
   to: email,
   subject: 'Victor Ojile - Message received.',
   html: (`
   <div style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <style type="text/css">
     table {
      border-collapse: collapse;
     }
    </style>
    <header style="background-color: #0F1622; padding: 10px 20px">
     <div style="width: 60%; margin: 0 auto;">
      <img style="width: 100%;" src="${process.env.VERCEL_URL || "https://victorojile.vercel.app"}/images/website_logo.png" alt="Victor Ojile's website logo" />
     </div>
    </header>
    
    <main style="background-color: #f5f5f5; max-width: 600px; width: 100%;">
     <section style="height: 4px; background-color: #818000; font-size: 0; line-height: 0;">&nbsp;</section>
     
     <!-- Hero Section -->
     <section style="background-color: #ffffff; padding: 40px 20px 30px; text-align: center">
      <!-- Success Icon -->
      <div style="margin-bottom: 20px;display: flex; justify-content: center;">
       <div style="background-color: #22c55e; border-radius: 50%; width: 60px; height: 60px;display: flex;align-items: center;justify-content: center;">
        <span style="color: #ffffff; font-size: 30px; font-weight: bold;">✓</span>
       </div>
      </div>
      <h2 style="color: #0a0a0a; font-size: 28px; font-weight: bold; padding-bottom: 10px;">
       Message Received
      </h2>
      <p style="color: #666666; font-size: 16px; line-height: 1.6;padding: 0px 20px;">
       Thanks for reaching out, ${escapeHtml(fullName)}. I've got your message and I'm already looking forward to reading&nbsp;it.
      </p>
     </section>
     
     <!-- What Happens Next -->
     <section style="background-color: #ffffff; padding: 0 20px 30px">
      <div style="background-color: #f8f9fa; border-radius: 8px; padding: 25px 30px;">
       <h2 style="color: #0a0a0a; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 15px;">
        What happens next
       </h2>
       <div style="padding-bottom: 12px">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
         <tr>
          <td width="30" style="color: #818000; font-weight: bold; font-size: 16px; vertical-align: top;">1.</td>
          <td style="color: #444444; font-size: 14px; line-height: 1.5;">I review your message and any project details</td>
         </tr>
        </table>
       </div>
       <div style="padding-bottom: 12px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
         <tr>
          <td width="30" style="color: #818000; font-weight: bold; font-size: 16px; vertical-align: top;">2.</td>
          <td style="color: #444444; font-size: 14px; line-height: 1.5;">I reply with next steps or questions (usually within 24 hours)</td>
         </tr>
        </table>
       </div>
       <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
         <td width="30" style="color: #818000; font-weight: bold; font-size: 16px; vertical-align: top;">3.</td>
         <td style="color: #444444; font-size: 14px; line-height: 1.5;">We schedule a call if the project is a good fit</td>
        </tr>
       </table>
      </div>
     </section>
     
     <!-- Visitor Message Box -->
     <section style="background-color: #ffffff; padding: 0 20px 30px">
      <div style="border-left: 4px solid #818000; background-color: #FEFFF5; padding: 20px 25px;">
       <h2 style="color: #888888; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 8px;">
        Your message
       </h2>
       <p style="color: #333333; font-size: 15px; line-height: 1.6; font-style: italic; padding-bottom: 10px;">
        "${escapeHtml(message)}"
       </p>
       <p style="color: #999999; font-size: 12px;">
        — Sent from victorojile.vercel.app
       </p>
      </div>
     </section>
     
     <!-- CTA Button -->
     <section style="background-color: #ffffff; padding: 0 20px 50px">
      <div style="background-color: #f97316; border-radius: 6px; max-width: 280px; text-align: center; margin: 0 auto;">
       <a href="https://victorojile.vercel.app#projects" target="_blank" style="display: inline-block; padding: 14px 32px; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px; border-radius: 6px;">
        View My Work →
       </a>
      </div>
     </section>
    </main>
    
    <footer style="background-color: #0F1622; padding: 20px 40px">
     <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center">
      <tr>
       <td style="padding: 0 10px;">
        <a href="https://victorojile.vercel.app" target="_blank" style="color: #818000; text-decoration: none; font-size: 13px;">Portfolio</a>
       </td>
       <td style="color: #444444;">|</td>
       <td style="padding: 0 10px;">
        <a href="https://github.com/victorOJILE" target="_blank" style="color: #818000; text-decoration: none; font-size: 13px;">GitHub</a>
       </td>
       <td style="color: #444444;">|</td>
       <td style="padding: 0 10px;">
        <a href="https://www.linkedin.com/in/victor-ojile-aa4896208" target="_blank" style="color: #818000; text-decoration: none; font-size: 13px;">LinkedIn</a>
       </td>
      </tr>
     </table>
     
     <div align="center" style="color: #909090; font-size: 11px; line-height: 1.5; padding-top: 15px">
      You're receiving this because you contacted me through my portfolio.<br><br>
      © ${new Date().getFullYear()} Victor Ojile.
     </div>
    </footer>
   </div>
   `)
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