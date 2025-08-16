import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, Download, Trash2, Edit, Lock, Users, FileText } from "lucide-react";

const logoPath = "/assets/logo-horizontal.png";

export default function GDPRPage() {
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
              <Shield className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-gray-800">
              GDPR 
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Compliance
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Your privacy rights under the General Data Protection Regulation and how MyLinked protects your personal data.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="space-y-8">
            {/* Introduction */}
            <Card className="bg-white/90 backdrop-blur-lg border-white/30 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-800">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  Your GDPR Rights
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600 space-y-4">
                <p>
                  The General Data Protection Regulation (GDPR) gives you specific rights regarding your personal data. MyLinked is committed to respecting these rights and providing transparent information about how we collect, use, and protect your data.
                </p>
                <p>
                  As a user of MyLinked, you have the following rights under GDPR, which you can exercise at any time by contacting our support team or using the tools in your account settings.
                </p>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card className="bg-white/90 backdrop-blur-lg border-white/30 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-800">
                  <Users className="h-5 w-5 mr-2 text-purple-600" />
                  Your Personal Data Rights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-center mb-3">
                      <Eye className="h-6 w-6 text-blue-600 mr-2" />
                      <h3 className="font-semibold text-gray-800">Right to Access</h3>
                    </div>
                    <p className="text-gray-600 text-sm">
                      You can request a copy of all personal data we hold about you, including how it's being used and who it's shared with.
                    </p>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                    <div className="flex items-center mb-3">
                      <Edit className="h-6 w-6 text-green-600 mr-2" />
                      <h3 className="font-semibold text-gray-800">Right to Rectification</h3>
                    </div>
                    <p className="text-gray-600 text-sm">
                      You can correct any inaccurate or incomplete personal data we hold about you through your account settings.
                    </p>
                  </div>

                  <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                    <div className="flex items-center mb-3">
                      <Trash2 className="h-6 w-6 text-red-600 mr-2" />
                      <h3 className="font-semibold text-gray-800">Right to Erasure</h3>
                    </div>
                    <p className="text-gray-600 text-sm">
                      You can request deletion of your personal data under certain circumstances, including when it's no longer necessary.
                    </p>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                    <div className="flex items-center mb-3">
                      <Lock className="h-6 w-6 text-purple-600 mr-2" />
                      <h3 className="font-semibold text-gray-800">Right to Restrict Processing</h3>
                    </div>
                    <p className="text-gray-600 text-sm">
                      You can limit how we use your personal data in certain situations while maintaining your account.
                    </p>
                  </div>

                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                    <div className="flex items-center mb-3">
                      <Download className="h-6 w-6 text-orange-600 mr-2" />
                      <h3 className="font-semibold text-gray-800">Right to Data Portability</h3>
                    </div>
                    <p className="text-gray-600 text-sm">
                      You can receive your personal data in a structured, machine-readable format and transfer it to another service.
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-center mb-3">
                      <Shield className="h-6 w-6 text-gray-600 mr-2" />
                      <h3 className="font-semibold text-gray-800">Right to Object</h3>
                    </div>
                    <p className="text-gray-600 text-sm">
                      You can object to certain types of processing, including direct marketing and automated decision-making.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data We Collect */}
            <Card className="bg-white/90 backdrop-blur-lg border-white/30 shadow-xl">
              <CardHeader>
                <CardTitle className="text-gray-800">What Personal Data We Collect</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600 space-y-4">
                <p>
                  We collect and process the following categories of personal data:
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium text-gray-800">Account Information</h4>
                      <p className="text-sm">Email address, username, password (encrypted), profile picture, and bio</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium text-gray-800">Profile Content</h4>
                      <p className="text-sm">Social media links, custom links, descriptions, and any content you choose to share</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium text-gray-800">Usage Data</h4>
                      <p className="text-sm">Analytics data, click tracking, page views, and interaction patterns (anonymized when possible)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium text-gray-800">Technical Data</h4>
                      <p className="text-sm">IP address, browser type, device information, and cookies (with your consent)</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Legal Basis */}
            <Card className="bg-white/90 backdrop-blur-lg border-white/30 shadow-xl">
              <CardHeader>
                <CardTitle className="text-gray-800">Legal Basis for Processing</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600 space-y-4">
                <p>
                  We process your personal data based on the following legal grounds:
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="font-medium text-gray-800 mb-1">Contract Performance</h4>
                    <p className="text-sm">To provide our services and fulfill our obligations to you</p>
                  </div>
                  
                  <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                    <h4 className="font-medium text-gray-800 mb-1">Legitimate Interest</h4>
                    <p className="text-sm">To improve our services, security, and user experience</p>
                  </div>
                  
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                    <h4 className="font-medium text-gray-800 mb-1">Consent</h4>
                    <p className="text-sm">For marketing communications and non-essential cookies</p>
                  </div>
                  
                  <div className="p-3 bg-orange-50 rounded-lg border border-orange-100">
                    <h4 className="font-medium text-gray-800 mb-1">Legal Obligation</h4>
                    <p className="text-sm">To comply with applicable laws and regulations</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Protection Measures */}
            <Card className="bg-white/90 backdrop-blur-lg border-white/30 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-800">
                  <Shield className="h-5 w-5 mr-2 text-green-600" />
                  How We Protect Your Data
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600 space-y-4">
                <p>
                  We implement appropriate technical and organizational measures to protect your personal data:
                </p>
                
                <ul className="space-y-2 ml-4">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span>Encryption of data in transit and at rest</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <span>Regular security assessments and updates</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span>Access controls and authentication measures</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    <span>Data minimization and retention policies</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                    <span>Incident response and breach notification procedures</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Exercising Your Rights */}
            <Card className="bg-white/90 backdrop-blur-lg border-white/30 shadow-xl">
              <CardHeader>
                <CardTitle className="text-gray-800">How to Exercise Your Rights</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600 space-y-4">
                <p>
                  You can exercise your GDPR rights in the following ways:
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold mt-0.5">1</div>
                    <div>
                      <h4 className="font-medium text-gray-800">Account Settings</h4>
                      <p className="text-sm">Access, update, or delete your personal data directly through your MyLinked account settings.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-bold mt-0.5">2</div>
                    <div>
                      <h4 className="font-medium text-gray-800">Contact Support</h4>
                      <p className="text-sm">Email our privacy team at privacy@mylinked.app with your specific request.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold mt-0.5">3</div>
                    <div>
                      <h4 className="font-medium text-gray-800">Data Protection Officer</h4>
                      <p className="text-sm">Contact our Data Protection Officer for complex privacy matters at dpo@mylinked.app.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                  <p className="text-sm text-blue-800">
                    <strong>Response Time:</strong> We will respond to your requests within 30 days. For complex requests, we may extend this period by up to 60 days and will inform you of any delays.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact and Complaints */}
            <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Questions or Complaints?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  If you have questions about our GDPR compliance or wish to file a complaint, you can:
                </p>
                <div className="space-y-2">
                  <p>• Contact us directly at privacy@mylinked.app</p>
                  <p>• Lodge a complaint with your local data protection authority</p>
                  <p>• Reach out to our Data Protection Officer for guidance</p>
                </div>
                <div className="flex space-x-4 mt-6">
                  <Button 
                    variant="secondary" 
                    className="bg-white text-blue-600 hover:bg-gray-50"
                    onClick={() => window.location.href = "/contact"}
                  >
                    Contact Us
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400"
                    onClick={() => window.location.href = "/privacy-policy"}
                  >
                    Privacy Policy
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}