import { storage } from './storage';

// AI-Generated Email Templates for MyLinked Business
export const aiEmailTemplates = [
  {
    id: 'welcome_onboarding',
    name: 'Welcome & Onboarding',
    subject: 'Welcome to MyLinked! 🚀 Your Digital Identity Journey Starts Here',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 0; border-radius: 10px;">
        <div style="background: white; margin: 20px; border-radius: 8px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">Welcome to MyLinked!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your Professional Digital Identity Platform</p>
          </div>
          
          <div style="padding: 30px;">
            <h2 style="color: #333; margin-top: 0;">Hi {{name}},</h2>
            <p style="color: #666; line-height: 1.6; font-size: 16px;">
              Welcome to MyLinked! You've just joined thousands of professionals who are transforming their digital presence. 
              Here's what makes your journey special:
            </p>
            
            <div style="background: #f8f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #667eea; margin-top: 0;">🎯 Your Next Steps:</h3>
              <ul style="color: #666; line-height: 1.8;">
                <li><strong>Complete your profile</strong> - Add your bio, profession, and profile image</li>
                <li><strong>Connect your social accounts</strong> - Link Instagram, LinkedIn, Twitter, and more</li>
                <li><strong>Customize your theme</strong> - Choose from premium themes that match your brand</li>
                <li><strong>Share your unique link</strong> - Start building your professional network</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{dashboard_url}}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                Complete Your Profile →
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
              Need help getting started? Reply to this email or visit our <a href="{{help_url}}" style="color: #667eea;">Help Center</a>
            </p>
          </div>
        </div>
      </div>
    `,
    variables: ['name', 'dashboard_url', 'help_url']
  },
  
  {
    id: 'feature_announcement',
    name: 'New Feature Announcement',
    subject: '🎉 New Feature Alert: AI-Powered Link Optimization is Here!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f5f5f5; padding: 20px;">
        <div style="background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 40px; text-align: center;">
            <h1 style="margin: 0; font-size: 32px;">🚀 Exciting Update!</h1>
            <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">AI-Powered Features Just Landed</p>
          </div>
          
          <div style="padding: 40px;">
            <h2 style="color: #333; margin-top: 0;">Hi {{name}},</h2>
            <p style="color: #666; line-height: 1.6; font-size: 16px;">
              We've been working hard to make MyLinked even more powerful for you. Today, we're thrilled to announce 
              our latest AI-powered features that will transform how you manage your digital presence!
            </p>
            
            <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 25px; border-radius: 10px; margin: 25px 0;">
              <h3 style="margin-top: 0; font-size: 20px;">🤖 New AI Features:</h3>
              <ul style="line-height: 1.8; margin: 15px 0;">
                <li><strong>Smart Link Optimization</strong> - AI analyzes and suggests better titles and descriptions</li>
                <li><strong>Social Score Enhancement</strong> - Get personalized tips to boost your profile score</li>
                <li><strong>Branding Suggestions</strong> - AI-powered color schemes and themes for your industry</li>
                <li><strong>Content Insights</strong> - Analytics that actually help you grow your network</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{dashboard_url}}" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 15px 35px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; font-size: 16px;">
                Try AI Features Now →
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; text-align: center; margin-top: 30px;">
              These features are available to all MyLinked users at no extra cost!
            </p>
          </div>
        </div>
      </div>
    `,
    variables: ['name', 'dashboard_url']
  },
  
  {
    id: 'engagement_boost',
    name: 'Engagement Boost Campaign',
    subject: '📈 {{name}}, Your Profile Views Are Up! Here\'s How to Capitalize',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 26px;">📊 Your Profile is Trending!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Let's maximize this momentum</p>
        </div>
        
        <div style="padding: 30px;">
          <h2 style="color: #333; margin-top: 0;">Great news, {{name}}!</h2>
          <p style="color: #666; line-height: 1.6; font-size: 16px;">
            Your MyLinked profile has been getting more attention lately! Here's what's happening:
          </p>
          
          <div style="background: #f8f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
            <h3 style="color: #667eea; margin-top: 0;">📈 Your Recent Stats:</h3>
            <ul style="color: #666; line-height: 1.8; margin: 10px 0;">
              <li><strong>Profile Views:</strong> +{{view_increase}}% this week</li>
              <li><strong>Link Clicks:</strong> +{{click_increase}}% engagement</li>
              <li><strong>Social Score:</strong> {{social_score}}/100</li>
              <li><strong>Network Growth:</strong> {{new_connections}} new connections</li>
            </ul>
          </div>
          
          <div style="background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%); color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">🚀 Recommended Actions:</h3>
            <ul style="line-height: 1.8; margin: 10px 0;">
              <li>Update your bio with recent achievements</li>
              <li>Add 2-3 new social links to capture more traffic</li>
              <li>Enable link analytics to track your growth</li>
              <li>Share your MyLinked profile on your main social accounts</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{dashboard_url}}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Optimize Your Profile →
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px; text-align: center; margin-top: 30px;">
            Keep up the great work! Your professional network is growing. 🌟
          </p>
        </div>
      </div>
    `,
    variables: ['name', 'view_increase', 'click_increase', 'social_score', 'new_connections', 'dashboard_url']
  },
  
  {
    id: 'monthly_newsletter',
    name: 'Monthly Newsletter',
    subject: '🌟 MyLinked Monthly: Platform Updates & Success Stories',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: white;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; text-align: center;">
          <h1 style="margin: 0; font-size: 32px;">MyLinked Monthly</h1>
          <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">{{month_year}} Edition</p>
        </div>
        
        <div style="padding: 40px;">
          <h2 style="color: #333; margin-top: 0;">Hi {{name}},</h2>
          <p style="color: #666; line-height: 1.6; font-size: 16px;">
            Welcome to this month's MyLinked update! Here's what's been happening in our community and 
            what's coming next to help you build your digital presence.
          </p>
          
          <div style="background: #f8f9ff; padding: 25px; border-radius: 10px; margin: 25px 0;">
            <h3 style="color: #667eea; margin-top: 0;">🎯 This Month's Highlights:</h3>
            <ul style="color: #666; line-height: 1.8;">
              <li><strong>{{feature_1}}</strong> - {{feature_1_description}}</li>
              <li><strong>{{feature_2}}</strong> - {{feature_2_description}}</li>
              <li><strong>{{feature_3}}</strong> - {{feature_3_description}}</li>
            </ul>
          </div>
          
          <div style="background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); padding: 25px; border-radius: 10px; margin: 25px 0;">
            <h3 style="color: #d4691a; margin-top: 0;">📊 Community Stats:</h3>
            <div style="display: flex; justify-content: space-around; text-align: center;">
              <div style="flex: 1;">
                <h4 style="color: #d4691a; margin: 0; font-size: 24px;">{{total_users}}</h4>
                <p style="color: #666; margin: 5px 0; font-size: 14px;">Active Users</p>
              </div>
              <div style="flex: 1;">
                <h4 style="color: #d4691a; margin: 0; font-size: 24px;">{{total_links}}</h4>
                <p style="color: #666; margin: 5px 0; font-size: 14px;">Links Created</p>
              </div>
              <div style="flex: 1;">
                <h4 style="color: #d4691a; margin: 0; font-size: 24px;">{{total_views}}</h4>
                <p style="color: #666; margin: 5px 0; font-size: 14px;">Profile Views</p>
              </div>
            </div>
          </div>
          
          <div style="background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); padding: 25px; border-radius: 10px; margin: 25px 0;">
            <h3 style="color: #2c5282; margin-top: 0;">🏆 Success Story:</h3>
            <p style="color: #666; line-height: 1.6; font-style: italic;">
              "{{success_story}}"
            </p>
            <p style="color: #2c5282; font-weight: bold; margin-top: 15px;">- {{success_story_author}}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{dashboard_url}}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 35px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; font-size: 16px;">
              Visit Your Dashboard →
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px; text-align: center; margin-top: 30px;">
            Thank you for being part of the MyLinked community! 🙏
          </p>
        </div>
      </div>
    `,
    variables: ['name', 'month_year', 'feature_1', 'feature_1_description', 'feature_2', 'feature_2_description', 'feature_3', 'feature_3_description', 'total_users', 'total_links', 'total_views', 'success_story', 'success_story_author', 'dashboard_url']
  },
  
  {
    id: 'reactivation_campaign',
    name: 'User Reactivation Campaign',
    subject: '👋 We Miss You! Your MyLinked Profile is Waiting',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 26px;">We Miss You! 💜</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your digital identity is waiting for you</p>
        </div>
        
        <div style="padding: 30px;">
          <h2 style="color: #333; margin-top: 0;">Hi {{name}},</h2>
          <p style="color: #666; line-height: 1.6; font-size: 16px;">
            We noticed you haven't logged into MyLinked in a while. Your professional profile is still there, 
            and we've been busy adding new features that we think you'll love!
          </p>
          
          <div style="background: #fff5f5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff9a9e;">
            <h3 style="color: #c53030; margin-top: 0;">✨ What's New Since Your Last Visit:</h3>
            <ul style="color: #666; line-height: 1.8;">
              <li><strong>AI-Powered Optimization</strong> - Let AI improve your profile automatically</li>
              <li><strong>Advanced Analytics</strong> - See exactly how your network is growing</li>
              <li><strong>New Themes</strong> - Fresh designs to match your professional brand</li>
              <li><strong>Enhanced Sharing</strong> - Better ways to promote your profile</li>
            </ul>
          </div>
          
          <div style="background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%); color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">🎁 Welcome Back Offer:</h3>
            <p style="line-height: 1.6; margin: 10px 0;">
              Log back in within the next 7 days and we'll give you a complimentary profile optimization 
              session with our AI tools - completely free!
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{login_url}}" style="background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); color: white; padding: 15px 35px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; font-size: 16px;">
              Welcome Back! →
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px; text-align: center; margin-top: 30px;">
            Your professional network is waiting. Let's get you back on track! 🚀
          </p>
        </div>
      </div>
    `,
    variables: ['name', 'login_url']
  },
  
  {
    id: 'premium_upgrade',
    name: 'Premium Upgrade Campaign',
    subject: '🚀 Ready to Supercharge Your Professional Brand, {{name}}?',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">🌟 Unlock Premium Features</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Take your professional presence to the next level</p>
        </div>
        
        <div style="padding: 40px;">
          <h2 style="color: #333; margin-top: 0;">Hi {{name}},</h2>
          <p style="color: #666; line-height: 1.6; font-size: 16px;">
            You've been making great progress with your MyLinked profile! We've noticed you're actively 
            building your digital presence, and we think you're ready for our premium features.
          </p>
          
          <div style="background: #f8f9ff; padding: 25px; border-radius: 10px; margin: 25px 0;">
            <h3 style="color: #667eea; margin-top: 0;">🎯 Your Current Success:</h3>
            <ul style="color: #666; line-height: 1.8;">
              <li><strong>{{profile_views}}</strong> profile views this month</li>
              <li><strong>{{link_clicks}}</strong> link clicks generated</li>
              <li><strong>{{social_score}}/100</strong> social score achieved</li>
              <li><strong>{{connections}}</strong> professional connections made</li>
            </ul>
          </div>
          
          <div style="background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); padding: 25px; border-radius: 10px; margin: 25px 0;">
            <h3 style="color: #d4691a; margin-top: 0;">🚀 Premium Features:</h3>
            <ul style="color: #666; line-height: 1.8;">
              <li><strong>Advanced Analytics</strong> - Detailed insights about your audience</li>
              <li><strong>Custom Branding</strong> - Upload your own logos and colors</li>
              <li><strong>Priority Support</strong> - Get help when you need it</li>
              <li><strong>Advanced Integrations</strong> - Connect with more platforms</li>
              <li><strong>Custom Domain</strong> - Use your own domain name</li>
            </ul>
          </div>
          
          <div style="background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); padding: 25px; border-radius: 10px; margin: 25px 0; text-align: center;">
            <h3 style="color: #2c5282; margin-top: 0;">💡 Limited Time Offer</h3>
            <p style="color: #666; line-height: 1.6; margin: 10px 0;">
              Upgrade to Premium this month and get <strong>50% off</strong> your first year!
            </p>
            <p style="color: #2c5282; font-weight: bold; font-size: 18px; margin: 15px 0;">
              Only $\{{price}}/month (normally $\{{regular_price}}/month)
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{upgrade_url}}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 35px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; font-size: 16px;">
              Upgrade to Premium →
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px; text-align: center; margin-top: 30px;">
            30-day money-back guarantee. Cancel anytime. 💜
          </p>
        </div>
      </div>
    `,
    variables: ['name', 'profile_views', 'link_clicks', 'social_score', 'connections', 'price', 'regular_price', 'upgrade_url']
  },
  
  {
    id: 'support_followup',
    name: 'Support Follow-up',
    subject: '🤝 How was your MyLinked support experience?',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 26px;">Thank You! 🙏</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your feedback helps us improve</p>
        </div>
        
        <div style="padding: 30px;">
          <h2 style="color: #333; margin-top: 0;">Hi {{name}},</h2>
          <p style="color: #666; line-height: 1.6; font-size: 16px;">
            We hope our support team was able to help you with your recent inquiry about "{{support_topic}}". 
            Your experience matters to us, and we'd love to hear how we did!
          </p>
          
          <div style="background: #f8f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #84fab0;">
            <h3 style="color: #2d7d32; margin-top: 0;">📝 Quick Feedback:</h3>
            <p style="color: #666; line-height: 1.6;">
              How would you rate your support experience? Your feedback helps us serve you better in the future.
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <div style="display: inline-block; margin: 10px;">
              <a href="{{feedback_url}}?rating=excellent" style="background: #4caf50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; margin: 0 5px;">
                😊 Excellent
              </a>
              <a href="{{feedback_url}}?rating=good" style="background: #2196f3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; margin: 0 5px;">
                👍 Good
              </a>
              <a href="{{feedback_url}}?rating=fair" style="background: #ff9800; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; margin: 0 5px;">
                😐 Fair
              </a>
              <a href="{{feedback_url}}?rating=poor" style="background: #f44336; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; margin: 0 5px;">
                😟 Poor
              </a>
            </div>
          </div>
          
          <div style="background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #d4691a; margin-top: 0;">💡 Need More Help?</h3>
            <p style="color: #666; line-height: 1.6; margin: 10px 0;">
              If you have any other questions or need additional assistance, we're here to help! 
              You can reply to this email or visit our help center.
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{help_center_url}}" style="background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
              Visit Help Center →
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px; text-align: center; margin-top: 30px;">
            Thanks for being part of the MyLinked community! 🌟
          </p>
        </div>
      </div>
    `,
    variables: ['name', 'support_topic', 'feedback_url', 'help_center_url']
  }
];

// Function to initialize AI-generated templates
export async function initAIEmailTemplates() {
  console.log('Initializing AI-generated email templates...');
  
  for (const template of aiEmailTemplates) {
    try {
      await storage.createEmailTemplate({
        name: template.name,
        subject: template.subject,
        html: template.html,
        variables: template.variables
      });
      console.log(`✅ Created template: ${template.name}`);
    } catch (error) {
      console.log(`Template ${template.name} already exists or error occurred`);
    }
  }
  
  console.log('AI email templates initialization complete!');
}