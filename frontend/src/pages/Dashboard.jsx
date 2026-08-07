import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext.jsx';
import RoadmapCard from '../components/RoadmapCard.jsx';
import Loader from '../components/Loader.jsx';
import SkillTag from '../components/SkillTag.jsx';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const [roadmaps, setRoadmaps] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    Promise.all([
      client.get('/my-roadmaps'),
      client.get('/my-roadmaps/dashboard/summary'),
    ])
      .then(([roadmapsRes, summaryRes]) => {
        if (!mounted) return;
        setRoadmaps(roadmapsRes.data.roadmaps);
        setSummary(summaryRes.data);
      })
      .catch(() => setError('Could not load your dashboard right now.'))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  if (loading) return <Loader full label="Charting your dashboard" />;

  return (
    <div className="container dashboard">
      <div className="dashboard-head">
        <div>
          <span className="eyebrow">Welcome back</span>
          <h1>{user?.name?.split(' ')[0]}'s dashboard</h1>
        </div>
        <div className="dashboard-head-actions">
          <Link to="/explore" className="btn btn-ghost">Explore roadmaps</Link>
          <Link to="/roadmaps/new" className="btn btn-brass">+ New roadmap</Link>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {summary && (
        <div className="stat-grid">
          <div className="stat-card card">
            <span className="eyebrow">Streak</span>
            <strong>{summary.streakDays} day{summary.streakDays === 1 ? '' : 's'}</strong>
            <span className="hint">Consecutive days with a logged entry</span>
          </div>
          <div className="stat-card card">
            <span className="eyebrow">Overall progress</span>
            <strong>{summary.overallPercent}%</strong>
            <span className="hint">{summary.completedMilestones}/{summary.totalMilestones} waypoints complete</span>
          </div>
          <div className="stat-card card">
            <span className="eyebrow">Active roadmaps</span>
            <strong>{summary.roadmapCount}</strong>
            <span className="hint">{summary.activeDays} distinct days logged</span>
          </div>
        </div>
      )}

      {summary?.skills?.length > 0 && (
        <section className="dashboard-section">
          <h2>Your skill profile</h2>
          <div className="skill-cloud">
            {summary.skills.map((s) => (
              <SkillTag key={s.skill} name={s.skill} level={Math.min(5, s.activityCount)} />
            ))}
          </div>
        </section>
      )}

      <section className="dashboard-section">
        <div className="dashboard-section-head">
          <h2>Your roadmaps</h2>
        </div>

        {roadmaps.length === 0 ? (
          <div className="card empty-state">
            <h3>No roadmap yet</h3>
            <p className="hint">Build one from scratch or follow a curated guide to get your first waypoint on the map.</p>
            <div className="hero-actions">
              <Link to="/roadmaps/new" className="btn btn-primary">Build a roadmap</Link>
              <Link to="/explore" className="btn btn-ghost">Browse curated guides</Link>
            </div>
          </div>
        ) : (
          <div className="roadmap-grid">
            {roadmaps.map((r) => (
              <RoadmapCard key={r.id} roadmap={r} to={`/roadmaps/${r.id}`} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
