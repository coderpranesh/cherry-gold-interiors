import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchBlogBySlug } from '../api/blogAPI';

const BlogDetailPage = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const loadBlog = async () => {
      try {
        const data = await fetchBlogBySlug(slug);
        setBlog(data);
      } catch (err) {
        console.error('Error fetching blog:', err);
      }
    };

    loadBlog();
  }, [slug]);

  if (!blog) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
      <p className="text-gray-500 text-sm mb-2">{new Date(blog.published_date).toLocaleDateString()}</p>
      {blog.cover_image && (
        <img
          src={blog.cover_image}
          alt={blog.title}
          className="w-full h-auto rounded-lg mb-6"
        />
      )}
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: blog.content }} />
    </div>
  );
};

export default BlogDetailPage;
