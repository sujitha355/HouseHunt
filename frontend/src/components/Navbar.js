import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">🏠 HouseHunt</Link>
        <div className="navbar-nav ms-auto">
          {user ? (
            <>
              <span className="navbar-text me-3">Welcome, {user.name}</span>
              <button className="btn btn-outline-light" onClick={onLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link className="nav-link" to="/login">Login</Link>
              <Link className="nav-link" to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
