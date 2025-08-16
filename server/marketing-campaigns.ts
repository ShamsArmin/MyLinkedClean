import { storage } from './storage';

// Pre-built Marketing Campaigns for MyLinked
export const marketingCampaigns = [
  {
    id: 'new_user_sequence',
    name: 'New User Onboarding Sequence',
    description: 'Welcome new users and guide them through setup',
    campaigns: [
      {
        day: 0,
        trigger: 'registration',
        template: 'welcome_onboarding',
        subject: 'Welcome to MyLinked! 🚀 Your Digital Identity Journey Starts Here',
        variables: {
          name: '{{user.name}}',
          dashboard_url: 'https://www.mylinked.app/dashboard',
          help_url: 'https://www.mylinked.app/help'
        }
      },
      {
        day: 3,
        trigger: 'time_delay',
        template: 'setup_reminder',
        subject: 'Quick Setup: Complete Your MyLinked Profile in 2 Minutes',
        variables: {
          name: '{{user.name}}',
          dashboard_url: 'https://www.mylinked.app/dashboard',
          profile_completion: '{{user.profile_completion}}%'
        }
      },
      {
        day: 7,
        trigger: 'time_delay',
        template: 'feature_introduction',
        subject: 'Discover AI-Powered Features That Will Transform Your Profile',
        variables: {
          name: '{{user.name}}',
          dashboard_url: 'https://www.mylinked.app/dashboard'
        }
      }
    ]
  },
  
  {
    id: 'engagement_campaign',
    name: 'User Engagement Campaign',
    description: 'Re-engage active users and boost platform usage',
    campaigns: [
      {
        day: 0,
        trigger: 'profile_view_spike',
        template: 'engagement_boost',
        subject: '📈 {{name}}, Your Profile Views Are Up! Here\'s How to Capitalize',
        variables: {
          name: '{{user.name}}',
          view_increase: '{{analytics.view_increase}}',
          click_increase: '{{analytics.click_increase}}',
          social_score: '{{user.social_score}}',
          new_connections: '{{analytics.new_connections}}',
          dashboard_url: 'https://www.mylinked.app/dashboard'
        }
      },
      {
        day: 14,
        trigger: 'time_delay',
        template: 'optimization_tips',
        subject: 'Weekly Optimization Tips: Boost Your Professional Presence',
        variables: {
          name: '{{user.name}}',
          dashboard_url: 'https://www.mylinked.app/dashboard'
        }
      }
    ]
  },
  
  {
    id: 'feature_announcement',
    name: 'New Feature Announcement Campaign',
    description: 'Announce new features and updates to all users',
    campaigns: [
      {
        day: 0,
        trigger: 'feature_launch',
        template: 'feature_announcement',
        subject: '🎉 New Feature Alert: {{feature_name}} is Here!',
        variables: {
          name: '{{user.name}}',
          feature_name: '{{campaign.feature_name}}',
          dashboard_url: 'https://www.mylinked.app/dashboard'
        }
      },
      {
        day: 7,
        trigger: 'time_delay',
        template: 'feature_tutorial',
        subject: 'Master {{feature_name}}: Step-by-Step Guide',
        variables: {
          name: '{{user.name}}',
          feature_name: '{{campaign.feature_name}}',
          tutorial_url: 'https://www.mylinked.app/help/{{campaign.feature_slug}}'
        }
      }
    ]
  },
  
  {
    id: 'reactivation_campaign',
    name: 'Win-Back Campaign',
    description: 'Re-engage inactive users and bring them back',
    campaigns: [
      {
        day: 0,
        trigger: 'inactive_30_days',
        template: 'reactivation_campaign',
        subject: '👋 We Miss You! Your MyLinked Profile is Waiting',
        variables: {
          name: '{{user.name}}',
          login_url: 'https://www.mylinked.app/login'
        }
      },
      {
        day: 7,
        trigger: 'still_inactive',
        template: 'final_winback',
        subject: 'Last Chance: Don\'t Lose Your Professional Network',
        variables: {
          name: '{{user.name}}',
          login_url: 'https://www.mylinked.app/login'
        }
      }
    ]
  },
  
  {
    id: 'monthly_newsletter',
    name: 'Monthly Newsletter Campaign',
    description: 'Regular updates and community highlights',
    campaigns: [
      {
        day: 0,
        trigger: 'monthly_schedule',
        template: 'monthly_newsletter',
        subject: '🌟 MyLinked Monthly: Platform Updates & Success Stories',
        variables: {
          name: '{{user.name}}',
          month_year: '{{date.month_year}}',
          feature_1: '{{newsletter.feature_1}}',
          feature_1_description: '{{newsletter.feature_1_description}}',
          feature_2: '{{newsletter.feature_2}}',
          feature_2_description: '{{newsletter.feature_2_description}}',
          feature_3: '{{newsletter.feature_3}}',
          feature_3_description: '{{newsletter.feature_3_description}}',
          total_users: '{{stats.total_users}}',
          total_links: '{{stats.total_links}}',
          total_views: '{{stats.total_views}}',
          success_story: '{{newsletter.success_story}}',
          success_story_author: '{{newsletter.success_story_author}}',
          dashboard_url: 'https://www.mylinked.app/dashboard'
        }
      }
    ]
  },
  
  {
    id: 'premium_upgrade',
    name: 'Premium Upgrade Campaign',
    description: 'Convert free users to premium subscribers',
    campaigns: [
      {
        day: 0,
        trigger: 'usage_threshold',
        template: 'premium_upgrade',
        subject: '🚀 Ready to Supercharge Your Professional Brand, {{name}}?',
        variables: {
          name: '{{user.name}}',
          profile_views: '{{user.profile_views}}',
          link_clicks: '{{user.link_clicks}}',
          social_score: '{{user.social_score}}',
          connections: '{{user.connections}}',
          price: '14.99',
          regular_price: '29.99',
          upgrade_url: 'https://www.mylinked.app/upgrade'
        }
      },
      {
        day: 7,
        trigger: 'not_upgraded',
        template: 'premium_limited_offer',
        subject: 'Final Hours: 50% Off Premium Ends Tonight!',
        variables: {
          name: '{{user.name}}',
          upgrade_url: 'https://www.mylinked.app/upgrade'
        }
      }
    ]
  }
];

// Ready-to-use campaign templates with AI-generated content
export const campaignTemplates = {
  // Social Media Growth Campaign
  social_media_growth: {
    name: 'Social Media Growth Accelerator',
    subject: '🚀 {{name}}, Let\'s Grow Your Social Media Following Together!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 26px;">📈 Social Media Growth Program</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Accelerate your professional presence</p>
        </div>
        
        <div style="padding: 30px;">
          <h2 style="color: #333; margin-top: 0;">Hi {{name}},</h2>
          <p style="color: #666; line-height: 1.6; font-size: 16px;">
            Ready to take your social media presence to the next level? We've created a comprehensive growth 
            program specifically designed for professionals like you.
          </p>
          
          <div style="background: #f8f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #667eea; margin-top: 0;">🎯 What's Included:</h3>
            <ul style="color: #666; line-height: 1.8;">
              <li><strong>Profile Optimization</strong> - AI-powered improvements to your bio and links</li>
              <li><strong>Content Strategy</strong> - Proven posting schedule and content ideas</li>
              <li><strong>Analytics Tracking</strong> - Monitor your growth and engagement metrics</li>
              <li><strong>Network Building</strong> - Connect with industry professionals</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{program_url}}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
              Join Growth Program →
            </a>
          </div>
        </div>
      </div>
    `,
    variables: ['name', 'program_url']
  },
  
  // Professional Networking Campaign
  professional_networking: {
    name: 'Professional Networking Mastery',
    subject: '🤝 {{name}}, Master Professional Networking in 2025',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 26px;">🌟 Networking Mastery</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Build meaningful professional connections</p>
        </div>
        
        <div style="padding: 30px;">
          <h2 style="color: #333; margin-top: 0;">Hi {{name}},</h2>
          <p style="color: #666; line-height: 1.6; font-size: 16px;">
            Great networking isn't about collecting contacts - it's about building genuine relationships 
            that advance your career. Let's master it together.
          </p>
          
          <div style="background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #d4691a; margin-top: 0;">🎯 Master These Skills:</h3>
            <ul style="color: #666; line-height: 1.8;">
              <li><strong>Strategic Connection Building</strong> - Quality over quantity approach</li>
              <li><strong>Personal Brand Development</strong> - Stand out in your industry</li>
              <li><strong>Follow-up Mastery</strong> - Turn connections into opportunities</li>
              <li><strong>Digital Presence Optimization</strong> - Make every platform work for you</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{networking_guide_url}}" style="background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
              Get Networking Guide →
            </a>
          </div>
        </div>
      </div>
    `,
    variables: ['name', 'networking_guide_url']
  },
  
  // Industry-Specific Campaign
  industry_spotlight: {
    name: 'Industry Spotlight Series',
    subject: '🏢 {{name}}, Your Industry is Transforming - Stay Ahead',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 26px;">🔍 Industry Spotlight</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">{{industry}} trends and opportunities</p>
        </div>
        
        <div style="padding: 30px;">
          <h2 style="color: #333; margin-top: 0;">Hi {{name}},</h2>
          <p style="color: #666; line-height: 1.6; font-size: 16px;">
            The {{industry}} industry is evolving rapidly, and staying ahead of trends is crucial for 
            career advancement. Here's what you need to know this month.
          </p>
          
          <div style="background: #f8f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #667eea; margin-top: 0;">📊 Key Trends:</h3>
            <ul style="color: #666; line-height: 1.8;">
              <li><strong>{{trend_1}}</strong> - {{trend_1_description}}</li>
              <li><strong>{{trend_2}}</strong> - {{trend_2_description}}</li>
              <li><strong>{{trend_3}}</strong> - {{trend_3_description}}</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{industry_report_url}}" style="background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
              Read Full Report →
            </a>
          </div>
        </div>
      </div>
    `,
    variables: ['name', 'industry', 'trend_1', 'trend_1_description', 'trend_2', 'trend_2_description', 'trend_3', 'trend_3_description', 'industry_report_url']
  }
};

// AI-Generated Campaign Ideas
export const aiCampaignIdeas = [
  {
    name: 'Profile Optimization Challenge',
    description: '7-day challenge to optimize user profiles',
    target: 'New and existing users',
    duration: '7 days',
    expected_engagement: '15-25%'
  },
  {
    name: 'Success Story Showcase',
    description: 'Feature user success stories and achievements',
    target: 'All users',
    duration: 'Monthly',
    expected_engagement: '20-30%'
  },
  {
    name: 'Industry Leader Spotlight',
    description: 'Highlight successful professionals in various industries',
    target: 'Industry-specific segments',
    duration: 'Bi-weekly',
    expected_engagement: '12-18%'
  },
  {
    name: 'Link Performance Report',
    description: 'Personalized analytics and performance insights',
    target: 'Active users',
    duration: 'Weekly',
    expected_engagement: '25-35%'
  },
  {
    name: 'Networking Event Promotion',
    description: 'Promote virtual and in-person networking events',
    target: 'Premium users',
    duration: 'Event-based',
    expected_engagement: '8-15%'
  }
];

// Function to initialize marketing campaigns
export async function initMarketingCampaigns() {
  console.log('Initializing marketing campaigns...');
  
  // Create campaign templates
  for (const [key, template] of Object.entries(campaignTemplates)) {
    try {
      await storage.createEmailTemplate({
        name: template.name,
        subject: template.subject,
        html: template.html,
        variables: template.variables
      });
      console.log(`✅ Created campaign template: ${template.name}`);
    } catch (error) {
      console.log(`Campaign template ${template.name} already exists or error occurred`);
    }
  }
  
  console.log('Marketing campaigns initialization complete!');
}

// Function to send campaign based on trigger
export async function sendCampaignEmail(campaignId: string, userId: number, variables: Record<string, any>) {
  const campaign = marketingCampaigns.find(c => c.id === campaignId);
  if (!campaign) {
    console.error(`Campaign ${campaignId} not found`);
    return false;
  }
  
  // Logic to send campaign emails would go here
  console.log(`Sending campaign ${campaignId} to user ${userId}`);
  return true;
}