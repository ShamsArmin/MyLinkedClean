import { useQuery } from '@tanstack/react-query';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { getTierFromScore, getTierIcon } from './social-score-indicator';

export function SocialScoreMini() {
  const { data: socialScore, isLoading } = useQuery<{
    currentScore: number;
    change?: number;
  }>({
    queryKey: ['/api/social-score'],
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="flex items-center h-8 px-2 animate-pulse">
        <div className="h-4 w-12 bg-gray-200 rounded"></div>
      </div>
    );
  }

  const score = socialScore?.currentScore || 0;
  const tier = getTierFromScore(score);
  const change = socialScore?.change || 0;
  
  return (
    <Link href="/social-score">
      <a>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center h-8 px-3 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 cursor-pointer transition-colors">
                <div className="flex items-center gap-1">
                  {getTierIcon(tier)}
                  <span className="font-semibold text-sm">{score}</span>
                  
                  {change !== 0 && (
                    <Badge variant={change > 0 ? "outline" : "destructive"} className={`flex items-center gap-0.5 h-5 pl-1 pr-1.5 ${change > 0 ? "bg-green-100 text-green-800" : ""}`}>
                      {change > 0 ? <TrendingUp className="h-3 w-3" /> : change < 0 ? <TrendingDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                      <span className="text-[10px]">{Math.abs(change)}</span>
                    </Badge>
                  )}
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Your Social Score: {score} - Click to view details</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </a>
    </Link>
  );
}