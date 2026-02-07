import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { 
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell 
} from '../components/ui/table';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { 
  Search, Download, Eye, Edit, User, UserCheck, UserX,
  ArrowUp, ArrowDown
} from 'lucide-react';
import { Badge } from '../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import PageMeta from '../../../components/common/PageMeta';

// Mock data for affiliates
const mockAffiliates = [
  { 
    id: 'AF001', 
    name: 'John Doe', 
    email: 'john@example.com', 
    phone: '+1 234-567-8901',
    status: 'Active', 
    level: 'Gold',
    joinDate: '2023-01-15', 
    totalEarnings: '$3,450.75',
    pendingCommission: '$240.50',
    teamSize: 24
  },
  { 
    id: 'AF002', 
    name: 'Alice Smith', 
    email: 'alice@example.com', 
    phone: '+1 345-678-9012',
    status: 'Active', 
    level: 'Silver',
    joinDate: '2023-02-21', 
    totalEarnings: '$2,120.30',
    pendingCommission: '$180.20',
    teamSize: 12
  },
  { 
    id: 'AF003', 
    name: 'Robert Johnson', 
    email: 'robert@example.com', 
    phone: '+1 456-789-0123',
    status: 'Pending', 
    level: 'Bronze',
    joinDate: '2023-03-08', 
    totalEarnings: '$820.15',
    pendingCommission: '$120.60',
    teamSize: 5
  },
  { 
    id: 'AF004', 
    name: 'Mary Williams', 
    email: 'mary@example.com', 
    phone: '+1 567-890-1234',
    status: 'Active', 
    level: 'Gold',
    joinDate: '2023-01-30', 
    totalEarnings: '$4,280.90',
    pendingCommission: '$310.75',
    teamSize: 31
  },
  { 
    id: 'AF005', 
    name: 'James Brown', 
    email: 'james@example.com', 
    phone: '+1 678-901-2345',
    status: 'Inactive', 
    level: 'Silver',
    joinDate: '2023-02-05', 
    totalEarnings: '$1,840.25',
    pendingCommission: '$0.00',
    teamSize: 8
  },
  { 
    id: 'AF006', 
    name: 'Patricia Davis', 
    email: 'patricia@example.com', 
    phone: '+1 789-012-3456',
    status: 'Active', 
    level: 'Platinum',
    joinDate: '2022-12-10', 
    totalEarnings: '$8,750.60',
    pendingCommission: '$520.30',
    teamSize: 47
  },
];

const AffiliateManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');

  // Filter the affiliates based on search term and filters
  const filteredAffiliates = mockAffiliates.filter((affiliate) => {
    // Search filter
    const matchesSearch = 
      affiliate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      affiliate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      affiliate.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || affiliate.status.toLowerCase() === statusFilter.toLowerCase();
    
    // Level filter
    const matchesLevel = levelFilter === 'all' || affiliate.level.toLowerCase() === levelFilter.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesLevel;
  });

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get level badge color
  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'platinum': return 'bg-violet-100 text-violet-800';
      case 'gold': return 'bg-yellow-100 text-yellow-800';
      case 'silver': return 'bg-blue-100 text-blue-800';
      case 'bronze': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <PageMeta 
        title="Affiliate Management - ProNet Admin Panel" 
        description="Manage and monitor all affiliates" 
      />
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Affiliate Management</h1>
          <Button>
            <User className="mr-2 h-4 w-4" />
            Add New Affiliate
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Affiliate Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Affiliates</p>
                <div className="flex items-end justify-between mt-1">
                  <p className="text-2xl font-bold">182</p>
                  <div className="text-xs text-green-600 flex items-center">
                    <span>+12.5%</span>
                    <ArrowUp className="h-3 w-3 ml-1" />
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Affiliates</p>
                <div className="flex items-end justify-between mt-1">
                  <p className="text-2xl font-bold">156</p>
                  <div className="text-xs text-green-600 flex items-center">
                    <span>+8.2%</span>
                    <ArrowUp className="h-3 w-3 ml-1" />
                  </div>
                </div>
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-900/30 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending Verification</p>
                <div className="flex items-end justify-between mt-1">
                  <p className="text-2xl font-bold">8</p>
                  <div className="text-xs text-amber-600 flex items-center">
                    <span>+3.1%</span>
                    <ArrowUp className="h-3 w-3 ml-1" />
                  </div>
                </div>
              </div>
              
              <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Inactive Affiliates</p>
                <div className="flex items-end justify-between mt-1">
                  <p className="text-2xl font-bold">18</p>
                  <div className="text-xs text-red-600 flex items-center">
                    <span>-2.3%</span>
                    <ArrowDown className="h-3 w-3 ml-1" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Affiliates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="w-full md:w-1/3 relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search affiliates..."
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
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full md:w-1/3">
                <Select value={levelFilter} onValueChange={setLevelFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="platinum">Platinum</SelectItem>
                    <SelectItem value="gold">Gold</SelectItem>
                    <SelectItem value="silver">Silver</SelectItem>
                    <SelectItem value="bronze">Bronze</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button variant="outline" className="md:w-auto">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>

            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Affiliate</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Team Size</TableHead>
                    <TableHead className="text-right">Earnings</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAffiliates.map((affiliate) => (
                    <TableRow key={affiliate.id}>
                      <TableCell className="font-medium">{affiliate.id}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{affiliate.name}</span>
                          <span className="text-xs text-gray-500">{affiliate.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(affiliate.status)}`}>
                          {affiliate.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${getLevelColor(affiliate.level)}`}>
                          {affiliate.level}
                        </span>
                      </TableCell>
                      <TableCell>{affiliate.joinDate}</TableCell>
                      <TableCell>{affiliate.teamSize}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-col">
                          <span className="font-medium">{affiliate.totalEarnings}</span>
                          <span className="text-xs text-gray-500">
                            {affiliate.pendingCommission} pending
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center space-x-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          {affiliate.status === 'Active' ? (
                            <Button variant="ghost" size="icon">
                              <UserX className="h-4 w-4 text-red-500" />
                            </Button>
                          ) : (
                            <Button variant="ghost" size="icon">
                              <UserCheck className="h-4 w-4 text-green-500" />
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
                Showing {filteredAffiliates.length} of {mockAffiliates.length} affiliates
              </p>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AffiliateManagement;
