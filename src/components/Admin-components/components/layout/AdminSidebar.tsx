
import React from 'react';
import { Link, useLocation } from 'react-router';
import { useAuth } from '../../../../context/AuthContext';
import { 
  LayoutDashboard, 
  BarChart, 
  Users,
  UsersRound,
  Network,
  Key,
  Settings,
  HelpCircle,
  DollarSign,
  Receipt,
  Wallet,
  FileText,
  Bell,
  Shield,
  LifeBuoy,
  UserCheck,
  UserPlus,
  Percent,
  SendHorizontal,
  MessageSquare,
  GitFork,
  Download,
  UserX,
  Calendar
} from 'lucide-react';

interface AdminSidebarProps {
  collapsed: boolean;
}

const AdminSidebar = ({ collapsed }: AdminSidebarProps) => {
  const location = useLocation();
  const { user } = useAuth();
  const isActive = (path: string) => location.pathname === path;
  
  const isAdmin = user?.role === 'Admin';
  const isSupport = user?.role === 'Support';
  
  // Group sidebar items by category
  const dashboardItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin', roles: ['Admin', 'Support'] },
    { icon: BarChart, label: 'Analytics', path: '/admin/analytics', roles: ['Admin'] },
    { icon: FileText, label: 'Reports', path: '/admin/reports', roles: ['Admin'] },
  ];
  
  const affiliateItems = [
    { icon: Users, label: 'Affiliates', path: '/admin/affiliates', roles: ['Admin'] },
    { icon: UserCheck, label: 'KYC Verification', path: '/admin/kyc', roles: ['Admin'] },
    { icon: UserPlus, label: 'Applications', path: '/admin/applications', roles: ['Admin'] },
    { icon: UserX, label: 'Blocked Affiliates', path: '/admin/blocked', roles: ['Admin'] },
    { icon: Network, label: 'Network', path: '/admin/network', roles: ['Admin'] },
    { icon: GitFork, label: 'Affiliate Tree', path: '/admin/tree', roles: ['Admin'] },
    { icon: Users, label: 'Teams', path: '/admin/teams', roles: ['Admin'] },
  ];

  const userItems = [
    { icon: UsersRound, label: 'All Users', path: '/admin/users', roles: ['Admin', 'Support'] },
  ];

  const financeItems = [
    { icon: DollarSign, label: 'Finance', path: '/admin/finance', roles: ['Admin'] },
    { icon: Percent, label: 'Bonus Structure', path: '/admin/bonus', roles: ['Admin'] },
    { icon: SendHorizontal, label: 'Withdrawals', path: '/admin/withdrawals', roles: ['Admin'] },
    { icon: Key, label: 'EPins', path: '/admin/epins', roles: ['Admin'] },
    { icon: Wallet, label: 'Wallets', path: '/admin/wallets', roles: ['Admin'] },
  ];

  const contentItems = [
    { icon: Bell, label: 'Announcements', path: '/admin/announcements', roles: ['Admin', 'Support'] },
    { icon: Download, label: 'Download Center', path: '/admin/downloads', roles: ['Admin', 'Support'] },
    { icon: MessageSquare, label: 'Support Tickets', path: '/admin/support', roles: ['Admin', 'Support'] },
    { icon: Calendar, label: 'Meetings', path: '/admin/meetings', roles: ['Admin', 'Support'] },
  ];

  const systemItems = [
    { icon: Shield, label: 'Permissions', path: '/admin/permissions', roles: ['Admin'] },
    { icon: Settings, label: 'Settings', path: '/admin/settings', roles: ['Admin'] },
  ];

  // Filter menu items based on user role
  const filterByRole = (items: typeof dashboardItems) => {
    return items.filter(item => item.roles.includes(user?.role || ''));
  };

  // Helper function to render a group of menu items
  const renderMenuGroup = (items: typeof dashboardItems, groupTitle: string) => {
    const filteredItems = filterByRole(items);
    
    if (filteredItems.length === 0) return null;
    
    return (
      <div className="mt-4 first:mt-0">
        {!collapsed && <div className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{groupTitle}</div>}
        {filteredItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-secondary mb-1 ${
              isActive(item.path) 
                ? 'bg-primary text-primary-foreground' 
                : 'text-card-foreground hover:text-card-foreground'
            }`}
          >
            <item.icon className="h-5 w-5" />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className="h-full p-2 overflow-y-auto">
      {renderMenuGroup(dashboardItems, 'Dashboard')}
      {renderMenuGroup(affiliateItems, 'Affiliate Management')}
      {renderMenuGroup(userItems, 'User Management')}
      {renderMenuGroup(financeItems, 'Finance')}
      {renderMenuGroup(contentItems, 'Content')}
      {renderMenuGroup(systemItems, 'System')}
      
      {/* Role Badge */}
      {!collapsed && user && (
        <div className="mt-6 px-3 py-2 rounded-md bg-secondary/50">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Role</div>
          <div className="text-sm font-medium text-primary">{user.role}</div>
        </div>
      )}
    </div>
  );
};

export default AdminSidebar;
