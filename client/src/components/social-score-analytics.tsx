import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SocialScoreIndicator } from './social-score-indicator';

interface SocialScoreAnalyticsProps {
  score: number;
  historicalData: {
    date: string;
    score: number;
    views: number;
    clicks: number;
  }[];
  compareData?: {
    category: string;
    userScore: number;
    avgScore: number;
  }[];
  className?: string;
}

export function SocialScoreAnalytics({
  score,
  historicalData,
  compareData,
  className = '',
}: SocialScoreAnalyticsProps) {
  // Generate trend data
  const calculateScoreChange = () => {
    if (historicalData.length < 2) return { change: 0, percentage: 0 };
    
    const currentScore = historicalData[historicalData.length - 1].score;
    const previousScore = historicalData[0].score;
    const change = currentScore - previousScore;
    const percentage = previousScore !== 0 
      ? Math.round((change / previousScore) * 100) 
      : 0;
      
    return { change, percentage };
  };
  
  const scoreChange = calculateScoreChange();
  
  // Calculate metrics
  const averageViews = Math.round(
    historicalData.reduce((sum, item) => sum + item.views, 0) / historicalData.length
  );
  
  const averageClicks = Math.round(
    historicalData.reduce((sum, item) => sum + item.clicks, 0) / historicalData.length
  );
  
  const calculateCTR = () => {
    const totalViews = historicalData.reduce((sum, item) => sum + item.views, 0);
    const totalClicks = historicalData.reduce((sum, item) => sum + item.clicks, 0);
    return totalViews > 0 ? Math.round((totalClicks / totalViews) * 100) : 0;
  };
  
  const ctr = calculateCTR();
  
  // Format for the tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-sm rounded-md">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any) => (
            <p key={entry.name} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className={`${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Social Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{score}</div>
            <p className={`text-xs ${scoreChange.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {scoreChange.change > 0 ? '+' : ''}{scoreChange.change} points
              ({scoreChange.percentage > 0 ? '+' : ''}{scoreChange.percentage}%)
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Avg. Profile Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageViews}</div>
            <p className="text-xs text-gray-500">per period</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Avg. Link Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageClicks}</div>
            <p className="text-xs text-gray-500">per period</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Click-Through Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ctr}%</div>
            <p className="text-xs text-gray-500">conversion rate</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Score Evolution</CardTitle>
              <CardDescription>How your social score has changed over time</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="line">
                <div className="flex justify-between items-center mb-4">
                  <TabsList>
                    <TabsTrigger value="line">Line</TabsTrigger>
                    <TabsTrigger value="area">Area</TabsTrigger>
                    <TabsTrigger value="bar">Bar</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="line" className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={historicalData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="score"
                        name="Social Score"
                        stroke="#3b82f6"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </TabsContent>
                
                <TabsContent value="area" className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={historicalData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="score"
                        name="Social Score"
                        fill="#93c5fd"
                        stroke="#3b82f6"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </TabsContent>
                
                <TabsContent value="bar" className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={historicalData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar
                        dataKey="score"
                        name="Social Score"
                        fill="#3b82f6"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Score Breakdown</CardTitle>
              <CardDescription>How your score compares to industry averages</CardDescription>
            </CardHeader>
            <CardContent>
              {compareData && (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={compareData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="category" type="category" width={120} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar
                        dataKey="userScore"
                        name="Your Score"
                        fill="#3b82f6"
                        radius={[4, 4, 4, 4]}
                      />
                      <Bar
                        dataKey="avgScore"
                        name="Average Score"
                        fill="#cbd5e1"
                        radius={[4, 4, 4, 4]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
              
              {!compareData && (
                <div className="flex items-center justify-center h-80 border border-dashed border-gray-200 rounded-lg">
                  <div className="text-center p-4">
                    <p className="text-sm text-gray-500 mb-2">
                      Not enough data to compare with industry averages yet. 
                      Keep improving your profile!
                    </p>
                    <SocialScoreIndicator score={score} />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}