import { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

interface TourStep {
  id: string;
  title: string;
  description: string;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  icon?: string;
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to MyLinked! 🎉',
    description: 'Let\'s take a quick tour to help you get started with your professional profile.',
    target: '.dashboard-header',
    position: 'bottom',
  },
  {
    id: 'profile-preview',
    title: 'Your Profile Preview',
    description: 'This shows how your public profile looks to visitors. Click "View Live" to see the full version.',
    target: '.profile-preview-card',
    position: 'left',
  },
  {
    id: 'links-section',
    title: 'Manage Your Links',
    description: 'Add your social media profiles, portfolio, resume, and other important links here.',
    target: '.links-section',
    position: 'top',
  },
  {
    id: 'add-link-button',
    title: 'Add Your First Link',
    description: 'Click here to add your first social media profile or custom link.',
    target: '.add-link-button',
    position: 'bottom',
  },
  {
    id: 'analytics-card',
    title: 'Track Your Performance',
    description: 'Monitor profile views, link clicks, and engagement with detailed analytics.',
    target: '.analytics-card',
    position: 'left',
  },
  {
    id: 'ai-suggestions',
    title: 'AI-Powered Insights',
    description: 'Get smart suggestions to optimize your profile and improve your online presence.',
    target: '.ai-suggestions-card',
    position: 'right',
  },
  {
    id: 'settings-menu',
    title: 'Customize Your Profile',
    description: 'Access themes, privacy settings, and profile customization from your user menu.',
    target: '.user-menu-trigger',
    position: 'bottom',
  },
];

interface TourGuideProps {
  isOpen: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export function TourGuide({ isOpen, onComplete, onSkip }: TourGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen && currentStep < tourSteps.length) {
      const step = tourSteps[currentStep];
      const element = document.querySelector(step.target) as HTMLElement;
      setHighlightedElement(element);
      
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Add highlight class
        element.classList.add('tour-highlight');
      }
    }

    return () => {
      if (highlightedElement) {
        highlightedElement.classList.remove('tour-highlight');
      }
    };
  }, [currentStep, isOpen]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      if (highlightedElement) {
        highlightedElement.classList.remove('tour-highlight');
      }
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      if (highlightedElement) {
        highlightedElement.classList.remove('tour-highlight');
      }
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    if (highlightedElement) {
      highlightedElement.classList.remove('tour-highlight');
    }
    onComplete();
  };

  const handleSkip = () => {
    if (highlightedElement) {
      highlightedElement.classList.remove('tour-highlight');
    }
    onSkip();
  };

  if (!isOpen || currentStep >= tourSteps.length) return null;

  const step = tourSteps[currentStep];

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]" />
      
      {/* Tour Card */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-4 z-[101] flex items-center justify-center"
        >
          <Card className="bg-white/95 backdrop-blur-lg border-0 shadow-2xl overflow-hidden w-full max-w-md max-h-full">
            <CardContent className="p-4 sm:p-6 overflow-y-auto h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {currentStep + 1}
                  </div>
                  <span className="text-sm text-gray-500">
                    {currentStep + 1} of {tourSteps.length}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSkip}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
                />
              </div>

              {/* Content */}
              <div className="flex-1 mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  {step.description}
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-2 flex-shrink-0">
                {/* Navigation Buttons */}
                <div className="flex justify-between gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                    className="flex items-center gap-1 flex-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  
                  {currentStep < tourSteps.length - 1 ? (
                    <Button
                      onClick={handleNext}
                      size="sm"
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 flex items-center gap-1 flex-1"
                    >
                      Next
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleComplete}
                      size="sm"
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 flex items-center gap-1 flex-1"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Get Started
                    </Button>
                  )}
                </div>

                {/* Skip Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSkip}
                  className="text-gray-500 hover:text-gray-700 w-full"
                >
                  Skip Tour
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

// CSS for tour highlighting (add to your global CSS)
export const tourStyles = `
  .tour-highlight {
    position: relative;
    z-index: 99;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 0 2px white;
    border-radius: 8px;
    animation: pulse-highlight 2s infinite;
  }

  @keyframes pulse-highlight {
    0%, 100% {
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 0 2px white;
    }
    50% {
      box-shadow: 0 0 0 8px rgba(59, 130, 246, 0.3), 0 0 0 2px white;
    }
  }

  /* Mobile-specific tour styles */
  @media (max-width: 640px) {
    .tour-highlight {
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5), 0 0 0 1px white;
    }
    
    @keyframes pulse-highlight {
      0%, 100% {
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5), 0 0 0 1px white;
      }
      50% {
        box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3), 0 0 0 1px white;
      }
    }
  }
  
  /* Ensure tour modal stays within viewport */
  .tour-modal {
    margin: 1rem;
    max-height: calc(100vh - 2rem);
    overflow-y: auto;
  }
`;