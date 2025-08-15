import axios from './axiosInstance';

export const bookConsultation = async (formData) => {
  const res = await axios.post('services/consultation/', formData);
  return res.data;
};
