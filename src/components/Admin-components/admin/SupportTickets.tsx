
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, Download, Eye, MessageSquare, 
  Filter, Clock, CheckCircle, AlertCircle
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

const mockTickets = [
  {
    id: "TKT001",
    affiliateId: "AF001",
    name: "John Doe",
    subject: "Payment not received",
    category: "Payment",
    priority: "High",
    status: "Open",
    createdOn: "2023-06-15 14:32",
    lastUpdated: "2023-06-15 14:32",
    messages: [
      {
        from: "AF001",
        sender: "John Doe",
        message: "I haven't received my commission payment that was due last week. Can you please check?",
        time: "2023-06-15 14:32",
      }
    ]
  },
  {
    id: "TKT002",
    affiliateId: "AF002",
    name: "Alice Smith",
    subject: "How to upgrade my package?",
    category: "Account",
    priority: "Medium",
    status: "Open",
    createdOn: "2023-06-16 09:15",
    lastUpdated: "2023-06-16 09:15",
    messages: [
      {
        from: "AF002",
        sender: "Alice Smith",
        message: "I want to upgrade my account package. What are the steps I need to follow?",
        time: "2023-06-16 09:15",
      }
    ]
  },
  {
    id: "TKT003",
    affiliateId: "AF003",
    name: "Robert Johnson",
    subject: "Unable to login",
    category: "Technical",
    priority: "High",
    status: "In Progress",
    createdOn: "2023-06-14 11:20",
    lastUpdated: "2023-06-14 16:45",
    messages: [
      {
        from: "AF003",
        sender: "Robert Johnson",
        message: "I'm unable to login to my account. It says invalid credentials but I'm sure I'm using the correct password.",
        time: "2023-06-14 11:20",
      },
      {
        from: "Admin",
        sender: "Support Team",
        message: "We've reset your password. Please check your email for instructions to set a new password.",
        time: "2023-06-14 16:45",
      }
    ]
  },
  {
    id: "TKT004",
    affiliateId: "AF004",
    name: "Mary Williams",
    subject: "Commission rate query",
    category: "Commission",
    priority: "Low",
    status: "Closed",
    createdOn: "2023-06-10 13:40",
    lastUpdated: "2023-06-12 10:22",
    messages: [
      {
        from: "AF004",
        sender: "Mary Williams",
        message: "Can you explain how the tiered commission rates work for Gold level affiliates?",
        time: "2023-06-10 13:40",
      },
      {
        from: "Admin",
        sender: "Support Team",
        message: "Gold level affiliates earn 15% on direct sales, 7% on team sales, and qualify for the 10% monthly bonus when you meet the $5,000 target. Let me know if you need more details.",
        time: "2023-06-11 09:30",
      },
      {
        from: "AF004",
        sender: "Mary Williams",
        message: "Thank you! That's clear now.",
        time: "2023-06-11 14:15",
      },
      {
        from: "Admin",
        sender: "Support Team",
        message: "You're welcome! Don't hesitate to reach out if you have more questions.",
        time: "2023-06-12 10:22",
      }
    ]
  },
  {
    id: "TKT005",
    affiliateId: "AF006",
    name: "Patricia Davis",
    subject: "E-Pin transfer issue",
    category: "E-Pin",
    priority: "Medium",
    status: "Open",
    createdOn: "2023-06-17 08:55",
    lastUpdated: "2023-06-17 08:55",
    messages: [
      {
        from: "AF006",
        sender: "Patricia Davis",
        message: "I tried to transfer an E-Pin to one of my team members but got an error. The E-Pin is EP12349.",
        time: "2023-06-17 08:55",
      }
    ]
  },
];

const SupportTickets = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [viewingTicket, setViewingTicket] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const { toast } = useToast();
  
  const filteredTickets = mockTickets.filter((ticket) => {
    const matchesSearch = 
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || ticket.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesCategory = categoryFilter === 'all' || ticket.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesPriority = priorityFilter === 'all' || ticket.priority.toLowerCase() === priorityFilter.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open': return 'bg-amber-100 text-amber-800';
      case 'in progress': return 'bg-blue-100 text-blue-800';
      case 'closed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-amber-100 text-amber-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const handleViewTicket = (ticket: any) => {
    setViewingTicket(ticket);
    setIsDialogOpen(true);
    setReplyMessage('');
  };
  
  const handleReply = () => {
    if (!replyMessage.trim()) {
      toast({
        title: "Empty message",
        description: "Please enter a reply message.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Reply Sent",
      description: `Your reply to ticket ${viewingTicket.id} has been sent.`,
    });
    setIsDialogOpen(false);
  };
  
  const handleCloseTicket = () => {
    toast({
      title: "Ticket Closed",
      description: `Ticket ${viewingTicket.id} has been closed.`,
    });
    setIsDialogOpen(false);
  };

  return (
    <>
      <PageMeta 
        title="Support Tickets - ProNext Admin Panel" 
        description="Manage and respond to support tickets" 
      />
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Support Tickets</h1>
          <Button>
            <MessageSquare className="mr-2 h-4 w-4" />
            Create New Ticket
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-amber-50 dark:bg-amber-900/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Open Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">3</p>
              <p className="text-sm text-gray-500">Waiting for response</p>
            </CardContent>
          </Card>
          
          <Card className="bg-blue-50 dark:bg-blue-900/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">1</p>
              <p className="text-sm text-gray-500">Being worked on</p>
            </CardContent>
          </Card>
          
          <Card className="bg-green-50 dark:bg-green-900/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Closed This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">4</p>
              <p className="text-sm text-gray-500">Successfully resolved</p>
            </CardContent>
          </Card>
          
          <Card className="bg-purple-50 dark:bg-purple-900/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Average Response Time</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">4.2 hours</p>
              <p className="text-sm text-gray-500">In the last 7 days</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="w-full md:w-1/3 relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search tickets..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="w-full md:w-2/3 flex flex-wrap justify-end gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in progress">In Progress</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="payment">Payment</SelectItem>
                    <SelectItem value="account">Account</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="commission">Commission</SelectItem>
                    <SelectItem value="e-pin">E-Pin</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                
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
                    <TableHead>Subject</TableHead>
                    <TableHead>Affiliate</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium">{ticket.id}</TableCell>
                      <TableCell className="max-w-xs truncate">{ticket.subject}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{ticket.name}</span>
                          <span className="text-xs text-gray-500">{ticket.affiliateId}</span>
                        </div>
                      </TableCell>
                      <TableCell>{ticket.category}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(ticket.status)}`}>
                          {ticket.status}
                        </span>
                      </TableCell>
                      <TableCell>{ticket.lastUpdated}</TableCell>
                      <TableCell className="text-center">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleViewTicket(ticket)}
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
                Showing {filteredTickets.length} of {mockTickets.length} tickets
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
        {viewingTicket && (
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Ticket #{viewingTicket.id} - {viewingTicket.subject}</DialogTitle>
              <DialogDescription className="flex flex-wrap items-center gap-2">
                <span>From: {viewingTicket.name} ({viewingTicket.affiliateId})</span>
                <span>•</span>
                <span>Category: {viewingTicket.category}</span>
                <span>•</span>
                <span>Priority: 
                  <span className={`ml-1 px-2 py-1 rounded-full text-xs ${getPriorityColor(viewingTicket.priority)}`}>
                    {viewingTicket.priority}
                  </span>
                </span>
                <span>•</span>
                <span>Status: 
                  <span className={`ml-1 px-2 py-1 rounded-full text-xs ${getStatusColor(viewingTicket.status)}`}>
                    {viewingTicket.status}
                  </span>
                </span>
              </DialogDescription>
            </DialogHeader>
            
            <div className="max-h-96 overflow-y-auto space-y-4 border-y py-4">
              {viewingTicket.messages.map((message: any, index: number) => (
                <div 
                  key={index} 
                  className={`flex ${
                    message.from === 'Admin' 
                      ? 'justify-end' 
                      : 'justify-start'
                  }`}
                >
                  <div className={`rounded-lg p-3 max-w-[80%] ${
                    message.from === 'Admin' 
                      ? 'bg-primary-50 dark:bg-primary-900/20' 
                      : 'bg-gray-100 dark:bg-gray-800'
                  }`}>
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-semibold">{message.sender}</p>
                      <p className="text-xs text-gray-500">{message.time}</p>
                    </div>
                    <p>{message.message}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {viewingTicket.status !== 'Closed' && (
              <div className="space-y-4 pt-2">
                <Textarea
                  placeholder="Type your reply here..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <Select defaultValue={viewingTicket.status}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Set status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Open">Open</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleCloseTicket}>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Close Ticket
                    </Button>
                    <Button onClick={handleReply}>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Send Reply
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {viewingTicket.status === 'Closed' && (
              <div className="flex justify-center items-center py-2">
                <span className="text-gray-500 flex items-center">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  This ticket is closed
                </span>
              </div>
            )}
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};

export default SupportTickets;
