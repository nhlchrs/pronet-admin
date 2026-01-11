
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '../components/ui/button';
import EnhancedChartCard from '@/components/dashboard/EnhancedChartCard';
import StatCard from '@/components/dashboard/StatCard';
import { 
  BarChart, DollarSign, Percent, Wallet, UserCheck, 
  UserX, BarChart2, ArrowUp, ArrowDown, Lock
} from 'lucide-react';
import PageMeta from '../../../components/common/PageMeta';

const AdminAnalytics = () => {
  // Mock data for charts
  const revenueData = [
    { name: 'Jan', amount: 12400 },
    { name: 'Feb', amount: 16600 },
    { name: 'Mar', amount: 18800 },
    { name: 'Apr', amount: 21200 },
    { name: 'May', amount: 19000 },
    { name: 'Jun', amount: 25500 },
    { name: 'Jul', amount: 28800 },
  ];

  const commissionData = [
    { name: 'Jan', direct: 2400, monthly: 1200, binary: 900, lifestyle: 500 },
    { name: 'Feb', direct: 3100, monthly: 1600, binary: 1200, lifestyle: 700 },
    { name: 'Mar', direct: 3500, monthly: 1800, binary: 1400, lifestyle: 800 },
    { name: 'Apr', direct: 4000, monthly: 2100, binary: 1600, lifestyle: 900 },
    { name: 'May', direct: 3600, monthly: 1900, binary: 1400, lifestyle: 750 },
    { name: 'Jun', direct: 4800, monthly: 2500, binary: 1900, lifestyle: 1100 },
    { name: 'Jul', direct: 5400, monthly: 2700, binary: 2200, lifestyle: 1300 },
  ];

  const userGrowthData = [
    { name: 'Jan', total: 145, active: 120, inactive: 25 },
    { name: 'Feb', total: 158, active: 135, inactive: 23 },
    { name: 'Mar', total: 172, active: 150, inactive: 22 },
    { name: 'Apr', total: 195, active: 168, inactive: 27 },
    { name: 'May', total: 220, active: 185, inactive: 35 },
    { name: 'Jun', total: 255, active: 210, inactive: 45 },
    { name: 'Jul', total: 280, active: 232, inactive: 48 },
  ];

  return (
    <>
      <PageMeta 
        title="Analytics - ProNext Admin Panel" 
        description="View detailed analytics and insights" 
      />
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Advanced Analytics</h1>
          <div className="flex gap-2">
            <Button variant="outline">
              <BarChart2 className="mr-2 h-4 w-4" />
              Export Reports
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div>
          <h2 className="text-lg font-medium mb-3">Key Financial Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
              title="Admin Total Income"
              value="$148,652.20"
              icon={<DollarSign className="h-5 w-5 text-primary" />}
              trend={{ value: 15.3, isPositive: true }}
            />
            
            <StatCard
              title="Direct Bonus Paid"
              value="$24,560.40"
              icon={<Wallet className="h-5 w-5 text-blue-500" />}
              trend={{ value: 12.8, isPositive: true }}
            />
            
            <StatCard
              title="Monthly Bonus Paid"
              value="$13,680.20"
              icon={<Wallet className="h-5 w-5 text-green-500" />}
              trend={{ value: 8.2, isPositive: true }}
            />
            
            <StatCard
              title="Binary Bonus Paid"
              value="$10,430.60"
              icon={<Wallet className="h-5 w-5 text-orange-500" />}
              trend={{ value: 7.5, isPositive: true }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="Lifestyle Fund"
            value="$6,240.00"
            icon={<Wallet className="h-5 w-5 text-purple-500" />}
            trend={{ value: 5.2, isPositive: true }}
          />
          
          <StatCard
            title="Locked Bonus"
            value="$5,240.50"
            icon={<Lock className="h-5 w-5 text-red-500" />}
            description="10 Days Return Policy"
          />
          
          <StatCard
            title="Affiliate Wallet Amount"
            value="$32,150.40"
            icon={<Wallet className="h-5 w-5 text-emerald-500" />}
            trend={{ value: 9.1, isPositive: true }}
          />
          
          <StatCard
            title="Deducted Charges"
            value="$8,245.30"
            icon={<Percent className="h-5 w-5 text-gray-500" />}
            trend={{ value: 2.3, isPositive: false }}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Total Members Income"
            value="$124,580.75"
            icon={<DollarSign className="h-5 w-5 text-green-500" />}
            trend={{ value: 14.2, isPositive: true }}
          />
          
          <StatCard
            title="Net Income"
            value="$48,652.20"
            icon={<DollarSign className="h-5 w-5 text-blue-500" />}
            trend={{ value: 11.4, isPositive: true }}
          />
          
          <StatCard
            title="Total Team"
            value="280"
            icon={<UserCheck className="h-5 w-5 text-primary" />}
            trend={{ value: 8.6, isPositive: true }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard
            title="Active Team"
            value="232"
            icon={<UserCheck className="h-5 w-5 text-green-500" />}
            trend={{ value: 7.2, isPositive: true }}
          />
          
          <StatCard
            title="Inactive Team"
            value="48"
            icon={<UserX className="h-5 w-5 text-red-500" />}
            trend={{ value: 3.1, isPositive: false }}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EnhancedChartCard
            title="System Revenue"
            description="Monthly revenue over time"
            data={revenueData}
            categories={['amount']}
            colors={['#3b82f6']}
            valueFormatter={(value) => `$${value}`}
          />
          
          <EnhancedChartCard
            title="Affiliate Growth"
            description="Total, active, and inactive affiliates"
            data={userGrowthData}
            categories={['total', 'active', 'inactive']}
            colors={['#6366f1', '#10b981', '#ef4444']}
            valueFormatter={(value) => `${value}`}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Commission Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <EnhancedChartCard
                title="Commission Types"
                description="Breakdown of different commission types"
                data={commissionData}
                categories={['direct', 'monthly', 'binary', 'lifestyle']}
                colors={['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6']}
                valueFormatter={(value) => `$${value}`}
                showLegend={true}
              />
            </div>
            
            <div className="grid grid-cols-4 gap-2 mt-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <p className="text-xs font-medium text-blue-500">Direct Bonus</p>
                <p className="text-lg font-bold">$24,560.40</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                <p className="text-xs font-medium text-green-500">Monthly Bonus</p>
                <p className="text-lg font-bold">$13,680.20</p>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
                <p className="text-xs font-medium text-amber-500">Binary Bonus</p>
                <p className="text-lg font-bold">$10,430.60</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                <p className="text-xs font-medium text-purple-500">Lifestyle Fund</p>
                <p className="text-lg font-bold">$6,240.00</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AdminAnalytics;
