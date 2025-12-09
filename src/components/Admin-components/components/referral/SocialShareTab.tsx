
import React from 'react';
import { Button } from '@/components/ui/button';
import { Facebook, Twitter, LinkedinIcon } from 'lucide-react';

interface SocialShareTabProps {
  onShareSocial: (platform: string) => void;
}

const SocialShareTab: React.FC<SocialShareTabProps> = ({ onShareSocial }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4">
        <Button 
          variant="outline" 
          className="flex items-center gap-2" 
          onClick={() => onShareSocial('facebook')}
        >
          <Facebook size={18} />
          Facebook
        </Button>
        
        <Button 
          variant="outline" 
          className="flex items-center gap-2" 
          onClick={() => onShareSocial('twitter')}
        >
          <Twitter size={18} />
          Twitter
        </Button>
        
        <Button 
          variant="outline" 
          className="flex items-center gap-2" 
          onClick={() => onShareSocial('linkedin')}
        >
          <LinkedinIcon size={18} />
          LinkedIn
        </Button>
      </div>
    </div>
  );
};

export default SocialShareTab;
