import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HelpCircle, Mail, MessageCircle, Phone, ArrowLeft, Home, LayoutDashboard } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";

export default function PublicSupportPage() {
  const { user } = useAuth();

  // SEO metadata setup
  useEffect(() => {
    document.title = "Help & Support Center - MyLinked";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Get help with MyLinked - find answers to frequently asked questions, contact our support team, and learn how to create your perfect link-in-bio profile.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Get help with MyLinked - find answers to frequently asked questions, contact our support team, and learn how to create your perfect link-in-bio profile.';
      document.head.appendChild(meta);
    }

    // Add structured data for SEO
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "HelpPage",
      "name": "Help & Support Center - MyLinked",
      "description": "Get help with MyLinked - find answers to frequently asked questions, contact our support team, and learn how to create your perfect link-in-bio profile.",
      "url": "https://www.mylinked.app/help",
      "mainEntity": {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How do I create my profile?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sign up for a free MyLinked account, then customize your profile with your bio, photo, and social links. Your personalized page will be ready in minutes."
            }
          }
        ]
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      // Cleanup on unmount
      document.title = "MyLinked";
    };
  }, []);

  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b-2 border-blue-200 shadow-lg">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          {user ? (
            <Link href="/dashboard">
              <Button variant="ghost" className="flex items-center text-blue-600 hover:text-blue-700">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Back to Dashboard</span>
                <span className="sm:hidden">Dashboard</span>
              </Button>
            </Link>
          ) : (
            <Link href="/">
              <Button variant="ghost" className="flex items-center text-blue-600 hover:text-blue-700">
                <Home className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Back to Home</span>
                <span className="sm:hidden">Home</span>
              </Button>
            </Link>
          )}
          <div className="flex items-center space-x-2">
            <img 
              src="/assets/logo-horizontal.png" 
              alt="MyLinked" 
              className="h-8 w-auto"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <h1 className="hidden text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              MyLinked
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 md:px-6 py-12 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
            Help & Support
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            We're here to help you get the most out of MyLinked. Find answers to common questions or get in touch with our support team.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* FAQ Section */}
          <Card className="shadow-xl border-2 border-blue-200/50 bg-white/90 backdrop-blur-lg">
            <CardHeader className="bg-gradient-to-r from-blue-100 to-purple-100 border-b border-blue-200/30">
              <CardTitle className="flex items-center text-slate-800">
                <HelpCircle className="h-5 w-5 mr-2 text-blue-600" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>Quick answers to common questions</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">How do I create my profile?</h3>
                <p className="text-slate-600 text-sm">
                  Sign up for a free MyLinked account, then customize your profile with your bio, photo, and social links. Your personalized page will be ready in minutes.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Can I customize my profile URL?</h3>
                <p className="text-slate-600 text-sm">
                  Yes! You can choose a custom username that will become your MyLinked URL (mylinked.com/yourusername).
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">How do I add social media links?</h3>
                <p className="text-slate-600 text-sm">
                  In your dashboard, click "Add Link" and choose from popular social platforms or add custom links. You can reorder and customize the appearance of your links.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Is MyLinked free to use?</h3>
                <p className="text-slate-600 text-sm">
                  Yes! MyLinked offers a free plan with core features. Premium features and advanced analytics are available with our paid plans.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Options */}
          <div className="space-y-6">
            <Card className="shadow-xl border-2 border-blue-200/50 bg-white/90 backdrop-blur-lg">
              <CardHeader className="bg-gradient-to-r from-blue-100 to-purple-100 border-b border-blue-200/30">
                <CardTitle className="flex items-center text-slate-800">
                  <Mail className="h-5 w-5 mr-2 text-blue-600" />
                  Email Support
                </CardTitle>
                <CardDescription>Get help via email</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-slate-600 mb-4">
                  Send us a message and we'll get back to you within 24 hours.
                </p>
                <a href="mailto:support@mylinked.com">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                    <Mail className="h-4 w-4 mr-2" />
                    support@mylinked.com
                  </Button>
                </a>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-2 border-blue-200/50 bg-white/90 backdrop-blur-lg">
              <CardHeader className="bg-gradient-to-r from-blue-100 to-purple-100 border-b border-blue-200/30">
                <CardTitle className="flex items-center text-slate-800">
                  <MessageCircle className="h-5 w-5 mr-2 text-blue-600" />
                  Live Chat
                </CardTitle>
                <CardDescription>Chat with our support team</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-slate-600 mb-4">
                  Get instant help from our support team during business hours.
                </p>
                <Button variant="outline" className="w-full border-blue-200 text-blue-600 hover:bg-blue-50">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Start Live Chat
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-2 border-blue-200/50 bg-white/90 backdrop-blur-lg">
              <CardHeader className="bg-gradient-to-r from-blue-100 to-purple-100 border-b border-blue-200/30">
                <CardTitle className="flex items-center text-slate-800">
                  <Phone className="h-5 w-5 mr-2 text-blue-600" />
                  Phone Support
                </CardTitle>
                <CardDescription>Speak with our team</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-slate-600 mb-4">
                  Call us during business hours for immediate assistance.
                </p>
                <Button variant="outline" className="w-full border-blue-200 text-blue-600 hover:bg-blue-50">
                  <Phone className="h-4 w-4 mr-2" />
                  1-800-MYLINKED
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Getting Started Section */}
        <Card className="mt-12 shadow-xl border-2 border-blue-200/50 bg-white/90 backdrop-blur-lg">
          <CardHeader className="bg-gradient-to-r from-blue-100 to-purple-100 border-b border-blue-200/30">
            <CardTitle className="text-center text-slate-800">Getting Started with MyLinked</CardTitle>
            <CardDescription className="text-center">Follow these simple steps to create your profile</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg flex items-center justify-center mx-auto mb-4">
                  1
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">Sign Up</h3>
                <p className="text-slate-600 text-sm">Create your free MyLinked account in seconds</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg flex items-center justify-center mx-auto mb-4">
                  2
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">Customize</h3>
                <p className="text-slate-600 text-sm">Add your bio, photo, and social media links</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg flex items-center justify-center mx-auto mb-4">
                  3
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">Share</h3>
                <p className="text-slate-600 text-sm">Share your MyLinked profile with the world</p>
              </div>
            </div>
            <div className="text-center mt-8">
              {user ? (
                <Link href="/dashboard">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/auth">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3">
                    Get Started Free
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}