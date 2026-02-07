import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from '@/hooks/use-toast';
import PageMeta from '../../../components/common/PageMeta';
import {
  Search,
  ChevronDown,
  RefreshCw,
  Eye,
  CheckCircle,
  XCircle,
  Trash2,
  Edit2,
  Users,
  TrendingUp,
  Award,
  Zap,
  AlertCircle,
  MoreVertical,
  Plus,
  Filter,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TeamManagement = () => {
  const { token } = useAuth();
  const { toast } = useToast();

  // State management
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tierFilter, setTierFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [stats, setStats] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [suspendReason, setSuspendReason] = useState("");
  const [suspendingId, setSuspendingId] = useState(null);
  const [verifyingId, setVerifyingId] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);

  // Fetch teams
  const fetchTeams = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 10,
        search: searchTerm,
        status: statusFilter,
        tier: tierFilter,
      };

      const response = await axios.get("/api/admin/team/list", {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data?.success && response.data?.data?.teams) {
        setTeams(response.data.data.teams);
        setPagination(response.data.data.pagination);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error("Error fetching teams:", error);
      toast({
        title: "Error",
        description: "Failed to fetch teams",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter, tierFilter, token, toast]);

  // Fetch statistics
  const fetchStatistics = useCallback(async () => {
    try {
      const response = await axios.get("/api/admin/team/statistics", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data?.success && response.data?.data) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  }, [token]);

  // Fetch team members
  const fetchTeamMembers = useCallback(async (teamId) => {
    setMembersLoading(true);
    try {
      const response = await axios.get(`/api/admin/team/${teamId}/members`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { limit: 20 },
      });

      if (response.data?.success) {
        setTeamMembers(response.data.data.members);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setMembersLoading(false);
    }
  }, [token]);

  // Initial load
  useEffect(() => {
    fetchTeams(1);
    fetchStatistics();
  }, []);

  // Re-fetch when filters change
  useEffect(() => {
    fetchTeams(1);
  }, [searchTerm, statusFilter, tierFilter, fetchTeams]);

  // Handle team selection for detail modal
  const handleViewTeam = async (team) => {
    setSelectedTeam(team);
    setShowDetailModal(true);
    await fetchTeamMembers(team._id);
  };

  // Verify team
  const handleVerifyTeam = async (teamId) => {
    setVerifyingId(teamId);
    try {
      const response = await axios.post(
        `/api/admin/team/${teamId}/verify`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data?.success) {
        toast({
          title: "Success",
          description: "Team verified successfully",
        });
        fetchTeams(currentPage);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to verify team",
        variant: "destructive",
      });
    } finally {
      setVerifyingId(null);
    }
  };

  // Suspend team
  const handleSuspendTeam = async () => {
    if (!suspendReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a suspension reason",
        variant: "destructive",
      });
      return;
    }

    setSuspendingId(suspendingId);
    try {
      const response = await axios.post(
        `/api/admin/team/${suspendingId}/suspend`,
        { reason: suspendReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data?.success) {
        toast({
          title: "Success",
          description: "Team suspended successfully",
        });
        setShowSuspendModal(false);
        setSuspendReason("");
        fetchTeams(currentPage);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to suspend team",
        variant: "destructive",
      });
    } finally {
      setSuspendingId(null);
    }
  };

  // Reactivate team
  const handleReactivateTeam = async (teamId) => {
    try {
      const response = await axios.post(
        `/api/admin/team/${teamId}/reactivate`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data?.success) {
        toast({
          title: "Success",
          description: "Team reactivated successfully",
        });
        fetchTeams(currentPage);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to reactivate team",
        variant: "destructive",
      });
    }
  };

  // Delete team
  const handleDeleteTeam = async (teamId) => {
    if (window.confirm("Are you sure you want to delete this team?")) {
      try {
        const response = await axios.delete(`/api/admin/team/${teamId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data?.success) {
          toast({
            title: "Success",
            description: "Team deleted successfully",
          });
          setShowDetailModal(false);
          fetchTeams(currentPage);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to delete team",
          variant: "destructive",
        });
      }
    }
  };

  // Render tier badge color
  const getTierColor = (tier) => {
    const colors = {
      bronze: "bg-amber-100 text-amber-800",
      silver: "bg-slate-100 text-slate-800",
      gold: "bg-yellow-100 text-yellow-800",
      platinum: "bg-purple-100 text-purple-800",
    };
    return colors[tier] || "bg-gray-100 text-gray-800";
  };

  // Render status badge
  const getStatusBadge = (team) => {
    if (!team.isActive) {
      return <Badge className="bg-red-100 text-red-800">Suspended</Badge>;
    }
    return team.isVerified ? (
      <Badge className="bg-green-100 text-green-800">Verified</Badge>
    ) : (
      <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
    );
  };

  return (
    <>
      <PageMeta 
        title="Team Management - ProNet Admin Panel" 
        description="Manage team structure and hierarchy" 
      />
      <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Team Management</h1>
          <p className="text-gray-600 mt-1">Manage and monitor all teams</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Create Team
        </Button>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Teams</CardTitle>
              <Users className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTeams}</div>
              <p className="text-xs text-gray-600">{stats.activeTeams} active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verified</CardTitle>
              <CheckCircle className="w-4 h-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.verifiedTeams}</div>
              <p className="text-xs text-gray-600">
                {stats.totalTeams > 0
                  ? Math.round((stats.verifiedTeams / stats.totalTeams) * 100)
                  : 0}
                % of total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${(stats.earnings?.totalEarnings || 0).toFixed(2)}
              </div>
              <p className="text-xs text-gray-600">
                ${(stats.earnings?.currentMonthEarnings || 0).toFixed(2)} this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Suspended</CardTitle>
              <AlertCircle className="w-4 h-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.suspendedTeams}</div>
              <p className="text-xs text-gray-600">Inactive teams</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Teams</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search teams by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => fetchTeams(1)}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              </Button>
            </div>

            {/* Filter Dropdowns */}
            <div className="flex gap-2 flex-wrap">
              {/* Status Filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none px-4 py-2 pr-8 border border-gray-300 rounded-lg bg-white cursor-pointer text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
                <Filter className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Tier Filter */}
              <div className="relative">
                <select
                  value={tierFilter}
                  onChange={(e) => setTierFilter(e.target.value)}
                  className="appearance-none px-4 py-2 pr-8 border border-gray-300 rounded-lg bg-white cursor-pointer text-sm"
                >
                  <option value="all">All Tiers</option>
                  <option value="bronze">Bronze</option>
                  <option value="silver">Silver</option>
                  <option value="gold">Gold</option>
                  <option value="platinum">Platinum</option>
                </select>
                <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Teams Table */}
      <Card>
        <CardContent className="p-0">
          {loading && teams.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Zap className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Loading teams...</p>
              </div>
            </div>
          ) : teams.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No teams found</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Team Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Lead
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Members
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Tier
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Total Earnings
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {teams.map((team) => (
                    <tr key={team._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {team.teamName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {team.teamLead?.fname} {team.teamLead?.lname}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {team.totalMembers}
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={getTierColor(team.tier)}>
                          {team.tier.charAt(0).toUpperCase() + team.tier.slice(1)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-green-600">
                        ${team.totalEarnings?.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(team)}</td>
                      <td className="px-6 py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewTeam(team)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            {!team.isVerified && team.isActive && (
                              <DropdownMenuItem
                                onClick={() => handleVerifyTeam(team._id)}
                                disabled={verifyingId === team._id}
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                {verifyingId === team._id ? "Verifying..." : "Verify Team"}
                              </DropdownMenuItem>
                            )}
                            {team.isActive && (
                              <DropdownMenuItem
                                onClick={() => {
                                  setSuspendingId(team._id);
                                  setShowSuspendModal(true);
                                }}
                              >
                                <AlertCircle className="w-4 h-4 mr-2" />
                                Suspend Team
                              </DropdownMenuItem>
                            )}
                            {!team.isActive && (
                              <DropdownMenuItem onClick={() => handleReactivateTeam(team._id)}>
                                <Zap className="w-4 h-4 mr-2" />
                                Reactivate Team
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => handleDeleteTeam(team._id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Team
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Page {pagination.currentPage} of {pagination.totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={!pagination.hasPrevPage || loading}
              onClick={() => fetchTeams(currentPage - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              disabled={!pagination.hasNextPage || loading}
              onClick={() => fetchTeams(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Team Details</DialogTitle>
            <DialogDescription>View and manage team information</DialogDescription>
          </DialogHeader>

          {selectedTeam && (
            <div className="space-y-6">
              {/* Team Info */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Team Name</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedTeam.teamName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Team Lead</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedTeam.teamLead?.fname} {selectedTeam.teamLead?.lname}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedTeam.description || "N/A"}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Tier</label>
                    <Badge className={`mt-1 ${getTierColor(selectedTeam.tier)}`}>
                      {selectedTeam.tier.charAt(0).toUpperCase() + selectedTeam.tier.slice(1)}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <div className="mt-1">{getStatusBadge(selectedTeam)}</div>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Total Members</p>
                  <p className="text-2xl font-bold text-gray-900">{selectedTeam.totalMembers}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Total Earnings</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${selectedTeam.totalEarnings?.toFixed(2)}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Monthly Target</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${selectedTeam.monthlyTarget?.toFixed(2)}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Current Month Earnings</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ${selectedTeam.currentMonthEarnings?.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Members List */}
              <div>
                <label className="text-sm font-medium text-gray-700">Team Members</label>
                {membersLoading ? (
                  <p className="mt-2 text-sm text-gray-600">Loading members...</p>
                ) : teamMembers.length === 0 ? (
                  <p className="mt-2 text-sm text-gray-600">No members in this team</p>
                ) : (
                  <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                    {teamMembers.map((member) => (
                      <div
                        key={member._id}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {member.fname} {member.lname}
                          </p>
                          <p className="text-xs text-gray-600">{member.email}</p>
                        </div>
                        <Badge variant="secondary">{member.phone}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Suspension Info */}
              {!selectedTeam.isActive && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm font-medium text-red-900">Suspension Details</p>
                  <p className="mt-1 text-sm text-red-700">
                    Reason: {selectedTeam.suspensionReason}
                  </p>
                  <p className="mt-1 text-xs text-red-600">
                    Suspended at: {new Date(selectedTeam.suspendedAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Suspend Modal */}
      <Dialog open={showSuspendModal} onOpenChange={setShowSuspendModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suspend Team</DialogTitle>
            <DialogDescription>
              Enter the reason for suspending this team
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Suspension Reason</label>
              <textarea
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                placeholder="Enter reason for suspension..."
                rows={4}
                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowSuspendModal(false);
                  setSuspendReason("");
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleSuspendTeam}
                disabled={suspendingId !== null}
              >
                {suspendingId ? "Suspending..." : "Suspend Team"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
    </>
  );
};

export default TeamManagement;
