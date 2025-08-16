import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ErrorAlertProps {
  title?: string;
  message: string;
  onDismiss?: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ 
  title = 'Operation Failed',
  message, 
  onDismiss 
}) => {
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        {message}
      </AlertDescription>
      {onDismiss && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onDismiss}
          className="mt-2"
        >
          Dismiss
        </Button>
      )}
    </Alert>
  );
};

export const handleApiError = (error: any): string => {
  console.error('API Error:', error);
  
  if (error?.message) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unexpected error occurred. Please try again.';
};

export default ErrorAlert;