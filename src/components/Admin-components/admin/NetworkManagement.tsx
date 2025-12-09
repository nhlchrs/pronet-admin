
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Network, 
  GitFork, 
  UserPlus,
  Users,
  Filter,
  Layers
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const NetworkManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('tree');
  
  const mockAffiliates = [
    { id: 'AF001', name: 'John Doe', level: 'Gold', team: 24, referrals: 5, status: 'Active' },
    { id: 'AF002', name: 'Alice Smith', level: 'Silver', team: 12, referrals: 3, status: 'Active' },
    { id: 'AF003', name: 'Robert Johnson', level: 'Bronze', team: 5, referrals: 2, status: 'Active' },
    { id: 'AF004', name: 'Mary Williams', level: 'Gold', team: 31, referrals: 7, status: 'Active' },
    { id: 'AF005', name: 'James Brown', level: 'Silver', team: 8, referrals: 1, status: 'Inactive' },
    { id: 'AF006', name: 'Patricia Davis', level: 'Platinum', team: 47, referrals: 12, status: 'Active' }
  ];

  const filteredAffiliates = mockAffiliates.filter((affiliate) => {
    const matchesSearch = 
      affiliate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      affiliate.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLevel = levelFilter === 'all' || affiliate.level.toLowerCase() === levelFilter.toLowerCase();
    
    return matchesSearch && matchesLevel;
  });

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
    <div>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Network Management</h1>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add New Affiliate
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                <Users className="mr-2 h-5 w-5 text-primary" />
                Total Team Size
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">277</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                <GitFork className="mr-2 h-5 w-5 text-green-600" />
                Total Direct Referrals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">42</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                <Layers className="mr-2 h-5 w-5 text-amber-600" />
                Network Depth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">7 levels</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                <Network className="mr-2 h-5 w-5 text-blue-600" />
                Active Affiliates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">258</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="tree" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="tree" className="flex items-center">
              <Network className="mr-2 h-4 w-4" />
              Network Tree
            </TabsTrigger>
            <TabsTrigger value="referrals" className="flex items-center">
              <GitFork className="mr-2 h-4 w-4" />
              Referral Structure
            </TabsTrigger>
            <TabsTrigger value="add" className="flex items-center">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Affiliates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tree" className="space-y-4">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Affiliate Network Tree</CardTitle>
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
                  
                  <div className="w-full md:w-1/3 flex justify-end">
                    <Button variant="outline">
                      <Filter className="mr-2 h-4 w-4" />
                      More Filters
                    </Button>
                  </div>
                </div>
                
                {/* Placeholder for network tree visualization */}
                <div className="border rounded-md p-4 bg-slate-50 dark:bg-slate-900">
                  <div className="flex items-center justify-center p-8">
                    <p className="text-gray-500">Network Tree Visualization would appear here</p>
                    <p className="text-gray-500">(Hierarchical view of the entire affiliate network)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="referrals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Affiliate Referrals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="w-full md:w-2/3 relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search by affiliate name or ID..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="w-full md:w-1/3 flex justify-end">
                    <Button variant="outline">
                      <Filter className="mr-2 h-4 w-4" />
                      Apply Filters
                    </Button>
                  </div>
                </div>

                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Affiliate Name</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead className="text-right">Team Size</TableHead>
                        <TableHead className="text-right">Direct Referrals</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAffiliates.map((affiliate) => (
                        <TableRow key={affiliate.id}>
                          <TableCell className="font-medium">{affiliate.id}</TableCell>
                          <TableCell>{affiliate.name}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${getLevelColor(affiliate.level)}`}>
                              {affiliate.level}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">{affiliate.team}</TableCell>
                          <TableCell className="text-right">{affiliate.referrals}</TableCell>
                          <TableCell>{affiliate.status}</TableCell>
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
          </TabsContent>

          <TabsContent value="add" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Add New Affiliate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-w-2xl mx-auto">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">First Name</label>
                      <Input placeholder="Enter first name" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Last Name</label>
                      <Input placeholder="Enter last name" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Email Address</label>
                      <Input type="email" placeholder="Enter email address" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Phone Number</label>
                      <Input placeholder="Enter phone number" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Affiliate Level</label>
                      <Select defaultValue="bronze">
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bronze">Bronze</SelectItem>
                          <SelectItem value="silver">Silver</SelectItem>
                          <SelectItem value="gold">Gold</SelectItem>
                          <SelectItem value="platinum">Platinum</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Sponsor ID</label>
                      <Input placeholder="Enter sponsor ID" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Address</label>
                    <Input placeholder="Enter address" />
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">City</label>
                      <Input placeholder="Enter city" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">State/Province</label>
                      <Input placeholder="Enter state" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">ZIP/Postal Code</label>
                      <Input placeholder="Enter ZIP code" />
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <Button variant="outline" className="mr-2">Cancel</Button>
                    <Button>Add Affiliate</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>  );
};

export default NetworkManagement;
