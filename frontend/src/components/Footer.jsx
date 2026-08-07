import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer-inner">
        <div>
          <div className="nav-brand" style={{ marginBottom: 6 }}>CareerCompass</div>
          <p className="hint">Plan your career, one waypoint at a time.</p>
        </div>
        <div className="footer-links">
          <Link to="/explore">Explore roadmaps</Link>
          <Link to="/register">Create an account</Link>
          <Link to="/login">Sign in</Link>
        </div>
        <p className="hint">Built by Abir · DIU Cyber Security Centre</p>
      </div>
    </footer>
  );
}
