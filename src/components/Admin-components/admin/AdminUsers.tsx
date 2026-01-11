import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Eye, Ban, CheckCircle, XCircle, Mail, Phone, X, Network } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useConfirmation } from '../../../hooks/useConfirmation';
import { toast } from 'sonner';
import { getApiUrl } from '../../../config/api';
import PageMeta from '../../../components/common/PageMeta';

interface User {
  _id: string;
  fname: string;
  lname: string;
  email: string;
  phone: string;
  address?: string;
  role: string;
  subscriptionStatus: boolean;
  isSuspended: boolean;
  suspensionReason?: string;
  isBlocked: boolean;
  referralCode?: string;
  createdAt: string;
  dailyLoginCount: number;
  lastLoginDate?: string;
}

export default function AdminUsers() {
  const { token } = useAuth();
  const { confirm: showConfirmation } = useConfirmation();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [suspensionReason, setSuspensionReason] = useState('');

  // Fetch users
  useEffect(() => {
    if (!token) {
      console.warn('No token available, cannot fetch users');
      setLoading(false);
      return;
    }
    fetchUsers();
  }, [token]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching users with token:', token);
      const response = await axios.get(
        getApiUrl('/allusers'),
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log('Users response:', response.data);

      if (response.data?.status === 1 || response.data?.success) {
        const usersData = response.data?.data || [];
        console.log('Setting users:', usersData);
        setUsers(Array.isArray(usersData) ? usersData : []);
        console.log('Successfully loaded', usersData.length, 'users');
      } else {
        console.error('API response not successful:', response.data);
        setError('Failed to load users');
        toast.error('Failed to load users');
      }
    } catch (error: any) {
      console.error('Error fetching users:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to load users';
      setError(errorMsg);
      if (error.response?.status === 401) {
        toast.error('Your session has expired. Please login again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSuspendUser = async (userId: string, reason: string) => {
    if (!reason.trim()) {
      toast.error('Please provide a suspension reason');
      return;
    }

    try {
      const response = await axios.put(
        getApiUrl(`/users/${userId}/suspend-status`),
        {
          isSuspended: true,
          suspensionReason: reason,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data?.status === 1 || response.data?.success) {
        toast.success('User suspended successfully');
        await fetchUsers();
        setShowViewModal(false);
      }
    } catch (error: any) {
      console.error('Error suspending user:', error);
      toast.error(error.response?.data?.message || 'Error suspending user');
    }
  };

  const handleReactivateUser = async (userId: string) => {
    const confirmed = await showConfirmation({
      title: 'Reactivate User',
      message: 'Are you sure you want to reactivate this user? This will reset their login count to 0.',
      details: selectedUser ? `User: ${selectedUser.fname} ${selectedUser.lname}` : '',
      confirmText: 'Reactivate',
      cancelText: 'Cancel',
      isDangerous: false,
    });

    if (!confirmed) return;

    try {
      const response = await axios.post(
        getApiUrl(`/admin/user/${userId}/reactivate`),
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data?.status === 1 || response.data?.success) {
        toast.success('User reactivated successfully with login count reset');
        await fetchUsers();
        setShowViewModal(false);
      }
    } catch (error: any) {
      console.error('Error reactivating user:', error);
      toast.error(error.response?.data?.message || 'Error reactivating user');
    }
  };

  const handleBlockUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to block this user?')) return;

    try {
      // This would need a backend endpoint like PUT /api/users/:id/block
      toast.error('Block feature requires backend endpoint');
    } catch (error: any) {
      toast.error('Error blocking user');
    }
  };

  const handleView = (user: User) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && !user.isSuspended && !user.isBlocked) ||
      (filterStatus === 'suspended' && user.isSuspended) ||
      (filterStatus === 'blocked' && user.isBlocked);
    return matchesSearch && matchesRole && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg max-w-md">
          <p className="text-red-700 dark:text-red-400 font-semibold mb-4">Error Loading Users</p>
          <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              fetchUsers();
            }}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title="Users Management - ProNext Admin Panel"
        description="Manage and monitor all users in the system"
      />
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Users Management</h1>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Total Users: <span className="font-semibold">{users.length}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="all">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="User">User</option>
          <option value="Affiliate">Affiliate</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                Email
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                Role
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                Subscription
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                Logins
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {user.fname} {user.lname}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.isBlocked ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded">
                        <XCircle className="w-4 h-4" />
                        Blocked
                      </span>
                    ) : user.isSuspended ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded">
                        <Ban className="w-4 h-4" />
                        Suspended
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded">
                        <CheckCircle className="w-4 h-4" />
                        Active
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                        user.subscriptionStatus
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {user.subscriptionStatus ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {user.dailyLoginCount}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleView(user)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
                      title="View"
                    >
                      <Eye className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {showViewModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-99999 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {selectedUser.fname} {selectedUser.lname}
              </h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Personal Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">First Name</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {selectedUser.fname}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Last Name</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {selectedUser.lname}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Mail className="w-4 h-4" /> Email
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white break-all">
                      {selectedUser.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Phone className="w-4 h-4" /> Phone
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {selectedUser.phone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Address */}
              {selectedUser.address && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Address</p>
                  <p className="text-gray-900 dark:text-white">{selectedUser.address}</p>
                </div>
              )}

              {/* Account Status */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Account Status
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {selectedUser.role}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                    {selectedUser.isBlocked ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded">
                        <XCircle className="w-4 h-4" />
                        Blocked
                      </span>
                    ) : selectedUser.isSuspended ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded">
                        <Ban className="w-4 h-4" />
                        Suspended
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded">
                        <CheckCircle className="w-4 h-4" />
                        Active
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Subscription</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {selectedUser.subscriptionStatus ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Referral Code</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {selectedUser.referralCode || 'N/A'}
                    </p>
                  </div>
                </div>

                {selectedUser.isSuspended && selectedUser.suspensionReason && (
                  <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
                    <p className="text-sm text-yellow-800 dark:text-yellow-300">
                      <strong>Suspension Reason:</strong> {selectedUser.suspensionReason}
                    </p>
                  </div>
                )}
              </div>

              {/* Activity */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Activity
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Daily Logins</p>
                    <p className="text-2xl font-bold text-brand-500">
                      {selectedUser.dailyLoginCount}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Last Login</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {selectedUser.lastLoginDate
                        ? new Date(selectedUser.lastLoginDate).toLocaleDateString()
                        : 'Never'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Created At</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {new Date(selectedUser.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-900">
              <button
                onClick={() => setShowViewModal(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
              >
                Close
              </button>
              {selectedUser.referralCode && (
                <a
                  href={`/admin/referrals?userId=${selectedUser._id}`}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <Network className="w-4 h-4" />
                  View Referral Network
                </a>
              )}
              {selectedUser.isSuspended ? (
                <button
                  onClick={() => handleReactivateUser(selectedUser._id)}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Reactivate Account
                </button>
              ) : (
                <button
                  onClick={() => {
                    setSuspensionReason('');
                    setShowSuspendModal(true);
                  }}
                  className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 flex items-center justify-center gap-2"
                >
                  <Ban className="w-4 h-4" />
                  Suspend Account
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Suspension Reason Modal */}
      {showSuspendModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-99999">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full mx-4">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Suspend User Account
              </h3>
              <button
                onClick={() => setShowSuspendModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  User: <span className="font-semibold text-gray-900 dark:text-white">{selectedUser.fname} {selectedUser.lname}</span>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Email: <span className="font-semibold text-gray-900 dark:text-white">{selectedUser.email}</span>
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Suspension Reason
                </label>
                <textarea
                  value={suspensionReason}
                  onChange={(e) => setSuspensionReason(e.target.value)}
                  placeholder="Enter the reason for suspension..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  rows={4}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <button
                onClick={() => setShowSuspendModal(false)}
                className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!suspensionReason.trim()) {
                    toast.error('Please enter a suspension reason');
                    return;
                  }
                  const confirmed = await showConfirmation({
                    title: 'Confirm Suspension',
                    message: `Are you sure you want to suspend ${selectedUser.fname} ${selectedUser.lname}?`,
                    details: `Reason: ${suspensionReason}`,
                    confirmText: 'Suspend User',
                    cancelText: 'Cancel',
                    isDangerous: true,
                  });
                  if (confirmed) {
                    await handleSuspendUser(selectedUser._id, suspensionReason);
                    setShowSuspendModal(false);
                    setSuspensionReason('');
                  }
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Confirm Suspension
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
