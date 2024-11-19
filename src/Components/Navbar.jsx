// src/components/Navbar.jsx
import { Search } from 'lucide';
import { Link } from 'react-router-dom';

const Navbar = ({ onSearch }) => (
  <nav className="navbar">
    <Link to="/" className="logo">HistoryHub</Link>
    <div className="search-container">
      <div className="search-wrapper">
        <input
          type="text"
          placeholder="Search"
          onChange={(e) => onSearch(e.target.value)}
          className="search-input"
        />
        <Search className="search-icon" size={20} />
      </div>
    </div>
    <div className="nav-links">
      <Link to="/" className="nav-link">Home</Link>
      <Link to="/create" className="nav-link">Create New Post</Link>
    </div>
  </nav>
);

export default Navbar;