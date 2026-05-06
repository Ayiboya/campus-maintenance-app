import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Wrench, Home, Settings } from 'lucide-react';
import './Navbar.css'; // I will add styles in index.css instead, wait, let's just use index.css for everything to keep it simple, or styled components. I will use class names.

const Navbar = () => {
  return (
    <nav className="navbar glass-panel">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Wrench className="brand-icon" />
          <span className="text-gradient brand-text">CampusFix</span>
        </div>
        <div className="navbar-links">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            <Home size={18} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/report" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            <Wrench size={18} />
            <span>Report Issue</span>
          </NavLink>
          <NavLink to="/maintenance" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            <Settings size={18} />
            <span>Admin</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
