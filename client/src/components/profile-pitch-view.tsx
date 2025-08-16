import { useState } from 'react';
import { User, Link } from '@shared/schema';
import { usePlatformIcons } from '@/hooks/use-platform-icons';
import { Briefcase, Mail, Phone, Download, ExternalLink, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiRequest } from '@/lib/queryClient';

type ProfilePitchViewProps = {
  profile: User;
  links: Link[];
  className?: string;
};

export function ProfilePitchView({ profile, links, className = '' }: ProfilePitchViewProps) {
  const { getPlatformConfig } = usePlatformIcons();
  const [contactModalOpen, setContactModalOpen] = useState(false);

  // Record link click
  const handleLinkClick = async (linkId: number) => {
    try {
      await apiRequest("POST", `/api/links/${linkId}/click`, null);
    } catch (error) {
      console.error("Failed to record link click:", error);
    }
  };

  // Get theme styles
  const getThemeStyles = () => {
    const theme = profile.theme || "default";
    const isDarkMode = profile.darkMode || false;
    
    let gradientColors = "from-primary-500 to-secondary-500";
    let textColor = isDarkMode ? "text-white" : "text-gray-900";
    let bgColor = isDarkMode ? "bg-gray-900" : "bg-white";
    
    switch (theme) {
      case "purple":
        gradientColors = "from-purple-500 to-pink-500";
        break;
      case "blue":
        gradientColors = "from-blue-500 to-cyan-400";
        break;
      case "orange":
        gradientColors = "from-amber-500 to-orange-500";
        break;
      case "green":
        gradientColors = "from-emerald-500 to-lime-500";
        break;
      default:
        break;
    }
    
    return {
      gradientColors,
      textColor,
      bgColor,
      isDarkMode
    };
  };

  const { gradientColors, textColor, bgColor, isDarkMode } = getThemeStyles();

  // Filter and sort links - featured links first, then regular links
  const sortedLinks = [...links].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return (a.order || 0) - (b.order || 0);
  });

  // Get important links - limit to top 4 links for pitch view
  const importantLinks = sortedLinks.slice(0, 4);

  return (
    <div className={`min-h-screen flex flex-col ${bgColor} ${className}`}>
      {/* Top banner with gradient */}
      <div className={`h-16 bg-gradient-to-r ${gradientColors} relative`}>
        <div className="absolute top-4 left-4">
          <div className="flex items-center gap-2">
            <Briefcase className="text-white" size={20} />
            <span className="text-white font-medium">Pitch Mode</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left column - Profile information */}
          <div className="md:w-1/3">
            <div className="flex flex-col items-center mb-6">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-white overflow-hidden shadow-lg mb-4">
                {profile.profileImage ? (
                  <img 
                    src={profile.profileImage} 
                    alt={profile.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-3xl font-bold text-gray-500">
                      {profile.name?.charAt(0) || profile.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              
              <h1 className={`text-2xl font-bold text-center ${textColor}`}>
                {profile.name}
              </h1>
              <p className="text-primary font-medium mt-1">{profile.profession || "Professional"}</p>
              
              <div className="flex gap-3 mt-5">
                <Button
                  size="sm"
                  className={`bg-gradient-to-r ${gradientColors} text-white border-0 hover:opacity-90`}
                  onClick={() => setContactModalOpen(true)}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Contact
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  asChild
                >
                  <a href="#">
                    <Download className="mr-2 h-4 w-4" />
                    Resume
                  </a>
                </Button>
              </div>
            </div>
            
            {/* Professional pitch */}
            <div className={`rounded-lg p-5 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} mb-6`}>
              <h2 className={`font-medium mb-3 ${textColor}`}>Professional Pitch</h2>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {profile.pitchDescription || 
                  "I'm a professional with expertise in my field, seeking opportunities to collaborate on exciting projects."}
              </p>
            </div>
            
            {/* Professional details */}
            <div className={`rounded-lg p-5 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <h2 className={`font-medium mb-3 ${textColor}`}>Professional Details</h2>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <UserIcon size={16} className="text-primary" />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {profile.profession || "Professional"}
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={16} className="text-primary" />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    contact@example.com
                  </span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Right column - Content */}
          <div className="md:w-2/3">
            {/* Bio section */}
            <div className={`rounded-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'} mb-6`}>
              <h2 className={`text-xl font-semibold mb-4 ${textColor}`}>About Me</h2>
              <div className={`prose ${isDarkMode ? 'prose-invert' : ''} max-w-none`}>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {profile.bio || "Hello! I'm a professional eager to collaborate on exciting projects. Feel free to reach out if you'd like to work together or learn more about my services."}
                </p>
              </div>
            </div>
            
            {/* Important links */}
            <div className={`rounded-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'}`}>
              <h2 className={`text-xl font-semibold mb-4 ${textColor}`}>Professional Links</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {importantLinks.map(link => {
                  const platform = getPlatformConfig(link.platform);
                  const Icon = platform.icon;
                  
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleLinkClick(link.id)}
                      className={`flex items-center p-4 rounded-lg ${
                        isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
                      } transition-colors`}
                    >
                      <div className={`w-10 h-10 rounded-full ${platform.bgColor} flex items-center justify-center mr-3`}>
                        <Icon className={`${platform.color}`} />
                      </div>
                      <div>
                        <h3 className={`font-medium ${textColor}`}>{link.title}</h3>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} flex items-center`}>
                          <ExternalLink size={12} className="mr-1" />
                          {link.url.replace(/^(https?:\/\/)?(www\.)?/i, '').split('/')[0]}
                        </p>
                      </div>
                    </a>
                  );
                })}
              </div>
              
              {links.length === 0 && (
                <div className="text-center py-8">
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    No professional links added yet.
                  </p>
                </div>
              )}
              
              {links.length > 4 && (
                <div className="mt-4 text-center">
                  <Button variant="link" className="text-primary">
                    View All Links ({links.length})
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Contact Modal */}
      {contactModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6`}>
            <h2 className={`text-xl font-semibold mb-4 ${textColor}`}>Contact {profile.name}</h2>
            
            <div className="space-y-4">
              <div>
                <p className={`text-sm font-medium ${textColor}`}>Email</p>
                <a
                  href="mailto:contact@example.com"
                  className="flex items-center gap-2 mt-1 text-primary hover:underline"
                >
                  <Mail size={16} />
                  contact@example.com
                </a>
              </div>
              
              <div className="pt-4 border-t border-gray-200 mt-4">
                <Button 
                  className="w-full" 
                  onClick={() => setContactModalOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}