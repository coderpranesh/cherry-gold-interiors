// src/api/portfolioAPI.js
import axios from './axiosInstance';

export const fetchPortfolioItems = async () => {
  const res = await axios.get('portfolio/items/');
  return res.data;
};

export const fetchPortfolioItemBySlug = async (slug) => {
  const res = await axios.get(`portfolio/items/${slug}/`);
  return res.data;
};


