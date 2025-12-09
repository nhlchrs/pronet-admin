
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { 
  Search, Download, Eye, CheckCircle, XCircle, LayoutDashboard, 
  Filter, Calendar, UserPlus
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

const mockApplications = [
  { 
    id: "APP001",
    name: "Michael Wilson",
    email: "michael@example.com",
    phone: "+1 987-654-3210",
    applied: "2023-06-10",
    sponsorId: "AF001",
    sponsor: "John Doe",
    status: "Pending",
    package: "Gold"
  },
  { 
    id: "APP002",
    name: "Sarah Garcia",
    email: "sarah@example.com",
    phone: "+1 876-543-2109",
    applied: "2023-06-12",
    sponsorId: "AF003",
    sponsor: "Robert Johnson",
    status: "Approved",
    package: "Silver"
  },
  { 
    id: "APP003",
    name: "David Martinez",
    email: "david@example.com",
    phone: "+1 765-432-1098",
    applied: "2023-06-15",
    sponsorId: "AF002",
    sponsor: "Alice Smith",
    status: "Rejected",
    package: "Bronze"
  },
  { 
    id: "APP004",
    name: "Jennifer Taylor",
    email: "jennifer@example.com",
    phone: "+1 654-321-0987",
    applied: "2023-06-18",
    sponsorId: "AF001",
    sponsor: "John Doe",
    status: "Pending",
    package: "Gold"
  },
  { 
    id: "APP005",
    name: "James Anderson",
    email: "james@example.com",
    phone: "+1 543-210-9876",
    applied: "2023-06-20",
    sponsorId: "AF004",
    sponsor: "Mary Williams",
    status: "Pending",
    package: "Platinum"
  },
];

const ApplicationManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [packageFilter, setPackageFilter] = useState('all');
  const [viewingApplication, setViewingApplication] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const filteredApplications = mockApplications.filter((app) => {
    const matchesSearch = 
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.sponsor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || app.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesPackage = packageFilter === 'all' || app.package.toLowerCase() === packageFilter.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesPackage;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getPackageColor = (packageName: string) => {
    switch (packageName.toLowerCase()) {
      case 'platinum': return 'bg-violet-100 text-violet-800';
      case 'gold': return 'bg-yellow-100 text-yellow-800';
      case 'silver': return 'bg-blue-100 text-blue-800';
      case 'bronze': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const handleViewApplication = (app: any) => {
    setViewingApplication(app);
    setIsDialogOpen(true);
  };
  
  const handleApprove = () => {
    toast({
      title: "Application Approved",
      description: `${viewingApplication.name}'s application has been approved.`,
    });
    setIsDialogOpen(false);
  };
  
  const handleReject = () => {
    toast({
      title: "Application Rejected",
      description: `${viewingApplication.name}'s application has been rejected.`,
    });
    setIsDialogOpen(false);
  };

  return (
    <div>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Affiliate Applications</h1>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Create Application
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-amber-50 dark:bg-amber-900/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Pending Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">3</p>
              <p className="text-sm text-gray-500">New applications to review</p>
            </CardContent>
          </Card>
          
          <Card className="bg-green-50 dark:bg-green-900/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Approved This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">24</p>
              <p className="text-sm text-gray-500">New affiliates added</p>
            </CardContent>
          </Card>
          
          <Card className="bg-blue-50 dark:bg-blue-900/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Average Processing Time</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">1.8 days</p>
              <p className="text-sm text-gray-500">From application to decision</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="w-full md:w-1/4 relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search applications..."
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
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full md:w-1/4">
                <Select value={packageFilter} onValueChange={setPackageFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by Package" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Packages</SelectItem>
                    <SelectItem value="bronze">Bronze</SelectItem>
                    <SelectItem value="silver">Silver</SelectItem>
                    <SelectItem value="gold">Gold</SelectItem>
                    <SelectItem value="platinum">Platinum</SelectItem>
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
                    <TableHead>Applicant</TableHead>
                    <TableHead>Package</TableHead>
                    <TableHead>Sponsor</TableHead>
                    <TableHead>Applied Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">{app.id}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{app.name}</span>
                          <span className="text-xs text-gray-500">{app.email}</span>
                          <span className="text-xs text-gray-500">{app.phone}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${getPackageColor(app.package)}`}>
                          {app.package}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{app.sponsor}</span>
                          <span className="text-xs text-gray-500">{app.sponsorId}</span>
                        </div>
                      </TableCell>
                      <TableCell>{app.applied}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(app.status)}`}>
                          {app.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleViewApplication(app)}
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
                Showing {filteredApplications.length} of {mockApplications.length} applications
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
        {viewingApplication && (
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Application Details - {viewingApplication.name}</DialogTitle>
              <DialogDescription>ID: {viewingApplication.id} | Applied: {viewingApplication.applied}</DialogDescription>
            </DialogHeader>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-sm text-gray-500">Applicant Information</h3>
                  <p>Name: {viewingApplication.name}</p>
                  <p>Email: {viewingApplication.email}</p>
                  <p>Phone: {viewingApplication.phone}</p>
                  <p>Package: 
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getPackageColor(viewingApplication.package)}`}>
                      {viewingApplication.package}
                    </span>
                  </p>
                  <p className="mt-2">
                    Status: 
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(viewingApplication.status)}`}>
                      {viewingApplication.status}
                    </span>
                  </p>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-medium text-sm text-gray-500">Sponsor Information</h3>
                  <p>Name: {viewingApplication.sponsor}</p>
                  <p>ID: {viewingApplication.sponsorId}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-sm text-gray-500">Additional Information</h3>
                  <p>Application Date: {viewingApplication.applied}</p>
                  <p>Address: 123 Main St, New York, NY</p>
                  <p>Date of Birth: 1985-06-15</p>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-medium text-sm text-gray-500">Payment Information</h3>
                  <p>Payment Method: Credit Card</p>
                  <p>Payment Status: Verified</p>
                  <p>Amount: ${viewingApplication.package === 'Bronze' ? '100' : 
                      viewingApplication.package === 'Silver' ? '250' : 
                      viewingApplication.package === 'Gold' ? '500' : '1,000'}</p>
                </div>
              </div>
            </div>
            
            <DialogFooter className="pt-4 gap-2 sm:gap-0">
              {viewingApplication.status === 'Pending' && (
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
              {viewingApplication.status !== 'Pending' && (
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

export default ApplicationManagement;
