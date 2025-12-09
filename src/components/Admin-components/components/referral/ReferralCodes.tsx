
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ReferralCodesProps {
  code: string;
  link: string;
  onCopyText: (text: string, message: string) => void;
}

const ReferralCodes: React.FC<ReferralCodesProps> = ({ code, link, onCopyText }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Referral Link & Code</CardTitle>
        <CardDescription>
          Share your unique referral link or code with friends and earn a 10% commission on their purchases
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Referral Code */}
          <div className="space-y-2">
            <div className="font-medium">Referral Code</div>
            <div className="flex items-center">
              <div className="flex-grow p-3 bg-muted rounded-l-md font-mono">{code}</div>
              <Button 
                variant="outline" 
                className="rounded-l-none" 
                onClick={() => onCopyText(code, "Referral code copied to clipboard!")}
              >
                <Copy size={16} />
              </Button>
            </div>
          </div>
          
          {/* Referral Link */}
          <div className="space-y-2">
            <div className="font-medium">Referral Link</div>
            <div className="flex items-center">
              <Input 
                value={link}
                readOnly
                className="font-mono rounded-r-none"
              />
              <Button 
                variant="outline" 
                className="rounded-l-none" 
                onClick={() => onCopyText(link, "Referral link copied to clipboard!")}
              >
                <Copy size={16} />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralCodes;
