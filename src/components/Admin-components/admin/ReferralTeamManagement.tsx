import { useState, useEffect, useCallback, ChangeEvent } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import {
  RefreshCw,
  Eye,
  Trash2,
  Edit2,
  Users,
  TrendingUp,
  Award,
  Zap,
  AlertCircle,
  Link as LinkIcon,
} from "lucide-react";

// Types
interface TeamMember {
  _id: string;
  userId: {
    _id: string;
    fname: string;
    lname: string;
    email: string;
    phone?: string;
    createdAt?: string;
  };
  referralCode: string;
  level: number;
  directCount: number;
  totalDownline?: number;
  totalEarnings: number;
  sponsorId?: { _id: string } | string;
  isActive: boolean;
  createdAt?: string;
}

interface TeamStats {
  totalMembers?: number;
  totalEarnings?: number;
  averageDirects?: number;
  averageEarnings?: number;
  maxDirects?: number;
  levelBreakdown?: { _id: number; count: number }[];
}

const ReferralTeamManagement = () => {
  const { token } = useAuth();

  // State management
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<TeamMember[]>([]);
  const [stats, setStats] = useState<TeamStats | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");
  const [sortBy, setSortBy] = useState("directCount");

  // Dialog states
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  // Fetch all team members with their referral data
  const fetchTeamMembers = useCallback(async () => {
    try {
      const response = await axios.get("/api/team/members", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setTeamMembers(response.data.data.members || []);
      }
    } catch (error: any) {
      alert(`Error: ${error.response?.data?.message || "Failed to fetch team members"}`);
    }
  }, [token]);

  // Fetch team statistics
  const fetchStatistics = useCallback(async () => {
    try {
      const response = await axios.get("/api/team/statistics", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error: any) {
      console.error("Failed to fetch statistics:", error);
    }
  }, [token]);

  // Refresh data
  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchTeamMembers(), fetchStatistics()]);
    setRefreshing(false);
    alert("Data refreshed successfully");
  };

  // Handle update sponsor
  const handleUpdateSponsor = async (userId: string, sponsorId: string) => {
    try {
      const response = await axios.post(
        `/api/admin/team-members/set-sponsor`,
        { userId, sponsorId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        alert("Sponsor updated successfully");
        await fetchTeamMembers();
        setEditOpen(false);
      }
    } catch (error: any) {
      alert(`Error: ${error.response?.data?.message || "Failed to update sponsor"}`);
    }
  };

  // Handle delete team member
  const handleDeleteMember = async (userId: string) => {
    if (!window.confirm("Are you sure you want to remove this team member?")) {
      return;
    }

    try {
      const response = await axios.delete(
        `/api/admin/team-members/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        alert("Team member removed successfully");
        await fetchTeamMembers();
      }
    } catch (error: any) {
      alert(`Error: ${error.response?.data?.message || "Failed to remove team member"}`);
    }
  };

  // Filter and sort team members
  useEffect(() => {
    let filtered: TeamMember[] = teamMembers;

    if (searchTerm) {
      filtered = filtered.filter(
        (member) =>
          member.userId?.fname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.userId?.lname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.referralCode?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterLevel !== "all") {
      filtered = filtered.filter((member) => member.level === parseInt(filterLevel));
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "directCount":
          return (b.directCount || 0) - (a.directCount || 0);
        case "totalEarnings":
          return (b.totalEarnings || 0) - (a.totalEarnings || 0);
        case "dateJoined":
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        default:
          return 0;
      }
    });

    setFilteredMembers(filtered);
  }, [teamMembers, searchTerm, filterLevel, sortBy]);

  // Initial load
  useEffect(() => {
    fetchTeamMembers();
    fetchStatistics();
  }, [fetchTeamMembers, fetchStatistics]);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Team & Referral Management</h1>
          <p className="text-gray-600 mt-1">Manage user connections and referral network</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          <RefreshCw size={20} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Members</p>
                <div className="text-3xl font-bold">{stats.totalMembers || 0}</div>
              </div>
              <Users size={40} className="text-blue-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Earnings</p>
                <div className="text-2xl font-bold">
                  ${(stats.totalEarnings || 0).toFixed(2)}
                </div>
              </div>
              <TrendingUp size={40} className="text-green-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Earnings</p>
                <div className="text-2xl font-bold">
                  ${(stats.averageEarnings || 0).toFixed(2)} per member
                </div>
              </div>
              <Award size={40} className="text-purple-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Direct Count</p>
                <div className="text-3xl font-bold">{(stats.averageDirects || 0).toFixed(1)}</div>
              </div>
              <Zap size={40} className="text-yellow-500 opacity-20" />
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h3 className="text-lg font-semibold">Filters & Search</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Search by name, email or code</label>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Filter by Level</label>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Levels</option>
              {[0, 1, 2, 3, 4].map((level) => (
                <option key={level} value={level}>
                  Level {level}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Sort by</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="directCount">Direct Count</option>
              <option value="totalEarnings">Total Earnings</option>
              <option value="dateJoined">Date Joined</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">&nbsp;</label>
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterLevel("all");
                setSortBy("directCount");
              }}
              className="w-full px-3 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Team Members Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Referral Code
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Direct Count
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Total Earnings
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Level
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredMembers.map((member) => (
                <tr key={member._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">
                        {member.userId?.fname} {member.userId?.lname}
                      </div>
                      <p className="text-xs text-gray-500">{member.userId?.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 font-mono text-sm">
                      {member.referralCode}
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(member.referralCode);
                          alert("Copied to clipboard");
                        }}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <LinkIcon className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {member.directCount}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium">
                    ${(member.totalEarnings || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {member.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {member.createdAt ? new Date(member.createdAt).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedMember(member);
                          setDetailsOpen(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        title="View details"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedMember(member);
                          setEditOpen(true);
                        }}
                        className="p-2 text-green-600 hover:bg-green-50 rounded"
                        title="Edit sponsor"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteMember(member.userId._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                        title="Delete member"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No team members found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>

      {/* Edit Sponsor Dialog */}
      {editOpen && selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Update Sponsor</h2>
            <p className="text-sm text-gray-600 mb-4">
              Change the sponsor for {selectedMember.userId.fname} {selectedMember.userId.lname}
            </p>
            <select
              id="sponsor"
              defaultValue={(selectedMember.sponsorId as any)?._id || ""}
              className="w-full px-3 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a sponsor</option>
              {teamMembers.map((member) => (
                <option key={member._id} value={member.userId._id}>
                  {member.userId.fname} {member.userId.lname} (Level {member.level})
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                onClick={async () => {
                  const sponsorSelect = document.getElementById("sponsor") as HTMLSelectElement;
                  const sponsorId = sponsorSelect?.value;
                  if (sponsorId && selectedMember) {
                    await handleUpdateSponsor(selectedMember.userId._id, sponsorId);
                  }
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Update
              </button>
              <button
                onClick={() => setEditOpen(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Dialog */}
      {detailsOpen && selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">Team Member Details</h2>
              <button
                onClick={() => setDetailsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600">Name</p>
                <p className="font-medium">
                  {selectedMember.userId.fname} {selectedMember.userId.lname}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Email</p>
                <p className="font-medium">{selectedMember.userId.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Referral Code</p>
                <p className="font-medium">{selectedMember.referralCode}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Level</p>
                <p className="font-medium">{selectedMember.level}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Direct Count</p>
                <p className="font-medium">{selectedMember.directCount}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Total Earnings</p>
                <p className="font-medium">${(selectedMember.totalEarnings || 0).toFixed(2)}</p>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setDetailsOpen(false)}
                className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferralTeamManagement;
