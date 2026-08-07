import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import client from '../api/client';
import './RoadmapBuilder.css';

const emptyMilestone = () => ({ key: uuid(), title: '', description: '', skill: '', estimatedDays: 7 });

export default function RoadmapBuilder() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('General');
  const [milestones, setMilestones] = useState([emptyMilestone()]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const updateMilestone = (key, patch) => {
    setMilestones((list) => list.map((m) => (m.key === key ? { ...m, ...patch } : m)));
  };

  const addMilestone = () => setMilestones((list) => [...list, emptyMilestone()]);
  const removeMilestone = (key) => setMilestones((list) => list.filter((m) => m.key !== key));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const cleanMilestones = milestones
      .filter((m) => m.title.trim())
      .map(({ title, description, skill, estimatedDays }) => ({
        title: title.trim(),
        description: description.trim(),
        skill: skill.trim() || 'General',
        estimatedDays: Number(estimatedDays) || 7,
      }));

    if (!title.trim()) return setError('Give your roadmap a title.');
    if (cleanMilestones.length === 0) return setError('Add at least one waypoint.');

    setSubmitting(true);
    try {
      const { data } = await client.post('/my-roadmaps', {
        title: title.trim(),
        category: category.trim() || 'General',
        source: 'manual',
        milestones: cleanMilestones,
      });
      navigate(`/roadmaps/${data.roadmap.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create the roadmap.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container builder">
      <div className="builder-head">
        <span className="eyebrow">Build a roadmap</span>
        <h1>Plot your own trail</h1>
        <p className="hint">Give it a title, then add each waypoint in the order you want to tackle them.</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <form onSubmit={handleSubmit} className="builder-form">
        <div className="card builder-top">
          <div className="field">
            <label htmlFor="title">Roadmap title</label>
            <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. My path to Penetration Tester" />
          </div>
          <div className="field">
            <label htmlFor="category">Category</label>
            <input id="category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Cybersecurity" />
          </div>
        </div>

        <div className="builder-milestones">
          {milestones.map((m, i) => (
            <div key={m.key} className="card milestone-form">
              <div className="milestone-form-head">
                <span className="milestone-num">{String(i + 1).padStart(2, '0')}</span>
                <button type="button" className="btn btn-danger btn-sm" onClick={() => removeMilestone(m.key)} disabled={milestones.length === 1}>
                  Remove
                </button>
              </div>
              <div className="field">
                <label>Waypoint title</label>
                <input value={m.title} onChange={(e) => updateMilestone(m.key, { title: e.target.value })} placeholder="e.g. Learn Nmap & Wireshark" />
              </div>
              <div className="field">
                <label>Description</label>
                <textarea value={m.description} onChange={(e) => updateMilestone(m.key, { description: e.target.value })} rows={2} placeholder="What does finishing this waypoint look like?" />
              </div>
              <div className="milestone-form-row">
                <div className="field">
                  <label>Skill tag</label>
                  <input value={m.skill} onChange={(e) => updateMilestone(m.key, { skill: e.target.value })} placeholder="e.g. Networking" />
                </div>
                <div className="field">
                  <label>Estimated days</label>
                  <input type="number" min="1" value={m.estimatedDays} onChange={(e) => updateMilestone(m.key, { estimatedDays: e.target.value })} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button type="button" className="btn btn-ghost" onClick={addMilestone}>+ Add another waypoint</button>

        <div className="builder-actions">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Creating…' : 'Create roadmap'}
          </button>
        </div>
      </form>
    </div>
  );
}
