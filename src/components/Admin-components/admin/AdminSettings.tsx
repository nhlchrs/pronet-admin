
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Settings, Globe, Mail, Bell, Shield, CreditCard, 
  Smartphone, PaintBucket, BookOpen, Save
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminSettings = () => {
  const { toast } = useToast();

  // General Settings
  const [websiteName, setWebsiteName] = useState('Pro Net Solutions');
  const [websiteTagline, setWebsiteTagline] = useState('The Future of Affiliate Marketing & Network Growth');
  const [adminEmail, setAdminEmail] = useState('admin@pronetsolutions.com');
  const [supportEmail, setSupportEmail] = useState('support@pronetsolutions.com');
  const [maintenance, setMaintenance] = useState(false);
  
  // Affiliate Settings
  const [maxDirectReferrals, setMaxDirectReferrals] = useState('10');
  const [minWithdrawalAmount, setMinWithdrawalAmount] = useState('50');
  const [withdrawalProcessingDays, setWithdrawalProcessingDays] = useState('3');
  const [requireKYC, setRequireKYC] = useState(true);
  
  // Email Settings
  const [smtpHost, setSmtpHost] = useState('smtp.example.com');
  const [smtpPort, setSmtpPort] = useState('587');
  const [smtpUsername, setSmtpUsername] = useState('notifications@pronetsolutions.com');
  const [smtpPassword, setSmtpPassword] = useState('********');
  const [senderName, setSenderName] = useState('Pro Net Solutions');
  
  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [adminAlerts, setAdminAlerts] = useState(true);
  
  // Save settings
  const saveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your changes have been saved successfully.",
    });
  };

  return (
    <div>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">System Settings</h1>
          <Button onClick={saveSettings}>
            <Save className="mr-2 h-4 w-4" />
            Save All Changes
          </Button>
        </div>
        
        <Tabs defaultValue="general">
          <div className="flex flex-col md:flex-row gap-6">
            <Card className="md:w-64 flex-shrink-0">
              <CardContent className="p-0">
                <TabsList className="flex flex-col w-full h-auto rounded-none">
                  <TabsTrigger value="general" className="justify-start px-4 py-3">
                    <Settings className="mr-2 h-4 w-4" />
                    General
                  </TabsTrigger>
                  <TabsTrigger value="affiliate" className="justify-start px-4 py-3">
                    <Shield className="mr-2 h-4 w-4" />
                    Affiliate Settings
                  </TabsTrigger>
                  <TabsTrigger value="email" className="justify-start px-4 py-3">
                    <Mail className="mr-2 h-4 w-4" />
                    Email Configuration
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="justify-start px-4 py-3">
                    <Bell className="mr-2 h-4 w-4" />
                    Notifications
                  </TabsTrigger>
                  <TabsTrigger value="payment" className="justify-start px-4 py-3">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Payment Gateways
                  </TabsTrigger>
                  <TabsTrigger value="appearance" className="justify-start px-4 py-3">
                    <PaintBucket className="mr-2 h-4 w-4" />
                    Appearance
                  </TabsTrigger>
                  <TabsTrigger value="legal" className="justify-start px-4 py-3">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Legal Documents
                  </TabsTrigger>
                </TabsList>
              </CardContent>
            </Card>
            
            <div className="flex-1">
              <TabsContent value="general" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Globe className="mr-2 h-5 w-5" />
                      General Settings
                    </CardTitle>
                    <CardDescription>
                      Configure the basic settings for your application.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="websiteName">Website Name</Label>
                        <Input 
                          id="websiteName" 
                          value={websiteName} 
                          onChange={(e) => setWebsiteName(e.target.value)} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="websiteTagline">Tagline</Label>
                        <Input 
                          id="websiteTagline" 
                          value={websiteTagline} 
                          onChange={(e) => setWebsiteTagline(e.target.value)} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="adminEmail">Admin Email</Label>
                        <Input 
                          id="adminEmail" 
                          type="email" 
                          value={adminEmail} 
                          onChange={(e) => setAdminEmail(e.target.value)} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="supportEmail">Support Email</Label>
                        <Input 
                          id="supportEmail" 
                          type="email" 
                          value={supportEmail} 
                          onChange={(e) => setSupportEmail(e.target.value)} 
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 pt-2">
                      <Switch 
                        id="maintenance" 
                        checked={maintenance} 
                        onCheckedChange={setMaintenance} 
                      />
                      <Label htmlFor="maintenance">Enable Maintenance Mode</Label>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => saveSettings()}>Save General Settings</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="affiliate" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="mr-2 h-5 w-5" />
                      Affiliate Settings
                    </CardTitle>
                    <CardDescription>
                      Configure rules and settings for affiliates.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="maxDirectReferrals">Max Direct Referrals</Label>
                        <Input 
                          id="maxDirectReferrals" 
                          type="number" 
                          value={maxDirectReferrals}
                          onChange={(e) => setMaxDirectReferrals(e.target.value)} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="minWithdrawalAmount">Minimum Withdrawal ($)</Label>
                        <Input 
                          id="minWithdrawalAmount" 
                          type="number" 
                          value={minWithdrawalAmount}
                          onChange={(e) => setMinWithdrawalAmount(e.target.value)} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="withdrawalProcessingDays">Withdrawal Processing Days</Label>
                        <Input 
                          id="withdrawalProcessingDays" 
                          type="number" 
                          value={withdrawalProcessingDays}
                          onChange={(e) => setWithdrawalProcessingDays(e.target.value)} 
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 pt-2">
                      <Switch 
                        id="requireKYC" 
                        checked={requireKYC} 
                        onCheckedChange={setRequireKYC} 
                      />
                      <Label htmlFor="requireKYC">Require KYC Verification</Label>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => saveSettings()}>Save Affiliate Settings</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="email" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Mail className="mr-2 h-5 w-5" />
                      Email Configuration
                    </CardTitle>
                    <CardDescription>
                      Configure SMTP settings for sending emails.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="smtpHost">SMTP Host</Label>
                        <Input 
                          id="smtpHost" 
                          value={smtpHost} 
                          onChange={(e) => setSmtpHost(e.target.value)} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="smtpPort">SMTP Port</Label>
                        <Input 
                          id="smtpPort" 
                          value={smtpPort} 
                          onChange={(e) => setSmtpPort(e.target.value)} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="smtpUsername">SMTP Username</Label>
                        <Input 
                          id="smtpUsername" 
                          value={smtpUsername} 
                          onChange={(e) => setSmtpUsername(e.target.value)} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="smtpPassword">SMTP Password</Label>
                        <Input 
                          id="smtpPassword" 
                          type="password" 
                          value={smtpPassword} 
                          onChange={(e) => setSmtpPassword(e.target.value)} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="senderName">Sender Name</Label>
                        <Input 
                          id="senderName" 
                          value={senderName} 
                          onChange={(e) => setSenderName(e.target.value)} 
                        />
                      </div>
                    </div>
                    
                    <Button variant="outline" className="mt-2">
                      Test Email Configuration
                    </Button>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => saveSettings()}>Save Email Settings</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="notifications" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Bell className="mr-2 h-5 w-5" />
                      Notification Settings
                    </CardTitle>
                    <CardDescription>
                      Configure how notifications are sent to users.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="emailNotifications" className="block font-medium">Email Notifications</Label>
                          <p className="text-sm text-gray-500">Send notifications via email</p>
                        </div>
                        <Switch 
                          id="emailNotifications" 
                          checked={emailNotifications} 
                          onCheckedChange={setEmailNotifications} 
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="smsNotifications" className="block font-medium">SMS Notifications</Label>
                          <p className="text-sm text-gray-500">Send notifications via SMS</p>
                        </div>
                        <Switch 
                          id="smsNotifications" 
                          checked={smsNotifications} 
                          onCheckedChange={setSmsNotifications} 
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="adminAlerts" className="block font-medium">Admin Alerts</Label>
                          <p className="text-sm text-gray-500">Receive critical system alerts</p>
                        </div>
                        <Switch 
                          id="adminAlerts" 
                          checked={adminAlerts} 
                          onCheckedChange={setAdminAlerts} 
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => saveSettings()}>Save Notification Settings</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="payment" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="mr-2 h-5 w-5" />
                      Payment Gateways
                    </CardTitle>
                    <CardDescription>
                      Configure payment processor settings.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: 'Stripe', enabled: true },
                        { name: 'PayPal', enabled: true },
                        { name: 'Bank Transfer', enabled: true },
                        { name: 'Cryptocurrency', enabled: false },
                      ].map((gateway, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                          <div>
                            <h3 className="font-medium">{gateway.name}</h3>
                            <p className="text-sm text-gray-500">
                              {gateway.enabled ? 'Active' : 'Inactive'}
                            </p>
                          </div>
                          <Switch checked={gateway.enabled} />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => saveSettings()}>Save Payment Settings</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="appearance" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <PaintBucket className="mr-2 h-5 w-5" />
                      Appearance
                    </CardTitle>
                    <CardDescription>
                      Customize the look and feel of your application.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Primary Color</Label>
                        <div className="flex gap-2">
                          {['#1A2A38', '#4CD3C8', '#2C3E50', '#3498DB', '#9B59B6', '#E74C3C'].map((color) => (
                            <button 
                              key={color} 
                              className="w-10 h-10 rounded-full border-2 border-transparent hover:border-black dark:hover:border-white"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Theme Mode</Label>
                        <div className="flex gap-2">
                          <Button variant="outline" className="flex-1">Light</Button>
                          <Button variant="outline" className="flex-1">Dark</Button>
                          <Button variant="outline" className="flex-1">System</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => saveSettings()}>Save Appearance Settings</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="legal" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BookOpen className="mr-2 h-5 w-5" />
                      Legal Documents
                    </CardTitle>
                    <CardDescription>
                      Manage terms of service, privacy policy and other legal documents.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { title: 'Terms of Service', lastUpdated: '2023-04-15' },
                        { title: 'Privacy Policy', lastUpdated: '2023-04-15' },
                        { title: 'Refund Policy', lastUpdated: '2023-03-20' },
                        { title: 'Disclaimer', lastUpdated: '2023-02-10' },
                      ].map((document, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                          <div>
                            <h3 className="font-medium">{document.title}</h3>
                            <p className="text-sm text-gray-500">
                              Last updated: {document.lastUpdated}
                            </p>
                          </div>
                          <Button variant="outline" size="sm">Edit</Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => saveSettings()}>Save Legal Documents</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </div>  );
};

export default AdminSettings;
