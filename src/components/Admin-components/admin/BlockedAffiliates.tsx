
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, UserCheck, Calendar, UserX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PageMeta from '../../../components/common/PageMeta';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';

// Mock data for affiliates
const mockAffiliates = [
  { 
    id: 'AF001', 
    name: 'John Smith', 
    email: 'john@example.com', 
    phone: '+1 234-567-8901',
    level: 'Gold',
    joinDate: '2023-01-15',
    isActive: true,
    totalEarnings: '$2,840.25',
  },
  { 
    id: 'AF002', 
    name: 'Emma Johnson', 
    email: 'emma@example.com', 
    phone: '+1 345-678-9012',
    level: 'Silver',
    joinDate: '2023-01-22',
    isActive: true,
    totalEarnings: '$1,450.75',
  },
  { 
    id: 'AF003', 
    name: 'Robert Williams', 
    email: 'robert@example.com', 
    phone: '+1 456-789-0123',
    level: 'Bronze',
    joinDate: '2023-02-10',
    isActive: true,
    totalEarnings: '$950.40',
  },
  { 
    id: 'AF004', 
    name: 'Sarah Brown', 
    email: 'sarah@example.com', 
    phone: '+1 567-890-1234',
    level: 'Platinum',
    joinDate: '2023-01-05',
    isActive: true,
    totalEarnings: '$3,650.90',
  }
];

// Mock data for blocked affiliates
const mockBlockedAffiliates = [
  { 
    id: 'AF005', 
    name: 'James Brown', 
    email: 'james@example.com', 
    phone: '+1 678-901-2345',
    level: 'Silver',
    blockedDate: '2023-06-15',
    reason: 'Violation of terms of service - spam marketing',
    blockedBy: 'Admin',
    totalEarnings: '$1,840.25',
    joinDate: '2023-02-05',
    isActive: false
  },
  { 
    id: 'AF008', 
    name: 'Michael Wilson', 
    email: 'michael@example.com', 
    phone: '+1 234-567-8901',
    level: 'Bronze',
    blockedDate: '2023-06-20',
    reason: 'Multiple account violations',
    blockedBy: 'Admin',
    totalEarnings: '$540.15',
    joinDate: '2023-03-10',
    isActive: false
  },
  { 
    id: 'AF012', 
    name: 'Sandra Miller', 
    email: 'sandra@example.com', 
    phone: '+1 345-678-9012',
    level: 'Gold',
    blockedDate: '2023-07-05',
    reason: 'Fraudulent activity detected',
    blockedBy: 'System',
    totalEarnings: '$2,750.80',
    joinDate: '2023-01-22',
    isActive: false
  },
  { 
    id: 'AF015', 
    name: 'Thomas Clark', 
    email: 'thomas@example.com', 
    phone: '+1 456-789-0123',
    level: 'Bronze',
    blockedDate: '2023-07-12',
    reason: 'Payment dispute unresolved',
    blockedBy: 'Admin',
    totalEarnings: '$320.50',
    joinDate: '2023-04-18',
    isActive: false
  },
  { 
    id: 'AF021', 
    name: 'Jessica Lee', 
    email: 'jessica@example.com', 
    phone: '+1 567-890-1234',
    level: 'Silver',
    blockedDate: '2023-07-25',
    reason: 'Request by affiliate after investigation',
    blockedBy: 'Admin',
    totalEarnings: '$1,250.30',
    joinDate: '2023-02-14',
    isActive: false
  }
];

type Affiliate = {
  id: string;
  name: string;
  email: string;
  phone: string;
  level: string;
  joinDate: string;
  isActive: boolean;
  totalEarnings: string;
  blockedDate?: string;
  reason?: string;
  blockedBy?: string;
};

const BlockedAffiliates = () => {
  const [allAffiliates, setAllAffiliates] = useState<Affiliate[]>([...mockAffiliates, ...mockBlockedAffiliates]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAffiliate, setSelectedAffiliate] = useState<Affiliate | null>(null);
  const [isUnblockDialogOpen, setIsUnblockDialogOpen] = useState(false);
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
  const [blockingReason, setBlockingReason] = useState('');
  const { toast } = useToast();

  // Get only active or blocked affiliates
  const activeAffiliates = allAffiliates.filter(affiliate => affiliate.isActive);
  const blockedAffiliates = allAffiliates.filter(affiliate => !affiliate.isActive);

  // Filter affiliates based on search term
  const filteredBlockedAffiliates = blockedAffiliates.filter((affiliate) => {
    return affiliate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           affiliate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
           affiliate.id.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleUnblockAffiliate = (affiliate: Affiliate) => {
    setSelectedAffiliate(affiliate);
    setIsUnblockDialogOpen(true);
  };

  const handleBlockAffiliate = (affiliate: Affiliate) => {
    setSelectedAffiliate(affiliate);
    setBlockingReason('');
    setIsBlockDialogOpen(true);
  };

  const confirmUnblock = () => {
    if (selectedAffiliate) {
      const updatedAffiliates = allAffiliates.map(affiliate => 
        affiliate.id === selectedAffiliate.id 
          ? { ...affiliate, isActive: true }
          : affiliate
      );
      
      setAllAffiliates(updatedAffiliates);
      
      toast({
        title: "Affiliate Unblocked",
        description: `${selectedAffiliate.name} has been successfully unblocked and reinstated.`,
      });
      
      setIsUnblockDialogOpen(false);
    }
  };

  const confirmBlock = () => {
    if (selectedAffiliate && blockingReason) {
      const today = new Date().toISOString().split('T')[0];
      
      const updatedAffiliates = allAffiliates.map(affiliate => 
        affiliate.id === selectedAffiliate.id 
          ? { 
              ...affiliate, 
              isActive: false, 
              blockedDate: today,
              reason: blockingReason,
              blockedBy: 'Admin'
            }
          : affiliate
      );
      
      setAllAffiliates(updatedAffiliates);
      
      toast({
        title: "Affiliate Blocked",
        description: `${selectedAffiliate.name} has been blocked from the platform.`,
      });
      
      setIsBlockDialogOpen(false);
    } else {
      toast({
        title: "Error",
        description: "Please provide a reason for blocking this affiliate.",
        variant: "destructive",
      });
    }
  };

  // Get level badge color
  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'platinum': return 'bg-violet-700 text-white';
      case 'gold': return 'bg-yellow-700 text-white';
      case 'silver': return 'bg-blue-700 text-white';
      case 'bronze': return 'bg-orange-700 text-white';
      default: return 'bg-gray-700 text-white';
    }
  };

  return (
    <>
      <PageMeta 
        title="Blocked Affiliates - ProNet Admin Panel" 
        description="Manage blocked and suspended affiliates" 
      />
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">Affiliate Status Management</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-blue-900/30 border border-blue-800/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-foreground">Active Affiliates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{activeAffiliates.length}</p>
              <p className="text-sm text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>
          
          <Card className="bg-red-900/30 border border-red-800/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-foreground">Total Blocked</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{blockedAffiliates.length}</p>
              <p className="text-sm text-muted-foreground">Blocked affiliates</p>
            </CardContent>
          </Card>
          
          <Card className="bg-amber-900/30 border border-amber-800/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-foreground">Potential Revenue Loss</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">$6,702.00</p>
              <p className="text-sm text-muted-foreground">From blocked affiliates</p>
            </CardContent>
          </Card>
        </div>

        {/* Active Affiliates Section */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-foreground">Active Affiliates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-border overflow-hidden">
              <Table>
                <TableHeader className="bg-secondary">
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Affiliate</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Earnings</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeAffiliates.map((affiliate) => (
                    <TableRow key={affiliate.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{affiliate.id}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{affiliate.name}</span>
                          <span className="text-xs text-muted-foreground">{affiliate.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${getLevelColor(affiliate.level)}`}>
                          {affiliate.level}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          {affiliate.joinDate}
                        </div>
                      </TableCell>
                      <TableCell>{affiliate.totalEarnings}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleBlockAffiliate(affiliate)}
                          className="border-red-800 text-red-500 hover:bg-red-950 hover:text-red-400"
                        >
                          <UserX className="h-4 w-4 mr-2" />
                          Block
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Blocked Affiliates Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Blocked Affiliate List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="w-full md:w-1/2 relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search blocked affiliates..."
                  className="pl-8 bg-secondary text-foreground"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="rounded-md border border-border overflow-hidden">
              <Table>
                <TableHeader className="bg-secondary">
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Affiliate</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Blocked Since</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Blocked By</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBlockedAffiliates.map((affiliate) => (
                    <TableRow key={affiliate.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{affiliate.id}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{affiliate.name}</span>
                          <span className="text-xs text-muted-foreground">{affiliate.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${getLevelColor(affiliate.level)}`}>
                          {affiliate.level}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          {affiliate.blockedDate}
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="max-w-[200px] truncate" title={affiliate.reason}>
                          {affiliate.reason}
                        </p>
                      </TableCell>
                      <TableCell>{affiliate.blockedBy}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleUnblockAffiliate(affiliate)}
                          className="border-green-800 text-green-500 hover:bg-green-950 hover:text-green-400"
                        >
                          <UserCheck className="h-4 w-4 mr-2" />
                          Unblock
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredBlockedAffiliates.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                        No blocked affiliates found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Unblock Dialog */}
      <Dialog open={isUnblockDialogOpen} onOpenChange={setIsUnblockDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Unblock Affiliate</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Are you sure you want to unblock this affiliate? They will regain access to the platform.
            </DialogDescription>
          </DialogHeader>
          
          {selectedAffiliate && (
            <div className="py-4">
              <div className="flex flex-col space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Affiliate ID</p>
                    <p className="text-foreground">{selectedAffiliate.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Name</p>
                    <p className="text-foreground">{selectedAffiliate.name}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Blocked Reason</p>
                  <p className="text-sm text-foreground">{selectedAffiliate.reason}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Notes for Reinstatement</p>
                  <Textarea 
                    placeholder="Add notes about why this affiliate is being unblocked..." 
                    className="bg-secondary text-foreground"
                  />
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUnblockDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={confirmUnblock}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Confirm Unblock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Block Dialog */}
      <Dialog open={isBlockDialogOpen} onOpenChange={setIsBlockDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Block Affiliate</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Are you sure you want to block this affiliate? They will lose access to the platform.
            </DialogDescription>
          </DialogHeader>
          
          {selectedAffiliate && (
            <div className="py-4">
              <div className="flex flex-col space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Affiliate ID</p>
                    <p className="text-foreground">{selectedAffiliate.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Name</p>
                    <p className="text-foreground">{selectedAffiliate.name}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Level</p>
                  <p className="text-foreground">{selectedAffiliate.level}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Reason for Blocking</p>
                  <Textarea 
                    placeholder="Explain why this affiliate is being blocked..." 
                    className="bg-secondary text-foreground"
                    value={blockingReason}
                    onChange={(e) => setBlockingReason(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBlockDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={confirmBlock}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Confirm Block
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BlockedAffiliates;
