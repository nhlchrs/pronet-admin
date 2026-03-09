import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { 
  Search, Download, Eye, CheckCircle, Package, 
  Gift, Calendar, Filter, Truck, RefreshCw
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
  claimedDate: string;
  processingDate?: string;
  shippedDate?: string;
  deliveredDate?: string;
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
      const response = await axios.get(`${API_URL}/admin/rewards`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRewards(response.data.data || []);
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
        `${API_URL}/admin/rewards/${viewingReward._id}/status`,
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

  const exportToCSV = async () => {
    try {
      const token = localStorage.getItem('token');
      const params: any = {};
      if (statusFilter !== 'all') params.status = statusFilter.toUpperCase();
      if (rankFilter !== 'all') params.rank = rankFilter;

      const response = await axios.get(`${API_URL}/admin/rewards/export/csv`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `reward-claims-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Rewards exported successfully",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Error",
        description: "Failed to export rewards",
        variant: "destructive",
      });
    }
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
          <div className="flex gap-2">
            <Button onClick={fetchRewards} variant="outline">
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={exportToCSV}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-2 border-blue-200 dark:border-blue-900 bg-white dark:bg-gray-800">
            <CardHeader className="pb-2 bg-blue-50 dark:bg-blue-950">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Claimed
              </CardTitle>
            </CardHeader>
            <CardContent className="bg-white dark:bg-gray-800 pt-4">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{statusStats.claimed}</div>
                <Gift className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-amber-200 dark:border-amber-900 bg-white dark:bg-gray-800">
            <CardHeader className="pb-2 bg-amber-50 dark:bg-amber-950">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Processing
              </CardTitle>
            </CardHeader>
            <CardContent className="bg-white dark:bg-gray-800 pt-4">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{statusStats.processing}</div>
                <Package className="h-8 w-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-purple-200 dark:border-purple-900 bg-white dark:bg-gray-800">
            <CardHeader className="pb-2 bg-purple-50 dark:bg-purple-950">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Shipped
              </CardTitle>
            </CardHeader>
            <CardContent className="bg-white dark:bg-gray-800 pt-4">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{statusStats.shipped}</div>
                <Truck className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-green-200 dark:border-green-900 bg-white dark:bg-gray-800">
            <CardHeader className="pb-2 bg-green-50 dark:bg-green-950">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Delivered
              </CardTitle>
            </CardHeader>
            <CardContent className="bg-white dark:bg-gray-800 pt-4">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{statusStats.delivered}</div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardHeader className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by user, email, rank, or reward..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px] bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-600">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700">
                  <SelectItem value="all" className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700">All Statuses</SelectItem>
                  <SelectItem value="claimed" className="bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-950">Claimed</SelectItem>
                  <SelectItem value="processing" className="bg-white dark:bg-gray-800 hover:bg-amber-50 dark:hover:bg-amber-950">Processing</SelectItem>
                  <SelectItem value="shipped" className="bg-white dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-purple-950">Shipped</SelectItem>
                  <SelectItem value="delivered" className="bg-white dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-green-950">Delivered</SelectItem>
                </SelectContent>
              </Select>
              <Select value={rankFilter} onValueChange={setRankFilter}>
                <SelectTrigger className="w-full md:w-[180px] bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-600">
                  <Gift className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by rank" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700">
                  <SelectItem value="all" className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700">All Ranks</SelectItem>
                  {Object.keys(RANK_ICONS).map(rank => (
                    <SelectItem key={rank} value={rank} className="bg-white dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-purple-950">
                      {RANK_ICONS[rank]} {rank}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="bg-white dark:bg-gray-800 pt-6">
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
                          {new Date(reward.claimedDate).toLocaleDateString()}
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700">
          <DialogHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 -m-6 mb-4 p-6 rounded-t-lg">
            <DialogTitle className="text-xl font-bold">Manage Reward Claim</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Update status and manage shipping details
            </DialogDescription>
          </DialogHeader>
          {viewingReward && (
            <div className="space-y-4 px-2">
              {/* User Info */}
              <Card className="border-2 border-blue-200 dark:border-blue-900 bg-white dark:bg-gray-800">
                <CardHeader className="bg-blue-50 dark:bg-blue-950">
                  <CardTitle className="text-base">User Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 pt-4 bg-white dark:bg-gray-800">
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
              <Card className="border-2 border-purple-200 dark:border-purple-900 bg-white dark:bg-gray-800">
                <CardHeader className="bg-purple-50 dark:bg-purple-950">
                  <CardTitle className="text-base">Reward Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 pt-4 bg-white dark:bg-gray-800">
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
              <Card className="border-2 border-green-200 dark:border-green-900 bg-white dark:bg-gray-800">
                <CardHeader className="bg-green-50 dark:bg-green-950">
                  <CardTitle className="text-base">Shipping Address</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1 pt-4 bg-white dark:bg-gray-800">
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
                <div className="space-y-2 p-4 bg-amber-50 dark:bg-amber-950 border-2 border-amber-200 dark:border-amber-900 rounded-lg">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    Tracking Number
                  </label>
                  <Input
                    placeholder="Enter tracking number..."
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="bg-white dark:bg-gray-800"
                  />
                </div>
              )}

              {/* Timestamps */}
              <Card className="border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <CardHeader className="bg-gray-50 dark:bg-gray-900">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm pt-4 bg-white dark:bg-gray-800">
                  <div className="flex justify-between items-center p-2 bg-blue-50 dark:bg-blue-950 rounded">
                    <span className="text-muted-foreground font-medium">Claimed:</span>
                    <span className="font-semibold">{new Date(viewingReward.claimedDate).toLocaleString()}</span>
                  </div>
                  {viewingReward.processingDate && (
                    <div className="flex justify-between items-center p-2 bg-amber-50 dark:bg-amber-950 rounded">
                      <span className="text-muted-foreground font-medium">Processing:</span>
                      <span className="font-semibold">{new Date(viewingReward.processingDate).toLocaleString()}</span>
                    </div>
                  )}
                  {viewingReward.shippedDate && (
                    <div className="flex justify-between items-center p-2 bg-purple-50 dark:bg-purple-950 rounded">
                      <span className="text-muted-foreground font-medium">Shipped:</span>
                      <span className="font-semibold">{new Date(viewingReward.shippedDate).toLocaleString()}</span>
                    </div>
                  )}
                  {viewingReward.deliveredDate && (
                    <div className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-950 rounded">
                      <span className="text-muted-foreground font-medium">Delivered:</span>
                      <span className="font-semibold">{new Date(viewingReward.deliveredDate).toLocaleString()}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
          <DialogFooter className="flex-wrap gap-2 bg-gray-50 dark:bg-gray-900 -m-6 mt-4 p-6 rounded-b-lg border-t-2 border-gray-200 dark:border-gray-700">
            {viewingReward?.status === 'CLAIMED' && (
              <Button
                onClick={() => handleUpdateStatus('PROCESSING')}
                disabled={updatingStatus}
                className="bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-lg"
              >
                <Package className="h-4 w-4 mr-2" />
                Mark as Processing
              </Button>
            )}
            {viewingReward?.status === 'PROCESSING' && (
              <Button
                onClick={() => handleUpdateStatus('SHIPPED')}
                disabled={updatingStatus || !trackingNumber}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-lg disabled:opacity-50"
              >
                <Truck className="h-4 w-4 mr-2" />
                Mark as Shipped
              </Button>
            )}
            {viewingReward?.status === 'SHIPPED' && (
              <Button
                onClick={() => handleUpdateStatus('DELIVERED')}
                disabled={updatingStatus}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark as Delivered
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 font-semibold"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminRewardManagement;
