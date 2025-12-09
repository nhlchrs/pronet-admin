
import React from 'react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

// Mock data for direct affiliates
const directAffiliates = [
  { 
    id: '1', 
    name: 'John Doe', 
    email: 'john@example.com', 
    joinedDate: '2023-01-15', 
    status: 'active',
    teamSize: 12,
    earnings: '$450.00' 
  },
  { 
    id: '2', 
    name: 'Alice Smith', 
    email: 'alice@example.com', 
    joinedDate: '2023-02-10', 
    status: 'active',
    teamSize: 5,
    earnings: '$320.50' 
  },
  { 
    id: '3', 
    name: 'Robert Johnson', 
    email: 'robert@example.com', 
    joinedDate: '2023-02-22', 
    status: 'inactive',
    teamSize: 0,
    earnings: '$0.00' 
  },
  { 
    id: '4', 
    name: 'Emily Davis', 
    email: 'emily@example.com', 
    joinedDate: '2023-03-05', 
    status: 'active',
    teamSize: 23,
    earnings: '$780.75' 
  },
  { 
    id: '5', 
    name: 'Michael Wilson', 
    email: 'michael@example.com', 
    joinedDate: '2023-03-18', 
    status: 'active',
    teamSize: 3,
    earnings: '$120.25' 
  },
];

const DirectAffiliates = () => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Affiliate</TableHead>
            <TableHead>Joined Date</TableHead>
            <TableHead>Team Size</TableHead>
            <TableHead>Earnings</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {directAffiliates.map((affiliate) => (
            <TableRow key={affiliate.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${affiliate.name}`} />
                    <AvatarFallback>{affiliate.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{affiliate.name}</div>
                    <div className="text-sm text-muted-foreground">{affiliate.email}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{affiliate.joinedDate}</TableCell>
              <TableCell>{affiliate.teamSize}</TableCell>
              <TableCell>{affiliate.earnings}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  affiliate.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }`}>
                  {affiliate.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">View Team</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DirectAffiliates;
