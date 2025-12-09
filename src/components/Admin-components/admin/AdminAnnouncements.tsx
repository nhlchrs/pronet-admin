
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Bell, Search, Pencil, Trash, Plus, Filter
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock announcements data
const mockAnnouncements = [
  {
    id: "AN001",
    title: "New Commission Structure",
    category: "Finance",
    date: "2023-07-15",
    status: "Active",
    content: "We are pleased to announce our new commission structure that will increase payouts for all affiliates...",
    visibility: "All Affiliates"
  },
  {
    id: "AN002",
    title: "System Maintenance Notice",
    category: "System",
    date: "2023-07-20",
    status: "Active",
    content: "The system will be under maintenance on July 25th from 2:00 AM to 4:00 AM UTC. During this time, access to the dashboard will be limited...",
    visibility: "All Users"
  },
  {
    id: "AN003",
    title: "New Marketing Materials Available",
    category: "Marketing",
    date: "2023-07-22",
    status: "Active",
    content: "We have added new marketing materials in the download center. These include social media templates, email templates, and presentation slides...",
    visibility: "Gold & Above"
  },
  {
    id: "AN004",
    title: "Special Promotion",
    category: "Promotion",
    date: "2023-07-10",
    status: "Inactive",
    content: "Get 10% extra commission on all referrals during August. This is a limited-time offer to boost your earnings...",
    visibility: "All Affiliates"
  },
  {
    id: "AN005",
    title: "New Product Launch",
    category: "Product",
    date: "2023-08-01",
    status: "Scheduled",
    content: "We are excited to announce that we will be launching a new AI trading bot on August 15th...",
    visibility: "All Users"
  }
];

const AdminAnnouncements = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState<any>(null);
  const [isNewAnnouncement, setIsNewAnnouncement] = useState(false);
  const { toast } = useToast();

  // Filter announcements based on search and filters
  const filteredAnnouncements = mockAnnouncements.filter((announcement) => {
    const matchesSearch = 
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || announcement.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesStatus = statusFilter === 'all' || announcement.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleEdit = (announcement: any) => {
    setCurrentAnnouncement(announcement);
    setIsNewAnnouncement(false);
    setIsDialogOpen(true);
  };

  const handleNewAnnouncement = () => {
    setCurrentAnnouncement({
      id: `AN${String(mockAnnouncements.length + 1).padStart(3, '0')}`,
      title: "",
      category: "General",
      date: new Date().toISOString().split('T')[0],
      status: "Draft",
      content: "",
      visibility: "All Affiliates"
    });
    setIsNewAnnouncement(true);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    toast({
      title: isNewAnnouncement ? "Announcement Created" : "Announcement Updated",
      description: `The announcement has been ${isNewAnnouncement ? 'created' : 'updated'} successfully.`,
    });
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    toast({
      title: "Announcement Deleted",
      description: `Announcement ${id} has been deleted.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'scheduled': return 'bg-amber-100 text-amber-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Announcement Management</h1>
          <Button onClick={handleNewAnnouncement}>
            <Plus className="mr-2 h-4 w-4" />
            New Announcement
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Announcements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="w-full md:w-1/3 relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search announcements..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="w-full md:w-1/3">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="promotion">Promotion</SelectItem>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full md:w-1/3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Visibility</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAnnouncements.map((announcement) => (
                    <TableRow key={announcement.id}>
                      <TableCell className="font-medium">{announcement.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Bell className="mr-2 h-4 w-4 text-primary" />
                          {announcement.title}
                        </div>
                      </TableCell>
                      <TableCell>{announcement.category}</TableCell>
                      <TableCell>{announcement.date}</TableCell>
                      <TableCell>{announcement.visibility}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(announcement.status)}`}>
                          {announcement.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleEdit(announcement)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-500"
                            onClick={() => handleDelete(announcement.id)}
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
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isNewAnnouncement ? "Create New Announcement" : "Edit Announcement"}</DialogTitle>
            <DialogDescription>
              {isNewAnnouncement ? "Create a new announcement to share with users." : "Make changes to the announcement here."}
            </DialogDescription>
          </DialogHeader>
          {currentAnnouncement && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="id" className="text-sm font-medium">ID</label>
                    <Input 
                      id="id" 
                      value={currentAnnouncement.id} 
                      disabled 
                    />
                  </div>
                  <div>
                    <label htmlFor="date" className="text-sm font-medium">Date</label>
                    <Input 
                      id="date" 
                      type="date" 
                      defaultValue={currentAnnouncement.date}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="title" className="text-sm font-medium">Title</label>
                  <Input 
                    id="title" 
                    defaultValue={currentAnnouncement.title} 
                    placeholder="Enter announcement title" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="category" className="text-sm font-medium">Category</label>
                    <Select defaultValue={currentAnnouncement.category}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="General">General</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="System">System</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Promotion">Promotion</SelectItem>
                        <SelectItem value="Product">Product</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label htmlFor="status" className="text-sm font-medium">Status</label>
                    <Select defaultValue={currentAnnouncement.status}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="Scheduled">Scheduled</SelectItem>
                        <SelectItem value="Draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label htmlFor="visibility" className="text-sm font-medium">Visibility</label>
                  <Select defaultValue={currentAnnouncement.visibility}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Users">All Users</SelectItem>
                      <SelectItem value="All Affiliates">All Affiliates</SelectItem>
                      <SelectItem value="Gold & Above">Gold & Above</SelectItem>
                      <SelectItem value="Platinum Only">Platinum Only</SelectItem>
                      <SelectItem value="Admins Only">Admins Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="content" className="text-sm font-medium">Content</label>
                  <Textarea 
                    id="content" 
                    rows={6}
                    defaultValue={currentAnnouncement.content} 
                    placeholder="Enter announcement content..." 
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{isNewAnnouncement ? "Create" : "Save Changes"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>  );
};

export default AdminAnnouncements;
