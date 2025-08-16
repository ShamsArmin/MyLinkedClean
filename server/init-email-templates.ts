import { storage } from './storage';
import { InsertEmailTemplate } from '../shared/email-schema';

export async function initializeEmailTemplates() {
  const templates: InsertEmailTemplate[] = [
    {
      name: 'Welcome Email',
      type: 'welcome',
      subject: 'Welcome to MyLinked! 🎉',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">Welcome to MyLinked!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Your professional social links platform</p>
          </div>
          
          <div style="padding: 30px 0;">
            <h2 style="color: #333; font-size: 22px;">Hi {{name}},</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Welcome to MyLinked! We're excited to have you join our community of professionals who are taking control of their digital presence.
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin: 0 0 15px 0;">What you can do with MyLinked:</h3>
              <ul style="color: #666; margin: 0; padding-left: 20px;">
                <li style="margin-bottom: 8px;">Create a professional profile with all your social links</li>
                <li style="margin-bottom: 8px;">Track engagement and analytics</li>
                <li style="margin-bottom: 8px;">Connect with other professionals</li>
                <li style="margin-bottom: 8px;">Showcase your projects and collaborations</li>
                <li style="margin-bottom: 8px;">Get AI-powered optimization suggestions</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://www.mylinked.app" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                Get Started Now
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              Need help? Reply to this email or visit our <a href="https://www.mylinked.app/help" style="color: #667eea;">help center</a>.
            </p>
          </div>
        </div>
      `,
      textContent: `
        Welcome to MyLinked!
        
        Hi {{name}},
        
        Welcome to MyLinked! We're excited to have you join our community of professionals who are taking control of their digital presence.
        
        What you can do with MyLinked:
        - Create a professional profile with all your social links
        - Track engagement and analytics
        - Connect with other professionals
        - Showcase your projects and collaborations
        - Get AI-powered optimization suggestions
        
        Get started now: https://www.mylinked.app
        
        Need help? Reply to this email or visit our help center: https://www.mylinked.app/help
      `,
      isActive: true,
      createdBy: 'system'
    },
    {
      name: 'Password Reset',
      type: 'password_reset',
      subject: 'Reset Your MyLinked Password',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="margin: 0; color: #333; font-size: 24px;">Password Reset Request</h1>
          </div>
          
          <div style="padding: 30px 0;">
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Hi {{name}},
            </p>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              We received a request to reset your password for your MyLinked account. If you didn't make this request, you can safely ignore this email.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{resetUrl}}" style="background: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              This link will expire in 24 hours for security reasons.
            </p>
            
            <p style="color: #666; font-size: 14px;">
              If you're having trouble clicking the button, copy and paste this URL into your browser:
              <br>{{resetUrl}}
            </p>
          </div>
        </div>
      `,
      textContent: `
        Password Reset Request
        
        Hi {{name}},
        
        We received a request to reset your password for your MyLinked account. If you didn't make this request, you can safely ignore this email.
        
        Reset your password: {{resetUrl}}
        
        This link will expire in 24 hours for security reasons.
      `,
      isActive: true,
      createdBy: 'system'
    },
    {
      name: 'Password Changed',
      type: 'password_changed',
      subject: 'Your MyLinked Password Has Been Changed',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #d4edda; padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="margin: 0; color: #155724; font-size: 24px;">Password Changed Successfully</h1>
          </div>
          
          <div style="padding: 30px 0;">
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Hi {{name}},
            </p>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              This is a confirmation that your password for your MyLinked account has been successfully changed.
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #333; margin: 0; font-weight: bold;">Security Tips:</p>
              <ul style="color: #666; margin: 10px 0 0 0; padding-left: 20px;">
                <li>Use a strong, unique password</li>
                <li>Don't share your password with anyone</li>
                <li>Enable two-factor authentication if available</li>
              </ul>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              If you didn't make this change, please contact our support team immediately.
            </p>
          </div>
        </div>
      `,
      textContent: `
        Password Changed Successfully
        
        Hi {{name}},
        
        This is a confirmation that your password for your MyLinked account has been successfully changed.
        
        Security Tips:
        - Use a strong, unique password
        - Don't share your password with anyone
        - Enable two-factor authentication if available
        
        If you didn't make this change, please contact our support team immediately.
      `,
      isActive: true,
      createdBy: 'system'
    },
    {
      name: 'Marketing Email',
      type: 'marketing',
      subject: 'Boost Your Professional Presence with MyLinked',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">{{campaignTitle}}</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">{{campaignSubtitle}}</p>
          </div>
          
          <div style="padding: 30px 0;">
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Hi {{name}},
            </p>
            
            <div style="color: #666; font-size: 16px; line-height: 1.6;">
              {{campaignContent}}
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{ctaUrl}}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                {{ctaText}}
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              You're receiving this because you're a valued member of MyLinked. You can <a href="{{unsubscribeUrl}}" style="color: #667eea;">unsubscribe</a> at any time.
            </p>
          </div>
        </div>
      `,
      textContent: `
        {{campaignTitle}}
        
        Hi {{name}},
        
        {{campaignContent}}
        
        {{ctaText}}: {{ctaUrl}}
        
        You're receiving this because you're a valued member of MyLinked. You can unsubscribe at any time: {{unsubscribeUrl}}
      `,
      isActive: true,
      createdBy: 'system'
    },
    {
      name: 'Newsletter',
      type: 'newsletter',
      subject: 'MyLinked Newsletter - {{newsTitle}}',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="margin: 0; color: #333; font-size: 24px;">MyLinked Newsletter</h1>
            <p style="margin: 10px 0 0 0; color: #666; font-size: 16px;">{{newsTitle}}</p>
          </div>
          
          <div style="padding: 30px 0;">
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Hi {{name}},
            </p>
            
            <div style="color: #666; font-size: 16px; line-height: 1.6;">
              {{newsContent}}
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin: 0 0 15px 0;">Latest Updates:</h3>
              <div style="color: #666;">
                {{updates}}
              </div>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://www.mylinked.app" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                Visit MyLinked
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              Thanks for being part of the MyLinked community! You can <a href="{{unsubscribeUrl}}" style="color: #667eea;">unsubscribe</a> from newsletters at any time.
            </p>
          </div>
        </div>
      `,
      textContent: `
        MyLinked Newsletter - {{newsTitle}}
        
        Hi {{name}},
        
        {{newsContent}}
        
        Latest Updates:
        {{updates}}
        
        Visit MyLinked: https://www.mylinked.app
        
        Thanks for being part of the MyLinked community! You can unsubscribe from newsletters at any time: {{unsubscribeUrl}}
      `,
      isActive: true,
      createdBy: 'system'
    },
    {
      name: 'Role Invitation',
      type: 'role_invitation',
      subject: 'You\'ve Been Invited to Join MyLinked Team',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">Team Invitation</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">You've been invited to join MyLinked</p>
          </div>
          
          <div style="padding: 30px 0;">
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Hi {{name}},
            </p>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              You've been invited to join the MyLinked team with the role of <strong>{{roleName}}</strong>.
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin: 0 0 15px 0;">What's next?</h3>
              <p style="color: #666; margin: 0;">
                Click the button below to accept your invitation and set up your account. You'll be able to access the admin dashboard and start contributing to the MyLinked platform.
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{acceptUrl}}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                Accept Invitation
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              If you have any questions, please don't hesitate to reach out to our team.
            </p>
          </div>
        </div>
      `,
      textContent: `
        Team Invitation
        
        Hi {{name}},
        
        You've been invited to join the MyLinked team with the role of {{roleName}}.
        
        What's next?
        Click the link below to accept your invitation and set up your account. You'll be able to access the admin dashboard and start contributing to the MyLinked platform.
        
        Accept Invitation: {{acceptUrl}}
        
        If you have any questions, please don't hesitate to reach out to our team.
      `,
      isActive: true,
      createdBy: 'system'
    },
    {
      name: 'Role Update',
      type: 'role_update',
      subject: 'Your MyLinked Role Has Been Updated',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #d4edda; padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="margin: 0; color: #155724; font-size: 24px;">Role Updated</h1>
          </div>
          
          <div style="padding: 30px 0;">
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Hi {{name}},
            </p>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Your role in MyLinked has been updated to <strong>{{roleName}}</strong>.
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #333; margin: 0; font-weight: bold;">Your new permissions may include:</p>
              <ul style="color: #666; margin: 10px 0 0 0; padding-left: 20px;">
                <li>Access to admin dashboard</li>
                <li>User management capabilities</li>
                <li>Content moderation tools</li>
                <li>Analytics and reporting</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://www.mylinked.app/admin" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                Access Admin Dashboard
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              If you have any questions about your new role, please contact our support team.
            </p>
          </div>
        </div>
      `,
      textContent: `
        Role Updated
        
        Hi {{name}},
        
        Your role in MyLinked has been updated to {{roleName}}.
        
        Your new permissions may include:
        - Access to admin dashboard
        - User management capabilities
        - Content moderation tools
        - Analytics and reporting
        
        Access Admin Dashboard: https://www.mylinked.app/admin
        
        If you have any questions about your new role, please contact our support team.
      `,
      isActive: true
    }
  ];

  try {
    console.log('Initializing email templates...');
    
    // Check if templates already exist
    const existingTemplates = await storage.getEmailTemplates();
    if (existingTemplates.length > 0) {
      console.log(`Found ${existingTemplates.length} existing email templates. Skipping initialization.`);
      return;
    }

    // Create all templates
    for (const template of templates) {
      await storage.createEmailTemplate(template as InsertEmailTemplate);
      console.log(`Created email template: ${template.name}`);
    }

    console.log('Email templates initialized successfully!');
  } catch (error) {
    console.error('Error initializing email templates:', error);
  }
}

// Run initialization if this file is executed directly
if (import.meta.url === new URL(import.meta.url).href) {
  initializeEmailTemplates();
}