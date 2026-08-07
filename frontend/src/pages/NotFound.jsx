import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
      <span className="eyebrow">Off the map</span>
      <h1 style={{ fontSize: 40, margin: '10px 0 12px' }}>404 — this trail doesn't exist</h1>
      <p className="hint" style={{ marginBottom: 24 }}>Let's get you back on route.</p>
      <Link to="/" className="btn btn-primary">Back to home</Link>
    </div>
  );
}
