
import React from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Award, 
  CreditCard,
  UserCheck,
  Activity,
  Users
} from 'lucide-react';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export interface AffiliateData {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  joinDate?: string;
  status?: 'active' | 'inactive' | 'pending';
  level?: string;
  teamSize?: number;
  directReferrals?: number;
  earnings?: {
    total: number;
    monthly: number;
    pending: number;
  };
  kyc?: 'verified' | 'pending' | 'rejected';
  profileImage?: string;
}

interface AffiliateProfileProps {
  affiliate: AffiliateData;
  onClose: () => void;
  isAdmin?: boolean;
}

const AffiliateProfile = ({ affiliate, onClose, isAdmin = false }: AffiliateProfileProps) => {
  // For demo purposes, we'll use the affiliate data passed in
  // In a real app, you might want to fetch more detailed data when this component mounts
  
  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    }
  };
  
  const getLevelColor = (level: string | undefined) => {
    switch (level?.toLowerCase()) {
      case 'platinum': return 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300';
      case 'gold': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      case 'silver': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'bronze': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {affiliate.profileImage ? (
              <img src={affiliate.profileImage} alt={affiliate.name} className="h-full w-full object-cover" />
            ) : (
              <User className="h-8 w-8 text-gray-500" />
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{affiliate.name}</h2>
            <div className="flex gap-2 mt-1">
              <Badge variant="outline" className={getStatusColor(affiliate.status)}>
                {affiliate.status || 'Unknown'}
              </Badge>
              {affiliate.level && (
                <Badge variant="outline" className={getLevelColor(affiliate.level)}>
                  {affiliate.level}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>

      <Tabs defaultValue="details">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {affiliate.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{affiliate.email}</span>
                </div>
              )}
              {affiliate.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{affiliate.phone}</span>
                </div>
              )}
              {affiliate.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{affiliate.address}</span>
                </div>
              )}
              {affiliate.joinDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Joined: {affiliate.joinDate}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {isAdmin && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">KYC Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Badge variant={affiliate.kyc === 'verified' ? 'default' : (affiliate.kyc === 'pending' ? 'outline' : 'destructive')}>
                    {affiliate.kyc || 'Not Submitted'}
                  </Badge>
                  {affiliate.kyc === 'verified' && <UserCheck className="h-4 w-4 text-green-500" />}
                </div>
              </CardContent>
              {isAdmin && (
                <CardFooter className="border-t pt-4">
                  <Button variant="outline" size="sm" className="mr-2">
                    View Documents
                  </Button>
                  {affiliate.kyc === 'pending' && (
                    <Button size="sm" className="ml-auto">
                      Verify KYC
                    </Button>
                  )}
                </CardFooter>
              )}
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Network Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span>Total Team Members</span>
                </div>
                <span className="font-medium">{affiliate.teamSize || 0}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-muted-foreground" />
                  <span>Direct Referrals</span>
                </div>
                <span className="font-medium">{affiliate.directReferrals || 0}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-muted-foreground" />
                  <span>Active Members</span>
                </div>
                <span className="font-medium">{Math.floor((affiliate.teamSize || 0) * 0.8)}</span>
              </div>
            </CardContent>
            {isAdmin && (
              <CardFooter className="border-t pt-4">
                <Button variant="outline" size="sm">
                  View Full Tree
                </Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="earnings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Financial Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <span>Total Earnings</span>
                </div>
                <span className="font-medium">${affiliate.earnings?.total || 0}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-muted-foreground" />
                  <span>Current Month</span>
                </div>
                <span className="font-medium">${affiliate.earnings?.monthly || 0}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-muted-foreground" />
                  <span>Pending</span>
                </div>
                <span className="font-medium">${affiliate.earnings?.pending || 0}</span>
              </div>
            </CardContent>
            {isAdmin && (
              <CardFooter className="border-t pt-4">
                <Button variant="outline" size="sm">
                  View Transactions
                </Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      {isAdmin && (
        <div className="flex justify-end gap-2">
          <Button variant="outline" className="gap-2">
            <Mail className="h-4 w-4" />
            Contact
          </Button>
          <Button className="gap-2">
            <User className="h-4 w-4" />
            Edit Profile
          </Button>
        </div>
      )}
    </div>
  );
};

export default AffiliateProfile;
