import sgMail from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable must be set");
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    await sgMail.send({
      to: params.to,
      from: params.from,
      subject: params.subject,
      text: params.text,
      html: params.html,
    });
    console.log(`Email sent successfully to ${params.to} from ${params.from}`);
    return true;
  } catch (error: any) {
    console.error('SendGrid email error:', error);
    if (error.response && error.response.body && error.response.body.errors) {
      console.error('SendGrid error details:', error.response.body.errors);
    }
    return false;
  }
}

export async function sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
  const resetUrl = `${process.env.BASE_URL || 'http://localhost:5000'}/reset-password?token=${resetToken}`;
  
  const subject = 'Reset Your MyLinked Password';
  
  const text = `
Hello,

You recently requested to reset your password for your MyLinked account. Click the link below to reset it:

${resetUrl}

This link will expire in 1 hour for security reasons.

If you did not request a password reset, please ignore this email or contact our support team if you have questions.

Best regards,
The MyLinked Team
`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Reset Your Password</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .button { display: inline-block; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; text-decoration: none; padding: 12px 30px; border-radius: 6px; margin: 20px 0; }
    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Reset Your Password</h1>
    </div>
    <div class="content">
      <p>Hello,</p>
      
      <p>You recently requested to reset your password for your MyLinked account. Click the button below to reset it:</p>
      
      <p style="text-align: center;">
        <a href="${resetUrl}" class="button">Reset My Password</a>
      </p>
      
      <p>Or copy and paste this link into your browser:</p>
      <p style="word-break: break-all; background: #e5e7eb; padding: 10px; border-radius: 4px;">${resetUrl}</p>
      
      <p><strong>This link will expire in 1 hour</strong> for security reasons.</p>
      
      <p>If you did not request a password reset, please ignore this email or contact our support team if you have questions.</p>
      
      <div class="footer">
        <p>Best regards,<br>The MyLinked Team</p>
        <p><a href="mailto:support@mylinked.app">support@mylinked.app</a></p>
      </div>
    </div>
  </div>
</body>
</html>
`;

  // Try different verified sender emails
  const senderEmails = [
    'support@mylinked.app',
    'info@mylinked.app', 
    'armin.shams@mylinked.app'
  ];
  
  for (const senderEmail of senderEmails) {
    const success = await sendEmail({
      to: email,
      from: senderEmail,
      subject,
      text,
      html
    });
    
    if (success) {
      console.log(`Password reset email sent successfully from ${senderEmail} to ${email}`);
      return true;
    } else {
      console.log(`Failed to send from ${senderEmail}, trying next sender...`);
    }
  }
  
  console.error('Failed to send password reset email with all sender addresses');
  return false;
}