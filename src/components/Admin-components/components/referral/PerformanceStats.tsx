
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface PerformanceStatsProps {
  clicks: number;
  signups: number;
  activeUsers: number;
  conversionRate: string;
}

const PerformanceStats: React.FC<PerformanceStatsProps> = ({
  clicks,
  signups,
  activeUsers,
  conversionRate
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Referral Performance</CardTitle>
        <CardDescription>
          Track how your referral link is performing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Link Clicks</div>
            <div className="text-2xl font-bold">{clicks}</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Sign Ups</div>
            <div className="text-2xl font-bold">{signups}</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Active Users</div>
            <div className="text-2xl font-bold">{activeUsers}</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Conversion Rate</div>
            <div className="text-2xl font-bold">{conversionRate}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceStats;
