import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, Edit2, Trash2, Eye, X, Calendar, Users, Clock } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useConfirmation } from '../../../hooks/useConfirmation';
import { getApiUrl } from '../../../config/api';
import { toast } from 'sonner';
import PageMeta from '../../../components/common/PageMeta';

interface Meeting {
  _id: string;
  title: string;
  description: string;
  scheduledAt: string;
  duration: number;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  zoomLink: string;
  zoomPasscode?: string;
  allowedSubscriptionTiers: string[];
  maxAttendees?: number;
  totalAttendees: number;
  createdBy: { _id: string; fname: string; lname: string };
  topic?: string;
  tags: string[];
  isRecorded: boolean;
  isInstant: boolean;
  createdAt: string;
  meetingStartedAt?: string;
  meetingEndedAt?: string;
}

interface FormData {
  title: string;
  description: string;
  scheduledAt: string;
  duration: string;
  allowedSubscriptionTiers: string[];
  maxAttendees: string;
  topic: string;
  tags: string;
  isRecorded: boolean;
  isInstant: boolean;
}

export default function AdminMeetings() {
  const { token } = useAuth();
  const { confirm } = useConfirmation();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    scheduledAt: new Date().toISOString().split('T')[0],
    duration: '60',
    allowedSubscriptionTiers: ['Premium', 'Pro'],
    maxAttendees: '',
    topic: '',
    tags: '',
    isRecorded: false,
    isInstant: false,
  });

  // Fetch meetings
  useEffect(() => {
    if (!token) {
      console.warn('No token available, cannot fetch meetings');
      setLoading(false);
      return;
    }
    fetchMeetings();
  }, [token]);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching meetings with token:', token);
      const response = await axios.get(
        getApiUrl('/admin/meetings'),
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log('Meetings response:', response.data);

      if (response.data?.status === 1 || response.data?.success) {
        const meetingsData = response.data?.data?.meetings || response.data?.data || [];
        console.log('Setting meetings:', meetingsData);
        setMeetings(Array.isArray(meetingsData) ? meetingsData : []);
        console.log('Successfully loaded', meetingsData.length, 'meetings');
      } else {
        console.error('API response not successful:', response.data);
        setError('Failed to load meetings');
        toast.error('Failed to load meetings');
      }
    } catch (error: any) {
      console.error('Error fetching meetings:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to load meetings';
      setError(errorMsg);
      if (error.response?.status === 401) {
        toast.error('Your session has expired. Please login again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async () => {
    if (!formData.title.trim() || !formData.duration) {
      toast.error('Title and Duration are required!');
      return;
    }

    if (!formData.isInstant && !formData.scheduledAt) {
      toast.error('Scheduled date is required for non-instant meetings!');
      return;
    }

    try {
      const payload = {
        ...formData,
        duration: parseInt(formData.duration),
        maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : null,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      };

      if (isEditing && selectedMeeting) {
        // Update meeting
        const response = await axios.put(
          getApiUrl(`/admin/meeting/${selectedMeeting._id}`),
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data?.status === 1 || response.data?.success) {
          console.log('Meeting updated successfully');
          resetForm();
          await fetchMeetings();
          toast.success('Meeting updated successfully!');
        }
      } else {
        // Create meeting
        const response = await axios.post(
          getApiUrl('/admin/meeting/create'),
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data?.status === 1 || response.data?.success) {
          console.log('Meeting created successfully');
          resetForm();
          await fetchMeetings();
          toast.success('Meeting created successfully!');
        }
      }
    } catch (error: any) {
      console.error('Error saving meeting:', error);
      toast.error(error.response?.data?.message || 'Error saving meeting');
    }
  };

  const handleDelete = async (id: string) => {
    const meeting = meetings.find(m => m._id === id);
    if (!meeting) return;

    const confirmed = await confirm({
      title: 'Delete Meeting',
      message: `Are you sure you want to delete "${meeting.title}"?`,
      details: `Status: ${meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}`,
      confirmText: 'Delete Meeting',
      cancelText: 'Cancel',
      isDangerous: true,
    });

    if (!confirmed) return;

    try {
      const response = await axios.delete(
        getApiUrl(`/admin/meeting/${id}`),
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data?.status === 1 || response.data?.success) {
        console.log('Meeting deleted successfully');
        await fetchMeetings();
        toast.success('Meeting deleted successfully!');
      }
    } catch (error: any) {
      console.error('Error deleting meeting:', error);
      toast.error(error.response?.data?.message || 'Error deleting meeting');
    }
  };

  const handleStartMeeting = async (meetingId: string) => {
    try {
      const response = await axios.post(
        getApiUrl(`/admin/meeting/${meetingId}/start`),
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data?.status === 1 || response.data?.success) {
        await fetchMeetings();
        toast.success('Meeting started!');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error starting meeting');
    }
  };

  const handleEndMeeting = async (meetingId: string) => {
    try {
      const response = await axios.post(
        getApiUrl(`/admin/meeting/${meetingId}/end`),
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data?.status === 1 || response.data?.success) {
        await fetchMeetings();
        toast.success('Meeting ended!');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error ending meeting');
    }
  };

  const handleEdit = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setFormData({
      title: meeting.title,
      description: meeting.description,
      scheduledAt: meeting.scheduledAt.split('T')[0],
      duration: meeting.duration.toString(),
      allowedSubscriptionTiers: meeting.allowedSubscriptionTiers,
      maxAttendees: meeting.maxAttendees?.toString() || '',
      topic: meeting.topic || '',
      tags: meeting.tags.join(', '),
      isRecorded: meeting.isRecorded,
      isInstant: meeting.isInstant,
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleView = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setShowViewModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      scheduledAt: new Date().toISOString().split('T')[0],
      duration: '60',
      allowedSubscriptionTiers: ['Premium', 'Pro'],
      maxAttendees: '',
      topic: '',
      tags: '',
      isRecorded: false,
      isInstant: false,
    });
    setSelectedMeeting(null);
    setIsEditing(false);
    setShowModal(false);
  };

  const filteredMeetings = meetings.filter((meeting) => {
    const matchesSearch =
      meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || meeting.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'ongoing':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading meetings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg max-w-md">
          <p className="text-red-700 dark:text-red-400 font-semibold mb-4">Error Loading Meetings</p>
          <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              fetchMeetings();
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
        title="Meetings Management - ProNext Admin Panel" 
        description="Manage and monitor all meetings and webinars in the system" 
      />
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Meetings Management</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-brand-500 text-white px-4 py-2 rounded-lg hover:bg-brand-600"
        >
          <Plus className="w-5 h-5" />
          New Meeting
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search meetings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="all">All Status</option>
          <option value="scheduled">Scheduled</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Meetings Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                Title
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                Attendees
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredMeetings.length > 0 ? (
              filteredMeetings.map((meeting) => (
                <tr key={meeting._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{meeting.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {meeting.description.substring(0, 40)}...
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      {new Date(meeting.scheduledAt).toLocaleDateString()} {new Date(meeting.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4 inline mr-1" />
                      {meeting.duration} min
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${getStatusColor(meeting.status)}`}>
                      {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <Users className="w-4 h-4 inline mr-1" />
                      {meeting.totalAttendees} {meeting.maxAttendees ? `/ ${meeting.maxAttendees}` : ''}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleView(meeting)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
                        title="View"
                      >
                        <Eye className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </button>
                      {meeting.status === 'scheduled' && (
                        <>
                          <button
                            onClick={() => handleEdit(meeting)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
                            title="Edit"
                          >
                            <Edit2 className="w-5 h-5 text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleDelete(meeting._id)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5 text-red-600" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No meetings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[99999] p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {isEditing ? 'Edit Meeting' : 'Create New Meeting'}
              </h2>
              <button
                onClick={resetForm}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  placeholder="Enter meeting title"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white resize-none"
                  placeholder="Enter meeting description"
                />
              </div>

              {/* Instant Meeting Toggle */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isInstant}
                  onChange={(e) => setFormData({ ...formData, isInstant: e.target.checked })}
                  className="w-5 h-5"
                />
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  ⚡ Instant Meeting (starts immediately)
                </label>
              </div>

              {/* Date and Time (only for non-instant) */}
              {!formData.isInstant && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Scheduled Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.scheduledAt}
                    onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  />
                </div>
              )}

              {/* Duration and Topic */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Duration (minutes) *
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    min="15"
                    max="480"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    placeholder="60"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Topic
                  </label>
                  <input
                    type="text"
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    placeholder="e.g., Training, Webinar"
                  />
                </div>
              </div>

              {/* Subscription Tiers */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Allowed Subscription Tiers
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Basic', 'Premium', 'Pro', 'Free'].map((tier) => (
                    <label key={tier} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.allowedSubscriptionTiers.includes(tier)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              allowedSubscriptionTiers: [...formData.allowedSubscriptionTiers, tier],
                            });
                          } else {
                            setFormData({
                              ...formData,
                              allowedSubscriptionTiers: formData.allowedSubscriptionTiers.filter((t) => t !== tier),
                            });
                          }
                        }}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{tier}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Max Attendees */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Max Attendees (leave empty for unlimited)
                </label>
                <input
                  type="number"
                  value={formData.maxAttendees}
                  onChange={(e) => setFormData({ ...formData, maxAttendees: e.target.value })}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  placeholder="e.g., 100"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  placeholder="e.g., important, training, monthly"
                />
              </div>

              {/* Recording */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isRecorded}
                  onChange={(e) => setFormData({ ...formData, isRecorded: e.target.checked })}
                  className="w-5 h-5"
                />
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Record Meeting
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-900">
              <button
                onClick={resetForm}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateOrUpdate}
                className="flex-1 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600"
              >
                {isEditing ? 'Update Meeting' : 'Create Meeting'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedMeeting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[99999] p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {selectedMeeting.title}
              </h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Meeting Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {selectedMeeting.status.charAt(0).toUpperCase() + selectedMeeting.status.slice(1)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {selectedMeeting.duration} minutes
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Scheduled</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {new Date(selectedMeeting.scheduledAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Attendees</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {selectedMeeting.totalAttendees} {selectedMeeting.maxAttendees ? `/ ${selectedMeeting.maxAttendees}` : ''}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Description</p>
                <p className="text-gray-700 dark:text-gray-300">{selectedMeeting.description}</p>
              </div>

              {/* Zoom Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Zoom Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Meeting Link</p>
                    <a
                      href={selectedMeeting.zoomLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {selectedMeeting.zoomLink}
                    </a>
                  </div>
                  {selectedMeeting.zoomPasscode && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Passcode</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {selectedMeeting.zoomPasscode}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              {selectedMeeting.tags.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedMeeting.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-900">
              <button
                onClick={() => setShowViewModal(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
              >
                Close
              </button>
              {selectedMeeting.status === 'scheduled' && (
                <button
                  onClick={() => {
                    handleStartMeeting(selectedMeeting._id);
                    setShowViewModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Start Meeting
                </button>
              )}
              {selectedMeeting.status === 'ongoing' && (
                <button
                  onClick={() => {
                    handleEndMeeting(selectedMeeting._id);
                    setShowViewModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  End Meeting
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}