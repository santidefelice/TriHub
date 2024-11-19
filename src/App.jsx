// src/App.jsx
import { useState } from 'react';
import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import CreatePost from './Components/CreatePost';
import PostDetail from './Components/PostDetail';
import PostList from './Components/PostList';
import './styles.css';

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
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
          </div>
        </header>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<PostList searchTerm={searchTerm} />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/post/:id" element={<PostDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;