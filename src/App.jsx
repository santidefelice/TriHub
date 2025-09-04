// src/App.jsx
import { useState } from 'react';
import { Link, Route, BrowserRouter as Router, Routes, Navigate } from 'react-router-dom';
import CreatePost from './Components/CreatePost';
import PostDetail from './Components/PostDetail';
import PostList from './Components/PostList';
import SignIn from './Components/SignIn';
import Profile from './Components/Profile';
import { AuthProvider, useAuth } from './AuthContext';
import './styles.css';

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <header className="header">
            <div className="header-left">
              <Link to="/" className="title">Triathlon Hub</Link>
            </div>
            <div className="header-center">
              <input
                type="text"
                placeholder="Search posts..."
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="header-right">
              <Link to="/create" className="create-button">Create Post</Link>
              <AuthStatus />
            </div>
          </header>
          <main className="main-content">
            <Routes>
              <Route path="/" element={<PostList searchTerm={searchTerm} />} />
              <Route path="/create" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
              <Route path="/post/:id" element={<PostDetail />} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/signin" replace />;
  return children;
};

const AuthStatus = () => {
  const { user, signOut } = useAuth();
  if (!user) return <Link to="/signin" className="create-button">Sign In</Link>;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Link to="/profile" className="create-button" style={{ background: 'transparent', color: 'var(--accent-color)' }}>
        Hi, {user.username}
      </Link>
      <button className="create-button" onClick={signOut}>Logout</button>
    </div>
  );
};

export default App;