
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Settings, Globe, Mail, Bell, Shield, CreditCard, 
  Smartphone, PaintBucket, BookOpen, Save, User, Lock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '../../../context/AuthContext';
import { getApiUrl } from '../../../config/api';
import axios from 'axios';
import { toast as sonnerToast } from 'sonner';
import PageMeta from '../../../components/common/PageMeta';

const AdminSettings = () => {
  const { toast } = useToast();
  const { token, user, setAuthState } = useAuth();
  const [loading, setLoading] = useState(true);
  
  // Profile/Account Settings
  const [profile, setProfile] = useState<any>(null);
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  
  // Password Change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // General Settings
  const [websiteName, setWebsiteName] = useState('ProNet Solutions');
  const [websiteTagline, setWebsiteTagline] = useState('The Future of Affiliate Marketing & Network Growth');
  const [adminEmail, setAdminEmail] = useState('admin@pronet.com');
  const [supportEmail, setSupportEmail] = useState('support@pronet.com');
  const [maintenance, setMaintenance] = useState(false);
  
  // Affiliate Settings
  const [maxDirectReferrals, setMaxDirectReferrals] = useState('10');
  const [minWithdrawalAmount, setMinWithdrawalAmount] = useState('50');
  const [withdrawalProcessingDays, setWithdrawalProcessingDays] = useState('3');
  const [requireKYC, setRequireKYC] = useState(true);
  
  // Email Settings
  const [smtpHost, setSmtpHost] = useState('smtp.example.com');
  const [smtpPort, setSmtpPort] = useState('587');
  const [smtpUsername, setSmtpUsername] = useState('notifications@pronet.com');
  const [smtpPassword, setSmtpPassword] = useState('********');
  const [senderName, setSenderName] = useState('ProNet Solutions');
  
  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [adminAlerts, setAdminAlerts] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(getApiUrl('/user/profile'), {
        headers: { Authorization: `Bearer ${token}` }
      });
      const userData = response.data.data;
      setProfile(userData);
      setFname(userData.fname || '');
      setLname(userData.lname || '');
      setEmail(userData.email || '');
      setPhone(userData.phone || '');
      setAddress(userData.address || '');
    } catch (error) {
      console.error('Error fetching profile:', error);
      sonnerToast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const saveAccountSettings = async () => {
    try {
      const response = await axios.put(getApiUrl('/user/update-profile'), {
        fname,
        lname,
        email,
        phone,
        address
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const updatedUser = response.data.data;
      setAuthState({
        id: updatedUser._id,
        name: `${updatedUser.fname} ${updatedUser.lname}`,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone
      }, token);

      sonnerToast.success('Account settings updated successfully');
      fetchProfile();
    } catch (error: any) {
      console.error('Error updating account:', error);
      sonnerToast.error(error.response?.data?.message || 'Failed to update account settings');
    }
  };

  const changePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      sonnerToast.error('Please fill in all password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      sonnerToast.error('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      sonnerToast.error('New password must be at least 6 characters');
      return;
    }

    try {
      await axios.post(getApiUrl('/user/change-password'), {
        currentPassword,
        newPassword,
        confirmPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      sonnerToast.success('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Error changing password:', error);
      sonnerToast.error(error.response?.data?.message || 'Failed to change password');
    }
  };
  
  // Save settings
  const saveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your changes have been saved successfully.",
    });
  };

  return (
    <>
      <PageMeta 
        title="Settings - ProNet Admin Panel" 
        description="Configure system settings and preferences" 
      />
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">System Settings</h1>
          <Button onClick={saveSettings}>
            <Save className="mr-2 h-4 w-4" />
            Save All Changes
          </Button>
        </div>
        
        <Tabs defaultValue="account">
          <div className="flex flex-col md:flex-row gap-6">
            <Card className="md:w-64 flex-shrink-0">
              <CardContent className="p-0">
                <TabsList className="flex flex-col w-full h-auto rounded-none">
                  <TabsTrigger value="account" className="justify-start px-4 py-3">
                    <User className="mr-2 h-4 w-4" />
                    Account
                  </TabsTrigger>
                  <TabsTrigger value="security" className="justify-start px-4 py-3">
                    <Lock className="mr-2 h-4 w-4" />
                    Security
                  </TabsTrigger>
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
              <TabsContent value="account" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="mr-2 h-5 w-5" />
                      Account Settings
                    </CardTitle>
                    <CardDescription>
                      Manage your admin account information.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {loading ? (
                      <div className="text-center py-8">Loading...</div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fname">First Name</Label>
                          <Input 
                            id="fname" 
                            value={fname} 
                            onChange={(e) => setFname(e.target.value)} 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lname">Last Name</Label>
                          <Input 
                            id="lname" 
                            value={lname} 
                            onChange={(e) => setLname(e.target.value)} 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input 
                            id="email" 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input 
                            id="phone" 
                            type="tel" 
                            value={phone} 
                            onChange={(e) => setPhone(e.target.value)} 
                          />
                        </div>
                        <div className="space-y-2 col-span-2">
                          <Label htmlFor="address">Address</Label>
                          <Input 
                            id="address" 
                            value={address} 
                            onChange={(e) => setAddress(e.target.value)} 
                          />
                        </div>
                        <div className="col-span-2">
                          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                            <div className="flex items-center gap-2 text-sm">
                              <Shield className="h-4 w-4 text-blue-500" />
                              <span className="font-medium">Role:</span>
                              <span className="text-gray-600 dark:text-gray-400">{profile?.role || 'Admin'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button onClick={saveAccountSettings} disabled={loading}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Account Settings
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Lock className="mr-2 h-5 w-5" />
                      Security Settings
                    </CardTitle>
                    <CardDescription>
                      Change your password and manage security settings.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input 
                          id="currentPassword" 
                          type="password" 
                          value={currentPassword} 
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Enter your current password"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input 
                          id="newPassword" 
                          type="password" 
                          value={newPassword} 
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password (min 6 characters)"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input 
                          id="confirmPassword" 
                          type="password" 
                          value={confirmPassword} 
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>
                    
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md mt-4">
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        <strong>Note:</strong> After changing your password, you'll need to log in again with your new credentials.
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={changePassword}>
                      <Lock className="mr-2 h-4 w-4" />
                      Change Password
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

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
    </>
  );
};

export default AdminSettings;
