import { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, Video, FileText, Trash2, Eye, X, Loader2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'sonner';
import { getApiUrl } from '../../../config/api';
import PageMeta from '../../../components/common/PageMeta';

interface SecureMedia {
  _id: string;
  title: string;
  description?: string;
  type: 'video' | 'pdf';
  mimeType: string;
  originalName: string;
  fileSize: number;
  duration?: number;
  thumbnail?: string;
  isActive: boolean;
  views: number;
  category?: string;
  tags: string[];
  accessLevel: 'public' | 'subscribers' | 'admin';
  uploadedBy: {
    _id: string;
    fname: string;
    lname: string;
  };
  createdAt: string;
}

export default function AdminMediaUpload() {
  const { token } = useAuth();
  const [media, setMedia] = useState<SecureMedia[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<SecureMedia | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'video' | 'pdf'>('all');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'video' as 'video' | 'pdf',
    category: '',
    tags: '',
    accessLevel: 'subscribers' as 'public' | 'subscribers' | 'admin',
    file: null as File | null,
  });

  useEffect(() => {
    fetchMedia();
  }, [filterType]);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (filterType !== 'all') params.type = filterType;

      const response = await axios.get(getApiUrl('/secure-media'), {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      const mediaData = response.data?.data?.media || response.data?.data || [];
      setMedia(Array.isArray(mediaData) ? mediaData : []);
    } catch (error: any) {
      console.error('Error fetching media:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch media');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const isVideo = file.type.startsWith('video/');
      const isPdf = file.type === 'application/pdf';

      if (!isVideo && !isPdf) {
        toast.error('Only video and PDF files are allowed');
        return;
      }

      setFormData(prev => ({
        ...prev,
        file,
        type: isVideo ? 'video' : 'pdf',
      }));
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.file) {
      toast.error('Please select a file');
      return;
    }

    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      const uploadFormData = new FormData();
      uploadFormData.append('file', formData.file);
      uploadFormData.append('title', formData.title);
      uploadFormData.append('description', formData.description);
      uploadFormData.append('type', formData.type);
      uploadFormData.append('category', formData.category);
      uploadFormData.append('tags', formData.tags);
      uploadFormData.append('accessLevel', formData.accessLevel);

      const response = await axios.post(
        getApiUrl('/secure-media/upload'),
        uploadFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 100)
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      if (response.data?.status === 1 || response.data?.success) {
        toast.success('Media uploaded and encrypted successfully!');
        setShowUploadModal(false);
        setFormData({
          title: '',
          description: '',
          type: 'video',
          category: '',
          tags: '',
          accessLevel: 'subscribers',
          file: null,
        });
        fetchMedia();
      }
    } catch (error: any) {
      console.error('Error uploading media:', error);
      toast.error(error.response?.data?.message || 'Failed to upload media');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this media? This action cannot be undone.')) {
      return;
    }

    try {
      await axios.delete(getApiUrl(`/secure-media/${id}`), {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Media deleted successfully');
      fetchMedia();
    } catch (error: any) {
      console.error('Error deleting media:', error);
      toast.error(error.response?.data?.message || 'Failed to delete media');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const filteredMedia = media.filter(m => {
    if (filterType === 'all') return true;
    return m.type === filterType;
  });

  return (
    <>
      <PageMeta 
        title="Media Library - ProNext Admin Panel" 
        description="Upload and manage secure media files including videos and PDFs" 
      />
      <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Secure Media Upload</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Upload encrypted videos and PDFs with download protection
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Upload Media
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        {['all', 'video', 'pdf'].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type as any)}
            className={`px-4 py-2 rounded-lg border transition ${
              filterType === type
                ? 'bg-brand-600 text-white border-brand-600'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:border-brand-600'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No media found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredMedia.map((item) => (
            <div
              key={item._id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              <div className="aspect-video bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                {item.type === 'video' ? (
                  <Video className="w-16 h-16 text-brand-600" />
                ) : (
                  <FileText className="w-16 h-16 text-red-600" />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                  {item.description || 'No description'}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                  <span>{formatFileSize(item.fileSize)}</span>
                  <span>{item.views} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedMedia(item)}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-sm flex items-center justify-center gap-1 hover:bg-blue-700"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                Upload Secure Media
              </h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="p-6 space-y-4">
              {/* File Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  File (Video or PDF) *
                </label>
                <input
                  type="file"
                  accept="video/*,application/pdf"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  required
                />
                {formData.file && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Selected: {formData.file.name} ({formatFileSize(formData.file.size)})
                  </p>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              {/* Category and Access Level */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Access Level
                  </label>
                  <select
                    value={formData.accessLevel}
                    onChange={(e) => setFormData(prev => ({ ...prev, accessLevel: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="subscribers">Subscribers Only</option>
                    <option value="public">Public</option>
                    <option value="admin">Admin Only</option>
                  </select>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="tutorial, advanced, beginner"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              {/* Upload Progress */}
              {uploading && (
                <div>
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>Uploading and encrypting...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-brand-600 h-2 rounded-full transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || !formData.file}
                  className="flex-1 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload & Encrypt
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Viewer Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedMedia.title}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedMedia.description}</p>
              </div>
              <button
                onClick={() => setSelectedMedia(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4">
              {selectedMedia.type === 'video' ? (
                <video
                  controls
                  controlsList="nodownload"
                  onContextMenu={(e) => e.preventDefault()}
                  className="w-full rounded-lg"
                  autoPlay
                >
                  <source 
                    src={getApiUrl(`/secure-media/${selectedMedia._id}/stream?token=${token}`)}
                    type={selectedMedia.mimeType}
                  />
                  Your browser does not support video playback.
                </video>
              ) : (
                <iframe
                  src={getApiUrl(`/secure-media/${selectedMedia._id}/stream?token=${token}`)}
                  className="w-full h-[600px] rounded-lg"
                  title={selectedMedia.title}
                />
              )}
              
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">File Size:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{formatFileSize(selectedMedia.fileSize)}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Views:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{selectedMedia.views}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Access Level:</span>
                  <span className="ml-2 text-gray-900 dark:text-white capitalize">{selectedMedia.accessLevel}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Uploaded:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">
                    {new Date(selectedMedia.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
