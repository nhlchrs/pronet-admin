
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface ReferralStatsProps {
  total: number;
  pending: number;
  available: number;
  conversionRate: string;
}

const ReferralStats: React.FC<ReferralStatsProps> = ({ 
  total, 
  pending, 
  available, 
  conversionRate 
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col space-y-2">
            <span className="text-sm text-muted-foreground">Total Earnings</span>
            <span className="text-2xl font-bold">${total}</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col space-y-2">
            <span className="text-sm text-muted-foreground">Pending Earnings</span>
            <span className="text-2xl font-bold">${pending}</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col space-y-2">
            <span className="text-sm text-muted-foreground">Available for Withdraw</span>
            <span className="text-2xl font-bold">${available}</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col space-y-2">
            <span className="text-sm text-muted-foreground">Conversion Rate</span>
            <span className="text-2xl font-bold">{conversionRate}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferralStats;
