
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, Edit2, Trash2, Eye, X } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'sonner';

interface Announcement {
  _id: string;
  title: string;
  description: string;
  type: 'announcement' | 'promotion' | 'news';
  flag: 'important' | 'promotional';
  priority: 'low' | 'medium' | 'high';
  isActive: boolean;
  views: number;
  clicks: number;
  startDate: string;
  endDate?: string;
  image?: string;
  tags: string[];
  actionUrl?: string;
  createdAt: string;
  createdBy: { _id: string; fname: string; lname: string };
}

interface FormData {
  title: string;
  description: string;
  type: 'announcement' | 'promotion' | 'news';
  flag: 'important' | 'promotional';
  priority: 'low' | 'medium' | 'high';
  isActive: boolean;
  startDate: string;
  endDate?: string;
  image?: string;
  tags: string;
  actionUrl?: string;
}

export default function AdminAnnouncements() {
  const { token } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    type: 'announcement',
    flag: 'important',
    priority: 'medium',
    isActive: true,
    startDate: new Date().toISOString().split('T')[0],
    tags: '',
  });

  // Fetch announcements
  useEffect(() => {
    if (!token) {
      console.warn('No token available, cannot fetch announcements');
      setLoading(false);
      return;
    }
    fetchAnnouncements();
  }, [token]);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching announcements with token:', token);
      const response = await axios.get(
        'http://localhost:5000/api/announcements',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log('Announcements response:', response.data);

      // Check for status: 1 or success: true (handle both formats)
      if (response.data?.status === 1 || response.data?.success) {
        // Extract announcements from nested structure
        const announcementsData = response.data?.data?.announcements || response.data?.data || [];
        console.log('Setting announcements:', announcementsData);
        setAnnouncements(Array.isArray(announcementsData) ? announcementsData : []);
        console.log('Successfully loaded', announcementsData.length, 'announcements');
      } else {
        console.error('API response not successful:', response.data);
        setError('Failed to load announcements');
        toast.error('Failed to load announcements');
      }
    } catch (error: any) {
      console.error('Error fetching announcements:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to load announcements';
      setError(errorMsg);
      if (error.response?.status === 401) {
        toast.error('Your session has expired. Please login again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Title and Description are required!');
      return;
    }

    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      };

      if (isEditing && selectedAnnouncement) {
        // Update announcement
        const response = await axios.put(
          `http://localhost:5000/api/announcements/${selectedAnnouncement._id}`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data?.status === 1 || response.data?.success) {
          console.log('Announcement updated successfully');
          resetForm();
          // Reload announcements in real-time
          await fetchAnnouncements();
          toast.success('Announcement updated successfully!');
        }
      } else {
        // Create announcement
        const response = await axios.post(
          'http://localhost:5000/api/announcements',
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data?.status === 1 || response.data?.success) {
          console.log('Announcement created successfully');
          resetForm();
          // Reload announcements in real-time
          await fetchAnnouncements();
          toast.success('Announcement created successfully!');
        }
      }
    } catch (error: any) {
      console.error('Error saving announcement:', error);
      toast.error(error.response?.data?.message || 'Error saving announcement');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/announcements/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data?.status === 1 || response.data?.success) {
        console.log('Announcement deleted successfully');
        // Reload announcements in real-time
        await fetchAnnouncements();
        toast.success('Announcement deleted successfully!');
      }
    } catch (error: any) {
      console.error('Error deleting announcement:', error);
      toast.error(error.response?.data?.message || 'Error deleting announcement');
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      description: announcement.description,
      type: announcement.type,
      flag: announcement.flag,
      priority: announcement.priority,
      isActive: announcement.isActive,
      startDate: announcement.startDate.split('T')[0],
      endDate: announcement.endDate?.split('T')[0],
      image: announcement.image,
      tags: announcement.tags.join(', '),
      actionUrl: announcement.actionUrl,
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleView = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setShowViewModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'announcement',
      flag: 'important',
      priority: 'medium',
      isActive: true,
      startDate: new Date().toISOString().split('T')[0],
      tags: '',
    });
    setSelectedAnnouncement(null);
    setIsEditing(false);
    setShowModal(false);
  };

  const filteredAnnouncements = announcements.filter((ann) => {
    const matchesSearch =
      ann.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ann.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || ann.type === filterType;
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading announcements...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg max-w-md">
          <p className="text-red-700 dark:text-red-400 font-semibold mb-4">Error Loading Announcements</p>
          <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              fetchAnnouncements();
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Announcements</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-brand-500 text-white px-4 py-2 rounded-lg hover:bg-brand-600"
        >
          <Plus className="w-5 h-5" />
          New Announcement
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search announcements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="all">All Types</option>
          <option value="announcement">Announcement</option>
          <option value="promotion">Promotion</option>
          <option value="news">News</option>
        </select>
      </div>

      {/* Announcements Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                Title
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                Type
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                Views
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredAnnouncements.length > 0 ? (
              filteredAnnouncements.map((ann) => (
                <tr key={ann._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{ann.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {ann.description.substring(0, 50)}...
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded">
                      {ann.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                        ann.priority === 'high'
                          ? 'bg-red-100 text-red-800'
                          : ann.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {ann.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                        ann.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {ann.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {ann.views}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleView(ann)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
                        title="View"
                      >
                        <Eye className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </button>
                      <button
                        onClick={() => handleEdit(ann)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
                        title="Edit"
                      >
                        <Edit2 className="w-5 h-5 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(ann._id)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No announcements found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {isEditing ? 'Edit Announcement' : 'Create New Announcement'}
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
                  placeholder="Enter announcement title"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white resize-none"
                  placeholder="Enter announcement description"
                />
              </div>

              {/* Type and Flag */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  >
                    <option value="announcement">Announcement</option>
                    <option value="promotion">Promotion</option>
                    <option value="news">News</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Flag
                  </label>
                  <select
                    value={formData.flag}
                    onChange={(e) => setFormData({ ...formData, flag: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  >
                    <option value="important">Important</option>
                    <option value="promotional">Promotional</option>
                  </select>
                </div>
              </div>

              {/* Priority and Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-5 h-5"
                    />
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Active
                    </span>
                  </label>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.endDate || ''}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  />
                </div>
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
                  placeholder="e.g., important, urgent, system"
                />
              </div>

              {/* Action URL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Action URL
                </label>
                <input
                  type="url"
                  value={formData.actionUrl || ''}
                  onChange={(e) => setFormData({ ...formData, actionUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  placeholder="https://example.com"
                />
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
                {isEditing ? 'Update Announcement' : 'Create Announcement'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedAnnouncement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {selectedAnnouncement.title}
              </h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Image */}
              {selectedAnnouncement.image && (
                <img
                  src={selectedAnnouncement.image}
                  alt={selectedAnnouncement.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Type</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedAnnouncement.type}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Priority</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedAnnouncement.priority}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedAnnouncement.isActive ? 'Active' : 'Inactive'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Views</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedAnnouncement.views}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Created By</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedAnnouncement.createdBy?.fname} {selectedAnnouncement.createdBy?.lname}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Created At</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {new Date(selectedAnnouncement.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Description</p>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {selectedAnnouncement.description}
                </p>
              </div>

              {/* Tags */}
              {selectedAnnouncement.tags.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedAnnouncement.tags.map((tag, idx) => (
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

              {/* Action URL */}
              {selectedAnnouncement.actionUrl && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Action URL</p>
                  <a
                    href={selectedAnnouncement.actionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {selectedAnnouncement.actionUrl}
                  </a>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-900">
              <button
                onClick={() => setShowViewModal(false)}
                className="flex-1 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  handleEdit(selectedAnnouncement);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

