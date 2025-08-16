import React from "react";
import { User, Link } from "@shared/schema";
import { Link as RouterLink } from "wouter";
import { Button } from "@/components/ui/button";
import { usePlatformIcons } from "@/hooks/use-platform-icons";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

type ProfilePreviewProps = {
  profile?: User;
  links?: Link[];
};

const ProfilePreview: React.FC<ProfilePreviewProps> = ({ profile, links }) => {
  const { getPlatformConfig } = usePlatformIcons();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  if (!profile) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 flex items-center justify-center h-64">
        <p className="text-gray-500">Loading profile information...</p>
      </div>
    );
  }
  
  const profileUrl = `mylinked.app/${profile.username}`;
  
  const copyProfileLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "Your profile link has been copied to clipboard.",
      });
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      <div className="aspect-[3/1] relative bg-gradient-to-r from-primary-500 to-secondary-500">
        {profile.profileBackground ? (
          <img 
            src={profile.profileBackground} 
            alt="Profile background" 
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-r 
            ${profile.theme === "default" ? "from-primary-500 to-secondary-500" : 
             profile.theme === "purple" ? "from-purple-500 to-pink-500" :
             profile.theme === "blue" ? "from-blue-500 to-cyan-400" :
             profile.theme === "orange" ? "from-amber-500 to-orange-500" :
             profile.theme === "green" ? "from-emerald-500 to-lime-500" :
             "from-primary-500 to-secondary-500"}`}></div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        
        {/* Profile avatar */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
          <div className="w-20 h-20 rounded-full border-4 border-white bg-white overflow-hidden">
            {profile.profileImage ? (
              <img 
                src={profile.profileImage} 
                alt={profile.name || profile.username} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-xl font-bold text-gray-500">
                  {profile.name?.charAt(0) || profile.username.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="pt-12 pb-5 px-4 text-center">
        <h3 className="font-heading font-bold text-lg text-gray-900">{profile.name}</h3>
        <p className="text-gray-600 text-sm">{profile.bio}</p>
        
        {/* Dynamic Links Display based on View Mode */}
        {profile.viewMode === "grid" ? (
          <div className="mt-5 grid grid-cols-2 gap-3 max-w-sm mx-auto">
            {(links || []).slice(0, 4).map(link => {
              const platform = getPlatformConfig(link.platform);
              const Icon = platform.icon;
              
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 
                    ${profile.darkMode ? 'bg-gray-800 text-white hover:bg-gray-700 border-gray-700' : 'bg-white text-gray-800 hover:bg-gray-50'}`}
                  aria-label={platform.name}
                >
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full text-white`} style={{background: platform.color}}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium truncate">{link.title}</span>
                </a>
              );
            })}
          </div>
        ) : (
          <div className="mt-5 flex justify-center gap-3">
            {(links || []).slice(0, 4).map(link => {
              const platform = getPlatformConfig(link.platform);
              const Icon = platform.icon;
              
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors
                    ${profile.darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  aria-label={platform.name}
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        )}
        
        {/* Welcome Message Preview */}
        {profile.welcomeMessage && (
          <div className="mt-5">
            <div className="text-gray-800 font-medium mb-2 text-sm">Welcome Message</div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <video 
                  controls 
                  className="w-full rounded border max-h-32"
                  src={profile.welcomeMessage}
                >
                  Your browser does not support the video element.
                </video>
                <audio 
                  controls 
                  className="w-full rounded"
                  src={profile.welcomeMessage}
                >
                  Your browser does not support the audio element.
                </audio>
              ) : (
                <p className="text-gray-600 text-sm">{profile.welcomeMessage}</p>
              )}
            </div>
          </div>
        )}

        <div className="mt-5">
          <div className="text-gray-800 font-medium mb-2 text-sm">Your Profile Link</div>
          <div className="flex rounded-lg overflow-hidden border border-gray-200">
            <div className="flex-1 bg-gray-50 py-2 px-3 text-gray-600 text-sm truncate">
              {profileUrl}
            </div>
            <button 
              className="bg-gray-100 py-2 px-3 text-gray-700 hover:bg-gray-200 transition-colors flex items-center justify-center"
              onClick={copyProfileLink}
              aria-label="Copy profile link"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>
        
        <div className="mt-5">
          <RouterLink to={`/profile/${profile.username}`}>
            <Button variant="outline" className="w-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M15.5 3h5v5"/>
                <path d="M20 3 10 13"/>
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              </svg>
              View Profile
            </Button>
          </RouterLink>
        </div>
      </div>
    </div>
  );
};

export default ProfilePreview;
