import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { createPost } from "../lib/postsApi";

const CreatePost = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [post, setPost] = useState({ title: '', content: '', imageUrl: '' });
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      await createPost({ title: post.title, content: post.content, image_url: post.imageUrl }, user);
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