
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { 
  Search, ArrowDown, ArrowUp, Download, Wallet, Lock, 
  DollarSign, Plus, Minus, Eye
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import PageMeta from '../../../components/common/PageMeta';
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

// Mock wallet data
const mockWalletData = [
  {
    id: "AF001",
    name: "John Doe",
    email: "john@example.com",
    level: "Gold",
    balance: 3450.75,
    pendingBalance: 240.50,
    lockedBalance: 85.25,
    totalEarnings: 3776.50,
    lastTransaction: "2023-07-15",
    status: "Active"
  },
  {
    id: "AF002",
    name: "Alice Smith",
    email: "alice@example.com",
    level: "Silver",
    balance: 2120.30,
    pendingBalance: 180.20,
    lockedBalance: 62.80,
    totalEarnings: 2363.30,
    lastTransaction: "2023-07-18",
    status: "Active"
  },
  {
    id: "AF003",
    name: "Robert Johnson",
    email: "robert@example.com",
    level: "Bronze",
    balance: 820.15,
    pendingBalance: 120.60,
    lockedBalance: 25.40,
    totalEarnings: 966.15,
    lastTransaction: "2023-07-10",
    status: "Pending"
  },
  {
    id: "AF004",
    name: "Mary Williams",
    email: "mary@example.com",
    level: "Gold",
    balance: 4280.90,
    pendingBalance: 310.75,
    lockedBalance: 102.50,
    totalEarnings: 4694.15,
    lastTransaction: "2023-07-20",
    status: "Active"
  },
  {
    id: "AF006",
    name: "Patricia Davis",
    email: "patricia@example.com",
    level: "Platinum",
    balance: 8750.60,
    pendingBalance: 520.30,
    lockedBalance: 185.70,
    totalEarnings: 9456.60,
    lastTransaction: "2023-07-22",
    status: "Active"
  }
];

const AdminWallets = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedWallet, setSelectedWallet] = useState<any>(null);
  const [transactionType, setTransactionType] = useState<'credit' | 'debit'>('credit');
  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false);
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const { toast } = useToast();

  // Filter wallets based on search and filters
  const filteredWallets = mockWalletData.filter((wallet) => {
    const matchesSearch = 
      wallet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wallet.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wallet.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || wallet.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  // Calculate wallet totals
  const walletTotals = {
    totalBalance: mockWalletData.reduce((sum, wallet) => sum + wallet.balance, 0),
    totalPending: mockWalletData.reduce((sum, wallet) => sum + wallet.pendingBalance, 0),
    totalLocked: mockWalletData.reduce((sum, wallet) => sum + wallet.lockedBalance, 0),
    totalEarnings: mockWalletData.reduce((sum, wallet) => sum + wallet.totalEarnings, 0),
  };

  const handleViewWallet = (wallet: any) => {
    setSelectedWallet(wallet);
    setIsWalletDialogOpen(true);
  };

  const handleAddTransaction = (wallet: any, type: 'credit' | 'debit') => {
    setSelectedWallet(wallet);
    setTransactionType(type);
    setIsTransactionDialogOpen(true);
  };

  const handleTransaction = () => {
    const action = transactionType === 'credit' ? 'credited to' : 'debited from';
    toast({
      title: "Transaction Processed",
      description: `Amount has been ${action} ${selectedWallet.name}'s wallet.`,
    });
    setIsTransactionDialogOpen(false);
  };

  // Get level badge color
  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'platinum': return 'bg-violet-100 text-violet-800';
      case 'gold': return 'bg-yellow-100 text-yellow-800';
      case 'silver': return 'bg-blue-100 text-blue-800';
      case 'bronze': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'frozen': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <PageMeta 
        title="Wallets - ProNext Admin Panel" 
        description="Manage user wallets and balances" 
      />
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Affiliate Wallets</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-green-50 dark:bg-green-900/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Total Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${walletTotals.totalBalance.toFixed(2)}</p>
              <p className="text-sm text-gray-500">Available in wallets</p>
            </CardContent>
          </Card>
          
          <Card className="bg-amber-50 dark:bg-amber-900/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Pending Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${walletTotals.totalPending.toFixed(2)}</p>
              <p className="text-sm text-gray-500">Awaiting clearance</p>
            </CardContent>
          </Card>
          
          <Card className="bg-red-50 dark:bg-red-900/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Locked Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${walletTotals.totalLocked.toFixed(2)}</p>
              <p className="text-sm text-gray-500">Locked due to policies</p>
            </CardContent>
          </Card>
          
          <Card className="bg-blue-50 dark:bg-blue-900/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Total Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${walletTotals.totalEarnings.toFixed(2)}</p>
              <p className="text-sm text-gray-500">All-time earnings</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Affiliate Wallets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="w-full md:w-1/3 relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search wallets..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="w-full md:w-1/3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="frozen">Frozen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full md:w-1/3 flex justify-end gap-2">
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
                    <TableHead>Affiliate</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                    <TableHead className="text-right">Pending</TableHead>
                    <TableHead className="text-right">Locked</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWallets.map((wallet) => (
                    <TableRow key={wallet.id}>
                      <TableCell className="font-medium">{wallet.id}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{wallet.name}</span>
                          <span className="text-xs text-gray-500">{wallet.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${getLevelColor(wallet.level)}`}>
                          {wallet.level}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(wallet.status)}`}>
                          {wallet.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">${wallet.balance.toFixed(2)}</TableCell>
                      <TableCell className="text-right">${wallet.pendingBalance.toFixed(2)}</TableCell>
                      <TableCell className="text-right">${wallet.lockedBalance.toFixed(2)}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleViewWallet(wallet)}
                            title="View Wallet"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleAddTransaction(wallet, 'credit')}
                            title="Add Funds"
                            className="text-green-600"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleAddTransaction(wallet, 'debit')}
                            title="Deduct Funds"
                            className="text-red-600"
                          >
                            <Minus className="h-4 w-4" />
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

      {/* Wallet Details Dialog */}
      <Dialog open={isWalletDialogOpen} onOpenChange={setIsWalletDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Wallet Details</DialogTitle>
            <DialogDescription>
              Detailed information about this affiliate's wallet.
            </DialogDescription>
          </DialogHeader>
          {selectedWallet && (
            <div className="space-y-4 py-2">
              <div className="flex justify-between items-center pb-4 border-b">
                <div>
                  <h3 className="font-medium">{selectedWallet.name}</h3>
                  <p className="text-sm text-gray-500">{selectedWallet.email}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${getLevelColor(selectedWallet.level)}`}>
                  {selectedWallet.level}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center mb-2">
                    <Wallet className="h-4 w-4 text-green-600 mr-2" />
                    <p className="text-sm font-medium">Available Balance</p>
                  </div>
                  <p className="text-2xl font-bold">${selectedWallet.balance.toFixed(2)}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center mb-2">
                    <DollarSign className="h-4 w-4 text-blue-600 mr-2" />
                    <p className="text-sm font-medium">Total Earnings</p>
                  </div>
                  <p className="text-2xl font-bold">${selectedWallet.totalEarnings.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center mb-2">
                    <ArrowDown className="h-4 w-4 text-amber-600 mr-2" />
                    <p className="text-sm font-medium">Pending Balance</p>
                  </div>
                  <p className="text-xl font-bold">${selectedWallet.pendingBalance.toFixed(2)}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center mb-2">
                    <Lock className="h-4 w-4 text-red-600 mr-2" />
                    <p className="text-sm font-medium">Locked Balance</p>
                  </div>
                  <p className="text-xl font-bold">${selectedWallet.lockedBalance.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Recent Transactions</h4>
                <div className="space-y-2">
                  {[
                    { type: 'credit', description: 'Direct Bonus', amount: 120.50, date: '2023-07-22' },
                    { type: 'credit', description: 'Team Bonus', amount: 75.25, date: '2023-07-18' },
                    { type: 'debit', description: 'Withdrawal', amount: 200.00, date: '2023-07-15' },
                    { type: 'credit', description: 'Monthly Bonus', amount: 180.75, date: '2023-07-10' },
                  ].map((tx, index) => (
                    <div key={index} className="flex justify-between items-center p-2 border-b last:border-b-0">
                      <div className="flex items-center">
                        {tx.type === 'credit' ? (
                          <ArrowDown className="h-4 w-4 text-green-600 mr-2" />
                        ) : (
                          <ArrowUp className="h-4 w-4 text-red-600 mr-2" />
                        )}
                        <div>
                          <p className="text-sm font-medium">{tx.description}</p>
                          <p className="text-xs text-gray-500">{tx.date}</p>
                        </div>
                      </div>
                      <p className={`font-medium ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                        {tx.type === 'credit' ? '+' : '-'}${tx.amount.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsWalletDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Deduct Transaction Dialog */}
      <Dialog open={isTransactionDialogOpen} onOpenChange={setIsTransactionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {transactionType === 'credit' ? 'Add Funds to Wallet' : 'Deduct Funds from Wallet'}
            </DialogTitle>
            <DialogDescription>
              {transactionType === 'credit' 
                ? 'Add funds to this affiliate\'s wallet balance.' 
                : 'Deduct funds from this affiliate\'s wallet balance.'
              }
            </DialogDescription>
          </DialogHeader>
          {selectedWallet && (
            <div className="space-y-4 py-2">
              <div>
                <p className="text-sm font-medium">Affiliate</p>
                <p>{selectedWallet.name} ({selectedWallet.id})</p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Current Balance</p>
                <p className="font-bold">${selectedWallet.balance.toFixed(2)}</p>
              </div>
              
              <div>
                <label htmlFor="amount" className="text-sm font-medium">Amount</label>
                <div className="flex items-center mt-1">
                  <span className="bg-gray-100 border border-r-0 border-gray-300 rounded-l-md px-3 py-2">$</span>
                  <Input 
                    id="amount" 
                    type="number" 
                    min="0.01" 
                    step="0.01" 
                    placeholder="0.00" 
                    className="rounded-l-none"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="reason" className="text-sm font-medium">Transaction Type</label>
                <Select defaultValue="bonus">
                  <SelectTrigger>
                    <SelectValue placeholder="Select transaction type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bonus">Bonus Payment</SelectItem>
                    <SelectItem value="commission">Commission</SelectItem>
                    <SelectItem value="adjustment">Manual Adjustment</SelectItem>
                    <SelectItem value="refund">Refund</SelectItem>
                    <SelectItem value="penalty">Penalty</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label htmlFor="notes" className="text-sm font-medium">Notes</label>
                <Input 
                  id="notes" 
                  placeholder="Add notes about this transaction..." 
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTransactionDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleTransaction}
              className={transactionType === 'credit' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
            >
              {transactionType === 'credit' ? 'Add Funds' : 'Deduct Funds'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminWallets;
