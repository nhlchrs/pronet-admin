
import React from 'react';
import { Link, useLocation } from 'react-router';
import { 
  Home, 
  User, 
  Inbox,
  Download,
  Users,
  Wallet,
  Key,
  DollarSign,
  LifeBuoy,
  Settings,
  Bell,
  CreditCard,
  Video,
  FileText,
  Share2,
  ShieldCheck
} from 'lucide-react';

interface AffiliateSidebarProps {
  collapsed: boolean;
}

const AffiliateSidebar = ({ collapsed }: AffiliateSidebarProps) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  
  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Bell, label: 'Announcements', path: '/announcements' },
    { icon: Download, label: 'Download Center', path: '/downloads' },
    { icon: FileText, label: 'My Invoices', path: '/invoices' },
    { icon: Users, label: 'My Team', path: '/team' },
    { icon: Wallet, label: 'Earning Wallet', path: '/earnings' },
    { icon: Key, label: 'Epin Center', path: '/epin' },
    { icon: DollarSign, label: 'My Payouts', path: '/payouts' },
    { icon: Share2, label: 'My Referrals', path: '/referral' },
    { icon: Video, label: 'Meetings', path: '/meetings' },
    { icon: ShieldCheck, label: 'KYC Verification', path: '/kyc-verification' },
    { icon: LifeBuoy, label: 'Support', path: '/support' },
    { icon: CreditCard, label: 'Subscriptions', path: '/subscriptions' },
    { icon: Settings, label: 'Profile Settings', path: '/profile/settings' },
  ];

  return (
    <div className="h-full p-2 overflow-y-auto">
      {menuItems.map((item) => (
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

export default AffiliateSidebar;
