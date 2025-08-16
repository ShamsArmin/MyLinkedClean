import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Target, Zap, Heart, ArrowLeft, Globe, Shield, TrendingUp } from "lucide-react";
import { Link } from "wouter";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b-2 border-blue-200 shadow-lg">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/">
            <Button variant="ghost" className="flex items-center text-blue-600 hover:text-blue-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
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
      <main className="container px-4 md:px-6 py-12 max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
            About MyLinked
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            We're revolutionizing how professionals and creators share their online presence. 
            MyLinked is more than just a link-in-bio tool – it's your digital headquarters for building meaningful connections and growing your personal brand.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid gap-8 md:grid-cols-2 mb-16">
          <Card className="shadow-xl border-2 border-blue-200/50 bg-white/90 backdrop-blur-lg">
            <CardHeader className="bg-gradient-to-r from-blue-100 to-purple-100 border-b border-blue-200/30">
              <CardTitle className="flex items-center text-slate-800">
                <Target className="h-6 w-6 mr-3 text-blue-600" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <p className="text-slate-600 leading-relaxed text-lg">
                To empower individuals and businesses to showcase their complete digital identity in one beautifully designed, 
                easily shareable space. We believe everyone deserves a professional online presence that truly represents who they are.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-2 border-blue-200/50 bg-white/90 backdrop-blur-lg">
            <CardHeader className="bg-gradient-to-r from-blue-100 to-purple-100 border-b border-blue-200/30">
              <CardTitle className="flex items-center text-slate-800">
                <Zap className="h-6 w-6 mr-3 text-blue-600" />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <p className="text-slate-600 leading-relaxed text-lg">
                To become the world's leading platform for digital identity management, 
                where every professional, creator, and business can build authentic connections 
                and unlock new opportunities through their personalized digital presence.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* What Makes Us Different */}
        <Card className="mb-16 shadow-xl border-2 border-blue-200/50 bg-white/90 backdrop-blur-lg">
          <CardHeader className="bg-gradient-to-r from-blue-100 to-purple-100 border-b border-blue-200/30">
            <CardTitle className="text-center text-slate-800 text-2xl">What Makes MyLinked Different</CardTitle>
            <CardDescription className="text-center text-lg">More than just links – it's your complete digital identity</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-3 text-xl">Smart Integration</h3>
                <p className="text-slate-600 leading-relaxed">
                  Seamlessly connect all your social media accounts and automatically sync your latest content. 
                  Your profile stays fresh without manual updates.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-3 text-xl">AI-Powered Insights</h3>
                <p className="text-slate-600 leading-relaxed">
                  Get intelligent recommendations to optimize your profile performance. 
                  Our AI analyzes engagement patterns to help you grow your audience.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-3 text-xl">Privacy First</h3>
                <p className="text-slate-600 leading-relaxed">
                  Your data is yours. We use industry-leading security measures and 
                  give you complete control over your privacy settings and data sharing.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Our Story */}
        <Card className="mb-16 shadow-xl border-2 border-blue-200/50 bg-white/90 backdrop-blur-lg">
          <CardHeader className="bg-gradient-to-r from-blue-100 to-purple-100 border-b border-blue-200/30">
            <CardTitle className="flex items-center text-slate-800 text-2xl">
              <Heart className="h-6 w-6 mr-3 text-blue-600" />
              Our Story
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="prose prose-lg max-w-none text-slate-600">
              <p className="mb-6 leading-relaxed">
                MyLinked was born from a simple frustration: managing multiple social media profiles and 
                trying to direct followers to the right content was becoming increasingly complex. 
                As creators, professionals, and businesses expanded their online presence across platforms, 
                the challenge of presenting a cohesive digital identity grew.
              </p>
              <p className="mb-6 leading-relaxed">
                We envisioned a solution that would not only centralize all your important links but also 
                provide intelligent insights, beautiful customization options, and seamless integration with 
                your existing workflows. What started as a simple link-sharing tool has evolved into a 
                comprehensive platform for digital identity management.
              </p>
              <p className="leading-relaxed">
                Today, MyLinked serves thousands of users worldwide – from individual creators and freelancers 
                to small businesses and enterprise teams. We're proud to be part of their success stories, 
                helping them build stronger connections and achieve their goals through better digital presence management.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Our Values */}
        <Card className="mb-16 shadow-xl border-2 border-blue-200/50 bg-white/90 backdrop-blur-lg">
          <CardHeader className="bg-gradient-to-r from-blue-100 to-purple-100 border-b border-blue-200/30">
            <CardTitle className="text-center text-slate-800 text-2xl">Our Core Values</CardTitle>
            <CardDescription className="text-center text-lg">The principles that guide everything we do</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center justify-center flex-shrink-0">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2 text-lg">User-Centric Design</h3>
                  <p className="text-slate-600">Every feature we build starts with understanding our users' needs and challenges.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center justify-center flex-shrink-0">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2 text-lg">Privacy & Security</h3>
                  <p className="text-slate-600">We implement robust security measures and transparent privacy practices in everything we do.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center justify-center flex-shrink-0">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2 text-lg">Innovation</h3>
                  <p className="text-slate-600">We continuously push boundaries to provide cutting-edge tools and features.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center justify-center flex-shrink-0">
                  <Heart className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2 text-lg">Community</h3>
                  <p className="text-slate-600">We foster a supportive community where everyone can grow and succeed together.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card className="mb-16 shadow-xl border-2 border-blue-200/50 bg-white/90 backdrop-blur-lg">
          <CardHeader className="bg-gradient-to-r from-blue-100 to-purple-100 border-b border-blue-200/30">
            <CardTitle className="text-center text-slate-800 text-2xl">MyLinked by Numbers</CardTitle>
            <CardDescription className="text-center text-lg">Our impact in the digital world</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid gap-8 md:grid-cols-4 text-center">
              <div>
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
                  50K+
                </div>
                <p className="text-slate-600 font-medium">Active Users</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
                  2M+
                </div>
                <p className="text-slate-600 font-medium">Links Shared</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
                  150+
                </div>
                <p className="text-slate-600 font-medium">Countries</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
                  99.9%
                </div>
                <p className="text-slate-600 font-medium">Uptime</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="shadow-xl border-2 border-blue-200/50 bg-white/90 backdrop-blur-lg">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
              Ready to Build Your Digital Presence?
            </h2>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Join thousands of creators, professionals, and businesses who trust MyLinked 
              to showcase their digital identity and grow their online presence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg">
                  Get Started Free
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="border-blue-200 text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg"
                onClick={() => window.open('https://youtube.com/@MyLinked', '_blank')}
              >
                Learn More
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}