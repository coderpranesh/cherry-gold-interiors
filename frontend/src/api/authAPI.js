import axios from './axiosInstance';

const AuthAPI = {
  // Register new user with email verification
  register: async (data) => {
    try {
      const res = await axios.post('auth/register/', data);
      return res.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Login user
  login: async (data) => {
    try {
      const res = await axios.post('auth/login/', data);
      
      // Store tokens and user data
      if (res.data.access) {
        localStorage.setItem('accessToken', res.data.access);
        localStorage.setItem('access_token', res.data.access); // Legacy support
      }
      if (res.data.refresh) {
        localStorage.setItem('refreshToken', res.data.refresh);
        localStorage.setItem('refresh_token', res.data.refresh); // Legacy support
      }
      if (res.data.user) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }
      
      return res.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Verify email OTP
  verifyEmailOTP: async (data) => {
    try {
      const res = await axios.post('auth/verify-email/', data);
      
      // Store tokens if auto-login is enabled
      if (res.data.access) {
        localStorage.setItem('accessToken', res.data.access);
        localStorage.setItem('access_token', res.data.access);
      }
      if (res.data.refresh) {
        localStorage.setItem('refreshToken', res.data.refresh);
        localStorage.setItem('refresh_token', res.data.refresh);
      }
      if (res.data.user) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }
      
      return res.data;
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    }
  },

  // Resend email OTP
  resendEmailOTP: async (data) => {
    try {
      const res = await axios.post('auth/resend-email-otp/', data);
      return res.data;
    } catch (error) {
      console.error('Resend OTP error:', error);
      throw error;
    }
  },

  // Get referral dashboard
  getReferrals: async () => {
    try {
      const res = await axios.get('auth/referrals/dashboard/');
      return res.data;
    } catch (error) {
      console.error('Get referrals error:', error);
      throw error;
    }
  },

  // Request withdrawal
  requestWithdrawal: async (data) => {
    try {
      const res = await axios.post('auth/withdrawals/', data);
      return res.data;
    } catch (error) {
      console.error('Withdrawal request error:', error);
      throw error;
    }
  },

  // Validate referral code
  validateReferral: async (code) => {
    try {
      const res = await axios.get('auth/referrals/validate/', {
        params: { code }
      });
      return res.data;
    } catch (error) {
      console.error('Referral validation error:', error);
      throw error;
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      const res = await axios.get('auth/profile/');
      return res.data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (data) => {
    try {
      const res = await axios.patch('auth/profile/', data);
      return res.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  // Change password
  changePassword: async (data) => {
    try {
      const res = await axios.post('auth/change-password/', data);
      return res.data;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  },

  // Refresh access token
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken') || 
                          localStorage.getItem('refresh_token');
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const res = await axios.post('auth/token/refresh/', {
        refresh: refreshToken
      });
      
      // Update stored tokens
      if (res.data.access) {
        localStorage.setItem('accessToken', res.data.access);
        localStorage.setItem('access_token', res.data.access);
      }
      
      return res.data;
    } catch (error) {
      console.error('Token refresh error:', error);
      
      // Clear tokens on refresh failure
      AuthAPI.logout();
      throw error;
    }
  },

  // Verify token
  verifyToken: async () => {
    try {
      const accessToken = localStorage.getItem('accessToken') || 
                         localStorage.getItem('access_token');
      
      if (!accessToken) {
        return false;
      }

      const res = await axios.post('auth/token/verify/', {
        token: accessToken
      });
      
      return res.status === 200;
    } catch (error) {
      console.error('Token verification error:', error);
      return false;
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const accessToken = localStorage.getItem('accessToken') || 
                       localStorage.getItem('access_token');
    const user = localStorage.getItem('user');
    return !!(accessToken && user);
  },

  // Get current user
  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  // Get access token
  getAccessToken: () => {
    return localStorage.getItem('accessToken') || 
           localStorage.getItem('access_token');
  },

  // Set user data
  setUser: (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
  },

  // Update user data partially
  updateUserData: (updates) => {
    try {
      const currentUser = AuthAPI.getCurrentUser();
      if (currentUser) {
        const updatedUser = { ...currentUser, ...updates };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
      }
      return null;
    } catch (error) {
      console.error('Update user data error:', error);
      return null;
    }
  },

  // Logout user
  logout: () => {
    // Clear all auth-related items
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('pending_verification_email');
    
    // Optional: Call backend logout endpoint if needed
    // axios.post('auth/logout/');
  },

  // Admin: Delete user
  adminDeleteUser: async (userId) => {
    try {
      const res = await axios.delete(`auth/admin/delete-user/${userId}/`);
      return res.data;
    } catch (error) {
      console.error('Admin delete user error:', error);
      throw error;
    }
  },

  // Validate bank details
  validateBankDetails: async (data) => {
    try {
      const res = await axios.post('auth/withdrawals/validate-bank/', data);
      return res.data;
    } catch (error) {
      console.error('Bank validation error:', error);
      throw error;
    }
  },

  // Get withdrawal history
  getWithdrawals: async () => {
    try {
      const res = await axios.get('auth/withdrawals/');
      return res.data;
    } catch (error) {
      console.error('Get withdrawals error:', error);
      throw error;
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const res = await axios.get('auth/health/');
      return res.data;
    } catch (error) {
      console.error('Health check error:', error);
      throw error;
    }
  },

  // Forgot password (if implemented)
  forgotPassword: async (email) => {
    try {
      const res = await axios.post('auth/forgot-password/', { email });
      return res.data;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  },

  // Reset password (if implemented)
  resetPassword: async (data) => {
    try {
      const res = await axios.post('auth/reset-password/', data);
      return res.data;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  },

  // Check if email exists (for registration)
  checkEmailExists: async (email) => {
    try {
      const res = await axios.post('auth/check-email/', { email });
      return res.data;
    } catch (error) {
      console.error('Check email error:', error);
      throw error;
    }
  },

  // Check if username exists (for registration)
  checkUsernameExists: async (username) => {
    try {
      const res = await axios.post('auth/check-username/', { username });
      return res.data;
    } catch (error) {
      console.error('Check username error:', error);
      throw error;
    }
  }
};

// Add response interceptor for token refresh
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh token
        await AuthAPI.refreshToken();
        
        // Retry the original request
        return axios(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        AuthAPI.logout();
        
        // Redirect to login if we're not already there
        if (!window.location.pathname.includes('/login') && 
            !window.location.pathname.includes('/register')) {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default AuthAPI;