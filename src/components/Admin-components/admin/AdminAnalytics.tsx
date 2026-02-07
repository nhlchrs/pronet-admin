
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatCard from '@/components/dashboard/StatCard';
import { 
  DollarSign, Users, TrendingUp, Activity
} from 'lucide-react';
import PageMeta from '../../../components/common/PageMeta';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalUsers: 0,
    activeUsers: 0,
    monthlyGrowth: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch analytics data from API
    const fetchAnalytics = async () => {
      try {
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
          setAnalytics({
            totalRevenue: result.data.totalRevenue || 0,
            totalUsers: result.data.totalUsers || 0,
            activeUsers: result.data.activeUsers || 0,
            monthlyGrowth: result.data.monthlyGrowth || 0
          });
        } else {
          console.error('Failed to fetch analytics:', result.message);
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <>
      <PageMeta 
        title="Analytics - ProNet Admin Panel" 
        description="View system analytics and insights" 
      />
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Analytics Overview</h1>
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
                value={`$${analytics.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
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

            {/* Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle>Analytics Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Revenue</p>
                      <p className="text-2xl font-bold">${analytics.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                    </div>
                    <DollarSign className="h-10 w-10 text-primary" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Users</p>
                      <p className="text-3xl font-bold mt-2">{analytics.totalUsers}</p>
                      <p className="text-xs text-muted-foreground mt-1">Registered accounts</p>
                    </div>
                    
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-sm font-medium text-green-600 dark:text-green-400">Active Users</p>
                      <p className="text-3xl font-bold mt-2">{analytics.activeUsers}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {((analytics.activeUsers / analytics.totalUsers) * 100).toFixed(1)}% active rate
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Monthly Growth</p>
                        <p className="text-2xl font-bold text-primary mt-1">+{analytics.monthlyGrowth}%</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-primary" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Compared to previous month
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">User Activity Rate</p>
                    <p className="text-2xl font-bold mt-2">
                      {((analytics.activeUsers / analytics.totalUsers) * 100).toFixed(1)}%
                    </p>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Inactive Users</p>
                    <p className="text-2xl font-bold mt-2">
                      {analytics.totalUsers - analytics.activeUsers}
                    </p>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Revenue Per User</p>
                    <p className="text-2xl font-bold mt-2">
                      ${(analytics.totalRevenue / analytics.totalUsers).toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </>
  );
};

export default AdminAnalytics;
