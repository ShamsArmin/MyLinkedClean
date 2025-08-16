import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { User } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

type WelcomeMessageProps = {
  profile?: User;
};

export function WelcomeMessage({ profile }: WelcomeMessageProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [message, setMessage] = useState(profile?.welcomeMessage || '');
  
  const saveWelcomeMessageMutation = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      const res = await apiRequest('POST', '/api/welcome-message', { message, type: 'text' });
      return await res.json();
    },
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(['/api/profile'], updatedProfile);
      toast({
        title: 'Welcome message updated',
        description: 'Your welcome message has been saved successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to update welcome message',
        description: error.message || 'An error occurred when updating your welcome message.',
        variant: 'destructive',
      });
    },
  });
  
  const handleSaveMessage = () => {
    if (message.trim()) {
      saveWelcomeMessageMutation.mutate({ message: message.trim() });
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Welcome Message</CardTitle>
        <CardDescription>
          Add a personal welcome message for your visitors
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="welcome-message" className="text-sm font-medium">
              Your Welcome Message
            </label>
            <Textarea
              id="welcome-message"
              placeholder="Write a welcome message for your visitors..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <Button
            onClick={handleSaveMessage}
            disabled={saveWelcomeMessageMutation.isPending || !message.trim()}
            className="w-full"
          >
            {saveWelcomeMessageMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Welcome Message'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}