import { API_BASE_URL } from '../config/api';

// Types
export interface DownloadResource {
  _id?: string;
  id?: string;
  title: string;
  category: string;
  date: string;
  fileType: string;
  fileSize: string;
  downloads: number;
  forLevel: string;
  description: string;
  fileUrl?: string;
  fileName?: string;
  uploadedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DownloadStats {
  totalResources: number;
  totalDownloads: number;
  totalCategories: number;
}

// Helper to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token') || '';
};

// Helper for API calls
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  const defaultHeaders: HeadersInit = {
    'Authorization': `Bearer ${token}`,
  };

  // Only add Content-Type if not FormData (FormData sets its own boundary)
  if (!(options.body instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Downloads API Service
export const downloadsService = {
  // Get all download resources
  getAllDownloads: async (): Promise<{ success: boolean; data: DownloadResource[] }> => {
    return apiCall('/downloads', {
      method: 'GET',
    });
  },

  // Get download stats
  getDownloadStats: async (): Promise<{ success: boolean; data: DownloadStats }> => {
    return apiCall('/downloads/stats', {
      method: 'GET',
    });
  },

  // Get single download by ID
  getDownloadById: async (id: string): Promise<{ success: boolean; data: DownloadResource }> => {
    return apiCall(`/downloads/${id}`, {
      method: 'GET',
    });
  },

  // Create new download resource
  createDownload: async (formData: FormData): Promise<{ success: boolean; data: DownloadResource; message: string }> => {
    return apiCall('/downloads', {
      method: 'POST',
      body: formData,
    });
  },

  // Update download resource
  updateDownload: async (id: string, formData: FormData): Promise<{ success: boolean; data: DownloadResource; message: string }> => {
    return apiCall(`/downloads/${id}`, {
      method: 'PUT',
      body: formData,
    });
  },

  // Delete download resource
  deleteDownload: async (id: string): Promise<{ success: boolean; message: string }> => {
    return apiCall(`/downloads/${id}`, {
      method: 'DELETE',
    });
  },

  // Track download
  trackDownload: async (id: string): Promise<{ success: boolean; message: string }> => {
    return apiCall(`/downloads/${id}/track`, {
      method: 'POST',
    });
  },

  // Download file
  downloadFile: async (id: string): Promise<Blob> => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/downloads/${id}/file`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to download file');
    }

    return response.blob();
  },
};
