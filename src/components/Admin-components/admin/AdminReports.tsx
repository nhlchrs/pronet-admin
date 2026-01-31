import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, TrendingUp, TrendingDown } from 'lucide-react';
import PageMeta from '../../../components/common/PageMeta';

const AdminReports = () => {
  const [reports, setReports] = useState({
    totalRevenue: 0,
    totalUsers: 0,
    totalCommissions: 0,
    activeRate: 0,
    revenueGrowth: 0,
    userGrowth: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch report data from API
    const fetchReports = async () => {
      try {
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
          setReports({
            totalRevenue: result.data.totalRevenue || 0,
            totalUsers: result.data.totalUsers || 0,
            totalCommissions: result.data.totalCommissions || 0,
            activeRate: result.data.activeRate || 0,
            revenueGrowth: result.data.revenueGrowth || 0,
            userGrowth: result.data.userGrowth || 0
          });
        } else {
          console.error('Failed to fetch reports:', result.message);
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <>
      <PageMeta 
        title="Reports - ProNext Admin Panel" 
        description="View system reports and summaries" 
      />
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Reports</h1>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
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

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
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

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Commissions Paid</CardTitle>
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

            {/* Main Report Card */}
            <Card>
              <CardHeader>
                <CardTitle>System Report Summary</CardTitle>
                <CardDescription>Current period overview and key metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Financial Overview */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Financial Overview</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm font-medium">Total Revenue</span>
                      <span className="text-sm font-bold">{formatCurrency(reports.totalRevenue)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm font-medium">Commissions Paid</span>
                      <span className="text-sm font-bold">{formatCurrency(reports.totalCommissions)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm font-medium">Net Profit</span>
                      <span className="text-sm font-bold">
                        {formatCurrency(reports.totalRevenue - reports.totalCommissions)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* User Metrics */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 text-muted-foreground">User Metrics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm font-medium">Total Users</span>
                      <span className="text-sm font-bold">{reports.totalUsers}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm font-medium">Active Rate</span>
                      <span className="text-sm font-bold">{reports.activeRate}%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm font-medium">Revenue Per User</span>
                      <span className="text-sm font-bold">
                        {reports.totalUsers > 0 
                          ? formatCurrency(reports.totalRevenue / reports.totalUsers)
                          : formatCurrency(0)
                        }
                      </span>
                    </div>
                  </div>
                </div>

                {/* Growth Indicators */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Growth Indicators</h3>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Revenue Growth</span>
                        <span className="font-medium">+{reports.revenueGrowth}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all" 
                          style={{ width: `${Math.min(reports.revenueGrowth * 5, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>User Growth</span>
                        <span className="font-medium">+{reports.userGrowth}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all" 
                          style={{ width: `${Math.min(reports.userGrowth * 8, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Active User Rate</span>
                        <span className="font-medium">{reports.activeRate}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all" 
                          style={{ width: `${reports.activeRate}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
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
