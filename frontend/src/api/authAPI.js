// src/api/AuthAPI.js
import axios from './axiosInstance';

const AuthAPI = {
  register: async (data) => {
    const res = await axios.post('auth/register/', data);
    return res.data;
  },

  login: async (data) => {
    const res = await axios.post('auth/login/', data);
    
    // Store both access and refresh tokens
    if (res.data.access) {
      localStorage.setItem('accessToken', res.data.access);
    }
    if (res.data.refresh) {
      localStorage.setItem('refreshToken', res.data.refresh);
    }
    localStorage.setItem('user', JSON.stringify(res.data.user));
    return res.data;
  },

  getReferrals: async () => {
    const res = await axios.get('auth/referrals/');
    return res.data;
  },

  requestWithdrawal: async (data) => {
    const res = await axios.post('auth/withdraw/', data);
    return res.data;
  },

  verifyOTP: async (data) => {
    const res = await axios.post('auth/verify-otp/', data);
    return res.data;
  },

  resendOTP: async (phone) => {
    const res = await axios.post('auth/resend-otp/', { phone });
    return res.data;
  },

  validateReferral: async (code) => {
    const res = await axios.get(`auth/validate-referral/?code=${code}`);
    return res.data;
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
};

export default AuthAPI;