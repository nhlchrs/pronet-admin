
import React from 'react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Mock data for team members
const teamMembers = [
  { 
    id: '1', 
    name: 'John Doe', 
    email: 'john@example.com', 
    level: 1, 
    joinedDate: '2023-01-15', 
    status: 'active',
    referrals: 5,
    earnings: '$1,245.00' 
  },
  { 
    id: '2', 
    name: 'Alice Smith', 
    email: 'alice@example.com', 
    level: 2, 
    joinedDate: '2023-02-10', 
    status: 'active',
    referrals: 3,
    earnings: '$870.50' 
  },
  { 
    id: '3', 
    name: 'Robert Johnson', 
    email: 'robert@example.com', 
    level: 1, 
    joinedDate: '2023-02-22', 
    status: 'inactive',
    referrals: 0,
    earnings: '$450.00' 
  },
  { 
    id: '4', 
    name: 'Emily Davis', 
    email: 'emily@example.com', 
    level: 3, 
    joinedDate: '2023-03-05', 
    status: 'active',
    referrals: 8,
    earnings: '$2,340.75' 
  },
  { 
    id: '5', 
    name: 'Michael Wilson', 
    email: 'michael@example.com', 
    level: 2, 
    joinedDate: '2023-03-18', 
    status: 'active',
    referrals: 2,
    earnings: '$780.25' 
  },
];

const TeamMembersList = () => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Affiliate</TableHead>
            <TableHead>Level</TableHead>
            <TableHead>Joined Date</TableHead>
            <TableHead>Referrals</TableHead>
            <TableHead>Earnings</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teamMembers.map((member) => (
            <TableRow key={member.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${member.name}`} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-muted-foreground">{member.email}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>Level {member.level}</TableCell>
              <TableCell>{member.joinedDate}</TableCell>
              <TableCell>{member.referrals}</TableCell>
              <TableCell>{member.earnings}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  member.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }`}>
                  {member.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">View</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TeamMembersList;
