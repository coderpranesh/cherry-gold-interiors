import React, { useEffect, useState } from 'react';
import { fetchAllBlogs } from '../api/blogAPI';
import BlogCard from '../Components/blog/BlogCard';

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const data = await fetchAllBlogs();
        setBlogs(data.results || []);
      } catch (err) {
        console.error('Error fetching blogs:', err);
      }
    };

    loadBlogs();
  }, []);

  return (
    <div className="px-6 py-10 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Latest Blog Posts</h1>
      {blogs.length === 0 ? (
        <p>No blog posts found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogPage;
