
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import StatCard from '@/components/dashboard/StatCard';
import { 
  DollarSign, Users, TrendingUp, Activity, Gift, CreditCard, Award, RefreshCw
} from 'lucide-react';
import PageMeta from '../../../components/common/PageMeta';
import { Button } from '@/components/ui/button';

interface AnalyticsData {
  totalRevenue: number;
  totalUsers: number;
  activeUsers: number;
  subscribedUsers: number;
  monthlyGrowth: number;
  commissions?: {
    total: number;
    breakdown: Array<{ _id: string; totalAmount: number; count: number }>;
    byType: {
      direct_bonus: number;
      level_income: number;
      binary_bonus: number;
      reward_bonus: number;
    };
  };
  payouts?: {
    total: number;
    breakdown: Array<{ _id: string; totalAmount: number; count: number }>;
    pending: number;
    completed: number;
    processing: number;
  };
  rewards?: {
    total: number;
    claimed: number;
    processed: number;
  };
}

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalRevenue: 0,
    totalUsers: 0,
    activeUsers: 0,
    subscribedUsers: 0,
    monthlyGrowth: 0
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = async () => {
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
      const response = await fetch(`${apiUrl}/admin/analytics`, {
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
      
      console.log('Analytics API Response:', result);
      
      if (result.status === 1 && result.data) {
        console.log('Analytics Data:', result.data);
        setAnalytics(result.data);
      } else {
        console.error('Failed to fetch analytics:', result.message);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
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
        title="Analytics - ProNet Admin Panel" 
        description="View system analytics and insights" 
      />
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Analytics Overview</h1>
          <Button
            onClick={fetchAnalytics}
            disabled={refreshing}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Essential Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Revenue"
                value={formatCurrency(analytics.totalRevenue)}
                icon={<DollarSign className="h-5 w-5 text-primary" />}
                trend={{ value: analytics.monthlyGrowth, isPositive: analytics.monthlyGrowth > 0 }}
                description="Total system revenue"
              />
              
              <StatCard
                title="Total Users"
                value={analytics.totalUsers.toString()}
                icon={<Users className="h-5 w-5 text-blue-500" />}
                description="Registered users"
              />
              
              <StatCard
                title="Active Users"
                value={analytics.activeUsers.toString()}
                icon={<Activity className="h-5 w-5 text-green-500" />}
                description="Currently active"
              />
              
              <StatCard
                title="Growth Rate"
                value={`${analytics.monthlyGrowth}%`}
                icon={<TrendingUp className="h-5 w-5 text-emerald-500" />}
                trend={{ value: analytics.monthlyGrowth, isPositive: analytics.monthlyGrowth > 0 }}
                description="Monthly growth"
              />
            </div>

            {/* Commission & Payout Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-2 border-blue-200 dark:border-blue-900">
                <CardHeader className="bg-blue-50 dark:bg-blue-950">
                  <CardTitle className="text-base flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Commissions Paid
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrency(analytics.commissions?.total || 0)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {((analytics.commissions?.total || 0) / (analytics.totalRevenue || 1) * 100).toFixed(1)}% of revenue
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-200 dark:border-green-900">
                <CardHeader className="bg-green-50 dark:bg-green-950">
                  <CardTitle className="text-base flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Payouts Completed
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(analytics.payouts?.completed || 0)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatCurrency(analytics.payouts?.pending || 0)} pending
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-200 dark:border-purple-900">
                <CardHeader className="bg-purple-50 dark:bg-purple-950">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Gift className="h-5 w-5" />
                    Binary Rewards
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {analytics.rewards?.total || 0}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {analytics.rewards?.processed || 0} processed
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Commission Breakdown */}
            {analytics.commissions && (
              <Card>
                <CardHeader>
                  <CardTitle>Commission Breakdown</CardTitle>
                  <CardDescription>Breakdown by commission type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-950 border-2 border-blue-200 dark:border-blue-900 rounded-lg">
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Direct Bonus</p>
                      <p className="text-2xl font-bold mt-2">{formatCurrency(analytics.commissions.byType.direct_bonus)}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {((analytics.commissions.byType.direct_bonus / (analytics.commissions.total || 1)) * 100).toFixed(1)}% of total
                      </p>
                    </div>
                    
                    <div className="p-4 bg-green-50 dark:bg-green-950 border-2 border-green-200 dark:border-green-900 rounded-lg">
                      <p className="text-sm font-medium text-green-600 dark:text-green-400">Level Income</p>
                      <p className="text-2xl font-bold mt-2">{formatCurrency(analytics.commissions.byType.level_income)}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {((analytics.commissions.byType.level_income / (analytics.commissions.total || 1)) * 100).toFixed(1)}% of total
                      </p>
                    </div>
                    
                    <div className="p-4 bg-purple-50 dark:bg-purple-950 border-2 border-purple-200 dark:border-purple-900 rounded-lg">
                      <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Binary Bonus</p>
                      <p className="text-2xl font-bold mt-2">{formatCurrency(analytics.commissions.byType.binary_bonus)}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {((analytics.commissions.byType.binary_bonus / (analytics.commissions.total || 1)) * 100).toFixed(1)}% of total
                      </p>
                    </div>
                    
                    <div className="p-4 bg-amber-50 dark:bg-amber-950 border-2 border-amber-200 dark:border-amber-900 rounded-lg">
                      <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Reward Bonus</p>
                      <p className="text-2xl font-bold mt-2">{formatCurrency(analytics.commissions.byType.reward_bonus)}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {((analytics.commissions.byType.reward_bonus / (analytics.commissions.total || 1)) * 100).toFixed(1)}% of total
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* User Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span className="text-sm font-medium">Total Users</span>
                      <span className="text-lg font-bold">{analytics.totalUsers}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                      <span className="text-sm font-medium">Active Users</span>
                      <span className="text-lg font-bold text-green-600 dark:text-green-400">{analytics.activeUsers}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <span className="text-sm font-medium">Subscribed Users</span>
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{analytics.subscribedUsers}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span className="text-sm font-medium">Active Rate</span>
                      <span className="text-lg font-bold">
                        {((analytics.activeUsers / analytics.totalUsers) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Financial Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-emerald-50 dark:bg-emerald-950 rounded-lg">
                      <span className="text-sm font-medium">Total Revenue</span>
                      <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(analytics.totalRevenue)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <span className="text-sm font-medium">Commissions Out</span>
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {formatCurrency(analytics.commissions?.total || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                      <span className="text-sm font-medium">Payouts Completed</span>
                      <span className="text-lg font-bold text-green-600 dark:text-green-400">
                        {formatCurrency(analytics.payouts?.completed || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                      <span className="text-sm font-medium">Net Profit</span>
                      <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        {formatCurrency(analytics.totalRevenue - (analytics.commissions?.total || 0))}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default AdminAnalytics;
