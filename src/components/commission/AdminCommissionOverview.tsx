import React, { useState, useEffect } from 'react';

interface CommissionBreakdown {
  directBonus: number;
  levelIncome: number;
  binaryBonus: number;
  rewardBonus: number;
  totalCommissions: number;
}

interface CommissionData {
  userId: string;
  userName: string;
  totalPending: number;
  totalPaid: number;
  breakdown: CommissionBreakdown;
}

// API Base URL - uses Vite env variable or defaults to localhost
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const AdminCommissionOverview: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [totalSystemCommissions, setTotalSystemCommissions] = useState<number>(0);
  const [systemBreakdown, setSystemBreakdown] = useState<CommissionBreakdown>({
    directBonus: 0,
    levelIncome: 0,
    binaryBonus: 0,
    rewardBonus: 0,
    totalCommissions: 0,
  });
  const [topEarners, setTopEarners] = useState<CommissionData[]>([]);

  useEffect(() => {
    fetchAdminCommissionData();
  }, []);

  const fetchAdminCommissionData = async () => {
    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      // Fetch system-wide commission data
      const response = await fetch(`${API_BASE_URL}/api/admin/commissions/system-overview`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch commission data');
      }

      const data = await response.json();
      
      setTotalSystemCommissions(data.totalSystemCommissions || 0);
      setSystemBreakdown(data.breakdown || systemBreakdown);
      setTopEarners(data.topEarners || []);

    } catch (err) {
      console.error('Error fetching commission data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load commission data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl bg-white p-8 shadow-sm dark:bg-gray-800">
        <div className="flex items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-white p-8 shadow-sm dark:bg-gray-800">
        <div className="text-center">
          <p className="text-red-500">⚠️ {error}</p>
          <button
            onClick={fetchAdminCommissionData}
            className="mt-4 rounded-lg bg-blue-500 px-6 py-2 text-white hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Total System Commissions Card */}
      <div className="rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 p-8 text-white shadow-lg">
        <div className="flex items-center gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 text-4xl">
            💰
          </div>
          <div className="flex-1">
            <h3 className="mb-2 text-lg font-medium opacity-90">Total System Commissions</h3>
            <div className="text-5xl font-bold">
              ${totalSystemCommissions.toFixed(2)}
            </div>
            <p className="mt-2 text-sm opacity-80">All pending commissions across platform</p>
          </div>
        </div>
      </div>

      {/* Commission Breakdown */}
      <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
        <h4 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
          📊 Commission Breakdown
        </h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Direct Bonus */}
          <div className="rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 p-5 dark:from-purple-900/20 dark:to-purple-800/20">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-xl">
                👥
              </div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Direct Bonus
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              ${systemBreakdown.directBonus.toFixed(2)}
            </div>
            <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
              From direct referrals
            </div>
          </div>

          {/* Level Income */}
          <div className="rounded-lg bg-gradient-to-br from-pink-50 to-pink-100 p-5 dark:from-pink-900/20 dark:to-pink-800/20">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-pink-600 text-xl">
                📈
              </div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Level Income
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              ${systemBreakdown.levelIncome.toFixed(2)}
            </div>
            <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
              From downline levels
            </div>
          </div>

          {/* Binary Bonus */}
          <div className="rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 p-5 dark:from-blue-900/20 dark:to-blue-800/20">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-xl">
                ⚖️
              </div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Binary Bonus
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              ${systemBreakdown.binaryBonus.toFixed(2)}
            </div>
            <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
              From binary matching
            </div>
          </div>

          {/* Reward Bonus */}
          <div className="rounded-lg bg-gradient-to-br from-yellow-50 to-yellow-100 p-5 dark:from-yellow-900/20 dark:to-yellow-800/20">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600 text-xl">
                🎁
              </div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Reward Bonus
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              ${systemBreakdown.rewardBonus.toFixed(2)}
            </div>
            <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
              From achievements
            </div>
          </div>
        </div>
      </div>

      {/* Top Earners */}
      {topEarners.length > 0 && (
        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
          <h4 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
            🏆 Top Commission Earners
          </h4>
          <div className="space-y-3">
            {topEarners.slice(0, 10).map((earner, index) => (
              <div
                key={earner.userId}
                className="flex items-center gap-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-lg font-bold text-white">
                  #{index + 1}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {earner.userName}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    User ID: {earner.userId}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-green-600 dark:text-green-400">
                    ${earner.totalPending.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500">Pending</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {topEarners.length === 0 && (
        <div className="rounded-xl bg-white p-8 text-center shadow-sm dark:bg-gray-800">
          <p className="text-gray-600 dark:text-gray-400">
            💡 No commission data available yet
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminCommissionOverview;
