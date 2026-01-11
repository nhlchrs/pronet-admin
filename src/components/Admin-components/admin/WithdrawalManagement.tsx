
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { 
  Search, Download, Eye, CheckCircle, XCircle, 
  WalletCards, Calendar, Filter, SendHorizontal
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

const mockWithdrawals = [
  { 
    id: "WID001",
    affiliateId: "AF001",
    name: "John Doe",
    amount: 450.75,
    requestDate: "2023-06-15",
    status: "Pending",
    paymentMethod: "Bank Transfer"
  },
  { 
    id: "WID002",
    affiliateId: "AF002",
    name: "Alice Smith",
    amount: 320.40,
    requestDate: "2023-06-16",
    status: "Processed",
    paymentMethod: "PayPal"
  },
  { 
    id: "WID003",
    affiliateId: "AF004",
    name: "Mary Williams",
    amount: 780.25,
    requestDate: "2023-06-17",
    status: "Pending",
    paymentMethod: "Bank Transfer"
  },
  { 
    id: "WID004",
    affiliateId: "AF006",
    name: "Patricia Davis",
    amount: 1250.60,
    requestDate: "2023-06-14",
    status: "Rejected",
    paymentMethod: "Crypto"
  },
  { 
    id: "WID005",
    affiliateId: "AF003",
    name: "Robert Johnson",
    amount: 190.30,
    requestDate: "2023-06-18",
    status: "Pending",
    paymentMethod: "PayPal"
  },
];

const WithdrawalManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [viewingWithdrawal, setViewingWithdrawal] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const filteredWithdrawals = mockWithdrawals.filter((withdrawal) => {
    const matchesSearch = 
      withdrawal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      withdrawal.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      withdrawal.affiliateId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || withdrawal.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesMethod = methodFilter === 'all' || withdrawal.paymentMethod.toLowerCase().replace(' ', '-') === methodFilter.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'processed': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'bank transfer': return '🏦';
      case 'paypal': return '💳';
      case 'crypto': return '₿';
      default: return '💰';
    }
  };
  
  const handleViewWithdrawal = (withdrawal: any) => {
    setViewingWithdrawal(withdrawal);
    setIsDialogOpen(true);
  };
  
  const handleApprove = () => {
    toast({
      title: "Withdrawal Approved",
      description: `Withdrawal request for ${viewingWithdrawal.name} has been approved and processed.`,
    });
    setIsDialogOpen(false);
  };
  
  const handleReject = () => {
    toast({
      title: "Withdrawal Rejected",
      description: `Withdrawal request for ${viewingWithdrawal.name} has been rejected.`,
    });
    setIsDialogOpen(false);
  };

  return (
    <>
      <PageMeta 
        title="Withdrawals - ProNext Admin Panel" 
        description="Manage and process withdrawal requests" 
      />
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Withdrawal Management</h1>
          <Button>
            <SendHorizontal className="mr-2 h-4 w-4" />
            Process All Pending
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-amber-50 dark:bg-amber-900/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Pending Withdrawals</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">$1,421.30</p>
              <p className="text-sm text-gray-500">3 requests to process</p>
            </CardContent>
          </Card>
          
          <Card className="bg-green-50 dark:bg-green-900/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Processed This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">$12,850.45</p>
              <p className="text-sm text-gray-500">28 withdrawals processed</p>
            </CardContent>
          </Card>
          
          <Card className="bg-blue-50 dark:bg-blue-900/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Average Processing Time</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">1.2 days</p>
              <p className="text-sm text-gray-500">From request to payment</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Withdrawal Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="w-full md:w-1/4 relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search withdrawals..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="w-full md:w-1/4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processed">Processed</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full md:w-1/4">
                <Select value={methodFilter} onValueChange={setMethodFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Methods</SelectItem>
                    <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="crypto">Crypto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full md:w-1/4 flex justify-end gap-2">
                <Button variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  Date Range
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>

            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Affiliate</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Request Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWithdrawals.map((withdrawal) => (
                    <TableRow key={withdrawal.id}>
                      <TableCell className="font-medium">{withdrawal.id}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{withdrawal.name}</span>
                          <span className="text-xs text-gray-500">{withdrawal.affiliateId}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">${withdrawal.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className="mr-1">{getMethodIcon(withdrawal.paymentMethod)}</span>
                          {withdrawal.paymentMethod}
                        </div>
                      </TableCell>
                      <TableCell>{withdrawal.requestDate}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(withdrawal.status)}`}>
                          {withdrawal.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleViewWithdrawal(withdrawal)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-between items-center mt-4">
              <p className="text-sm text-gray-500">
                Showing {filteredWithdrawals.length} of {mockWithdrawals.length} withdrawals
              </p>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {viewingWithdrawal && (
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Withdrawal Details</DialogTitle>
              <DialogDescription>ID: {viewingWithdrawal.id} | Requested: {viewingWithdrawal.requestDate}</DialogDescription>
            </DialogHeader>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-sm text-gray-500">Affiliate Information</h3>
                  <p>Name: {viewingWithdrawal.name}</p>
                  <p>ID: {viewingWithdrawal.affiliateId}</p>
                  <p className="mt-2">
                    Status: 
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(viewingWithdrawal.status)}`}>
                      {viewingWithdrawal.status}
                    </span>
                  </p>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-medium text-sm text-gray-500">Withdrawal Information</h3>
                  <p>Amount: <span className="font-semibold">${viewingWithdrawal.amount.toFixed(2)}</span></p>
                  <p>Request Date: {viewingWithdrawal.requestDate}</p>
                  <p>Payment Method: {viewingWithdrawal.paymentMethod}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-sm text-gray-500">Payment Details</h3>
                  {viewingWithdrawal.paymentMethod === "Bank Transfer" && (
                    <>
                      <p>Bank Name: Example Bank</p>
                      <p>Account Number: ****6789</p>
                      <p>Routing Number: ****4321</p>
                      <p>Account Holder: {viewingWithdrawal.name}</p>
                    </>
                  )}
                  
                  {viewingWithdrawal.paymentMethod === "PayPal" && (
                    <>
                      <p>PayPal Email: {viewingWithdrawal.name.toLowerCase().replace(' ', '.')}@example.com</p>
                      <p>Account Verified: Yes</p>
                    </>
                  )}
                  
                  {viewingWithdrawal.paymentMethod === "Crypto" && (
                    <>
                      <p>Wallet Type: Bitcoin</p>
                      <p>Wallet Address: bc1q........x8vh</p>
                      <p>Network: Bitcoin Mainnet</p>
                    </>
                  )}
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-medium text-sm text-gray-500">Admin Notes</h3>
                  {viewingWithdrawal.status === 'Rejected' ? (
                    <p>Withdrawal rejected due to verification issues.</p>
                  ) : viewingWithdrawal.status === 'Processed' ? (
                    <p>Payment processed successfully on {new Date(viewingWithdrawal.requestDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} + 2 days.</p>
                  ) : (
                    <Input placeholder="Add a note about this withdrawal..." className="mt-2" />
                  )}
                </div>
              </div>
            </div>
            
            <DialogFooter className="pt-4 gap-2 sm:gap-0">
              {viewingWithdrawal.status === 'Pending' && (
                <>
                  <Button variant="outline" onClick={handleReject}>
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                  <Button onClick={handleApprove}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve & Process
                  </Button>
                </>
              )}
              {viewingWithdrawal.status !== 'Pending' && (
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};

export default WithdrawalManagement;
