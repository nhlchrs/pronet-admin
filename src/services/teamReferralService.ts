import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Set auth token
export const setAuthToken = (token: string) => {
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common['Authorization'];
  }
};

// Team/Referral API Service
export const teamReferralService = {
  // Get all team members
  getAllMembers: async () => {
    const response = await axiosInstance.get('/team/members');
    return response.data;
  },

  // Get team statistics
  getStatistics: async () => {
    const response = await axiosInstance.get('/team/statistics');
    return response.data;
  },

  // Create team member
  createMember: async (data: any) => {
    const response = await axiosInstance.post('/team/create-member', data);
    return response.data;
  },

  // Set sponsor/upline
  setSponsor: async (userId: string, sponsorId: string) => {
    const response = await axiosInstance.post('/team/set-sponsor', {
      userId,
      sponsorId,
    });
    return response.data;
  },

  // Get team network tree
  getNetworkTree: async (userId: string) => {
    const response = await axiosInstance.get(`/team/network/${userId}`);
    return response.data;
  },

  // Update team member
  updateMember: async (userId: string, data: any) => {
    const response = await axiosInstance.put(`/team/member/${userId}`, data);
    return response.data;
  },

  // Delete team member
  deleteMember: async (userId: string) => {
    const response = await axiosInstance.delete(`/team/member/${userId}`);
    return response.data;
  },

  // Get team dashboard (for user)
  getDashboard: async (userId: string) => {
    const response = await axiosInstance.get(`/team/dashboard/${userId}`);
    return response.data;
  },

  // Get team members for a user
  getTeamMembers: async (userId: string, page: number = 1, limit: number = 10) => {
    const response = await axiosInstance.get(`/team/${userId}/members`, {
      params: { page, limit },
    });
    return response.data;
  },

  // Get referral history
  getReferralHistory: async (userId: string, page: number = 1, limit: number = 10) => {
    const response = await axiosInstance.get(`/team/${userId}/referrals`, {
      params: { page, limit },
    });
    return response.data;
  },

  // Get bonus history
  getBonusHistory: async (userId: string, page: number = 1, limit: number = 10) => {
    const response = await axiosInstance.get(`/team/${userId}/bonuses`, {
      params: { page, limit },
    });
    return response.data;
  },

  // Get commission details
  getCommissions: async (userId: string) => {
    const response = await axiosInstance.get(`/team/${userId}/commissions`);
    return response.data;
  },

  // Request payout
  requestPayout: async (userId: string, amount: number) => {
    const response = await axiosInstance.post(`/team/${userId}/payout`, {
      amount,
    });
    return response.data;
  },

  // Update user level
  updateLevel: async (userId: string) => {
    const response = await axiosInstance.post(`/team/${userId}/update-level`);
    return response.data;
  },

  // Get leaderboard
  getLeaderboard: async (limit = 10) => {
    const response = await axiosInstance.get('/team/leaderboard', {
      params: { limit },
    });
    return response.data;
  },

  // Process bonuses
  processBonuses: async (userId: string) => {
    const response = await axiosInstance.post(`/team/${userId}/process-bonuses`);
    return response.data;
  },

  // Validate referral code
  validateReferralCode: async (code: string) => {
    const response = await axiosInstance.post('/team/validate-referral-code', {
      code,
    });
    return response.data;
  },

  // Apply referral code
  applyReferralCode: async (code: string) => {
    const response = await axiosInstance.post('/team/apply-referral-code', {
      code,
    });
    return response.data;
  },

  // Get my referral code and info
  getMyReferralCode: async () => {
    const response = await axiosInstance.get('/team/my-referral-code');
    return response.data;
  },

  // Get my referrals
  getMyReferrals: async (page = 1, limit = 10) => {
    const response = await axiosInstance.get('/team/my-referrals', {
      params: { page, limit },
    });
    return response.data;
  },

  // Get downline structure/hierarchy (Admin version - can view any user)
  getDownlineStructure: async (userId: string, depth: number = 10) => {
    try {
      console.log(`[Service] Fetching downline structure for userId: ${userId}, depth: ${depth}`);
      // Use admin endpoint for viewing any user's hierarchy
      const response = await axiosInstance.get(`/admin/team/downline-structure/${userId}`, {
        params: { depth },
      });
      console.log('[Service] Response received:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('[Service] Error fetching downline structure:', error.response?.data || error.message);
      throw error;
    }
  },
};

export default teamReferralService;
