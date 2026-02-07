import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { 
  Search, Eye, CheckCircle, XCircle, Filter, Download, ShieldCheck, Loader, AlertCircle
} from 'lucide-react';
import { getApiUrl } from '../../../config/api';
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
import { useAuth } from '../../../context/AuthContext';

const KYCVerification = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewingKYC, setViewingKYC] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [kycList, setKycList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [stats, setStats] = useState({
    pending: 0,
    verified: 0,
    rejected: 0,
  });
  const { toast } = useToast();
  const { token } = useAuth();

  // Fetch KYC records from backend
  const fetchKYCRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        getApiUrl('/admin/kyc/list'),
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      
      if (response.data.success && response.data.data) {
        const kycRecords = response.data.data.map((kyc: any) => ({
          id: kyc._id,
          userId: kyc.userId,
          name: kyc.fullName,
          email: kyc.userId?.email || 'N/A',
          affiliateId: kyc.userId?._id?.toString().slice(-6) || 'N/A',
          documentType: kyc.documentType,
          submissionDate: new Date(kyc.createdAt).toLocaleDateString(),
          status: kyc.status,
          fullData: kyc,
        }));
        setKycList(kycRecords);
        
        // Calculate stats
        const pending = kycRecords.filter(k => k.status === 'pending').length;
        const verified = kycRecords.filter(k => k.status === 'verified').length;
        const rejected = kycRecords.filter(k => k.status === 'rejected').length;
        setStats({ pending, verified, rejected });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch KYC records';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      // Use mock data as fallback
      setKycList([
        {
          id: "KYC001",
          affiliateId: "AF001",
          name: "John Doe",
          email: "john@example.com",
          documentType: "Passport",
          submissionDate: "2023-05-12",
          status: "pending",
        },
        {
          id: "KYC002",
          affiliateId: "AF003",
          name: "Robert Johnson",
          email: "robert@example.com",
          documentType: "ID Card",
          submissionDate: "2023-05-10",
          status: "verified",
        },
        {
          id: "KYC003",
          affiliateId: "AF004", 
          name: "Mary Williams",
          email: "mary@example.com",
          documentType: "Driving License",
          submissionDate: "2023-05-15",
          status: "rejected",
        },
      ]);
      setStats({ pending: 1, verified: 1, rejected: 1 });
    } finally {
      setLoading(false);
    }
  };

  // Fetch KYC records on component mount
  useEffect(() => {
    fetchKYCRecords();
  }, [token]);

  const filteredKYC = kycList.filter((kyc) => {
    const matchesSearch = 
      kyc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kyc.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kyc.affiliateId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || kyc.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'approved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const handleViewKYC = (kyc: any) => {
    setViewingKYC(kyc);
    setIsDialogOpen(true);
  };
  
  const handleApprove = async () => {
    if (!viewingKYC) return;
    
    try {
      setVerifyingId(viewingKYC.id);
      const response = await axios.post(
        getApiUrl('/admin/kyc/verify'),
        {
          kycId: viewingKYC.id,
          verificationNotes: 'Approved by admin',
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast({
          title: "Success",
          description: `KYC for ${viewingKYC.name} has been verified.`,
        });
        setIsDialogOpen(false);
        // Refresh list
        await fetchKYCRecords();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to verify KYC';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setVerifyingId(null);
    }
  };
  
  const handleReject = async () => {
    if (!viewingKYC) return;
    
    if (!rejectReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a rejection reason",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setRejectingId(viewingKYC.id);
      const response = await axios.post(
        getApiUrl('/admin/kyc/reject'),
        {
          kycId: viewingKYC.id,
          rejectionReason: rejectReason,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast({
          title: "Success",
          description: `KYC for ${viewingKYC.name} has been rejected.`,
        });
        setIsDialogOpen(false);
        setShowRejectReason(false);
        setRejectReason('');
        // Refresh list
        await fetchKYCRecords();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reject KYC';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setRejectingId(null);
    }
  };

  return (
    <>
      <PageMeta 
        title="KYC Verification - ProNet Admin Panel" 
        description="Review and verify user KYC documents" 
      />
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">KYC Verification</h1>
          <Button>
            <ShieldCheck className="mr-2 h-4 w-4" />
            KYC Settings
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-amber-50 dark:bg-amber-900/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Pending Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.pending}</p>
              <p className="text-sm text-gray-500">
                {loading ? 'Loading...' : 'Awaiting review'}
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-green-50 dark:bg-green-900/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Verified</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.verified}</p>
              <p className="text-sm text-gray-500">Total verified KYC</p>
            </CardContent>
          </Card>
          
          <Card className="bg-red-50 dark:bg-red-900/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Rejected</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.rejected}</p>
              <p className="text-sm text-gray-500">Total rejected KYC</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>KYC Applications</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-800">{error} - Using demo data</span>
              </div>
            )}
            
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="w-full md:w-1/3 relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search applications..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={loading}
                />
              </div>
              
              <div className="w-full md:w-1/3">
                <Select value={statusFilter} onValueChange={setStatusFilter} disabled={loading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full md:w-1/3 flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={fetchKYCRecords}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <Filter className="mr-2 h-4 w-4" />
                      Refresh
                    </>
                  )}
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>

            {loading && filteredKYC.length === 0 ? (
              <div className="text-center py-8">
                <Loader className="h-8 w-8 animate-spin mx-auto mb-2 text-gray-400" />
                <p className="text-gray-500">Loading KYC records...</p>
              </div>
            ) : (
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Affiliate</TableHead>
                      <TableHead>Document Type</TableHead>
                      <TableHead>Submission Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredKYC.length > 0 ? (
                      filteredKYC.map((kyc) => (
                        <TableRow key={kyc.id}>
                          <TableCell className="font-medium">{kyc.id}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">{kyc.name}</span>
                              <span className="text-xs text-gray-500">{kyc.affiliateId}</span>
                              <span className="text-xs text-gray-500">{kyc.email}</span>
                            </div>
                          </TableCell>
                          <TableCell>{kyc.documentType}</TableCell>
                          <TableCell>{kyc.submissionDate}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(kyc.status)}`}>
                              {kyc.status.charAt(0).toUpperCase() + kyc.status.slice(1)}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleViewKYC(kyc)}
                              disabled={loading}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          No KYC records found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}

            {filteredKYC.length > 0 && (
              <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-gray-500">
                  Showing {filteredKYC.length} of {kycList.length} applications
                </p>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" disabled>Previous</Button>
                  <Button variant="outline" size="sm">Next</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {viewingKYC && (
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>KYC Details - {viewingKYC.name}</DialogTitle>
              <DialogDescription>ID: {viewingKYC.id} | User: {viewingKYC.affiliateId}</DialogDescription>
            </DialogHeader>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-sm text-gray-500">Personal Information</h3>
                  <div className="mt-2 space-y-1">
                    <p><span className="font-medium">Name:</span> {viewingKYC.name}</p>
                    <p><span className="font-medium">Email:</span> {viewingKYC.email}</p>
                    <p><span className="font-medium">Document Type:</span> {viewingKYC.documentType}</p>
                    <p><span className="font-medium">Submission Date:</span> {viewingKYC.submissionDate}</p>
                    <p className="mt-2">
                      <span className="font-medium">Status:</span> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(viewingKYC.status)}`}>
                        {viewingKYC.status.charAt(0).toUpperCase() + viewingKYC.status.slice(1)}
                      </span>
                    </p>
                  </div>
                </div>
                
                {viewingKYC.fullData && (
                  <div className="border-t pt-4">
                    <h3 className="font-medium text-sm text-gray-500">Document Details</h3>
                    <div className="mt-2 space-y-1 text-sm">
                      <p><span className="font-medium">Document #:</span> {viewingKYC.fullData.documentNumber}</p>
                      <p><span className="font-medium">Full Name:</span> {viewingKYC.fullData.fullName}</p>
                      <p><span className="font-medium">DOB:</span> {new Date(viewingKYC.fullData.dateOfBirth).toLocaleDateString()}</p>
                      <p><span className="font-medium">Gender:</span> {viewingKYC.fullData.gender}</p>
                    </div>
                  </div>
                )}

                {viewingKYC.fullData?.address && (
                  <div className="border-t pt-4">
                    <h3 className="font-medium text-sm text-gray-500">Address</h3>
                    <div className="mt-2 space-y-1 text-sm">
                      <p>{viewingKYC.fullData.address.street}</p>
                      <p>{viewingKYC.fullData.address.city}, {viewingKYC.fullData.address.state} {viewingKYC.fullData.address.zipCode}</p>
                      <p>{viewingKYC.fullData.address.country}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium text-sm text-gray-500">Document Preview</h3>
                {viewingKYC.fullData?.documentImageUrl ? (
                  <div className="border rounded-md bg-gray-50 flex items-center justify-center h-40">
                    <img 
                      src={viewingKYC.fullData.documentImageUrl} 
                      alt="Document" 
                      className="max-h-40 object-contain"
                    />
                  </div>
                ) : (
                  <div className="border rounded-md bg-gray-50 flex items-center justify-center h-40">
                    <p className="text-gray-400">Front document not available</p>
                  </div>
                )}
                
                {viewingKYC.fullData?.backImageUrl ? (
                  <div className="border rounded-md bg-gray-50 flex items-center justify-center h-40">
                    <img 
                      src={viewingKYC.fullData.backImageUrl} 
                      alt="Back Document" 
                      className="max-h-40 object-contain"
                    />
                  </div>
                ) : (
                  <div className="border rounded-md bg-gray-50 flex items-center justify-center h-40">
                    <p className="text-gray-400">Back document not available</p>
                  </div>
                )}

                {viewingKYC.fullData?.verificationNotes && (
                  <div className="border-t pt-4">
                    <h3 className="font-medium text-sm text-gray-500">Verification Notes</h3>
                    <p className="text-sm mt-2">{viewingKYC.fullData.verificationNotes}</p>
                  </div>
                )}

                {viewingKYC.fullData?.rejectionReason && (
                  <div className="border-t pt-4 bg-red-50 p-3 rounded-md">
                    <h3 className="font-medium text-sm text-red-700">Rejection Reason</h3>
                    <p className="text-sm mt-2 text-red-600">{viewingKYC.fullData.rejectionReason}</p>
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter className="pt-4 gap-2 sm:gap-0">
              {viewingKYC.status === 'pending' && (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowRejectReason(true)}
                    disabled={rejectingId === viewingKYC.id || verifyingId === viewingKYC.id}
                  >
                    {rejectingId === viewingKYC.id ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Rejecting...
                      </>
                    ) : (
                      <>
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </>
                    )}
                  </Button>
                  <Button 
                    onClick={handleApprove}
                    disabled={verifyingId === viewingKYC.id || rejectingId === viewingKYC.id}
                  >
                    {verifyingId === viewingKYC.id ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Approving...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve
                      </>
                    )}
                  </Button>
                </>
              )}
              {viewingKYC.status !== 'pending' && (
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Reject Reason Dialog */}
      <Dialog open={showRejectReason} onOpenChange={setShowRejectReason}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reject KYC Application</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting {viewingKYC?.name}'s KYC application
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Rejection Reason</label>
              <textarea
                className="w-full p-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Explain why this KYC application is being rejected..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                disabled={rejectingId === viewingKYC?.id}
              />
              <p className="text-xs text-gray-500 mt-1">{rejectReason.length}/500 characters</p>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowRejectReason(false);
                setRejectReason('');
              }}
              disabled={rejectingId === viewingKYC?.id}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleReject}
              disabled={!rejectReason.trim() || rejectingId === viewingKYC?.id}
            >
              {rejectingId === viewingKYC?.id ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Rejecting...
                </>
              ) : (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Confirm Rejection
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default KYCVerification;
