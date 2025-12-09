
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';

interface EmailShareTabProps {
  emailTo: string;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onShareEmail: () => void;
}

const EmailShareTab: React.FC<EmailShareTabProps> = ({ emailTo, onEmailChange, onShareEmail }) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          type="email"
          placeholder="Enter your friend's email"
          value={emailTo}
          onChange={onEmailChange}
          className="flex-1"
        />
        <Button onClick={onShareEmail} className="flex items-center gap-2">
          <Mail size={16} />
          Send Invitation
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        We'll send a personalized invitation with your referral link.
      </p>
    </div>
  );
};

export default EmailShareTab;
