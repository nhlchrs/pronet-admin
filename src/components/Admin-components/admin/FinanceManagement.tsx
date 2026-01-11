
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, Calendar, Download, Filter, ChevronDown, ChevronUp, 
  Check, X, ArrowRight, WalletCards, Wallet, BarChart2
} from 'lucide-react';
import { 
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell 
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ChartCard from '@/components/dashboard/ChartCard';
import { Input } from '@/components/ui/input';
import PageMeta from '../../../components/common/PageMeta';

const FinanceManagement = () => {
  const [dateRange, setDateRange] = useState('this-month');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Helper function for formatting currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };
  
  // Mock data for financial metrics
  const financialMetrics = [
    { name: 'Total Revenue', value: formatCurrency(562450), change: '+12.5%', isPositive: true },
    { name: 'Net Profit', value: formatCurrency(287620), change: '+8.3%', isPositive: true },
    { name: 'Commissions Paid', value: formatCurrency(145780), change: '+15.7%', isPositive: true },
    { name: 'Operating Costs', value: formatCurrency(129050), change: '+4.2%', isPositive: false },
    { name: 'Total Deposits', value: formatCurrency(412630), change: '+18.1%', isPositive: true },
    { name: 'Total Withdrawals', value: formatCurrency(198420), change: '+22.3%', isPositive: false },
  ];
  
  // Mock data for transactions
  const transactions = [
    { id: 'TRX-1234', date: '2023-07-28', type: 'Commission', amount: 1250, status: 'Completed', affiliate: 'John Doe' },
    { id: 'TRX-1235', date: '2023-07-27', type: 'Withdrawal', amount: 5000, status: 'Pending', affiliate: 'Alice Smith' },
    { id: 'TRX-1236', date: '2023-07-27', type: 'Deposit', amount: 10000, status: 'Completed', affiliate: 'Robert Johnson' },
    { id: 'TRX-1237', date: '2023-07-26', type: 'Commission', amount: 850, status: 'Completed', affiliate: 'Mary Williams' },
    { id: 'TRX-1238', date: '2023-07-25', type: 'Withdrawal', amount: 2500, status: 'Processing', affiliate: 'James Brown' },
    { id: 'TRX-1239', date: '2023-07-25', type: 'Deposit', amount: 7500, status: 'Completed', affiliate: 'Patricia Davis' },
    { id: 'TRX-1240', date: '2023-07-24', type: 'Commission', amount: 1100, status: 'Completed', affiliate: 'Linda Wilson' },
    { id: 'TRX-1241', date: '2023-07-23', type: 'Withdrawal', amount: 3500, status: 'Declined', affiliate: 'Michael Moore' },
  ];
  
  // Mock data for financial chart
  const financialChartData = [
    { name: 'Jan', revenue: 38000, profit: 22000, commission: 10500, costs: 5500 },
    { name: 'Feb', revenue: 42000, profit: 25000, commission: 11200, costs: 5800 },
    { name: 'Mar', revenue: 45000, profit: 27000, commission: 12300, costs: 5700 },
    { name: 'Apr', revenue: 52000, profit: 31000, commission: 14100, costs: 6900 },
    { name: 'May', revenue: 48000, profit: 29000, commission: 13200, costs: 5800 },
    { name: 'Jun', revenue: 58000, profit: 35000, commission: 15600, costs: 7400 },
    { name: 'Jul', revenue: 65000, profit: 39000, commission: 17500, costs: 8500 },
  ];
  
  // Function to get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'Pending':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100';
      case 'Processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'Declined':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };
  
  // Function to get transaction type icon
  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case 'Commission':
        return <DollarSign className="h-4 w-4 text-green-500" />;
      case 'Withdrawal':
        return <Wallet className="h-4 w-4 text-red-500" />;
      case 'Deposit':
        return <WalletCards className="h-4 w-4 text-blue-500" />;
      default:
        return <BarChart2 className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <>
      <PageMeta 
        title="Finance Management - ProNext Admin Panel" 
        description="Manage financial transactions and payments" 
      />
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Finance Management</h1>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="This Month" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="this-week">This Week</SelectItem>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
                <SelectItem value="this-year">This Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {financialMetrics.slice(0, 6).map((metric, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className={`flex items-center text-xs ${metric.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.isPositive ? <ChevronUp className="h-3 w-3 mr-1" /> : <ChevronDown className="h-3 w-3 mr-1" />}
                  {metric.change} from previous period
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ChartCard
            title="Revenue & Profit"
            data={financialChartData}
            categories={['revenue', 'profit']}
            colors={['#3B82F6', '#10B981']}
          />
          
          <ChartCard
            title="Commissions & Costs"
            data={financialChartData}
            categories={['commission', 'costs']}
            colors={['#F59E0B', '#EF4444']}
          />
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between mb-4 gap-4">
              <div className="w-full sm:w-1/3 relative">
                <Input placeholder="Search transactions..." className="pl-8" />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 absolute left-2.5 top-2.5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <div className="flex items-center">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Status" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="declined">Declined</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  More Filters
                </Button>
              </div>
            </div>
            
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Affiliate</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.id}</TableCell>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {getTransactionTypeIcon(transaction.type)}
                          <span className="ml-2">{transaction.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>{transaction.affiliate}</TableCell>
                      <TableCell className={`font-medium ${
                        transaction.type === 'Withdrawal' ? 'text-red-600' : 
                        transaction.type === 'Deposit' ? 'text-blue-600' : 'text-green-600'
                      }`}>
                        {transaction.type === 'Withdrawal' ? '-' : ''}
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <span className="sr-only">View details</span>
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                          {transaction.status === 'Pending' && (
                            <>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-green-600">
                                <span className="sr-only">Approve</span>
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600">
                                <span className="sr-only">Reject</span>
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="flex justify-center mt-4">
              <Button variant="outline" className="w-full sm:w-auto">Load More Transactions</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default FinanceManagement;
