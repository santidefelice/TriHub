import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const PostDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [comment, setComment] = useState('');
    const [posts, setPosts] = useState(JSON.parse(localStorage.getItem('posts') || '[]'));
    const post = posts.find(p => p.id === parseInt(id));
    const [isEditing, setIsEditing] = useState(false);
    const [editedPost, setEditedPost] = useState(post);
  
    if (!post) return <div>Post not found</div>;
  
    const handleUpvote = () => {
      const updatedPosts = posts.map(p =>
        p.id === post.id ? { ...p, upvotes: p.upvotes + 1 } : p
      );
      setPosts(updatedPosts);
      localStorage.setItem('posts', JSON.stringify(updatedPosts));
    };
  
    const handleComment = (e) => {
      e.preventDefault();
      const updatedPosts = posts.map(p =>
        p.id === post.id
          ? { ...p, comments: [...p.comments, { id: Date.now(), text: comment }] }
          : p
      );
      setPosts(updatedPosts);
      localStorage.setItem('posts', JSON.stringify(updatedPosts));
      setComment('');
    };
  
    const handleDelete = () => {
      const updatedPosts = posts.filter(p => p.id !== post.id);
      localStorage.setItem('posts', JSON.stringify(updatedPosts));
      navigate('/');
    };
  
    const handleEdit = () => {
      const updatedPosts = posts.map(p =>
        p.id === post.id ? editedPost : p
      );
      localStorage.setItem('posts', JSON.stringify(updatedPosts));
      setPosts(updatedPosts);
      setIsEditing(false);
    };
  
    return (
      <div className="post-detail">
        {isEditing ? (
          <div className="post-edit">
            <input
              type="text"
              value={editedPost.title}
              onChange={(e) => setEditedPost({ ...editedPost, title: e.target.value })}
              className="form-input"
            />
            <textarea
              value={editedPost.content}
              onChange={(e) => setEditedPost({ ...editedPost, content: e.target.value })}
              className="form-textarea"
            />
            <input
              type="url"
              value={editedPost.imageUrl}
              onChange={(e) => setEditedPost({ ...editedPost, imageUrl: e.target.value })}
              className="form-input"
            />
            <div className="button-group">
              <button onClick={handleEdit} className="button primary-button">Save</button>
              <button onClick={() => setIsEditing(false)} className="button secondary-button">Cancel</button>
            </div>
          </div>
        ) : (
          <div className="post-content">
            <h1>{post.title}</h1>
            {post.imageUrl && (
              <img src={post.imageUrl} alt="Post" className="post-image" />
            )}
            {post.content && <p className="post-text">{post.content}</p>}
            <div className="button-group">
              <button onClick={handleUpvote} className="button primary-button">
                Upvote ({post.upvotes})
              </button>
              <button onClick={() => setIsEditing(true)} className="button edit-button">
                Edit
              </button>
              <button onClick={handleDelete} className="button delete-button">
                Delete
              </button>
            </div>
          </div>
        )}
  
        <div className="comments-section">
          <h2>Comments</h2>
          <form onSubmit={handleComment} className="comment-form">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Leave a comment..."
              className="form-textarea"
            />
            <button type="submit" className="button primary-button">Comment</button>
          </form>
          <div className="comments-list">
            {post.comments.map(comment => (
              <div key={comment.id} className="comment">
                {comment.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  export default PostDetail