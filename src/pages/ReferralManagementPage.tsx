import { useState, useEffect } from 'react';
import { TeamHierarchy } from '../components/Team/TeamHierarchy';
import { useAuth } from '../context/AuthContext';
import { Network, Search, Users, TrendingUp, Award } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { getApiUrl } from '../config/api';
import PageMeta from '../components/common/PageMeta';

// Card components
const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-lg shadow ${className}`}>{children}</div>
);

const CardHeader = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-4 border-b ${className}`}>{children}</div>
);

const CardTitle = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>
);

const CardContent = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

export const ReferralManagementPage = () => {
  const { user, token } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);

  // Get userId from URL params if available
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('userId');
    if (userId) {
      setSelectedUserId(userId);
    }
  }, []);

  // Fetch users for search
  const searchUsers = async () => {
    if (!searchTerm.trim() || !token) return;
    
    try {
      setLoading(true);
      const response = await axios.get(
        getApiUrl(`/admin/users?search=${searchTerm}`),
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Response structure: { status, message, data: { users, pagination } }
      setUsers(response.data.data?.users || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to search users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch referral statistics
  const fetchStats = async () => {
    if (!selectedUserId || !token) return;
    
    try {
      const response = await axios.get(
        getApiUrl(`/team/referral/stats/${selectedUserId}`),
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStats(response.data);
    } catch (error: any) {
      console.error('Failed to fetch stats:', error);
      setStats(null);
    }
  };

  useEffect(() => {
    if (selectedUserId) {
      fetchStats();
    }
  }, [selectedUserId]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-center">Please log in to access referral management</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageMeta 
        title="Referral Management - ProNext Admin Panel" 
        description="Manage referrals and team hierarchy" 
      />
      <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Referral & Team Management</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          View team hierarchies, referral networks, and statistics
        </p>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search User to View Team
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search by name, email, or user ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchUsers()}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={searchUsers}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>

          {/* Search Results */}
          {users.length > 0 && (
            <div className="border border-gray-200 rounded-lg divide-y">
              {users.map((u) => (
                <div
                  key={u._id}
                  onClick={() => {
                    setSelectedUserId(u._id);
                    setUsers([]);
                    setSearchTerm('');
                  }}
                  className="p-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-gray-900">{u.fname} {u.lname}</p>
                    <p className="text-sm text-gray-500">{u.email}</p>
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {u.referralCode && (
                        <p className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-200 font-mono">
                          🔑 {u.referralCode}
                        </p>
                      )}
                      {u.leftReferralCode && (
                        <p className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-mono">
                          ⬅️ {u.leftReferralCode}
                        </p>
                      )}
                      {u.rightReferralCode && (
                        <p className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200 font-mono">
                          ➡️ {u.rightReferralCode}
                        </p>
                      )}
                    </div>
                  </div>
                  <Network className="w-5 h-5 text-gray-400" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      {stats && selectedUserId && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Team</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalTeam || 0}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Direct Referrals</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.directReferrals || 0}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Team Levels</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.maxDepth || 0}</p>
                </div>
                <Award className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Active Members</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeMembers || 0}</p>
                </div>
                <Network className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Referral Codes Display */}
      {selectedUserId && users.length === 0 && (
        (() => {
          // Find the selected user from state to get their referral codes
          // We'll fetch this data when user is selected
          return (
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="w-5 h-5" />
                  Referral Codes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Main Code */}
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-200 dark:border-green-700">
                    <p className="text-sm font-semibold text-green-700 dark:text-green-300 mb-2">🔑 Main Code</p>
                    <div className="bg-white dark:bg-gray-800 p-2 rounded font-mono text-sm font-bold break-all text-green-600 dark:text-green-400">
                      {stats?.referralCode || 'N/A'}
                    </div>
                  </div>

                  {/* Left Code */}
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-700">
                    <p className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2">⬅️ Left Code (Lpro)</p>
                    <div className="bg-white dark:bg-gray-800 p-2 rounded font-mono text-sm font-bold break-all text-blue-600 dark:text-blue-400">
                      {stats?.leftReferralCode || 'N/A'}
                    </div>
                  </div>

                  {/* Right Code */}
                  <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border-2 border-orange-200 dark:border-orange-700">
                    <p className="text-sm font-semibold text-orange-700 dark:text-orange-300 mb-2">➡️ Right Code (Rpro)</p>
                    <div className="bg-white dark:bg-gray-800 p-2 rounded font-mono text-sm font-bold break-all text-orange-600 dark:text-orange-400">
                      {stats?.rightReferralCode || 'N/A'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })()
      )}

      {/* Team Hierarchy */}
      {selectedUserId ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="w-5 h-5" />
              Team Network Hierarchy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TeamHierarchy userId={selectedUserId} depth={10} />
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Network className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No User Selected</h3>
            <p className="text-gray-500">Search and select a user to view their referral network and team hierarchy</p>
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
        <CardHeader>
          <CardTitle className="text-base text-blue-900 dark:text-blue-100">Admin View Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-blue-900 dark:text-blue-100">
          <p>
            <strong>Purpose:</strong> This admin panel allows you to view and monitor referral networks and team hierarchies across the platform.
          </p>
          <div className="space-y-2 pt-2">
            <p className="font-semibold">Key Features:</p>
            <ul className="ml-4 space-y-1">
              <li>• Search any user by name, email, or ID</li>
              <li>• View complete team hierarchy and network structure</li>
              <li>• Monitor referral statistics and team growth</li>
              <li>• Track direct and indirect referrals</li>
              <li>• Analyze team depth and active member count</li>
            </ul>
          </div>
          <p className="pt-2 text-xs">
            <strong>Note:</strong> This is a view-only interface. Admins cannot join teams or use referral codes from this panel.
          </p>
        </CardContent>
      </Card>
    </div>
    </>
  );
};

export default ReferralManagementPage;
