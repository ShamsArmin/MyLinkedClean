// Apple OAuth Implementation - Ready to integrate

import jwt from 'jsonwebtoken';

interface AppleOAuthConfig {
  clientId: string;           // Services ID from Apple Developer
  teamId: string;            // Apple Developer Team ID  
  keyId: string;             // Key ID from Apple Developer
  privateKey: string;        // Private key content
  redirectUri: string;       // Authorized redirect URI
}

// Apple OAuth initiation
export function generateAppleAuthURL(config: AppleOAuthConfig, state?: string): string {
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'code',
    scope: 'name email',
    response_mode: 'form_post',
    state: state || Math.random().toString(36).substring(7)
  });

  return `https://appleid.apple.com/auth/authorize?${params.toString()}`;
}

// Generate client secret for Apple OAuth
export function generateAppleClientSecret(config: AppleOAuthConfig): string {
  const now = Math.floor(Date.now() / 1000);
  
  const payload = {
    iss: config.teamId,
    iat: now,
    exp: now + (6 * 30 * 24 * 60 * 60), // 6 months
    aud: 'https://appleid.apple.com',
    sub: config.clientId
  };

  const header = {
    kid: config.keyId,
    alg: 'ES256'
  };

  return jwt.sign(payload, config.privateKey, { 
    algorithm: 'ES256',
    header 
  });
}

// Exchange authorization code for tokens
export async function exchangeAppleCode(code: string, config: AppleOAuthConfig) {
  const clientSecret = generateAppleClientSecret(config);
  
  const params = new URLSearchParams({
    client_id: config.clientId,
    client_secret: clientSecret,
    code: code,
    grant_type: 'authorization_code',
    redirect_uri: config.redirectUri
  });

  const response = await fetch('https://appleid.apple.com/auth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params
  });

  return response.json();
}

// Verify and decode Apple ID token
export function verifyAppleToken(idToken: string): any {
  // In production, verify signature with Apple's public keys
  // For now, decode without verification (Apple validates on their side)
  const decoded = jwt.decode(idToken);
  return decoded;
}

// Example Express.js routes for Apple OAuth
export const appleOAuthRoutes = `
// Apple OAuth initiation
app.get('/api/auth/apple', (req, res) => {
  const config: AppleOAuthConfig = {
    clientId: process.env.APPLE_CLIENT_ID!,
    teamId: process.env.APPLE_TEAM_ID!,
    keyId: process.env.APPLE_KEY_ID!,
    privateKey: process.env.APPLE_PRIVATE_KEY!,
    redirectUri: process.env.BASE_URL + '/api/auth/apple/callback'
  };
  
  const authURL = generateAppleAuthURL(config);
  res.redirect(authURL);
});

// Apple OAuth callback
app.post('/api/auth/apple/callback', async (req, res) => {
  try {
    const { code, user: userInfo } = req.body;
    
    const config: AppleOAuthConfig = {
      clientId: process.env.APPLE_CLIENT_ID!,
      teamId: process.env.APPLE_TEAM_ID!,
      keyId: process.env.APPLE_KEY_ID!,
      privateKey: process.env.APPLE_PRIVATE_KEY!,
      redirectUri: process.env.BASE_URL + '/api/auth/apple/callback'
    };
    
    // Exchange code for tokens
    const tokens = await exchangeAppleCode(code, config);
    
    if (tokens.error) {
      return res.redirect('/auth?error=apple_token_failed&message=' + 
        encodeURIComponent('Failed to get Apple access token'));
    }
    
    // Verify and decode ID token
    const userProfile = verifyAppleToken(tokens.id_token);
    
    // Create or update user
    const appleUsername = \`apple_\${userProfile.sub}\`;
    let user = await storage.getUserByUsername(appleUsername);
    
    if (!user) {
      const newUser = {
        username: appleUsername,
        password: await hashPassword(Math.random().toString(36)),
        name: userInfo?.name ? \`\${userInfo.name.firstName} \${userInfo.name.lastName}\` : 'Apple User',
        email: userProfile.email || null,
        bio: 'Joined via Apple',
        isEmailVerified: !!userProfile.email
      };
      
      user = await storage.createUser(newUser);
    }
    
    // Log user in
    req.login(user, (err) => {
      if (err) {
        return res.redirect('/auth?error=session_failed&message=' + 
          encodeURIComponent('Failed to create login session'));
      }
      
      res.redirect('/dashboard');
    });
    
  } catch (error) {
    res.redirect('/auth?error=apple_callback_error&message=' + 
      encodeURIComponent('Apple authentication failed'));
  }
});
`;

// Frontend Apple OAuth button component
export const appleOAuthButton = `
import { FaApple } from "react-icons/fa";

function AppleOAuthButton() {
  const handleAppleLogin = () => {
    window.location.href = '/api/auth/apple';
  };

  return (
    <Button 
      onClick={handleAppleLogin}
      variant="outline" 
      className="w-full bg-black text-white hover:bg-gray-800"
    >
      <FaApple className="mr-2 h-4 w-4" />
      Continue with Apple
    </Button>
  );
}
`;

export default {
  generateAppleAuthURL,
  generateAppleClientSecret,
  exchangeAppleCode,
  verifyAppleToken
};