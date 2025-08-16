import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cookie, Shield, Settings, Info } from "lucide-react";

const logoPath = "/assets/logo-horizontal.png";

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/4 -left-20 w-60 h-60 bg-gradient-to-br from-purple-400/15 to-pink-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <header className="bg-white/95 backdrop-blur-xl border-b border-white/20 shadow-lg relative z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img 
                src={logoPath} 
                alt="MyLinked" 
                className="h-10 w-auto"
                style={{ imageRendering: 'crisp-edges' }}
              />
            </div>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = "/"}
              className="border-blue-200 hover:border-blue-300 hover:bg-blue-50 text-blue-600"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mx-auto mb-6">
              <Cookie className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-gray-800">
              Cookie 
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Policy
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Learn how MyLinked uses cookies to enhance your experience and protect your privacy.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="space-y-8">
            {/* What Are Cookies */}
            <Card className="bg-white/90 backdrop-blur-lg border-white/30 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-800">
                  <Info className="h-5 w-5 mr-2 text-blue-600" />
                  What Are Cookies?
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600 space-y-4">
                <p>
                  Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our service.
                </p>
                <p>
                  MyLinked uses cookies to enhance functionality, analyze usage patterns, and improve our services. We respect your privacy and are committed to transparent cookie practices.
                </p>
              </CardContent>
            </Card>

            {/* Types of Cookies */}
            <Card className="bg-white/90 backdrop-blur-lg border-white/30 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-800">
                  <Settings className="h-5 w-5 mr-2 text-purple-600" />
                  Types of Cookies We Use
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h3 className="font-semibold text-gray-800 mb-2">Essential Cookies</h3>
                    <p className="text-gray-600 text-sm">
                      These cookies are necessary for the website to function properly. They enable basic features like user authentication, secure login, and navigation. These cookies cannot be disabled.
                    </p>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                    <h3 className="font-semibold text-gray-800 mb-2">Performance Cookies</h3>
                    <p className="text-gray-600 text-sm">
                      These cookies help us understand how visitors interact with our website by collecting anonymous information about usage patterns, page views, and site performance.
                    </p>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                    <h3 className="font-semibold text-gray-800 mb-2">Functional Cookies</h3>
                    <p className="text-gray-600 text-sm">
                      These cookies remember your preferences and settings to provide a personalized experience, such as your preferred language, theme, or dashboard layout.
                    </p>
                  </div>

                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                    <h3 className="font-semibold text-gray-800 mb-2">Analytics Cookies</h3>
                    <p className="text-gray-600 text-sm">
                      We use analytics cookies to understand how our users interact with MyLinked, which features are most popular, and how we can improve our service.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cookie Management */}
            <Card className="bg-white/90 backdrop-blur-lg border-white/30 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-800">
                  <Shield className="h-5 w-5 mr-2 text-green-600" />
                  Managing Your Cookie Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600 space-y-4">
                <p>
                  You have control over your cookie preferences. Here's how you can manage them:
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold mt-0.5">1</div>
                    <div>
                      <h4 className="font-medium text-gray-800">Browser Settings</h4>
                      <p className="text-sm">You can control cookies through your browser settings. Most browsers allow you to block or delete cookies.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-bold mt-0.5">2</div>
                    <div>
                      <h4 className="font-medium text-gray-800">Cookie Banner</h4>
                      <p className="text-sm">When you first visit MyLinked, you'll see a cookie banner where you can accept or customize your preferences.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold mt-0.5">3</div>
                    <div>
                      <h4 className="font-medium text-gray-800">Account Settings</h4>
                      <p className="text-sm">Logged-in users can manage cookie preferences in their account settings at any time.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Disabling certain cookies may affect the functionality of MyLinked and limit your ability to use some features.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Third-Party Cookies */}
            <Card className="bg-white/90 backdrop-blur-lg border-white/30 shadow-xl">
              <CardHeader>
                <CardTitle className="text-gray-800">Third-Party Services</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600 space-y-4">
                <p>
                  MyLinked may use third-party services that set their own cookies. These include:
                </p>
                
                <ul className="space-y-2 ml-4">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span>Analytics services to understand user behavior</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <span>Social media integration for profile connections</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span>Security services for fraud prevention</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    <span>Performance monitoring tools</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Data Retention */}
            <Card className="bg-white/90 backdrop-blur-lg border-white/30 shadow-xl">
              <CardHeader>
                <CardTitle className="text-gray-800">Cookie Retention</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600 space-y-4">
                <p>
                  Different cookies have different lifespans:
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-1">Session Cookies</h4>
                    <p className="text-sm">Deleted when you close your browser</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-1">Persistent Cookies</h4>
                    <p className="text-sm">Remain for a specified period (up to 2 years)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Questions About Our Cookie Policy?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  If you have any questions about how we use cookies or want to request more information about our privacy practices, please don't hesitate to contact us.
                </p>
                <Button 
                  variant="secondary" 
                  className="bg-white text-blue-600 hover:bg-gray-50"
                  onClick={() => window.location.href = "/contact"}
                >
                  Contact Us
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}