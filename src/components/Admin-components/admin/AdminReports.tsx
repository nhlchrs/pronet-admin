import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Printer, Calendar, ChevronDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import ChartCard from '@/components/dashboard/ChartCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminReports = () => {
  const [reportPeriod, setReportPeriod] = useState('monthly');
  
  // Mock data
  const revenueData = [
    { name: 'Jan', revenue: 45000, profit: 28000, commission: 12600 },
    { name: 'Feb', revenue: 52000, profit: 32000, commission: 14560 },
    { name: 'Mar', revenue: 48000, profit: 29000, commission: 13440 },
    { name: 'Apr', revenue: 61000, profit: 37000, commission: 17080 },
    { name: 'May', revenue: 55000, profit: 34000, commission: 15400 },
    { name: 'Jun', revenue: 67000, profit: 41000, commission: 18760 },
    { name: 'Jul', revenue: 72000, profit: 44000, commission: 20160 },
  ];
  
  const affiliateData = [
    { name: 'Jan', newAffiliates: 42, activeAffiliates: 120 },
    { name: 'Feb', newAffiliates: 38, activeAffiliates: 135 },
    { name: 'Mar', newAffiliates: 45, activeAffiliates: 142 },
    { name: 'Apr', newAffiliates: 56, activeAffiliates: 160 },
    { name: 'May', newAffiliates: 48, activeAffiliates: 172 },
    { name: 'Jun', newAffiliates: 62, activeAffiliates: 185 },
    { name: 'Jul', newAffiliates: 58, activeAffiliates: 205 },
  ];
  
  const bonusData = [
    { name: 'Jan', direct: 8500, team: 3200, monthly: 4300 },
    { name: 'Feb', direct: 9800, team: 3700, monthly: 4900 },
    { name: 'Mar', direct: 9200, team: 3500, monthly: 4600 },
    { name: 'Apr', direct: 11500, team: 4300, monthly: 5800 },
    { name: 'May', direct: 10400, team: 3900, monthly: 5200 },
    { name: 'Jun', direct: 12700, team: 4800, monthly: 6400 },
    { name: 'Jul', direct: 13600, team: 5100, monthly: 6800 },
  ];
  
  const kpiSummaryData = [
    { name: 'Revenue', value: 400000 },
    { name: 'Profit', value: 245000 },
    { name: 'Commission', value: 112000 },
    { name: 'Affiliates', value: 205 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };
  
    const affiliateTableData = [
    { id: 'AFF001', name: 'John Doe', joined: '2023-01-15', referrals: 15, earnings: 5400 },
    { id: 'AFF002', name: 'Alice Smith', joined: '2023-02-20', referrals: 22, earnings: 8800 },
    { id: 'AFF003', name: 'Robert Jones', joined: '2023-03-10', referrals: 18, earnings: 6900 },
    { id: 'AFF004', name: 'Emily White', joined: '2023-04-05', referrals: 25, earnings: 9500 },
  ];
  
  return (
    <div>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline">
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Select value={reportPeriod} onValueChange={setReportPeriod}>
              <SelectTrigger className="w-44">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Monthly" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="revenue">Revenue & Profit</TabsTrigger>
            <TabsTrigger value="affiliates">Affiliates</TabsTrigger>
            <TabsTrigger value="commissions">Commissions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(400000)}</div>
                  <p className="text-xs text-muted-foreground">+12% from previous period</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(245000)}</div>
                  <p className="text-xs text-muted-foreground">+8% from previous period</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Commissions Paid</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(112000)}</div>
                  <p className="text-xs text-muted-foreground">+15% from previous period</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Active Affiliates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">205</div>
                  <p className="text-xs text-muted-foreground">+22 from previous period</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Overview Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ChartCard
                title="Financial Summary"
                data={revenueData}
                categories={['revenue', 'profit', 'commission']}
                colors={['#4F46E5', '#10B981', '#F59E0B']}
              />
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">KPI Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={kpiSummaryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {kpiSummaryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">Executive Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    The system has shown strong performance this period with a 12% increase in total revenue compared to the previous period. 
                    Net profit grew by 8%, with commission payouts up by 15%. The affiliate network has expanded, with 22 more active affiliates 
                    compared to the last period. Key areas of growth include direct bonuses (+15%) and monthly bonuses (+12%). The financial health 
                    of the system remains strong with positive cash flow and increasing member engagement metrics.
                  </p>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Revenue Target Achievement</span>
                      <span className="font-medium">95%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div className="bg-primary h-2.5 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>Affiliate Growth</span>
                      <span className="font-medium">78%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>System Stability</span>
                      <span className="font-medium">99.8%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '99.8%' }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="revenue" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ChartCard
                title="Affiliate Growth"
                data={affiliateData}
                categories={['newAffiliates', 'activeAffiliates']}
                colors={['#3B82F6', '#10B981']}
              />
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">Revenue Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Legend />
                        <Bar dataKey="revenue" name="Revenue" fill="#4F46E5" />
                        <Bar dataKey="profit" name="Profit" fill="#10B981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">Revenue Analysis</CardTitle>
                <CardDescription>Monthly breakdown of key financial metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left font-medium p-2">Month</th>
                        <th className="text-right font-medium p-2">Revenue</th>
                        <th className="text-right font-medium p-2">Profit</th>
                        <th className="text-right font-medium p-2">Commission</th>
                        <th className="text-right font-medium p-2">Margin</th>
                      </tr>
                    </thead>
                    <tbody>
                      {revenueData.map((item) => (
                        <tr key={item.name} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="p-2">{item.name}</td>
                          <td className="text-right p-2">{formatCurrency(item.revenue)}</td>
                          <td className="text-right p-2">{formatCurrency(item.profit)}</td>
                          <td className="text-right p-2">{formatCurrency(item.commission)}</td>
                          <td className="text-right p-2">{((item.profit / item.revenue) * 100).toFixed(1)}%</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="font-medium bg-gray-50 dark:bg-gray-800">
                        <td className="p-2">Total</td>
                        <td className="text-right p-2">
                          {formatCurrency(revenueData.reduce((sum, item) => sum + item.revenue, 0))}
                        </td>
                        <td className="text-right p-2">
                          {formatCurrency(revenueData.reduce((sum, item) => sum + item.profit, 0))}
                        </td>
                        <td className="text-right p-2">
                          {formatCurrency(revenueData.reduce((sum, item) => sum + item.commission, 0))}
                        </td>
                        <td className="text-right p-2">
                          {((revenueData.reduce((sum, item) => sum + item.profit, 0) / 
                            revenueData.reduce((sum, item) => sum + item.revenue, 0)) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="affiliates" className="space-y-4">
             <div className="grid grid-cols-1 gap-6">
              <ChartCard
                title="Affiliate Growth"
                data={affiliateData}
                categories={['newAffiliates', 'activeAffiliates']}
                colors={['#3B82F6', '#10B981']}
              />
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">Affiliate Performance</CardTitle>
                  <CardDescription>Key metrics for top performing affiliates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left font-medium p-2">ID</th>
                          <th className="text-left font-medium p-2">Name</th>
                          <th className="text-center font-medium p-2">Joined</th>
                          <th className="text-center font-medium p-2">Referrals</th>
                          <th className="text-right font-medium p-2">Earnings</th>
                        </tr>
                      </thead>
                      <tbody>
                        {affiliateTableData.map((item) => (
                          <tr key={item.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="p-2">{item.id}</td>
                            <td className="p-2">{item.name}</td>
                            <td className="text-center p-2">{item.joined}</td>
                            <td className="text-center p-2">{item.referrals}</td>
                            <td className="text-right p-2">{formatCurrency(item.earnings)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="font-medium bg-gray-50 dark:bg-gray-800">
                          <td className="p-2">Total</td>
                          <td className="p-2"></td>
                          <td className="p-2"></td>
                          <td className="text-center p-2">
                            {affiliateTableData.reduce((sum, item) => sum + item.referrals, 0)}
                          </td>
                          <td className="text-right p-2">
                            {formatCurrency(affiliateTableData.reduce((sum, item) => sum + item.earnings, 0))}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="commissions" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              <ChartCard
                title="Commission Types"
                data={bonusData}
                categories={['direct', 'team', 'monthly']}
                colors={['#4F46E5', '#F59E0B', '#10B981']}
              />
              
               <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">Commission Breakdown</CardTitle>
                  <CardDescription>Monthly overview of commission payouts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left font-medium p-2">Month</th>
                          <th className="text-right font-medium p-2">Direct</th>
                          <th className="text-right font-medium p-2">Team</th>
                          <th className="text-right font-medium p-2">Monthly</th>
                          <th className="text-right font-medium p-2">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bonusData.map((item) => (
                          <tr key={item.name} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="p-2">{item.name}</td>
                            <td className="text-right p-2">{formatCurrency(item.direct)}</td>
                            <td className="text-right p-2">{formatCurrency(item.team)}</td>
                            <td className="text-right p-2">{formatCurrency(item.monthly)}</td>
                            <td className="text-right p-2">{formatCurrency(item.direct + item.team + item.monthly)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="font-medium bg-gray-50 dark:bg-gray-800">
                          <td className="p-2">Total</td>
                          <td className="text-right p-2">
                            {formatCurrency(bonusData.reduce((sum, item) => sum + item.direct, 0))}
                          </td>
                          <td className="text-right p-2">
                            {formatCurrency(bonusData.reduce((sum, item) => sum + item.team, 0))}
                          </td>
                          <td className="text-right p-2">
                            {formatCurrency(bonusData.reduce((sum, item) => sum + item.monthly, 0))}
                          </td>
                          <td className="text-right p-2">
                            {formatCurrency(bonusData.reduce((sum, item) => sum + item.direct + item.team + item.monthly, 0))}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>  );
};

export default AdminReports;
