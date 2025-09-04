import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { addComment, deletePost as apiDeletePost, fetchPostById, updatePost as apiUpdatePost, toggleUpvote } from "../lib/postsApi";

const PostDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [comment, setComment] = useState('');
    const [post, setPost] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedPost, setEditedPost] = useState(null);

    useEffect(() => {
      (async () => {
        const data = await fetchPostById(id, user?.id);
        setPost(data);
        setEditedPost({ title: data.title, content: data.content, image_url: data.image_url });
      })();
    }, [id, user?.id]);

    if (!post) return <div>Loading...</div>;
  
    const handleUpvote = async () => {
      if (!user) return;
      const result = await toggleUpvote(post.id, user.id);
      const refreshed = await fetchPostById(id, user.id);
      setPost(refreshed);
    };
  
    const handleComment = async (e) => {
      e.preventDefault();
      await addComment(post.id, comment, user);
      const refreshed = await fetchPostById(id, user?.id);
      setPost(refreshed);
      setComment('');
    };
  
    const handleDelete = async () => {
      await apiDeletePost(post.id);
      navigate('/');
    };
  
    const handleEdit = async () => {
      await apiUpdatePost(post.id, editedPost);
      const refreshed = await fetchPostById(id, user?.id);
      setPost(refreshed);
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
              value={editedPost.image_url || ''}
              onChange={(e) => setEditedPost({ ...editedPost, image_url: e.target.value })}
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
            {post.image_url && (
              <img src={post.image_url} alt="Post" className="post-image" />
            )}
            {post.content && <p className="post-text">{post.content}</p>}
            <div className="button-group">
              <button 
                onClick={handleUpvote} 
                className={`button ${post.has_upvoted ? 'upvoted-button' : 'primary-button'}`}
                disabled={!user}
              >
                {post.has_upvoted ? 'Upvoted' : 'Upvote'} ({post.upvotes})
              </button>
              {user && user.id === post.author_id && (
                <button onClick={() => setIsEditing(true)} className="button edit-button">
                  Edit
                </button>
              )}
              {user && user.id === post.author_id && (
                <button onClick={handleDelete} className="button delete-button">
                  Delete
                </button>
              )}
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
            <button type="submit" className="button primary-button" disabled={!user}>Comment</button>
          </form>
          <div className="comments-list">
            {(post.comments || []).map(c => (
              <div key={c.id} className="comment">
                {c.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  export default PostDetail