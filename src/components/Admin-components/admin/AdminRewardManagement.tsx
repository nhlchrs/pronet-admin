import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { 
  Search, Download, Eye, CheckCircle, Package, 
  Gift, Calendar, Filter, Truck
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import PageMeta from '../../../components/common/PageMeta';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface RewardClaim {
  _id: string;
  userId: {
    _id: string;
    fname: string;
    lname: string;
    email: string;
  };
  rank: string;
  rewardType: string;
  status: 'CLAIMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED';
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  size?: string;
  color?: string;
  trackingNumber?: string;
  claimedAt: string;
  processingStartedAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
}

const RANK_ICONS: Record<string, string> = {
  IGNITOR: '🔥',
  SPARK: '⚡',
  RISER: '🌅',
  PIONEER: '🧭',
  INNOVATOR: '💡',
  TRAILBLAZER: '🚀',
  CATALYST: '⚗️',
  MOGUL: '👑',
  VANGUARD: '🛡️',
  LUMINARY: '✨',
  SOVEREIGN: '👑',
  ZENITH: '🏆',
};

const AdminRewardManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [rankFilter, setRankFilter] = useState('all');
  const [rewards, setRewards] = useState<RewardClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingReward, setViewingReward] = useState<RewardClaim | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/team/rewards/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRewards(response.data.data || response.data || []);
    } catch (error) {
      console.error('Error fetching rewards:', error);
      toast({
        title: "Error",
        description: "Failed to fetch reward claims",
        variant: "destructive",
      });
      setRewards([]);
    } finally {
      setLoading(false);
    }
  };
  
  const filteredRewards = rewards.filter((reward) => {
    const userName = `${reward.userId.fname} ${reward.userId.lname}`.toLowerCase();
    const matchesSearch = 
      userName.includes(searchTerm.toLowerCase()) ||
      reward.userId.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reward.rank.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reward.rewardType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || reward.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesRank = rankFilter === 'all' || reward.rank === rankFilter;
    
    return matchesSearch && matchesStatus && matchesRank;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'claimed': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-amber-100 text-amber-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewReward = (reward: RewardClaim) => {
    setViewingReward(reward);
    setTrackingNumber(reward.trackingNumber || '');
    setIsDialogOpen(true);
  };
  
  const handleUpdateStatus = async (newStatus: string) => {
    if (!viewingReward) return;

    try {
      setUpdatingStatus(true);
      const token = localStorage.getItem('token');
      const updateData: any = { status: newStatus };
      
      if (newStatus === 'SHIPPED' && trackingNumber) {
        updateData.trackingNumber = trackingNumber;
      }

      await axios.patch(
        `${API_URL}/api/team/rewards/${viewingReward._id}/status`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast({
        title: "Status Updated",
        description: `Reward status updated to ${newStatus}`,
      });

      // Refresh the list
      await fetchRewards();
      setIsDialogOpen(false);
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update reward status",
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const exportToCSV = () => {
    const csv = [
      ['Claim ID', 'User', 'Email', 'Rank', 'Reward', 'Status', 'Claimed Date', 'Tracking Number'].join(','),
      ...filteredRewards.map(reward => [
        reward._id,
        `${reward.userId.fname} ${reward.userId.lname}`,
        reward.userId.email,
        reward.rank,
        reward.rewardType,
        reward.status,
        new Date(reward.claimedAt).toLocaleDateString(),
        reward.trackingNumber || 'N/A'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reward-claims-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'claimed': return <Gift className="h-4 w-4" />;
      case 'processing': return <Package className="h-4 w-4" />;
      case 'shipped': return <Truck className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      default: return <Gift className="h-4 w-4" />;
    }
  };

  const statusStats = {
    claimed: rewards.filter(r => r.status === 'CLAIMED').length,
    processing: rewards.filter(r => r.status === 'PROCESSING').length,
    shipped: rewards.filter(r => r.status === 'SHIPPED').length,
    delivered: rewards.filter(r => r.status === 'DELIVERED').length,
  };

  return (
    <>
      <PageMeta 
        title="Reward Management - ProNet Admin Panel" 
        description="Manage binary rank reward claims" 
      />
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Binary Reward Management</h1>
          <Button onClick={exportToCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Claimed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{statusStats.claimed}</div>
                <Gift className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Processing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{statusStats.processing}</div>
                <Package className="h-8 w-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Shipped
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{statusStats.shipped}</div>
                <Truck className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Delivered
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{statusStats.delivered}</div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by user, email, rank, or reward..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="claimed">Claimed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
              <Select value={rankFilter} onValueChange={setRankFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <Gift className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by rank" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ranks</SelectItem>
                  {Object.keys(RANK_ICONS).map(rank => (
                    <SelectItem key={rank} value={rank}>
                      {RANK_ICONS[rank]} {rank}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
                <p className="mt-2 text-muted-foreground">Loading rewards...</p>
              </div>
            ) : filteredRewards.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Gift className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No reward claims found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Rank</TableHead>
                    <TableHead>Reward</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Claimed Date</TableHead>
                    <TableHead>Tracking</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRewards.map((reward) => (
                    <TableRow key={reward._id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {reward.userId.fname} {reward.userId.lname}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {reward.userId.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{RANK_ICONS[reward.rank] || '🏆'}</span>
                          <span className="font-medium">{reward.rank}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{reward.rewardType}</div>
                          {(reward.size || reward.color) && (
                            <div className="text-sm text-muted-foreground">
                              {reward.size && `Size: ${reward.size}`}
                              {reward.size && reward.color && ' • '}
                              {reward.color && `Color: ${reward.color}`}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(reward.status)}>
                          <span className="mr-1">{getStatusIcon(reward.status)}</span>
                          {reward.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {new Date(reward.claimedAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        {reward.trackingNumber ? (
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {reward.trackingNumber}
                          </code>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewReward(reward)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* View/Update Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Reward Claim</DialogTitle>
            <DialogDescription>
              Update status and manage shipping details
            </DialogDescription>
          </DialogHeader>
          {viewingReward && (
            <div className="space-y-4">
              {/* User Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">User Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Name:</div>
                    <div className="font-medium">
                      {viewingReward.userId.fname} {viewingReward.userId.lname}
                    </div>
                    <div className="text-muted-foreground">Email:</div>
                    <div className="font-medium">{viewingReward.userId.email}</div>
                  </div>
                </CardContent>
              </Card>

              {/* Reward Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Reward Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Rank:</div>
                    <div className="font-medium">
                      {RANK_ICONS[viewingReward.rank]} {viewingReward.rank}
                    </div>
                    <div className="text-muted-foreground">Reward Type:</div>
                    <div className="font-medium">{viewingReward.rewardType}</div>
                    {viewingReward.size && (
                      <>
                        <div className="text-muted-foreground">Size:</div>
                        <div className="font-medium">{viewingReward.size}</div>
                      </>
                    )}
                    {viewingReward.color && (
                      <>
                        <div className="text-muted-foreground">Color:</div>
                        <div className="font-medium">{viewingReward.color}</div>
                      </>
                    )}
                    <div className="text-muted-foreground">Status:</div>
                    <div>
                      <Badge className={getStatusColor(viewingReward.status)}>
                        {viewingReward.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Shipping Address</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1">
                  <div className="font-medium">{viewingReward.shippingAddress.fullName}</div>
                  <div>{viewingReward.shippingAddress.phone}</div>
                  <div>{viewingReward.shippingAddress.addressLine1}</div>
                  {viewingReward.shippingAddress.addressLine2 && (
                    <div>{viewingReward.shippingAddress.addressLine2}</div>
                  )}
                  <div>
                    {viewingReward.shippingAddress.city}, {viewingReward.shippingAddress.state}{' '}
                    {viewingReward.shippingAddress.postalCode}
                  </div>
                  <div>{viewingReward.shippingAddress.country}</div>
                </CardContent>
              </Card>

              {/* Tracking Number */}
              {(viewingReward.status === 'PROCESSING' || viewingReward.status === 'SHIPPED') && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tracking Number</label>
                  <Input
                    placeholder="Enter tracking number..."
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                  />
                </div>
              )}

              {/* Timestamps */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Timeline</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Claimed:</span>
                    <span>{new Date(viewingReward.claimedAt).toLocaleString()}</span>
                  </div>
                  {viewingReward.processingStartedAt && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Processing:</span>
                      <span>{new Date(viewingReward.processingStartedAt).toLocaleString()}</span>
                    </div>
                  )}
                  {viewingReward.shippedAt && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipped:</span>
                      <span>{new Date(viewingReward.shippedAt).toLocaleString()}</span>
                    </div>
                  )}
                  {viewingReward.deliveredAt && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivered:</span>
                      <span>{new Date(viewingReward.deliveredAt).toLocaleString()}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
          <DialogFooter className="flex-wrap gap-2">
            {viewingReward?.status === 'CLAIMED' && (
              <Button
                onClick={() => handleUpdateStatus('PROCESSING')}
                disabled={updatingStatus}
                className="bg-amber-600 hover:bg-amber-700"
              >
                <Package className="h-4 w-4 mr-2" />
                Mark as Processing
              </Button>
            )}
            {viewingReward?.status === 'PROCESSING' && (
              <Button
                onClick={() => handleUpdateStatus('SHIPPED')}
                disabled={updatingStatus || !trackingNumber}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Truck className="h-4 w-4 mr-2" />
                Mark as Shipped
              </Button>
            )}
            {viewingReward?.status === 'SHIPPED' && (
              <Button
                onClick={() => handleUpdateStatus('DELIVERED')}
                disabled={updatingStatus}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark as Delivered
              </Button>
            )}
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminRewardManagement;
