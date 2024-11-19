import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
    const navigate = useNavigate();
    const [post, setPost] = useState({ title: '', content: '', imageUrl: '' });
  
    const handleSubmit = (e) => {
      e.preventDefault();
      const posts = JSON.parse(localStorage.getItem('posts') || '[]');
      const newPost = {
        ...post,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        upvotes: 0,
        comments: []
      };
      posts.push(newPost);
      localStorage.setItem('posts', JSON.stringify(posts));
      navigate('/');
    };
  
    return (
      <div className="create-post">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            required
            className="form-input"
            onChange={(e) => setPost({ ...post, title: e.target.value })}
          />
          <textarea
            placeholder="Content (Optional)"
            className="form-textarea"
            onChange={(e) => setPost({ ...post, content: e.target.value })}
          />
          <input
            type="url"
            placeholder="Image URL (Optional)"
            className="form-input"
            onChange={(e) => setPost({ ...post, imageUrl: e.target.value })}
          />
          <button className="button primary-button">Create Post</button>
        </form>
      </div>
    );
  };

export default CreatePost;