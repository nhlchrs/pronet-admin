
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PartyPopper, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Plan {
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
}

interface Addon {
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
}

interface SubscriptionConfirmationProps {
  open: boolean;
  onClose: () => void;
  plan: Plan | undefined;
  addons: Addon[];
  period: 'monthly' | 'yearly';
}

const SubscriptionConfirmation: React.FC<SubscriptionConfirmationProps> = ({
  open,
  onClose,
  plan,
  addons,
  period
}) => {
  const { user } = useAuth();
  
  if (!plan) return null;
  
  const planPrice = period === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
  const addonsTotal = addons.reduce((total, addon) => 
    total + (period === 'monthly' ? addon.monthlyPrice : addon.yearlyPrice), 0);
  const totalPrice = planPrice + addonsTotal;

  const handleTelegramAccess = () => {
    window.open('https://t.me/ProNetSolutions', '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="bg-[#1A2A38] text-white border-none sm:max-w-[500px] p-8">
        <div className="text-center">
          <DialogHeader className="space-y-2">
            <div className="flex items-center justify-center mb-4">
              <PartyPopper className="h-6 w-6 text-[#4CD3C8] mr-2" />
              <DialogTitle className="text-2xl font-bold text-[#4CD3C8]">Congratulations, {user?.name?.split(' ')[0] || 'Affiliate'}!</DialogTitle>
            </div>
            <DialogDescription className="text-white text-lg">
              You have successfully subscribed to {plan.name}.
              <p className="mt-2">Your subscription is now active.</p>
            </DialogDescription>
          </DialogHeader>
          
          <div className="my-6 pt-4 border-t border-gray-600">
            <div className="space-y-3">
              <p className="flex justify-between">
                <span className="text-gray-300">Plan:</span>
                <span className="font-semibold">{plan.name} (${planPrice}/{period === 'monthly' ? 'month' : 'year'})</span>
              </p>
              
              {addons.length > 0 && (
                <>
                  <p className="flex justify-between">
                    <span className="text-gray-300">Add-ons:</span>
                    <span className="font-semibold">${addonsTotal}/{period === 'monthly' ? 'month' : 'year'}</span>
                  </p>
                  
                  <p className="flex justify-between font-bold border-t border-gray-600 pt-2">
                    <span className="text-gray-300">Total:</span>
                    <span>${totalPrice}/{period === 'monthly' ? 'month' : 'year'}</span>
                  </p>
                </>
              )}
              
              <p className="flex justify-between">
                <span className="text-gray-300">Email:</span>
                <span className="font-semibold">{user?.email || 'user@example.com'}</span>
              </p>
            </div>
          </div>
          
          <Button 
            onClick={handleTelegramAccess}
            className="w-full bg-[#229ED9] hover:bg-[#1A7AB0] text-white font-medium py-2 px-4 rounded mb-4 flex items-center justify-center"
          >
            <MessageSquare className="mr-2 h-5 w-5" />
            Access Telegram Channels
          </Button>
          
          <Button 
            onClick={onClose}
            className="w-full bg-[#2CBFB1] hover:bg-[#25A69A] text-white font-medium py-2 px-4 rounded"
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionConfirmation;
