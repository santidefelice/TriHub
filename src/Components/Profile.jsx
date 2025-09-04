import { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { fetchPosts } from '../lib/postsApi';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [biography, setBiography] = useState(user?.profile?.biography || '');
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setBiography(user.profile?.biography || '');
      loadUserPosts();
    }
  }, [user]);

  const loadUserPosts = async () => {
    try {
      const posts = await fetchPosts({ authorId: user.id });
      setUserPosts(posts);
    } catch (error) {
      console.error('Error loading user posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBiography = async () => {
    try {
      await updateProfile({ biography });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating biography:', error);
    }
  };

  if (!user) {
    return <div>Please sign in to view your profile.</div>;
  }

  return (
    <div className="post-detail">
      <div className="profile-header">
        <h1>Profile</h1>
        <div className="profile-info">
          <h2>Hi, {user.username}!</h2>
          <p className="profile-email">{user.email}</p>
        </div>
      </div>

      <div className="biography-section">
        <h3>Biography</h3>
        {isEditing ? (
          <div>
            <textarea
              value={biography}
              onChange={(e) => setBiography(e.target.value)}
              placeholder="Tell us about yourself..."
              className="form-textarea"
              rows={4}
            />
            <div className="button-group">
              <button onClick={handleSaveBiography} className="button primary-button">
                Save
              </button>
              <button 
                onClick={() => {
                  setBiography(user.profile?.biography || '');
                  setIsEditing(false);
                }} 
                className="button secondary-button"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="biography-text">
              {biography || 'No biography yet. Click edit to add one!'}
            </p>
            <button 
              onClick={() => setIsEditing(true)} 
              className="button edit-button"
            >
              Edit Biography
            </button>
          </div>
        )}
      </div>

      <div className="posts-section">
        <h3>Your Posts ({userPosts.length})</h3>
        {loading ? (
          <p>Loading your posts...</p>
        ) : userPosts.length === 0 ? (
          <p>You haven't created any posts yet.</p>
        ) : (
          <div className="user-posts-list">
            {userPosts.map(post => (
              <div key={post.id} className="user-post-item">
                <h4>{post.title}</h4>
                <p className="post-meta">
                  Posted {new Date(post.created_at).toLocaleString()} • {post.upvotes} upvotes
                </p>
                {post.content && (
                  <p className="post-preview">
                    {post.content.length > 100 
                      ? `${post.content.substring(0, 100)}...` 
                      : post.content
                    }
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
