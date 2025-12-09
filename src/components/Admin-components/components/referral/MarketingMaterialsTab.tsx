
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send, Clock, Copy } from 'lucide-react';

interface MarketingMaterialsTabProps {
  onCopyText: (text: string, message: string) => void;
}

const MarketingMaterialsTab: React.FC<MarketingMaterialsTabProps> = ({ onCopyText }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Send size={24} className="text-primary" />
            </div>
            <div>
              <h4 className="font-medium">Email Templates</h4>
              <p className="text-sm text-muted-foreground">Ready-to-send email templates</p>
            </div>
            <Button variant="ghost" className="ml-auto" onClick={() => onCopyText("Email template text would go here", "Email template copied!")}>
              <Copy size={16} />
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Clock size={24} className="text-primary" />
            </div>
            <div>
              <h4 className="font-medium">Social Posts</h4>
              <p className="text-sm text-muted-foreground">Pre-written social media posts</p>
            </div>
            <Button variant="ghost" className="ml-auto" onClick={() => onCopyText("Social media post template would go here", "Social post copied!")}>
              <Copy size={16} />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MarketingMaterialsTab;
