
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { 
  Search, Eye, CheckCircle, XCircle, Filter, Download, ShieldCheck
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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

const mockKycData = [
  {
    id: "KYC001",
    affiliateId: "AF001",
    name: "John Doe",
    email: "john@example.com",
    documentType: "Passport",
    submissionDate: "2023-05-12",
    status: "Pending",
  },
  {
    id: "KYC002",
    affiliateId: "AF003",
    name: "Robert Johnson",
    email: "robert@example.com",
    documentType: "ID Card",
    submissionDate: "2023-05-10",
    status: "Approved",
  },
  {
    id: "KYC003",
    affiliateId: "AF004", 
    name: "Mary Williams",
    email: "mary@example.com",
    documentType: "Driving License",
    submissionDate: "2023-05-15",
    status: "Rejected",
  },
  {
    id: "KYC004",
    affiliateId: "AF006",
    name: "Patricia Davis",
    email: "patricia@example.com",
    documentType: "Passport",
    submissionDate: "2023-05-18",
    status: "Pending",
  },
  {
    id: "KYC005",
    affiliateId: "AF002",
    name: "Alice Smith",
    email: "alice@example.com",
    documentType: "ID Card",
    submissionDate: "2023-05-20",
    status: "Pending",
  }
];

const KYCVerification = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewingKYC, setViewingKYC] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const filteredKYC = mockKycData.filter((kyc) => {
    const matchesSearch = 
      kyc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kyc.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kyc.affiliateId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || kyc.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const handleViewKYC = (kyc: any) => {
    setViewingKYC(kyc);
    setIsDialogOpen(true);
  };
  
  const handleApprove = () => {
    toast({
      title: "KYC Approved",
      description: `KYC for ${viewingKYC.name} has been approved.`,
    });
    setIsDialogOpen(false);
  };
  
  const handleReject = () => {
    toast({
      title: "KYC Rejected",
      description: `KYC for ${viewingKYC.name} has been rejected.`,
    });
    setIsDialogOpen(false);
  };

  return (
    <div>
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
              <p className="text-2xl font-bold">3</p>
              <p className="text-sm text-gray-500">Updated 10 minutes ago</p>
            </CardContent>
          </Card>
          
          <Card className="bg-green-50 dark:bg-green-900/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">156</p>
              <p className="text-sm text-gray-500">Total approved KYC</p>
            </CardContent>
          </Card>
          
          <Card className="bg-red-50 dark:bg-red-900/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Rejected</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">14</p>
              <p className="text-sm text-gray-500">Total rejected KYC</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>KYC Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="w-full md:w-1/3 relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search applications..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="w-full md:w-1/3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full md:w-1/3 flex justify-end gap-2">
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  More Filters
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
                    <TableHead>Document Type</TableHead>
                    <TableHead>Submission Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredKYC.map((kyc) => (
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
                          {kyc.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleViewKYC(kyc)}
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
                Showing {filteredKYC.length} of {mockKycData.length} applications
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
        {viewingKYC && (
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>KYC Details - {viewingKYC.name}</DialogTitle>
              <DialogDescription>ID: {viewingKYC.id} | Affiliate ID: {viewingKYC.affiliateId}</DialogDescription>
            </DialogHeader>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-sm text-gray-500">Personal Information</h3>
                  <p>Name: {viewingKYC.name}</p>
                  <p>Email: {viewingKYC.email}</p>
                  <p>Document Type: {viewingKYC.documentType}</p>
                  <p>Submission Date: {viewingKYC.submissionDate}</p>
                  <p className="mt-2">
                    Status: 
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(viewingKYC.status)}`}>
                      {viewingKYC.status}
                    </span>
                  </p>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-medium text-sm text-gray-500">Additional Information</h3>
                  <p>Phone: +1 234-567-8901</p>
                  <p>Address: 123 Main St, New York, NY</p>
                  <p>Date of Birth: 1985-06-15</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium text-sm text-gray-500">Document Preview</h3>
                <div className="border rounded-md bg-gray-50 flex items-center justify-center h-40">
                  <p className="text-gray-400">Document preview placeholder</p>
                </div>
                <div className="border rounded-md bg-gray-50 flex items-center justify-center h-40">
                  <p className="text-gray-400">Document preview placeholder</p>
                </div>
              </div>
            </div>
            
            <DialogFooter className="pt-4 gap-2 sm:gap-0">
              {viewingKYC.status === 'Pending' && (
                <>
                  <Button variant="outline" onClick={handleReject}>
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                  <Button onClick={handleApprove}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                </>
              )}
              {viewingKYC.status !== 'Pending' && (
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>  );
};

export default KYCVerification;
