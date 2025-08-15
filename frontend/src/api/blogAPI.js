// src/api/blogAPI.js
import axios from './axiosInstance';

// Fetch all blog posts
export const fetchAllBlogs = async () => {
  const res = await axios.get('blog/posts/');
  return res.data;
};

// ✅ FIXED: Fetch a single blog post by slug
export const fetchBlogBySlug = async (slug) => {
  const res = await axios.get(`blog/posts/${slug}/`);
  return res.data;
};
