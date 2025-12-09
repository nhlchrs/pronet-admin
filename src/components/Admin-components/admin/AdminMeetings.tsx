
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Plus, Calendar, Edit, Trash2, MoreVertical } from 'lucide-react';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

// Mock meetings data
const initialMeetings = [
  { 
    id: 'M001', 
    title: 'Monthly Team Update', 
    date: '2025-05-15T10:00:00', 
    duration: 60,
    host: 'Admin User',
    participants: ['John Smith', 'Mary Johnson', 'Robert Brown'],
    status: 'scheduled',
    type: 'group',
    link: 'https://meet.google.com/abc-defg-hij'
  },
  { 
    id: 'M002', 
    title: 'Onboarding Call: New Affiliates', 
    date: '2025-05-16T14:30:00', 
    duration: 45,
    host: 'Admin User',
    participants: ['Sarah Williams', 'James Wilson', 'Emma Davis'],
    status: 'scheduled',
    type: 'group',
    link: 'https://meet.google.com/klm-nopq-rst'
  },
  { 
    id: 'M003', 
    title: 'Strategy Discussion with Top Performers', 
    date: '2025-05-10T09:00:00', 
    duration: 90,
    host: 'Admin User',
    participants: ['Michael Johnson', 'Jennifer Smith'],
    status: 'completed',
    type: 'private',
    link: 'https://meet.google.com/uvw-xyz-123'
  },
  { 
    id: 'M004', 
    title: 'Product Update Training', 
    date: '2025-05-20T11:00:00', 
    duration: 60,
    host: 'Admin User',
    participants: ['All Affiliates'],
    status: 'scheduled',
    type: 'webinar',
    link: 'https://meet.google.com/456-789-abc'
  },
  { 
    id: 'M005', 
    title: 'New Bonus Structure Review', 
    date: '2025-05-05T15:00:00', 
    duration: 30,
    host: 'Admin User',
    participants: ['Regional Managers'],
    status: 'cancelled',
    type: 'group',
    link: 'https://meet.google.com/def-ghi-jkl'
  },
];

type Meeting = typeof initialMeetings[0];

const AdminMeetings = () => {
  const [meetings, setMeetings] = useState(initialMeetings);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentMeeting, setCurrentMeeting] = useState<Meeting | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  // Filter meetings based on search term
  const filteredMeetings = meetings.filter(meeting => {
    return meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           meeting.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
           meeting.participants.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const handleAddNewMeeting = () => {
    setCurrentMeeting({
      id: `M${String(meetings.length + 1).padStart(3, '0')}`, 
      title: '', 
      date: new Date().toISOString(), 
      duration: 30,
      host: 'Admin User',
      participants: [],
      status: 'scheduled',
      type: 'group',
      link: ''
    });
    setIsDialogOpen(true);
  };

  const handleEditMeeting = (meeting: Meeting) => {
    setCurrentMeeting(meeting);
    setIsDialogOpen(true);
  };

  const handleDeleteMeeting = (meeting: Meeting) => {
    setCurrentMeeting(meeting);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (currentMeeting) {
      setMeetings(meetings.filter(m => m.id !== currentMeeting.id));
      toast({
        title: "Meeting Deleted",
        description: `Meeting "${currentMeeting.title}" has been deleted.`,
      });
      setIsDeleteDialogOpen(false);
    }
  };

  const saveMeeting = () => {
    if (currentMeeting) {
      const existingIndex = meetings.findIndex(m => m.id === currentMeeting.id);
      
      if (existingIndex >= 0) {
        // Update existing meeting
        const updatedMeetings = [...meetings];
        updatedMeetings[existingIndex] = currentMeeting;
        setMeetings(updatedMeetings);
        toast({
          title: "Meeting Updated",
          description: `Meeting "${currentMeeting.title}" has been updated.`,
        });
      } else {
        // Add new meeting
        setMeetings([...meetings, currentMeeting]);
        toast({
          title: "Meeting Scheduled",
          description: `Meeting "${currentMeeting.title}" has been scheduled.`,
        });
      }
      
      setIsDialogOpen(false);
    }
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-green-700 text-white';
      case 'completed': return 'bg-blue-700 text-white';
      case 'cancelled': return 'bg-red-700 text-white';
      default: return 'bg-gray-700 text-white';
    }
  };

  // Format meeting date and time
  const formatMeetingDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy 'at' h:mm a");
  };

  return (
    <div>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Meeting Management</h1>
          <Button onClick={handleAddNewMeeting}>
            <Plus className="h-4 w-4 mr-2" />
            Schedule Meeting
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-green-900/30 border border-green-800/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Scheduled</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {meetings.filter(m => m.status === 'scheduled').length}
              </p>
              <p className="text-sm text-muted-foreground">Upcoming meetings</p>
            </CardContent>
          </Card>
          
          <Card className="bg-blue-900/30 border border-blue-800/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {meetings.filter(m => m.status === 'completed').length}
              </p>
              <p className="text-sm text-muted-foreground">Past meetings</p>
            </CardContent>
          </Card>
          
          <Card className="bg-red-900/30 border border-red-800/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Cancelled</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {meetings.filter(m => m.status === 'cancelled').length}
              </p>
              <p className="text-sm text-muted-foreground">Cancelled meetings</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Meeting Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="w-full md:w-1/2 relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search meetings..."
                  className="pl-8 bg-secondary text-foreground"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="rounded-md border border-border overflow-hidden">
              <Table>
                <TableHeader className="bg-secondary">
                  <TableRow>
                    <TableHead>Meeting ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Participants</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMeetings.map((meeting) => (
                    <TableRow key={meeting.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{meeting.id}</TableCell>
                      <TableCell>
                        <div className="font-medium">{meeting.title}</div>
                        <div className="text-xs text-muted-foreground">{meeting.type}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          {formatMeetingDateTime(meeting.date)}
                        </div>
                      </TableCell>
                      <TableCell>{meeting.duration} min</TableCell>
                      <TableCell>
                        <div className="max-w-[200px] truncate" title={meeting.participants.join(', ')}>
                          {meeting.participants.length > 3 
                            ? `${meeting.participants.slice(0, 3).join(', ')} +${meeting.participants.length - 3} more` 
                            : meeting.participants.join(', ')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(meeting.status)}>
                          {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditMeeting(meeting)}>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteMeeting(meeting)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Simple meeting form dialog - in a real app, this would be more comprehensive */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-card border-border sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>
              {currentMeeting && currentMeeting.id.includes('M00') ? 'Edit Meeting' : 'Schedule New Meeting'}
            </DialogTitle>
            <DialogDescription>
              Complete the form below to schedule or update a meeting.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">Title</Label>
              <Input
                id="title"
                value={currentMeeting?.title || ''}
                onChange={(e) => currentMeeting && setCurrentMeeting({...currentMeeting, title: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">Date & Time</Label>
              <Input
                id="date"
                type="datetime-local"
                value={currentMeeting?.date ? currentMeeting.date.slice(0, 16) : ''}
                onChange={(e) => currentMeeting && setCurrentMeeting({...currentMeeting, date: new Date(e.target.value).toISOString()})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">Duration (min)</Label>
              <Input
                id="duration"
                type="number"
                min="15"
                step="15"
                value={currentMeeting?.duration || 30}
                onChange={(e) => currentMeeting && setCurrentMeeting({...currentMeeting, duration: parseInt(e.target.value)})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="participants" className="text-right">Participants</Label>
              <Input
                id="participants"
                placeholder="Comma separated names"
                value={currentMeeting?.participants.join(', ') || ''}
                onChange={(e) => currentMeeting && setCurrentMeeting({...currentMeeting, participants: e.target.value.split(',').map(p => p.trim())})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="link" className="text-right">Meeting Link</Label>
              <Input
                id="link"
                placeholder="https://meet.google.com/..."
                value={currentMeeting?.link || ''}
                onChange={(e) => currentMeeting && setCurrentMeeting({...currentMeeting, link: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">Status</Label>
              <select
                id="status"
                value={currentMeeting?.status || 'scheduled'}
                onChange={(e) => currentMeeting && setCurrentMeeting({...currentMeeting, status: e.target.value as any})}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveMeeting}>Save Meeting</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this meeting? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {currentMeeting && (
            <div className="py-4">
              <div className="font-medium">{currentMeeting.title}</div>
              <div className="text-sm text-muted-foreground">
                {formatMeetingDateTime(currentMeeting.date)}
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={confirmDelete}
              variant="destructive"
            >
              Delete Meeting
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>  );
};

export default AdminMeetings;
