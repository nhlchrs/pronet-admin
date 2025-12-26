
import React from 'react';
import { Link, useLocation } from 'react-router';
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
  const isActive = (path: string) => location.pathname === path;
  
  // Group sidebar items by category
  const dashboardItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: BarChart, label: 'Analytics', path: '/admin/analytics' },
    { icon: FileText, label: 'Reports', path: '/admin/reports' },
  ];
  
  const affiliateItems = [
    { icon: Users, label: 'Affiliates', path: '/admin/affiliates' },
    { icon: UserCheck, label: 'KYC Verification', path: '/admin/kyc' },
    { icon: UserPlus, label: 'Applications', path: '/admin/applications' },
    { icon: UserX, label: 'Blocked Affiliates', path: '/admin/blocked' },
    { icon: Network, label: 'Network', path: '/admin/network' },
    { icon: GitFork, label: 'Affiliate Tree', path: '/admin/tree' },
  ];

  const userItems = [
    { icon: UsersRound, label: 'All Users', path: '/admin/users' },
  ];

  const financeItems = [
    { icon: DollarSign, label: 'Finance', path: '/admin/finance' },
    { icon: Percent, label: 'Bonus Structure', path: '/admin/bonus' },
    { icon: SendHorizontal, label: 'Withdrawals', path: '/admin/withdrawals' },
    { icon: Key, label: 'EPins', path: '/admin/epins' },
    { icon: Wallet, label: 'Wallets', path: '/admin/wallets' },
  ];

  const contentItems = [
    { icon: Bell, label: 'Announcements', path: '/admin/announcements' },
    { icon: Download, label: 'Download Center', path: '/admin/downloads' },
    { icon: MessageSquare, label: 'Support Tickets', path: '/admin/support' }, // Updated to correct path
    { icon: Calendar, label: 'Meetings', path: '/admin/meetings' },
  ];

  const systemItems = [
    { icon: Shield, label: 'Permissions', path: '/admin/permissions' }, // Now linked to working page
    { icon: Settings, label: 'Settings', path: '/admin/settings' }, // Now linked to working page
  ];

  // Helper function to render a group of menu items
  const renderMenuGroup = (items: typeof dashboardItems, groupTitle: string) => (
    <div className="mt-4 first:mt-0">
      {!collapsed && <div className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{groupTitle}</div>}
      {items.map((item) => (
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

  return (
    <div className="h-full p-2 overflow-y-auto">
      {renderMenuGroup(dashboardItems, 'Dashboard')}
      {renderMenuGroup(affiliateItems, 'Affiliate Management')}
      {renderMenuGroup(userItems, 'User Management')}
      {renderMenuGroup(financeItems, 'Finance')}
      {renderMenuGroup(contentItems, 'Content')}
      {renderMenuGroup(systemItems, 'System')}
    </div>
  );
};

export default AdminSidebar;
