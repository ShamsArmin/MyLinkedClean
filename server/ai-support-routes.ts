import { Router } from "express";
import { isAuthenticated } from "./auth";
import OpenAI from "openai";

export const aiSupportRouter = Router();

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const systemPrompt = `You are an advanced AI technical support agent for MyLinked, a professional social link management platform. You provide comprehensive technical support and troubleshooting assistance.

## Your Capabilities:

### 1. Technical Troubleshooting:
   - OAuth connection issues (Google, Facebook, Instagram, Twitter)
   - Login and authentication problems
   - Profile loading and display errors
   - Theme application failures
   - Link management and redirect issues
   - Analytics tracking problems
   - Mobile responsiveness issues

### 2. Profile & Content Management:
   - Complete profile setup guidance
   - Social media integration troubleshooting
   - Custom link creation and management
   - Image upload and display issues
   - Bio and personal information optimization
   - Username change and URL customization

### 3. Platform Features & Advanced Support:
   - Spotlight projects and collaboration tools
   - Industry discovery and networking features
   - Referral link creation and tracking
   - Analytics dashboard interpretation
   - Social Score calculation and improvement
   - Performance optimization strategies

### 4. Account & Security Support:
   - Password reset and account recovery
   - Security settings and privacy controls
   - Account deletion and data export
   - Email verification and communication
   - Billing and subscription inquiries

### 5. Technical Diagnostics:
   - Browser compatibility issues
   - Network connectivity problems
   - Cache and cookies troubleshooting
   - Mobile app functionality
   - Custom domain setup assistance

## Technical Problem-Solving Approach:
1. **Identify** the specific issue and gather details
2. **Diagnose** the root cause systematically
3. **Provide** step-by-step solutions
4. **Verify** the solution works
5. **Offer** preventive measures

## Communication Style:
- Use clear, simple language
- Provide detailed step-by-step instructions
- Offer multiple solution approaches when possible
- Ask clarifying questions when needed
- Escalate complex issues appropriately
- Always test solutions before suggesting them

## Platform Knowledge:
- MyLinked runs on React frontend with Express backend
- Supports OAuth for major social platforms
- Uses PostgreSQL database with real-time analytics
- Features 6 preset themes with customization options
- Includes AI-powered social scoring system
- Provides glassmorphism design with mobile responsiveness

Remember: You're a technical expert who can solve most user problems. When you can't solve something, clearly explain why and provide alternative solutions or escalation paths.`;

aiSupportRouter.post('/chat', isAuthenticated, async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Build conversation with system prompt
    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-8), // Keep last 8 messages for context
      { role: 'user', content: message }
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o', // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages,
      max_tokens: 500,
      temperature: 0.7,
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    });

    const assistantMessage = completion.choices[0]?.message?.content;
    
    if (!assistantMessage) {
      throw new Error('No response generated');
    }

    // Generate relevant suggestions based on the response
    const suggestions = generateSuggestions(message.toLowerCase(), assistantMessage);

    res.json({
      response: assistantMessage,
      suggestions,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI Support Chat Error:', error);
    
    // Provide a helpful fallback response
    const fallbackResponse = generateFallbackResponse(req.body.message);
    
    res.status(200).json({
      response: fallbackResponse.content,
      suggestions: fallbackResponse.suggestions,
      timestamp: new Date().toISOString()
    });
  }
});

function generateSuggestions(userMessage: string, assistantResponse: string): string[] {
  const suggestions: string[] = [];
  const message = userMessage.toLowerCase();
  
  // Technical troubleshooting suggestions
  if (message.includes('error') || message.includes('problem') || message.includes('issue') || message.includes('not working')) {
    suggestions.push('Clear browser cache', 'Try different browser', 'Check internet connection');
  } else if (message.includes('oauth') || message.includes('login') || message.includes('connect')) {
    suggestions.push('Reset OAuth connection', 'Try incognito mode', 'Check account permissions');
  } else if (message.includes('theme') || message.includes('color') || message.includes('appearance')) {
    suggestions.push('View all available themes', 'Reset theme settings', 'Customize profile appearance');
  } else if (message.includes('link') || message.includes('social') || message.includes('instagram') || message.includes('facebook')) {
    suggestions.push('Add Instagram link', 'Connect Facebook account', 'Troubleshoot link issues');
  } else if (message.includes('analytics') || message.includes('score') || message.includes('views')) {
    suggestions.push('View analytics dashboard', 'Improve social score', 'Track profile performance');
  } else if (message.includes('profile') || message.includes('setup') || message.includes('customize')) {
    suggestions.push('Complete profile setup', 'Add profile picture', 'Optimize profile visibility');
  } else if (message.includes('mobile') || message.includes('phone') || message.includes('responsive')) {
    suggestions.push('Mobile optimization tips', 'Test mobile view', 'Report mobile issues');
  } else if (message.includes('domain') || message.includes('url') || message.includes('username')) {
    suggestions.push('Custom username setup', 'Domain configuration', 'URL troubleshooting');
  } else if (message.includes('settings') || message.includes('account') || message.includes('password')) {
    suggestions.push('Update account settings', 'Change password', 'Security preferences');
  } else {
    // Default technical support suggestions
    suggestions.push('Profile troubleshooting', 'Connection issues help', 'Performance optimization');
  }
  
  return suggestions.slice(0, 3); // Limit to 3 suggestions
}

function generateFallbackResponse(message: string): { content: string; suggestions: string[] } {
  const query = message?.toLowerCase() || '';
  
  if (query.includes('error') || query.includes('problem') || query.includes('issue') || query.includes('not working')) {
    return {
      content: "I can help troubleshoot technical issues! Here are common solutions:\n\n🔧 **Quick Fixes:**\n• Clear your browser cache and cookies\n• Try using incognito/private browsing mode\n• Refresh the page or restart your browser\n• Check your internet connection\n• Try a different browser (Chrome, Firefox, Safari)\n\n📱 **Mobile Issues:**\n• Update your mobile browser\n• Clear mobile browser data\n• Try desktop version if mobile isn't working\n\nWhat specific issue are you experiencing? I can provide more targeted help.",
      suggestions: ['Clear browser cache', 'Try different browser', 'Mobile troubleshooting']
    };
  } else if (query.includes('oauth') || query.includes('login') || query.includes('connect') || query.includes('facebook') || query.includes('google')) {
    return {
      content: "OAuth connection issues can be frustrating! Here's how to fix them:\n\n🔑 **Common Solutions:**\n• Try logging out and back in\n• Use incognito/private browsing mode\n• Clear browser cookies for the social platform\n• Check if you're logged into the correct social account\n• Disable browser extensions temporarily\n\n🔧 **Facebook/Google Specific:**\n• Make sure your social account is active\n• Check app permissions in your social platform settings\n• Try connecting from a different device\n\nWhich platform are you having trouble connecting?",
      suggestions: ['Reset OAuth connection', 'Try incognito mode', 'Check account permissions']
    };
  } else if (query.includes('theme') || query.includes('color') || query.includes('appearance')) {
    return {
      content: "Theme customization help! MyLinked offers 6 beautiful preset themes:\n\n🎨 **Available Themes:**\n• Ocean Blue (professional)\n• Sunset Glow (warm & creative)\n• Forest Green (natural)\n• Midnight Dark (sleek)\n• Royal Purple (elegant)\n• Passion Red (bold)\n\n⚙️ **Apply Theme:**\n1. Go to your profile menu → Themes\n2. Select your preferred style\n3. Changes save automatically\n\n🔧 **Theme Not Applying?**\n• Clear browser cache\n• Refresh the page\n• Try a different browser",
      suggestions: ['View all themes', 'Reset theme settings', 'Theme troubleshooting']
    };
  } else if (query.includes('mobile') || query.includes('phone') || query.includes('responsive')) {
    return {
      content: "Mobile optimization help! MyLinked is fully responsive:\n\n📱 **Mobile Features:**\n• Touch-friendly interface\n• Optimized for all screen sizes\n• Fast loading on mobile networks\n• Mobile-first design approach\n\n🔧 **Mobile Issues?**\n• Update your mobile browser\n• Clear mobile browser cache\n• Try desktop version as backup\n• Check your internet connection\n• Restart your mobile browser\n\nWhat specific mobile issue are you experiencing?",
      suggestions: ['Mobile optimization tips', 'Test mobile view', 'Report mobile issues']
    };
  } else if (query.includes('analytics') || query.includes('score') || query.includes('views')) {
    return {
      content: "Analytics and performance tracking help:\n\n📊 **Your Analytics Include:**\n• Profile Views: Total visitors to your profile\n• Click-Through Rate: (clicks ÷ views) × 100%\n• Social Score: AI-calculated engagement metric\n• Link Performance: Individual link statistics\n\n🚀 **Improve Performance:**\n• Complete your profile 100%\n• Add high-quality profile picture\n• Write compelling bio\n• Connect social media accounts\n• Keep links active and updated\n\nAccess analytics from your Dashboard to track performance.",
      suggestions: ['View analytics dashboard', 'Improve social score', 'Performance optimization']
    };
  } else {
    return {
      content: "I'm your AI technical support agent for MyLinked! I can help with:\n\n🔧 **Technical Issues:**\n• OAuth connection problems\n• Login and authentication issues\n• Profile loading errors\n• Theme application failures\n• Mobile responsiveness problems\n\n⚙️ **Platform Features:**\n• Profile setup and customization\n• Social media link management\n• Analytics and performance tracking\n• Account settings and security\n\n🚀 **Optimization:**\n• Performance improvements\n• Social score enhancement\n• Troubleshooting guides\n\nWhat technical issue can I help you solve today?",
      suggestions: ['Technical troubleshooting', 'OAuth connection help', 'Performance optimization']
    };
  }
}

aiSupportRouter.get('/quick-actions', isAuthenticated, async (req, res) => {
  const quickActions = [
    {
      title: "Technical Troubleshooting",
      description: "Fix login, connection, and performance issues",
      action: "I'm having technical problems"
    },
    {
      title: "OAuth Connection Issues",
      description: "Fix Facebook, Google, and social media login problems",
      action: "My social media login isn't working"
    },
    {
      title: "Theme Not Applying",
      description: "Troubleshoot theme changes and customization",
      action: "My theme changes aren't saving"
    },
    {
      title: "Mobile Issues",
      description: "Fix mobile display and responsiveness problems",
      action: "MyLinked isn't working on my phone"
    },
    {
      title: "Profile Loading Problems",
      description: "Fix slow loading and display errors",
      action: "My profile won't load properly"
    },
    {
      title: "Analytics Not Working",
      description: "Fix tracking and performance metrics issues",
      action: "My analytics aren't updating"
    },
    {
      title: "Link Management Issues",
      description: "Fix broken links and redirect problems",
      action: "My links aren't working correctly"
    },
    {
      title: "Account Recovery",
      description: "Reset password and recover access",
      action: "I can't access my account"
    },
    {
      title: "Performance Optimization",
      description: "Improve profile speed and social score",
      action: "How can I optimize my profile performance?"
    }
  ];
  
  res.json(quickActions);
});

// Technical diagnostics endpoint
aiSupportRouter.post('/diagnose', isAuthenticated, async (req, res) => {
  try {
    const { issueType, description, userAgent, currentPage } = req.body;
    
    // Generate diagnostic response based on issue type
    const diagnosticPrompt = `As a technical support agent, diagnose this MyLinked issue:

Issue Type: ${issueType || 'General'}
Description: ${description || 'No description provided'}
User Agent: ${userAgent || 'Unknown'}
Current Page: ${currentPage || 'Unknown'}

Provide:
1. Likely root cause analysis
2. Step-by-step troubleshooting guide
3. Alternative solutions
4. Prevention tips

Be technical but use simple language. Focus on actionable solutions.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: diagnosticPrompt }
      ],
      max_tokens: 600,
      temperature: 0.3 // Lower temperature for more precise technical responses
    });

    const diagnosis = completion.choices[0]?.message?.content;
    
    if (!diagnosis) {
      throw new Error('No diagnosis generated');
    }

    res.json({
      diagnosis,
      timestamp: new Date().toISOString(),
      issueType,
      status: 'diagnosed'
    });

  } catch (error) {
    console.error('Technical Diagnosis Error:', error);
    
    // Fallback diagnostic response
    const fallbackDiagnosis = generateFallbackDiagnosis(req.body.issueType, req.body.description);
    
    res.json({
      diagnosis: fallbackDiagnosis,
      timestamp: new Date().toISOString(),
      issueType: req.body.issueType || 'general',
      status: 'fallback'
    });
  }
});

function generateFallbackDiagnosis(issueType: string, description: string): string {
  const type = issueType?.toLowerCase() || '';
  
  if (type.includes('oauth') || type.includes('login')) {
    return `OAuth Login Troubleshooting:

🔍 **Root Cause Analysis:**
- Browser cookies/cache blocking authentication
- Social platform account restrictions
- Network connectivity issues
- Browser extension interference

🔧 **Step-by-Step Fix:**
1. Clear browser cache and cookies
2. Try incognito/private browsing mode
3. Disable browser extensions temporarily
4. Check if you're logged into the correct social account
5. Try a different browser or device

🚨 **Alternative Solutions:**
- Use manual username/password login
- Try OAuth from different device
- Contact platform support if account is restricted

💡 **Prevention Tips:**
- Keep browser updated
- Allow cookies for MyLinked
- Don't use multiple social accounts simultaneously`;
  } else if (type.includes('theme') || type.includes('appearance')) {
    return `Theme Application Troubleshooting:

🔍 **Root Cause Analysis:**
- Browser cache storing old theme data
- JavaScript loading issues
- Network connectivity problems
- Browser compatibility issues

🔧 **Step-by-Step Fix:**
1. Hard refresh the page (Ctrl+F5 or Cmd+Shift+R)
2. Clear browser cache and cookies
3. Try different browser
4. Check internet connection stability
5. Wait 30 seconds and try again

🚨 **Alternative Solutions:**
- Use browser dev tools to force refresh
- Try theme change from different device
- Contact support if issue persists

💡 **Prevention Tips:**
- Keep browser updated
- Clear cache regularly
- Use stable internet connection`;
  } else {
    return `General Technical Troubleshooting:

🔍 **Root Cause Analysis:**
- Browser compatibility issues
- Network connectivity problems
- Cache/cookies conflicts
- JavaScript errors

🔧 **Step-by-Step Fix:**
1. Refresh the page
2. Clear browser cache and cookies
3. Try incognito/private browsing mode
4. Check internet connection
5. Try different browser
6. Restart browser completely

🚨 **Alternative Solutions:**
- Use different device
- Try mobile/desktop version
- Contact technical support

💡 **Prevention Tips:**
- Keep browser updated
- Use stable internet connection
- Clear cache regularly`;
  }
}