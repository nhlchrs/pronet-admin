
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SocialShareTab from './SocialShareTab';
import EmailShareTab from './EmailShareTab';
import MarketingMaterialsTab from './MarketingMaterialsTab';

interface SharingOptionsProps {
  emailTo: string;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onShareEmail: () => void;
  onShareSocial: (platform: string) => void;
  onCopyText: (text: string, message: string) => void;
}

const SharingOptions: React.FC<SharingOptionsProps> = ({
  emailTo,
  onEmailChange,
  onShareEmail,
  onShareSocial,
  onCopyText
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Share Your Referral</CardTitle>
        <CardDescription>
          Choose how you want to share your referral link with others
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="social">
          <TabsList className="mb-6">
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="marketing">Marketing Materials</TabsTrigger>
          </TabsList>
          
          <TabsContent value="social">
            <SocialShareTab onShareSocial={onShareSocial} />
          </TabsContent>
          
          <TabsContent value="email">
            <EmailShareTab 
              emailTo={emailTo} 
              onEmailChange={onEmailChange} 
              onShareEmail={onShareEmail} 
            />
          </TabsContent>
          
          <TabsContent value="marketing">
            <MarketingMaterialsTab onCopyText={onCopyText} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SharingOptions;
