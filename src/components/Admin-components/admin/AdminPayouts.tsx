import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '../components/ui/button';
import { 
  DollarSign, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Search, 
  Filter,
  Eye,
  RefreshCw,
  Download,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'sonner';
import { getApiUrl } from '../../../config/api';
import PageMeta from '../../../components/common/PageMeta';

interface Payout {
  _id: string;
  userId: {
    _id: string;
    fname: string;
    lname: string;
    email: string;
    phone?: string;
  };
  amount: number;
  netAmount: number;
  taxDeducted: number;
  payoutMethod: string;
  cryptoWalletAddress?: string;
  cryptoCurrency?: string;
  status: string;
  referenceNumber: string;
  transactionId?: string;
  cryptoTransactionHash?: string;
  adminNotes?: string;
  createdAt: string;
  completedDate?: string;
}

interface PayoutStats {
  totalPayouts: number;
  totalPaid: number;
  totalPending: number;
  statusBreakdown: Array<{
    _id: string;
    count: number;
    totalAmount: number;
  }>;
}

export default function AdminPayouts() {
  const { token } = useAuth();
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [stats, setStats] = useState<PayoutStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);
  const [showModal, setShowModal] = useState(false);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Update form
  const [updateStatus, setUpdateStatus] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [cryptoTxHash, setCryptoTxHash] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (token) {
      fetchPayouts();
      fetchStats();
    }
  }, [token, statusFilter, methodFilter, searchQuery, currentPage]);

  const fetchPayouts = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: currentPage,
        limit: 20
      };
      if (statusFilter) params.status = statusFilter;
      if (methodFilter) params.payoutMethod = methodFilter;
      if (searchQuery) params.search = searchQuery;

      const response = await axios.get(getApiUrl('/admin/payouts'), {
        headers: { Authorization: `Bearer ${token}` },
        params
      });

      if (response.data.success) {
        setPayouts(response.data.data.payouts);
        setTotalPages(response.data.data.pagination.totalPages);
      }
    } catch (error: any) {
      console.error('Error fetching payouts:', error);
      toast.error(error.response?.data?.message || 'Failed to load payouts');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(getApiUrl('/admin/payouts/stats/summary'), {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error: any) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleViewDetails = async (payoutId: string) => {
    try {
      const response = await axios.get(getApiUrl(`/admin/payouts/${payoutId}`), {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setSelectedPayout(response.data.data);
        setUpdateStatus(response.data.data.status);
        setTransactionId(response.data.data.transactionId || '');
        setCryptoTxHash(response.data.data.cryptoTransactionHash || '');
        setAdminNotes(response.data.data.adminNotes || '');
        setShowModal(true);
      }
    } catch (error: any) {
      toast.error('Failed to load payout details');
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedPayout) return;

    try {
      setUpdating(true);
      const response = await axios.put(
        getApiUrl(`/admin/payouts/${selectedPayout._id}/status`),
        {
          status: updateStatus,
          transactionId,
          cryptoTransactionHash: cryptoTxHash,
          adminNotes
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(`Payout ${updateStatus} successfully`);
        setShowModal(false);
        fetchPayouts();
        fetchStats();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update payout');
    } finally {
      setUpdating(false);
    }
  };

  const handleProcessPayout = async () => {
    if (!selectedPayout) return;

    // Validate crypto payout
    if (selectedPayout.payoutMethod !== 'crypto') {
      toast.error('Can only process crypto payouts');
      return;
    }

    if (!selectedPayout.cryptoWalletAddress || !selectedPayout.cryptoCurrency) {
      toast.error('Missing crypto wallet details');
      return;
    }

    if (selectedPayout.status === 'completed' || selectedPayout.status === 'processing') {
      toast.error(`Payout is already ${selectedPayout.status}`);
      return;
    }

    if (!confirm(`Process payout of ${formatCurrency(selectedPayout.netAmount)} to ${selectedPayout.userId.fname} ${selectedPayout.userId.lname}?\n\nThis will send ${selectedPayout.cryptoCurrency} to:\n${selectedPayout.cryptoWalletAddress}`)) {
      return;
    }

    try {
      setProcessing(true);
      const response = await axios.post(
        getApiUrl(`/admin/payouts/${selectedPayout._id}/process`),
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success('Payout processed successfully! User has been notified via email.');
        setShowModal(false);
        fetchPayouts();
        fetchStats();
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Failed to process payout';
      toast.error(errorMsg);
      console.error('Payout processing error:', error.response?.data);
    } finally {
      setProcessing(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      setExporting(true);
      const params: any = {};
      if (statusFilter) params.status = statusFilter;
      if (methodFilter) params.payoutMethod = methodFilter;

      const response = await axios.get(getApiUrl('/admin/payouts/export/csv'), {
        headers: { Authorization: `Bearer ${token}` },
        params,
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `payouts_export_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('CSV exported successfully');
    } catch (error: any) {
      toast.error('Failed to export CSV');
    } finally {
      setExporting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: any = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      processing: 'bg-blue-100 text-blue-800 border-blue-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      failed: 'bg-red-100 text-red-800 border-red-200',
      cancelled: 'bg-gray-100 text-gray-800 border-gray-200'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && payouts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-600">Loading payouts...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageMeta 
        title="Payout Management - ProNet Admin Panel" 
        description="Manage user payout requests" 
      />
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Payout Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and process user payout requests</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleExportCSV}
              disabled={exporting}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Download className="mr-2 h-4 w-4" />
              {exporting ? 'Exporting...' : 'Export CSV'}
            </Button>
            <Button 
              onClick={() => { fetchPayouts(); fetchStats(); }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-500" />
                  Total Paid
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(stats.totalPaid)}
                </div>
                <p className="text-xs text-gray-500 mt-1">Completed payouts</p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  Pending
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(stats.totalPending)}
                </div>
                <p className="text-xs text-gray-500 mt-1">Awaiting processing</p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.statusBreakdown.find(s => s._id === 'completed')?.count || 0}
                </div>
                <p className="text-xs text-gray-500 mt-1">Total completed</p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  All Payouts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.totalPayouts}
                </div>
                <p className="text-xs text-gray-500 mt-1">Total requests</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="border border-gray-200 dark:border-gray-700">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Method
                </label>
                <select
                  value={methodFilter}
                  onChange={(e) => setMethodFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="">All Methods</option>
                  <option value="crypto">Crypto</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="upi">UPI</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by reference, email..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payouts Table */}
        <Card className="border border-gray-200 dark:border-gray-700">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">User</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Reference</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Amount</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Method</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {payouts.length > 0 ? (
                    payouts.map((payout) => (
                      <tr key={payout._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {payout.userId.fname} {payout.userId.lname}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{payout.userId.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-mono text-gray-900 dark:text-white">{payout.referenceNumber}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{formatCurrency(payout.netAmount)}</p>
                            <p className="text-xs text-gray-500">Gross: {formatCurrency(payout.amount)}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-900 dark:text-white capitalize">
                            {payout.payoutMethod === 'crypto' ? payout.cryptoCurrency : payout.payoutMethod.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(payout.status)}
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-600 dark:text-gray-400">{formatDate(payout.createdAt)}</p>
                        </td>
                        <td className="px-6 py-4">
                          <Button
                            onClick={() => handleViewDetails(payout._id)}
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-1"
                          >
                            <Eye className="h-3 w-3" />
                            View
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center">
                        <p className="text-gray-500 dark:text-gray-400">No payouts found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                >
                  Previous
                </Button>
                <span className="flex items-center px-4 text-sm text-gray-700 dark:text-gray-300">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="sm"
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detail Modal */}
      {showModal && selectedPayout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Payout Details</h2>
              
              {/* User Info */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">User Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Name</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {selectedPayout.userId.fname} {selectedPayout.userId.lname}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Email</p>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedPayout.userId.email}</p>
                  </div>
                </div>
              </div>

              {/* Payout Info */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Payout Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Reference Number</p>
                    <p className="font-mono font-medium text-gray-900 dark:text-white">{selectedPayout.referenceNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Status</p>
                    {getStatusBadge(selectedPayout.status)}
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Gross Amount</p>
                    <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(selectedPayout.amount)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Net Amount</p>
                    <p className="font-medium text-green-600">{formatCurrency(selectedPayout.netAmount)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Tax Deducted</p>
                    <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(selectedPayout.taxDeducted)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Method</p>
                    <p className="font-medium text-gray-900 dark:text-white capitalize">
                      {selectedPayout.payoutMethod === 'crypto' 
                        ? `${selectedPayout.cryptoCurrency} (Crypto)` 
                        : selectedPayout.payoutMethod.replace('_', ' ')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Crypto Details */}
              {selectedPayout.payoutMethod === 'crypto' && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Crypto Details</h3>
                  <div className="text-sm space-y-2">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Wallet Address</p>
                      <p className="font-mono text-xs break-all text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 p-2 rounded">
                        {selectedPayout.cryptoWalletAddress}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Update Form */}
              <div className="mb-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Update Payout</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={updateStatus}
                    onChange={(e) => setUpdateStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {selectedPayout.payoutMethod === 'crypto' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Crypto Transaction Hash
                    </label>
                    <input
                      type="text"
                      value={cryptoTxHash}
                      onChange={(e) => setCryptoTxHash(e.target.value)}
                      placeholder="Enter blockchain transaction hash"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Transaction ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="Enter transaction ID"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Admin Notes
                  </label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add any notes or comments..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center">
                <div>
                  {selectedPayout.payoutMethod === 'crypto' && 
                   selectedPayout.status === 'pending' && (
                    <Button
                      onClick={handleProcessPayout}
                      disabled={processing || updating}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      {processing ? 'Processing...' : '🚀 Process Payout via NOWPayments'}
                    </Button>
                  )}
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowModal(false)}
                    variant="outline"
                    disabled={updating || processing}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpdateStatus}
                    disabled={updating || processing}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {updating ? 'Updating...' : 'Update Payout'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
