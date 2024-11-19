// src/components/PostList.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

const PostList = ({ searchTerm }) => {
  const [sortBy, setSortBy] = useState('newest');
  const posts = JSON.parse(localStorage.getItem('posts') || '[]');

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return b.upvotes - a.upvotes;
  });

  return (
    <div className="post-list">
      <div className="sort-buttons">
        <span>Sort by:</span>
        <button
          className={`button ${sortBy === 'newest' ? 'active' : ''}`}
          onClick={() => setSortBy('newest')}
        >
          Newest
        </button>
        <button
          className={`button ${sortBy === 'popular' ? 'active' : ''}`}
          onClick={() => setSortBy('popular')}
        >
          Most Popular
        </button>
      </div>
      {sortedPosts.map(post => (
        <Link key={post.id} to={`/post/${post.id}`} className="post-link">
          <div className="post-card">
            <h2>{post.title}</h2>
            <div className="post-meta">
              <span>Posted {new Date(post.createdAt).toLocaleString()}</span>
              <span>{post.upvotes} upvotes</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default PostList;