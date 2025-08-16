import React from "react";

type StatsCardProps = {
  title: string;
  value: number | string;
  change: number;
  iconName: string;
  colorClass: string;
  bgColorClass: string;
};

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  iconName,
  colorClass,
  bgColorClass,
}) => {
  const renderIcon = () => {
    switch (iconName) {
      case "eye":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        );
      case "cursor":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 9l15-5-5 15-4-4-6-1.5L5 9z"/>
          </svg>
        );
      case "bar-chart":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="20" x2="12" y2="10"/>
            <line x1="18" y1="20" x2="18" y2="4"/>
            <line x1="6" y1="20" x2="6" y2="16"/>
          </svg>
        );
      case "award":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="6"/>
            <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20V10"/>
            <path d="M18 20V4"/>
            <path d="M6 20v-4"/>
          </svg>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className="text-2xl font-semibold mt-1">{value}</h3>
          <p className="text-xs mt-1">
            <span className={`${change >= 0 ? 'text-green-600' : 'text-red-600'} font-medium`}>
              {change >= 0 ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline mr-0.5">
                  <polyline points="18 15 12 9 6 15"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline mr-0.5">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              )}
              {Math.abs(change)}%
            </span>
            <span className="text-gray-500 ml-1">vs last week</span>
          </p>
        </div>
        <div className={`w-10 h-10 rounded-full ${bgColorClass} flex items-center justify-center ${colorClass}`}>
          {renderIcon()}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
