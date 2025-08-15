
import axios from './axiosInstance';

const AuthAPI = {
  register: async (data) => {
    const res = await axios.post('auth/register/', data);
    return res.data;
  },

  login: async (data) => {
    const res = await axios.post('auth/login/', data);
    localStorage.setItem('accessToken', res.data.access);
    localStorage.setItem('refreshToken', res.data.refresh);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    return res.data.user;
  },

  fetchProfile: async () => {
    const res = await axios.get('auth/profile/');
    return res.data;
  },

  verifyOTP: async (data) => {
    const res = await axios.post('auth/verify-otp/', data);
    return res.data;
  },

  resendOTP: async (email) => {
    const res = await axios.post('auth/resend-otp/', { email });
    return res.data;
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

};

export default AuthAPI;