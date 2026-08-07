import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import './Landing.css';

const FEATURES = [
  {
    title: 'Build your own roadmap',
    body: 'Start from a blank trail and add the exact waypoints your goal needs.',
    icon: '✎',
  },
  {
    title: 'Follow a curated roadmap',
    body: 'Pick a guide made for Cybersecurity, Data, or Web Development and follow it as-is.',
    icon: '⇢',
  },
  {
    title: 'Customize an existing roadmap',
    body: 'Take any curated guide and reorder, add, or drop waypoints to fit your pace.',
    icon: '⌁',
  },
  {
    title: 'Log progress daily',
    body: 'Leave a short note and a percentage for what you covered each day, per waypoint.',
    icon: '✓',
  },
  {
    title: 'Track everything in one view',
    body: 'See streaks, completion percentage, and time spent across every roadmap you run.',
    icon: '◔',
  },
  {
    title: 'Grow a skill profile',
    body: 'Every waypoint you complete quietly builds a skill graph tied to your profile.',
    icon: '◆',
  },
];

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="landing">
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <span className="eyebrow">Personalized career planning</span>
            <h1>
              Plan your career like a trail — <span className="hero-accent">one waypoint at a time.</span>
            </h1>
            <p className="hero-lead">
              CareerCompass turns "learn cybersecurity" or "become a data analyst" into a concrete route:
              pick a guide, build your own, track daily progress, and watch your skills accumulate.
            </p>
            <div className="hero-actions">
              <Link to={user ? '/dashboard' : '/register'} className="btn btn-primary">
                {user ? 'Go to your dashboard' : 'Start your roadmap — it\'s free'}
              </Link>
              <Link to="/explore" className="btn btn-ghost">Browse roadmaps</Link>
            </div>
          </div>
          <HeroTrail />
        </div>
      </section>

      <section className="container features">
        <div className="features-head">
          <span className="eyebrow">What you can do</span>
          <h2>Everything you need to stay on route</h2>
        </div>
        <div className="feature-grid">
          {FEATURES.map((f) => (
            <div key={f.title} className="feature-card card">
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p className="hint">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container how">
        <div className="features-head">
          <span className="eyebrow">How it works</span>
          <h2>Three steps to a working plan</h2>
        </div>
        <ol className="how-steps">
          <li>
            <span className="how-num">01</span>
            <div>
              <h4>Create your profile</h4>
              <p className="hint">Tell CareerCompass your interests and current skills.</p>
            </div>
          </li>
          <li>
            <span className="how-num">02</span>
            <div>
              <h4>Choose your route</h4>
              <p className="hint">Build a roadmap from scratch, follow a curated one, or customize it.</p>
            </div>
          </li>
          <li>
            <span className="how-num">03</span>
            <div>
              <h4>Log daily and track</h4>
              <p className="hint">Mark waypoints complete and leave a note — your dashboard tracks the rest.</p>
            </div>
          </li>
        </ol>
      </section>

      <section className="container cta-band">
        <div className="cta-band-inner card">
          <div>
            <h2>Ready to find your route?</h2>
            <p className="hint">Create a free account and set your first waypoint in under a minute.</p>
          </div>
          <Link to={user ? '/dashboard' : '/register'} className="btn btn-primary">
            {user ? 'Open dashboard' : 'Create free account'}
          </Link>
        </div>
      </section>
    </div>
  );
}

function HeroTrail() {
  return (
    <svg viewBox="0 0 260 320" className="hero-trail" role="presentation">
      <path
        d="M40 300 Q 90 250 60 200 Q 30 150 110 130 Q 190 110 150 60 Q 120 20 190 10"
        fill="none"
        stroke="var(--paper-line)"
        strokeWidth="3"
      />
      <path
        d="M40 300 Q 90 250 60 200 Q 30 150 110 130"
        fill="none"
        stroke="var(--trail)"
        strokeWidth="3"
      />
      {[
        [40, 300, true],
        [60, 200, true],
        [110, 130, true],
        [150, 60, false],
        [190, 10, false],
      ].map(([x, y, done], i) => (
        <circle key={i} cx={x} cy={y} r={done ? 9 : 7} fill={done ? 'var(--trail)' : '#fff'} stroke={done ? 'var(--trail)' : 'var(--slate)'} strokeWidth="2" />
      ))}
      <circle cx="190" cy="10" r="14" fill="none" stroke="var(--brass)" strokeWidth="2" strokeDasharray="3 3" />
    </svg>
  );
}
