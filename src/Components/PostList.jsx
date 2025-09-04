// src/components/PostList.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPosts } from '../lib/postsApi';
import { useAuth } from '../AuthContext';

const PostList = ({ searchTerm }) => {
  const [sortBy, setSortBy] = useState('newest');
  const [posts, setPosts] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      const data = await fetchPosts({ 
        search: searchTerm, 
        sort: sortBy === 'popular' ? 'popular' : 'newest',
        userId: user?.id 
      });
      setPosts(data);
    })();
  }, [searchTerm, sortBy, user?.id]);

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
      {posts.map(post => (
        <Link key={post.id} to={`/post/${post.id}`} className="post-link">
          <div className="post-card">
            <h2>{post.title}</h2>
            <div className="post-meta">
              <span>Posted {new Date(post.created_at).toLocaleString()}</span>
              <span>{post.upvotes} upvotes</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default PostList;