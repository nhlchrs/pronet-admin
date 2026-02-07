
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { 
  Search, Download, Key, KeyRound, Eye, Copy, Filter,
  Trash, RefreshCw, Receipt, CheckCircle, XCircle
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
import { useToast } from '@/hooks/use-toast';
import GenerateEpinForm from '@/components/epin/GenerateEpinForm';
import TransferEpinForm from '@/components/epin/TransferEpinForm';

// Mock data for EPins
const mockEpins = [
  { 
    id: "EP12345", 
    code: "A7B9-C2D4-E6F8-G0H2",
    amount: 100, 
    status: "Active", 
    createdBy: "Admin", 
    createdOn: "2023-06-01",
    expiresOn: "2024-06-01", 
    usedBy: null,
    usedOn: null
  },
  { 
    id: "EP12346", 
    code: "J3K5-L7M9-N1P3-Q5R7",
    amount: 200, 
    status: "Used", 
    createdBy: "Admin", 
    createdOn: "2023-06-02",
    expiresOn: "2024-06-02", 
    usedBy: "AF003",
    usedOn: "2023-06-15"
  },
  { 
    id: "EP12347", 
    code: "S9T1-U3V5-W7X9-Y1Z3",
    amount: 200, 
    status: "Active", 
    createdBy: "Admin", 
    createdOn: "2023-06-03",
    expiresOn: "2024-06-03", 
    usedBy: null,
    usedOn: null
  },
  { 
    id: "EP12348", 
    code: "B4C6-D8E0-F2G4-H6I8",
    amount: 500, 
    status: "Expired", 
    createdBy: "Admin", 
    createdOn: "2022-06-04",
    expiresOn: "2023-06-04", 
    usedBy: null,
    usedOn: null
  },
  { 
    id: "EP12349", 
    code: "K0L2-M4N6-P8Q0-R2S4",
    amount: 500, 
    status: "Active", 
    createdBy: "Admin", 
    createdOn: "2023-06-05",
    expiresOn: "2024-06-05", 
    usedBy: null,
    usedOn: null
  },
  { 
    id: "EP12350", 
    code: "T6U8-V0W2-X4Y6-Z8A0",
    amount: 1000, 
    status: "Used", 
    createdBy: "Admin", 
    createdOn: "2023-06-06",
    expiresOn: "2024-06-06", 
    usedBy: "AF004",
    usedOn: "2023-06-20"
  },
];

const mockTransactions = [
  { 
    id: "TR0001", 
    epinId: "EP12346", 
    type: "Usage", 
    from: "System", 
    to: "AF003", 
    date: "2023-06-15", 
    amount: 200,
    notes: "Used for package upgrade"
  },
  { 
    id: "TR0002", 
    epinId: "EP12350", 
    type: "Usage", 
    from: "System", 
    to: "AF004", 
    date: "2023-06-20", 
    amount: 1000,
    notes: "Used for new registration"
  },
  { 
    id: "TR0003", 
    epinId: "EP12345", 
    type: "Transfer", 
    from: "Admin", 
    to: "AF001", 
    date: "2023-06-25", 
    amount: 100,
    notes: "Allocated to top performer"
  },
  { 
    id: "TR0004", 
    epinId: "EP12347", 
    type: "Transfer", 
    from: "Admin", 
    to: "AF006", 
    date: "2023-06-28", 
    amount: 200,
    notes: "Monthly bonus reward"
  },
  { 
    id: "TR0005", 
    epinId: "EP12349", 
    type: "Creation", 
    from: "System", 
    to: "Admin", 
    date: "2023-06-05", 
    amount: 500,
    notes: "Newly generated epin"
  },
];

const EpinManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();
  
  const handleGenerateEpin = (data: any) => {
    toast({
      title: "E-Pin Generated",
      description: `${data.quantity} E-Pin(s) of $${data.amount} has been generated successfully.`,
    });
  };
  
  const handleTransferEpin = (data: any) => {
    toast({
      title: "E-Pin Transferred",
      description: `E-Pin ${data.epinId} has been transferred successfully.`,
    });
  };
  
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      toast({
        title: "Code Copied",
        description: "The E-Pin code has been copied to clipboard.",
      });
    });
  };
  
  // Filter EPins based on search and status
  const filteredEpins = mockEpins.filter((epin) => {
    const matchesSearch = 
      epin.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      epin.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || 
      epin.status.toLowerCase() === statusFilter.toLowerCase();
    
    const matchesTab = 
      activeTab === 'all' || 
      (activeTab === 'used' && epin.status === 'Used') ||
      (activeTab === 'unused' && epin.status === 'Active');
    
    return matchesSearch && matchesStatus && matchesTab;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'used': return 'bg-blue-100 text-blue-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getTransactionTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'usage': return 'bg-blue-100 text-blue-800';
      case 'transfer': return 'bg-amber-100 text-amber-800';
      case 'creation': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <PageMeta 
        title="E-Pin Management - ProNet Admin Panel" 
        description="Manage E-Pins and voucher codes" 
      />
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">E-Pin Management</h1>
          <div className="flex gap-2">
            <Button variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button>
              <KeyRound className="mr-2 h-4 w-4" />
              Create New E-Pins
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-green-50 dark:bg-green-900/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Available E-Pins</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">3</p>
              <p className="text-sm text-gray-500">Value: $800</p>
            </CardContent>
          </Card>
          
          <Card className="bg-blue-50 dark:bg-blue-900/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Used E-Pins</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">2</p>
              <p className="text-sm text-gray-500">Value: $1,200</p>
            </CardContent>
          </Card>
          
          <Card className="bg-red-50 dark:bg-red-900/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Expired E-Pins</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">1</p>
              <p className="text-sm text-gray-500">Value: $500</p>
            </CardContent>
          </Card>
          
          <Card className="bg-purple-50 dark:bg-purple-900/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Total E-Pins</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">6</p>
              <p className="text-sm text-gray-500">Value: $2,500</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="all" className="flex items-center">
              <Key className="mr-2 h-4 w-4" />
              All E-Pins
            </TabsTrigger>
            <TabsTrigger value="unused" className="flex items-center">
              <CheckCircle className="mr-2 h-4 w-4" />
              Unused E-Pins
            </TabsTrigger>
            <TabsTrigger value="used" className="flex items-center">
              <XCircle className="mr-2 h-4 w-4" />
              Used E-Pins
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center">
              <Receipt className="mr-2 h-4 w-4" />
              Transactions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All E-Pins</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="w-full md:w-1/3 relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search by ID or code..."
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
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="used">Used</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="w-full md:w-1/3 flex justify-end gap-2">
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
                        <TableHead>E-Pin Code</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created On</TableHead>
                        <TableHead>Expires On</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEpins.map((epin) => (
                        <TableRow key={epin.id}>
                          <TableCell className="font-medium">{epin.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <span className="font-mono">{epin.code}</span>
                              <Button
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6 ml-1"
                                onClick={() => handleCopyCode(epin.code)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">${epin.amount}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(epin.status)}`}>
                              {epin.status}
                            </span>
                          </TableCell>
                          <TableCell>{epin.createdOn}</TableCell>
                          <TableCell>{epin.expiresOn}</TableCell>
                          <TableCell className="text-center">
                            <div className="flex justify-center space-x-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-8 w-8"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {epin.status === 'Active' && (
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="h-8 w-8 text-red-500"
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <p className="text-sm text-gray-500">
                    Showing {filteredEpins.length} of {mockEpins.length} e-pins
                  </p>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" disabled>Previous</Button>
                    <Button variant="outline" size="sm">Next</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="unused" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Unused E-Pins</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="w-full md:w-1/2 relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search by ID or code..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="w-full md:w-1/2 flex justify-end gap-2">
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
                        <TableHead>E-Pin Code</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Created On</TableHead>
                        <TableHead>Expires On</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEpins.filter(epin => epin.status === 'Active').map((epin) => (
                        <TableRow key={epin.id}>
                          <TableCell className="font-medium">{epin.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <span className="font-mono">{epin.code}</span>
                              <Button
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6 ml-1"
                                onClick={() => handleCopyCode(epin.code)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">${epin.amount}</TableCell>
                          <TableCell>{epin.createdOn}</TableCell>
                          <TableCell>{epin.expiresOn}</TableCell>
                          <TableCell className="text-center">
                            <div className="flex justify-center space-x-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-8 w-8"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-8 w-8 text-red-500"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="used" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Used E-Pins</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="w-full md:w-1/2 relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search by ID or code..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="w-full md:w-1/2 flex justify-end gap-2">
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
                        <TableHead>E-Pin Code</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Created On</TableHead>
                        <TableHead>Used By</TableHead>
                        <TableHead>Used On</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEpins.filter(epin => epin.status === 'Used').map((epin) => (
                        <TableRow key={epin.id}>
                          <TableCell className="font-medium">{epin.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <span className="font-mono">{epin.code}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">${epin.amount}</TableCell>
                          <TableCell>{epin.createdOn}</TableCell>
                          <TableCell>{epin.usedBy}</TableCell>
                          <TableCell>{epin.usedOn}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>E-Pin Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="w-full md:w-1/3 relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search transactions..."
                      className="pl-8"
                    />
                  </div>
                  
                  <div className="w-full md:w-1/3">
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="creation">Creation</SelectItem>
                        <SelectItem value="transfer">Transfer</SelectItem>
                        <SelectItem value="usage">Usage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="w-full md:w-1/3 flex justify-end gap-2">
                    <Button variant="outline">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
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
                        <TableHead>E-Pin ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>From</TableHead>
                        <TableHead>To</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockTransactions.map((tx) => (
                        <TableRow key={tx.id}>
                          <TableCell className="font-medium">{tx.id}</TableCell>
                          <TableCell>{tx.epinId}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${getTransactionTypeColor(tx.type)}`}>
                              {tx.type}
                            </span>
                          </TableCell>
                          <TableCell>{tx.from}</TableCell>
                          <TableCell>{tx.to}</TableCell>
                          <TableCell>{tx.date}</TableCell>
                          <TableCell className="text-right">${tx.amount}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <p className="text-sm text-gray-500">
                    Showing {mockTransactions.length} of {mockTransactions.length} transactions
                  </p>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" disabled>Previous</Button>
                    <Button variant="outline" size="sm">Next</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate E-Pins</CardTitle>
            </CardHeader>
            <CardContent>
              <GenerateEpinForm onSubmit={handleGenerateEpin} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Transfer E-Pin</CardTitle>
            </CardHeader>
            <CardContent>
              <TransferEpinForm onSubmit={handleTransferEpin} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default EpinManagement;
