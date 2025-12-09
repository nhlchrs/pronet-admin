
import React from 'react';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';

const ReferralHeader: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold">My Referrals</h1>
        <p className="text-muted-foreground">
          Share Pro Net Solutions and earn rewards for every referral
        </p>
      </div>
      <Button className="mt-4 md:mt-0 flex items-center gap-2">
        <Share2 size={16} />
        Share Now
      </Button>
    </div>
  );
};

export default ReferralHeader;
