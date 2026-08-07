import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import './Navbar.css';

function CompassMark() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <circle cx="13" cy="13" r="11.5" stroke="var(--brass)" strokeWidth="1.5" />
      <path d="M13 5.5L15.4 11.6L21.5 13L15.4 14.4L13 20.5L10.6 14.4L4.5 13L10.6 11.6L13 5.5Z" fill="var(--brass)" />
    </svg>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const publicLinks = [
    { to: '/', label: 'Home' },
    { to: '/explore', label: 'Explore roadmaps' },
  ];

  const privateLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/explore', label: 'Explore' },
    { to: '/roadmaps/new', label: 'Build a roadmap' },
    { to: '/profile', label: 'Profile' },
  ];

  const links = user ? privateLinks : publicLinks;

  return (
    <header className="nav">
      <div className="nav-inner container">
        <Link to={user ? '/dashboard' : '/'} className="nav-brand">
          <CompassMark />
          <span>CareerCompass</span>
        </Link>

        <nav className={`nav-links ${open ? 'nav-links-open' : ''}`}>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav-actions">
          {user ? (
            <>
              <span className="nav-user" title={user.email}>
                <span className="nav-avatar" style={{ background: user.avatarColor }}>
                  {user.name?.[0]?.toUpperCase() || '?'}
                </span>
                {user.name}
              </span>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Sign in</Link>
              <Link to="/register" className="btn btn-brass btn-sm">Get started</Link>
            </>
          )}
        </div>

        <button
          className="nav-toggle"
          aria-label="Toggle navigation menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>
      </div>
    </header>
  );
}
