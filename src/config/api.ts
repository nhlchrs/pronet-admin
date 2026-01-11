// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

// Helper function to get full API URL
export const getApiUrl = (endpoint: string) => {
  // Remove /api prefix if endpoint already has it
  const cleanEndpoint = endpoint.startsWith('/api') ? endpoint.slice(4) : endpoint;
  // Ensure endpoint starts with /
  const formattedEndpoint = cleanEndpoint.startsWith('/') ? cleanEndpoint : `/${cleanEndpoint}`;
  return `${API_BASE_URL}${formattedEndpoint}`;
};

// Legacy support - returns base without /api
export const getBaseUrl = () => {
  return API_BASE_URL.replace('/api', '');
};
