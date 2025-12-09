
import React, { useState } from 'react';
import { Bell, Menu, Search, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TopBarProps {
  toggleSidebar: () => void;
}

const TopBar = ({ toggleSidebar }: TopBarProps) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const handleProfileClick = () => {
    navigate('/profile');
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search functionality
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      
      // Navigate to search results page or filter current page
      // This is a placeholder - typically you would:
      // 1. Navigate to a search results page
      // 2. Or trigger a global state update for filtering
      
      // For demo purposes, navigate to a relevant page based on simple keyword matching
      if (searchQuery.toLowerCase().includes('invoice')) {
        navigate('/invoices');
      } else if (searchQuery.toLowerCase().includes('team') || searchQuery.toLowerCase().includes('affiliate')) {
        navigate('/team');
      } else if (searchQuery.toLowerCase().includes('referral')) {
        navigate('/referral');
      } else if (searchQuery.toLowerCase().includes('download')) {
        navigate('/downloads');
      } else if (searchQuery.toLowerCase().includes('epin')) {
        navigate('/epin');
      } else {
        // You could add a dedicated search results page here
        navigate('/');
      }
    }
  };
  
  return (
    <div className="bg-card border-b border-border py-2 px-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="mr-2"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/1dc005c5-1f18-4598-92dc-030b0afec31f.png" 
              alt="Pro Net Solutions Logo" 
              className="h-8 mr-2" 
            />
            <span className="text-xl font-bold text-card-foreground">Pro Net Solutions</span>
          </div>
        </div>
        
        <div className="hidden md:block mx-auto max-w-md w-full">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search..."
              className="w-full rounded-full bg-muted border-0 pl-10 py-2 focus:ring-2 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  <User className="h-5 w-5" />
                </div>
                <span className="hidden md:inline-block font-medium text-card-foreground">
                  {user?.name}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfileClick}>Profile</DropdownMenuItem>
              {isAdmin && (
                <DropdownMenuItem onClick={() => navigate('/admin')}>Admin Dashboard</DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => navigate('/settings')}>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
