
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { 
  Users, DollarSign, Lock, Calendar, CheckCircle, Bell
} from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../../context/AuthContext';
import { useSocket } from '../../../context/SocketContext';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { socket } = useSocket();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    suspendedUsers: 0,
    totalRevenue: 0,
    totalMeetings: 0,
    upcomingMeetings: 0,
    completedMeetings: 0,
    usersWithMeetings: 0,
    totalAnnouncements: 0,
    activeAnnouncements: 0,
  });
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [recentMeetings, setRecentMeetings] = useState<any[]>([]);

  useEffect(() => {
    const authToken = localStorage.getItem("token");
    if (!authToken) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  // Socket listener for real-time announcement updates
  useEffect(() => {
    if (!socket) return;

    socket.on('announcement_created', (data) => {
      console.log('📊 Admin Dashboard: New announcement created', data);
      setStats((prev) => ({
        ...prev,
        totalAnnouncements: prev.totalAnnouncements + 1,
        activeAnnouncements: data.announcementData?.isActive ? prev.activeAnnouncements + 1 : prev.activeAnnouncements,
      }));
    });

    socket.on('announcement_deleted', (data) => {
      console.log('📊 Admin Dashboard: Announcement deleted', data);
      setStats((prev) => ({
        ...prev,
        totalAnnouncements: Math.max(0, prev.totalAnnouncements - 1),
      }));
    });

    return () => {
      socket.off('announcement_created');
      socket.off('announcement_deleted');
    };
  }, [socket]);

  const fetchDashboardData = async () => {
    try {
      // Fetch users data
      const usersResponse = await axios.get('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log('Users Response:', usersResponse.data);
      
      let users = [];
      // API returns { users, pagination }
      if (usersResponse.data.users && Array.isArray(usersResponse.data.users)) {
        users = usersResponse.data.users;
      } else if (Array.isArray(usersResponse.data)) {
        users = usersResponse.data;
      } else if (usersResponse.data.data && Array.isArray(usersResponse.data.data)) {
        users = usersResponse.data.data;
      }
      
      console.log('Parsed Users:', users);
      
      const totalUsers = users.length;
      const activeUsers = users.filter((u: any) => !u.isSuspended).length;
      const suspendedUsers = users.filter((u: any) => u.isSuspended).length;
      const totalRevenue = users.filter((u: any) => u.subscriptionStatus).length * 100;

      // Get recent users (last 4)
      const recent = users.slice(-4).reverse();
      setRecentUsers(recent);

      // Fetch meetings data
      let totalMeetings = 0;
      let upcomingMeetings = 0;
      let completedMeetings = 0;
      let usersWithMeetings = 0;
      let recentMeetingsData: any[] = [];

      try {
        const meetingsResponse = await axios.get('http://localhost:5000/api/admin/meetings', {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        console.log('Meetings Response:', meetingsResponse.data);
        
        let meetings = [];
        // API returns { meetings, pagination }
        if (meetingsResponse.data.meetings && Array.isArray(meetingsResponse.data.meetings)) {
          meetings = meetingsResponse.data.meetings;
        } else if (Array.isArray(meetingsResponse.data)) {
          meetings = meetingsResponse.data;
        } else if (meetingsResponse.data.data && Array.isArray(meetingsResponse.data.data)) {
          meetings = meetingsResponse.data.data;
        }
        
        console.log('Parsed Meetings:', meetings);
        
        totalMeetings = meetings.length;
        
        const now = new Date();
        upcomingMeetings = meetings.filter((m: any) => new Date(m.scheduledTime) > now).length;
        completedMeetings = meetings.filter((m: any) => new Date(m.scheduledTime) <= now).length;
        
        // Calculate unique users with meetings
        const uniqueUserIds = new Set(meetings.map((m: any) => m.userId || m.organizedBy).filter(Boolean));
        usersWithMeetings = uniqueUserIds.size;
        
        // Get recent meetings (last 4)
        recentMeetingsData = meetings.slice(-4).reverse();
        setRecentMeetings(recentMeetingsData);
      } catch (error) {
        console.error('Error fetching meetings data:', error);
      }

      // Fetch announcements data
      let totalAnnouncements = 0;
      let activeAnnouncements = 0;
      try {
        const announcementsResponse = await axios.get('http://localhost:5000/api/announcements', {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        console.log('Announcements Response:', announcementsResponse.data);
        
        let announcements = [];
        if (announcementsResponse.data.data?.announcements && Array.isArray(announcementsResponse.data.data.announcements)) {
          announcements = announcementsResponse.data.data.announcements;
        } else if (Array.isArray(announcementsResponse.data)) {
          announcements = announcementsResponse.data;
        } else if (announcementsResponse.data.data && Array.isArray(announcementsResponse.data.data)) {
          announcements = announcementsResponse.data.data;
        }
        
        totalAnnouncements = announcements.length;
        activeAnnouncements = announcements.filter((a: any) => a.isActive).length;
      } catch (error) {
        console.error('Error fetching announcements data:', error);
      }

      console.log('Setting stats:', {
        totalUsers,
        activeUsers,
        suspendedUsers,
        totalRevenue,
        totalMeetings,
        upcomingMeetings,
        completedMeetings,
        usersWithMeetings,
        totalAnnouncements,
        activeAnnouncements,
      });

      setStats({
        totalUsers,
        activeUsers,
        suspendedUsers,
        totalRevenue,
        totalMeetings,
        upcomingMeetings,
        completedMeetings,
        usersWithMeetings,
        totalAnnouncements,
        activeAnnouncements,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Debug Info */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-100">
          Debug: Users: {stats.totalUsers} | Meetings: {stats.totalMeetings} | Token: {token ? 'Yes' : 'No'}
        </p>
      </div>

      {/* User Statistics */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-sm font-medium">
                <span>Total Users</span>
                <Users className="h-5 w-5 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-sm font-medium">
                <span>Active Users</span>
                <Users className="h-5 w-5 text-green-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.activeUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-sm font-medium">
                <span>Suspended Users</span>
                <Lock className="h-5 w-5 text-red-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.suspendedUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-sm font-medium">
                <span>Subscription Revenue</span>
                <DollarSign className="h-5 w-5 text-emerald-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">${stats.totalRevenue.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Announcement Statistics */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Announcement Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-sm font-medium">
                <span>Total Announcements</span>
                <Bell className="h-5 w-5 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalAnnouncements}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-sm font-medium">
                <span>Active Announcements</span>
                <Bell className="h-5 w-5 text-green-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.activeAnnouncements}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Meeting Statistics */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Meeting Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-sm font-medium">
                <span>Total Meetings</span>
                <Calendar className="h-5 w-5 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalMeetings}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-sm font-medium">
                <span>Upcoming Meetings</span>
                <Calendar className="h-5 w-5 text-blue-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.upcomingMeetings}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-sm font-medium">
                <span>Completed Meetings</span>
                <CheckCircle className="h-5 w-5 text-green-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completedMeetings}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-sm font-medium">
                <span>Users with Meetings</span>
                <Users className="h-5 w-5 text-purple-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {stats.usersWithMeetings}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Users and Meetings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentUsers.map((user: any, index: number) => (
                <div key={index} className="flex justify-between items-center pb-2 border-b last:border-b-0">
                  <div>
                    <p className="font-medium text-sm text-gray-900 dark:text-white">{user.fname} {user.lname}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.isSuspended ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100' : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100'
                    }`}>
                      {user.isSuspended ? 'Suspended' : 'Active'}
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/admin/users" className="block mt-4">
              <button className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-sm font-medium">
                View All Users
              </button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Recent Meetings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentMeetings.length > 0 ? (
                recentMeetings.map((meeting: any, index: number) => (
                  <div key={index} className="flex justify-between items-start pb-2 border-b last:border-b-0">
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-900 dark:text-white">{meeting.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {meeting.status || 'Scheduled'}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        new Date(meeting.scheduledTime) > new Date()
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100'
                          : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100'
                      }`}>
                        {new Date(meeting.scheduledTime) > new Date() ? 'Upcoming' : 'Completed'}
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(meeting.scheduledTime).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">No meetings scheduled</p>
              )}
            </div>
            <Link to="/admin/meetings" className="block mt-4">
              <button className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-sm font-medium">
                View All Meetings
              </button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* User Status Summary and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">User Status Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between pb-2 border-b">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Users</span>
                <span className="font-semibold text-gray-900 dark:text-white">{stats.totalUsers}</span>
              </div>
              <div className="flex justify-between pb-2 border-b">
                <span className="text-sm text-gray-600 dark:text-gray-400">Active Users</span>
                <span className="font-semibold text-green-600 dark:text-green-400">{stats.activeUsers}</span>
              </div>
              <div className="flex justify-between pb-2 border-b">
                <span className="text-sm text-gray-600 dark:text-gray-400">Suspended Users</span>
                <span className="font-semibold text-red-600 dark:text-red-400">{stats.suspendedUsers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Active Rate</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {stats.totalUsers > 0 ? ((stats.activeUsers / stats.totalUsers) * 100).toFixed(1) : 0}%
                </span>
              </div>
            </div>
            <Link to="/admin/users" className="block mt-4">
              <button className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-sm font-medium">
                Manage Users
              </button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Meeting Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between pb-2 border-b">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Meetings</span>
                <span className="font-semibold text-gray-900 dark:text-white">{stats.totalMeetings}</span>
              </div>
              <div className="flex justify-between pb-2 border-b">
                <span className="text-sm text-gray-600 dark:text-gray-400">Upcoming</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">{stats.upcomingMeetings}</span>
              </div>
              <div className="flex justify-between pb-2 border-b">
                <span className="text-sm text-gray-600 dark:text-gray-400">Completed</span>
                <span className="font-semibold text-green-600 dark:text-green-400">{stats.completedMeetings}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {stats.totalMeetings > 0 ? ((stats.completedMeetings / stats.totalMeetings) * 100).toFixed(1) : 0}%
                </span>
              </div>
            </div>
            <Link to="/admin/meetings" className="block mt-4">
              <button className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-sm font-medium">
                Manage Meetings
              </button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">System Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between pb-2 border-b">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Members</span>
                <span className="font-semibold text-gray-900 dark:text-white">{stats.totalUsers}</span>
              </div>
              <div className="flex justify-between pb-2 border-b">
                <span className="text-sm text-gray-600 dark:text-gray-400">Active Members</span>
                <span className="font-semibold text-green-600 dark:text-green-400">{stats.activeUsers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Suspended Members</span>
                <span className="font-semibold text-red-600 dark:text-red-400">{stats.suspendedUsers}</span>
              </div>
            </div>
            <Link to="/admin/users" className="block mt-4">
              <button className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-sm font-medium">
                View Users
              </button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link to="/admin/users">
                <button className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-sm font-medium text-left">
                  → Manage Users
                </button>
              </Link>
              <Link to="/admin/announcements">
                <button className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-sm font-medium text-left">
                  → Announcements
                </button>
              </Link>
              <Link to="/admin/meetings">
                <button className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-sm font-medium text-left">
                  → Meetings
                </button>
              </Link>
              <Link to="/admin/reports">
                <button className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-sm font-medium text-left">
                  → Reports
                </button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Platform Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm text-gray-600 dark:text-gray-400">System Status</span>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100">
                  Operational
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm text-gray-600 dark:text-gray-400">API Status</span>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100">
                  Active
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Data Sync</span>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100">
                  Real-time
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
