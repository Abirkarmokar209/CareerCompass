import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import client from '../api/client';
import Loader from '../components/Loader.jsx';
import ProgressRing from '../components/ProgressRing.jsx';
import TrailPath from '../components/TrailPath.jsx';
import MilestoneItem from '../components/MilestoneItem.jsx';
import './RoadmapDetail.css';

export default function RoadmapDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeId, setActiveId] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [addingMilestone, setAddingMilestone] = useState(false);

  const load = () => {
    client.get(`/my-roadmaps/${id}`)
      .then((res) => setRoadmap(res.data.roadmap))
      .catch(() => setError('Could not load this roadmap.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  const toggleComplete = async (milestoneId) => {
    const { data } = await client.patch(`/my-roadmaps/${id}/milestones/${milestoneId}`);
    setRoadmap(data.roadmap);
  };

  const addLog = async (milestoneId, payload) => {
    const { data } = await client.post(`/my-roadmaps/${id}/milestones/${milestoneId}/logs`, payload);
    setRoadmap(data.roadmap);
  };

  const removeMilestone = async (milestoneId) => {
    if (!confirm('Remove this waypoint? Its log history will be lost.')) return;
    const { data } = await client.delete(`/my-roadmaps/${id}/milestones/${milestoneId}`);
    setRoadmap(data.roadmap);
  };

  const addMilestone = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setAddingMilestone(true);
    try {
      const { data } = await client.post(`/my-roadmaps/${id}/milestones`, { title: newTitle.trim(), skill: 'General', estimatedDays: 7 });
      setRoadmap(data.roadmap);
      setNewTitle('');
    } finally {
      setAddingMilestone(false);
    }
  };

  const deleteRoadmap = async () => {
    if (!confirm('Delete this entire roadmap? This cannot be undone.')) return;
    await client.delete(`/my-roadmaps/${id}`);
    navigate('/dashboard');
  };

  if (loading) return <Loader full label="Charting your route" />;
  if (error) return <div className="container"><div className="error-banner">{error}</div></div>;
  if (!roadmap) return null;

  return (
    <div className="container roadmap-detail">
      <div className="roadmap-detail-head">
        <div>
          <span className="eyebrow">{roadmap.category}</span>
          <h1>{roadmap.title}</h1>
          <span className="hint">
            {roadmap.progress.completed}/{roadmap.progress.total} waypoints complete
          </span>
        </div>
        <div className="roadmap-detail-actions">
          <ProgressRing percent={roadmap.progress.percent} size={64} />
          <button className="btn btn-danger btn-sm" onClick={deleteRoadmap}>Delete roadmap</button>
        </div>
      </div>

      <div className="roadmap-body">
        <div className="trail-col">
          <TrailPath milestones={roadmap.milestones} activeId={activeId} onSelect={(mid) => {
            setActiveId(mid);
            document.getElementById(`milestone-${mid}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }} />
        </div>

        <div className="milestones-col">
          {roadmap.milestones.length === 0 && (
            <div className="card empty-state">
              <h3>No waypoints yet</h3>
              <p className="hint">Add your first one below to start tracking progress.</p>
            </div>
          )}

          {roadmap.milestones.map((m, i) => (
            <MilestoneItem
              key={m.id}
              milestone={m}
              index={i}
              active={activeId === m.id}
              onFocus={setActiveId}
              onToggleComplete={toggleComplete}
              onAddLog={addLog}
              onRemove={removeMilestone}
            />
          ))}

          <form className="add-milestone-form card" onSubmit={addMilestone}>
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Add another waypoint…"
            />
            <button className="btn btn-brass btn-sm" type="submit" disabled={addingMilestone || !newTitle.trim()}>
              Add
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
