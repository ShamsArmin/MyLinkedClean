import React, { useState } from "react";
import { User, UpdateUser } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

type ProfileCustomizerProps = {
  profile?: User;
  onUpdate: (updates: UpdateUser) => void;
};

const ProfileCustomizer: React.FC<ProfileCustomizerProps> = ({ profile, onUpdate }) => {
  const { toast } = useToast();
  const [isPending, setIsPending] = useState(false);
  // Define a stricter type that ensures no null values
  const [formData, setFormData] = useState({
    name: profile?.name || "",
    bio: profile?.bio || "",
    font: profile?.font || "inter",
    profileImage: profile?.profileImage || "",
    profileBackground: profile?.profileBackground || "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newFormData = { ...prev, [name]: value };
      
      // Create an optimistic update for the UI (only for non-critical fields)
      if (name === "name" || name === "bio") {
        const optimisticProfile = {
          ...profile!,
          [name]: value
        };
        queryClient.setQueryData(["/api/profile"], optimisticProfile);
      }
      
      return newFormData;
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => {
      const newFormData = { ...prev, [name]: value };
      
      // Create an optimistic update for the UI (only for non-critical fields)
      if (name === "font") {
        const optimisticProfile = {
          ...profile!,
          [name]: value
        };
        queryClient.setQueryData(["/api/profile"], optimisticProfile);
      }
      
      return newFormData;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    
    // Only submit if there are changes
    const updates: UpdateUser = {};
    
    if (formData.name !== profile?.name) updates.name = formData.name;
    if (formData.bio !== profile?.bio) updates.bio = formData.bio;
    if (formData.font !== profile?.font) updates.font = formData.font;
    if (formData.profileImage !== profile?.profileImage) updates.profileImage = formData.profileImage;
    if (formData.profileBackground !== profile?.profileBackground) updates.profileBackground = formData.profileBackground;
    
    if (Object.keys(updates).length === 0) {
      setIsPending(false);
      toast({
        title: "No changes detected",
        description: "Make some changes to update your profile.",
      });
      return;
    }
    
    onUpdate(updates);
    setIsPending(false);
  };

  // File upload handler with optimistic UI updates
  const handleImageUpload = (type: 'profile' | 'background') => {
    // Create a temporary file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    
    // Handle file selection
    fileInput.onchange = (e) => {
      if (fileInput.files && fileInput.files.length > 0) {
        // Check file size - limit to 5MB
        const file = fileInput.files[0];
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: "Please select an image under 5MB.",
            variant: "destructive",
          });
          return;
        }
        
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            const imageDataUrl = event.target.result as string;
            const field = type === 'profile' ? 'profileImage' : 'profileBackground';
            
            // Update local form state
            setFormData(prev => ({ 
              ...prev, 
              [field]: imageDataUrl 
            }));
            
            // Apply optimistic update to show changes immediately
            if (profile) {
              const optimisticProfile = {
                ...profile,
                [field]: imageDataUrl
              };
              queryClient.setQueryData(["/api/profile"], optimisticProfile);
            }
            
            toast({
              title: `${type === 'profile' ? 'Profile' : 'Background'} image updated`,
              description: "Changes will be saved when you click Save.",
            });
          }
        };
        reader.readAsDataURL(file);
      }
    };
    
    // Trigger the file dialog
    fileInput.click();
  };

  const backgrounds = [
    {
      id: "default",
      type: "gradient",
      value: "bg-gradient-to-r from-primary-500 to-secondary-500",
    },
    {
      id: "abstract",
      type: "image",
      value: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=500&h=200&q=80",
    },
    {
      id: "minimal",
      type: "image",
      value: "https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?w=500&h=200&q=80",
    },
    {
      id: "custom",
      type: "upload",
      value: "",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
      <h2 className="font-heading text-xl font-semibold text-gray-900 mb-5">Profile Settings</h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label htmlFor="name">Display Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="mt-1"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            name="bio"
            value={formData.bio || ""}
            onChange={handleInputChange}
            className="mt-1 resize-none"
            rows={3}
            placeholder="Digital Creator & Designer"
            maxLength={160}
          />
          <div className="text-sm text-gray-500 mt-1">
            {(formData.bio || "").length}/160 characters
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                mylinked.app/
              </div>
              <Input
                id="username"
                value={profile?.username || ""}
                className="pl-[105px]"
                readOnly
                disabled
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="font">Font Style</Label>
            <Select
              value={formData.font || "inter"}
              onValueChange={(value) => handleSelectChange("font", value)}
            >
              <SelectTrigger id="font" className="mt-1">
                <SelectValue placeholder="Select a font" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inter">Inter (Default)</SelectItem>
                <SelectItem value="poppins">Poppins</SelectItem>
                <SelectItem value="roboto">Roboto</SelectItem>
                <SelectItem value="lato">Lato</SelectItem>
                <SelectItem value="opensans">Open Sans</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Label className="block mb-2">Profile Image</Label>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
              {formData.profileImage ? (
                <img
                  src={formData.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400 text-lg font-medium">
                  {formData.name ? formData.name.charAt(0).toUpperCase() : profile?.username?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => handleImageUpload('profile')}
            >
              Change Image
            </Button>
          </div>
        </div>
        
        <div>
          <Label className="block mb-2">Profile Background</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {backgrounds.map((bg) => (
              <button
                key={bg.id}
                type="button"
                className={`aspect-[3/1] rounded-lg overflow-hidden ${
                  formData.profileBackground === bg.value || (bg.id === 'default' && !formData.profileBackground)
                    ? 'border-2 border-primary-500'
                    : 'border-2 border-gray-200 hover:border-gray-300 transition-colors'
                }`}
                onClick={() => {
                  if (bg.type !== 'upload') {
                    setFormData(prev => ({ ...prev, profileBackground: bg.value }));
                  } else {
                    handleImageUpload('background');
                  }
                }}
              >
                {bg.type === 'gradient' && (
                  <div className="w-full h-full bg-gradient-to-r from-primary-500 to-secondary-500"></div>
                )}
                {bg.type === 'image' && (
                  <img
                    src={bg.value}
                    alt={`${bg.id} background`}
                    className="w-full h-full object-cover"
                  />
                )}
                {bg.type === 'upload' && (
                  <div className="w-full h-full flex items-center justify-center border-dashed">
                    <div className="text-center">
                      <Upload className="mx-auto h-5 w-5 text-gray-400" />
                      <p className="text-xs text-gray-500 mt-1">Upload</p>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            type="submit"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileCustomizer;
