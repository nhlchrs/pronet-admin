import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '../components/ui/button';
import { CreditCard, TrendingUp, CheckCircle, Clock, XCircle, DollarSign } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'sonner';
import { getApiUrl } from '../../../config/api';

interface PaymentStats {
  totalPayments: number;
  totalAmount: number;
  completedPayments: number;
  pendingPayments: number;
  failedPayments: number;
  paymentsByProvider: {
    [key: string]: number;
  };
}

export default function AdminPaymentStatistics() {
  const { token } = useAuth();
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      console.warn('No token available, cannot fetch payment statistics');
      setLoading(false);
      return;
    }
    fetchPaymentStatistics();
  }, [token]);

  const fetchPaymentStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching payment statistics with token:', token);

      const response = await axios.get(
        getApiUrl('/payments/admin/statistics'),
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log('Payment statistics response:', response.data);

      if (response.data?.status === 1 || response.data?.success || response.data?.data) {
        const statsData = response.data?.data || response.data;
        console.log('Setting stats:', statsData);
        // Set default values of 0 for undefined fields
        const defaultStats: PaymentStats = {
          totalPayments: statsData?.totalPayments || 0,
          totalAmount: statsData?.totalAmount || 0,
          completedPayments: statsData?.completedPayments || 0,
          pendingPayments: statsData?.pendingPayments || 0,
          failedPayments: statsData?.failedPayments || 0,
          paymentsByProvider: statsData?.paymentsByProvider || {},
        };
        setStats(defaultStats);
        toast.success('Payment statistics loaded successfully');
      } else {
        console.error('API response not successful:', response.data);
        setError('Failed to load payment statistics');
        toast.error('Failed to load payment statistics');
      }
    } catch (error: any) {
      console.error('Error fetching payment statistics:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to load payment statistics';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchPaymentStatistics();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-600">Loading payment statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Statistics</h1>
          <p className="text-gray-600 mt-1">Overview of all payment transactions</p>
        </div>
        <Button 
          onClick={handleRefresh}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <TrendingUp className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">Error: {error}</p>
        </div>
      )}

      {stats && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Payments */}
            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-blue-500" />
                  Total Payments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stats.totalPayments}</div>
                <p className="text-xs text-gray-500 mt-1">All transactions</p>
              </CardContent>
            </Card>

            {/* Total Amount */}
            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-500" />
                  Total Amount
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">${stats?.totalAmount?.toLocaleString()}</div>
                <p className="text-xs text-gray-500 mt-1">Total revenue</p>
              </CardContent>
            </Card>

            {/* Completed Payments */}
            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{stats.completedPayments}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.totalPayments > 0 
                    ? `${((stats.completedPayments / stats.totalPayments) * 100).toFixed(1)}%`
                    : '0%'
                  }
                </p>
              </CardContent>
            </Card>

            {/* Pending Payments */}
            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  Pending
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600">{stats.pendingPayments}</div>
                <p className="text-xs text-gray-500 mt-1">Awaiting completion</p>
              </CardContent>
            </Card>
          </div>

          {/* Failed Payments Card */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500" />
                Failed Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{stats.failedPayments}</div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.totalPayments > 0 
                  ? `${((stats.failedPayments / stats.totalPayments) * 100).toFixed(1)}%`
                  : '0%'
                }
              </p>
            </CardContent>
          </Card>

          {/* Payments by Provider */}
          {stats.paymentsByProvider && Object.keys(stats.paymentsByProvider).length > 0 && (
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle>Payments by Provider</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(stats.paymentsByProvider).map(([provider, count]) => (
                    <div key={provider} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="font-medium text-gray-700 capitalize">{provider}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">{count}</p>
                          <p className="text-xs text-gray-500">
                            {stats.totalPayments > 0 
                              ? `${((count / stats.totalPayments) * 100).toFixed(1)}%`
                              : '0%'
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Summary Stats */}
          <Card className="border border-gray-200 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Success Rate</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.totalPayments > 0 
                      ? `${((stats.completedPayments / stats.totalPayments) * 100).toFixed(1)}%`
                      : '0%'
                    }
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Average Amount</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${stats.totalPayments > 0 
                      ? (stats.totalAmount / stats.totalPayments).toFixed(2)
                      : '0.00'
                    }
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Failure Rate</p>
                  <p className="text-2xl font-bold text-red-600">
                    {stats.totalPayments > 0 
                      ? `${((stats.failedPayments / stats.totalPayments) * 100).toFixed(1)}%`
                      : '0%'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
