import axios from './axiosInstance';

export const trackProject = async (code) => {
  const res = await axios.get(`projects/track/?code=${code}`);
  return res.data;
};
