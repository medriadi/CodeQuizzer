import React, { useContext, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { auth, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const signOut = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="site-header">
      <nav className="nav-container" aria-label="Main navigation">
        <Link className="brand" to="/"><span className="brand-mark">&lt;/&gt;</span> CodeQuizzer</Link>
        <button className="nav-toggle" type="button" aria-label="Toggle navigation" onClick={() => setOpen((value) => !value)}>☰</button>
        <div className={`nav-links ${open ? 'nav-links-open' : ''}`}>
          <NavLink to="/quizzes">Explore</NavLink>
          {auth.isAuthenticated && <NavLink to="/leaderboard">Leaderboard</NavLink>}
          {auth.isAuthenticated ? (
            <>
              <NavLink to="/profile" className="nav-user">{auth.user?.username || 'Profile'}</NavLink>
              <button className="button button-ghost nav-action" onClick={signOut}>Sign out</button>
            </>
          ) : (
            <>
              <NavLink to="/login">Sign in</NavLink>
              <Link className="button button-small" to="/register">Get started</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
