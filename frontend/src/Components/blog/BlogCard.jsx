import React from 'react';
import { Link } from 'react-router-dom';

const BlogCard = ({ blog }) => {
  return (
    <Link to={`/blog/${blog.slug}`} className="block bg-white shadow-md hover:shadow-xl rounded-lg overflow-hidden transition-all">
      <img src={blog.cover_image} alt={blog.title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2">{blog.title}</h2>
        <p className="text-sm text-gray-500 mb-1">{blog.category?.name}</p>
        <p className="text-gray-600 text-sm">{blog.excerpt || 'Read more...'}</p>
      </div>
    </Link>
  );
};

export default BlogCard;
