
import React from 'react';
import { cn } from '../../lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string; // Add the missing description prop
  className?: string;
}

const StatCard = ({ title, value, icon, trend, description, className }: StatCardProps) => {
  return (
    <div className={cn("stat-card", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          
          {trend && (
            <div className="flex items-center mt-2">
              <span 
                className={`text-xs font-medium ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className="text-xs text-gray-500 ml-1">vs last period</span>
            </div>
          )}
          
          {description && (
            <div className="mt-1">
              <span className="text-xs text-gray-500">{description}</span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-md">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
