import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, TrendingUp, TrendingDown, RefreshCw, Users, DollarSign, CreditCard, Gift } from 'lucide-react';
import PageMeta from '../../../components/common/PageMeta';

interface ReportsData {
  totalRevenue: number;
  totalUsers: number;
  totalCommissions: number;
  activeRate: number;
  revenueGrowth: number;
  userGrowth: number;
  users?: {
    total: number;
    active: number;
    subscribed: number;
    suspended: number;
    newThisMonth: number;
  };
  commissions?: {
    total: number;
    count: number;
    byType: {
      direct_bonus: number;
      level_income: number;
      binary_bonus: number;
      reward_bonus: number;
    };
  };
  payouts?: {
    completed: number;
    pending: number;
    total: number;
    breakdown: Array<{ _id: string; total: number; count: number }>;
  };
  rewards?: {
    total: number;
    claimed: number;
    delivered: number;
    pending: number;
  };
  financial?: {
    grossRevenue: number;
    commissionsOut: number;
    payoutsCompleted: number;
    netProfit: number;
  };
}

const AdminReports = () => {
  const [reports, setReports] = useState<ReportsData>({
    totalRevenue: 0,
    totalUsers: 0,
    totalCommissions: 0,
    activeRate: 0,
    revenueGrowth: 0,
    userGrowth: 0
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReports = async () => {
    try {
      const isRefresh = !loading;
      if (isRefresh) setRefreshing(true);
      
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        setLoading(false);
        return;
      }

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/admin/reports`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      console.log('Reports API Response:', result);
      
      if (result.status === 1 && result.data) {
        console.log('Reports Data:', result.data);
        setReports(result.data);
      } else {
        console.error('Failed to fetch reports:', result.message);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value || 0);
  };

  return (
    <>
      <PageMeta 
        title="Reports - ProNet Admin Panel" 
        description="View system reports and summaries" 
      />
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Comprehensive Reports</h1>
          <div className="flex gap-2">
            <Button
              onClick={fetchReports}
              disabled={refreshing}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-2 border-emerald-200 dark:border-emerald-900">
                <CardHeader className="pb-3 bg-emerald-50 dark:bg-emerald-950">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Total Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">{formatCurrency(reports.totalRevenue)}</div>
                      <div className="flex items-center mt-1 text-sm">
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-green-500 font-medium">+{reports.revenueGrowth}%</span>
                        <span className="text-muted-foreground ml-1">vs last month</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-200 dark:border-blue-900">
                <CardHeader className="pb-3 bg-blue-50 dark:bg-blue-950">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Total Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">{reports.totalUsers}</div>
                      <div className="flex items-center mt-1 text-sm">
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-green-500 font-medium">+{reports.userGrowth}%</span>
                        <span className="text-muted-foreground ml-1">growth rate</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-200 dark:border-purple-900">
                <CardHeader className="pb-3 bg-purple-50 dark:bg-purple-950">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Commissions Paid
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">{formatCurrency(reports.totalCommissions)}</div>
                      <div className="flex items-center mt-1 text-sm">
                        <span className="text-muted-foreground">
                          {reports.totalRevenue > 0 
                            ? `${((reports.totalCommissions / reports.totalRevenue) * 100).toFixed(1)}% of revenue`
                            : '0% of revenue'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* User Metrics Detailed */}
            {reports.users && (
              <Card>
                <CardHeader>
                  <CardTitle>User Metrics Breakdown</CardTitle>
                  <CardDescription>Detailed user statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-950 border-2 border-blue-200 dark:border-blue-900 rounded-lg">
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Users</p>
                      <p className="text-3xl font-bold mt-2">{reports.users.total}</p>
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-950 border-2 border-green-200 dark:border-green-900 rounded-lg">
                      <p className="text-sm font-medium text-green-600 dark:text-green-400">Active</p>
                      <p className="text-3xl font-bold mt-2">{reports.users.active}</p>
                      <p className="text-xs text-muted-foreground mt-1">{reports.activeRate}% rate</p>
                    </div>
                    <div className="p-4 bg-purple-50 dark:bg-purple-950 border-2 border-purple-200 dark:border-purple-900 rounded-lg">
                      <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Subscribed</p>
                      <p className="text-3xl font-bold mt-2">{reports.users.subscribed}</p>
                    </div>
                    <div className="p-4 bg-red-50 dark:bg-red-950 border-2 border-red-200 dark:border-red-900 rounded-lg">
                      <p className="text-sm font-medium text-red-600 dark:text-red-400">Suspended</p>
                      <p className="text-3xl font-bold mt-2">{reports.users.suspended}</p>
                    </div>
                    <div className="p-4 bg-amber-50 dark:bg-amber-950 border-2 border-amber-200 dark:border-amber-900 rounded-lg">
                      <p className="text-sm font-medium text-amber-600 dark:text-amber-400">New This Month</p>
                      <p className="text-3xl font-bold mt-2">{reports.users.newThisMonth}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Financial Summary */}
            {reports.financial && (
              <Card>
                <CardHeader>
                  <CardTitle>Financial Summary</CardTitle>
                  <CardDescription>Revenue, commissions, payouts, and profit</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-950 border-2 border-emerald-200 dark:border-emerald-900 rounded-lg">
                      <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Gross Revenue</p>
                      <p className="text-2xl font-bold mt-2">{formatCurrency(reports.financial.grossRevenue)}</p>
                      <p className="text-xs text-muted-foreground mt-1">Total income</p>
                    </div>
                    <div className="p-4 bg-blue-50 dark:bg-blue-950 border-2 border-blue-200 dark:border-blue-900 rounded-lg">
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Commissions Out</p>
                      <p className="text-2xl font-bold mt-2">{formatCurrency(reports.financial.commissionsOut)}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {((reports.financial.commissionsOut / reports.financial.grossRevenue) * 100).toFixed(1)}% of revenue
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-950 border-2 border-green-200 dark:border-green-900 rounded-lg">
                      <p className="text-sm font-medium text-green-600 dark:text-green-400">Payouts Completed</p>
                      <p className="text-2xl font-bold mt-2">{formatCurrency(reports.financial.payoutsCompleted)}</p>
                      <p className="text-xs text-muted-foreground mt-1">Successfully paid</p>
                    </div>
                    <div className="p-4 bg-purple-50 dark:bg-purple-950 border-2 border-purple-200 dark:border-purple-900 rounded-lg">
                      <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Net Profit</p>
                      <p className="text-2xl font-bold mt-2">{formatCurrency(reports.financial.netProfit)}</p>
                      <p className="text-xs text-muted-foreground mt-1">After commissions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Commission Breakdown */}
            {reports.commissions && (
              <Card>
                <CardHeader>
                  <CardTitle>Commission Breakdown</CardTitle>
                  <CardDescription>{reports.commissions.count} total commission transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-950 border-2 border-blue-200 dark:border-blue-900 rounded-lg">
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Direct Bonus</p>
                      <p className="text-2xl font-bold mt-2">{formatCurrency(reports.commissions.byType.direct_bonus)}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {((reports.commissions.byType.direct_bonus / reports.commissions.total) * 100).toFixed(1)}% of total
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-950 border-2 border-green-200 dark:border-green-900 rounded-lg">
                      <p className="text-sm font-medium text-green-600 dark:text-green-400">Level Income</p>
                      <p className="text-2xl font-bold mt-2">{formatCurrency(reports.commissions.byType.level_income)}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {((reports.commissions.byType.level_income / reports.commissions.total) * 100).toFixed(1)}% of total
                      </p>
                    </div>
                    <div className="p-4 bg-purple-50 dark:bg-purple-950 border-2 border-purple-200 dark:border-purple-900 rounded-lg">
                      <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Binary Bonus</p>
                      <p className="text-2xl font-bold mt-2">{formatCurrency(reports.commissions.byType.binary_bonus)}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {((reports.commissions.byType.binary_bonus / (reports.commissions.total || 1)) * 100).toFixed(1)}% of total
                      </p>
                    </div>
                    <div className="p-4 bg-amber-50 dark:bg-amber-950 border-2 border-amber-200 dark:border-amber-900 rounded-lg">
                      <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Reward Bonus</p>
                      <p className="text-2xl font-bold mt-2">{formatCurrency(reports.commissions.byType.reward_bonus)}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {((reports.commissions.byType.reward_bonus / reports.commissions.total) * 100).toFixed(1)}% of total
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Payouts & Rewards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reports.payouts && (
                <Card>
                  <CardHeader>
                    <CardTitle>Payout Statistics</CardTitle>
                    <CardDescription>Total payouts: {formatCurrency(reports.payouts.total)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-950 rounded-lg border-2 border-green-200 dark:border-green-900">
                        <span className="text-sm font-medium">Completed</span>
                        <span className="text-sm font-bold text-green-600 dark:text-green-400">{formatCurrency(reports.payouts.completed)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-amber-50 dark:bg-amber-950 rounded-lg border-2 border-amber-200 dark:border-amber-900">
                        <span className="text-sm font-medium">Pending</span>
                        <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{formatCurrency(reports.payouts.pending)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <span className="text-sm font-medium">Completion Rate</span>
                        <span className="text-sm font-bold">
                          {((reports.payouts.completed / reports.payouts.total) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {reports.rewards && (
                <Card>
                  <CardHeader>
                    <CardTitle>Binary Rewards</CardTitle>
                    <CardDescription>Total rewards: {reports.rewards.total}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border-2 border-blue-200 dark:border-blue-900">
                        <span className="text-sm font-medium">Claimed</span>
                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{reports.rewards.claimed}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-950 rounded-lg border-2 border-green-200 dark:border-green-900">
                        <span className="text-sm font-medium">Delivered</span>
                        <span className="text-sm font-bold text-green-600 dark:text-green-400">{reports.rewards.delivered}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-amber-50 dark:bg-amber-950 rounded-lg border-2 border-amber-200 dark:border-amber-900">
                        <span className="text-sm font-medium">Pending</span>
                        <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{reports.rewards.pending}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Growth Indicators */}
            <Card>
              <CardHeader>
                <CardTitle>Growth Indicators</CardTitle>
                <CardDescription>Month-over-month comparisons</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">Revenue Growth</span>
                      <span className="font-bold text-green-600 dark:text-green-400">+{reports.revenueGrowth}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all" 
                        style={{ width: `${Math.min(reports.revenueGrowth * 5, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">User Growth</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">+{reports.userGrowth}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all" 
                        style={{ width: `${Math.min(reports.userGrowth * 8, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">Active User Rate</span>
                      <span className="font-bold text-purple-600 dark:text-purple-400">{reports.activeRate}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-purple-400 to-purple-600 h-3 rounded-full transition-all" 
                        style={{ width: `${reports.activeRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Export Options */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Export Options</CardTitle>
                <CardDescription>Download reports in different formats</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Button variant="outline" className="w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    Export as PDF
                  </Button>
                  <Button variant="outline" className="w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    Export as CSV
                  </Button>
                  <Button variant="outline" className="w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    Export as Excel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </>
  );
};

export default AdminReports;
