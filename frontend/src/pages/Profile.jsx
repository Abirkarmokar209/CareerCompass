import { useState } from 'react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext.jsx';
import SkillTag from '../components/SkillTag.jsx';
import './Profile.css';

export default function Profile() {
  const { user, updateLocalUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    headline: user?.headline || '',
    bio: user?.bio || '',
    location: user?.location || '',
    interests: (user?.interests || []).join(', '),
  });
  const [skills, setSkills] = useState(user?.skills?.length ? user.skills : [{ name: '', level: 3 }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const updateSkill = (i, patch) => setSkills((list) => list.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  const addSkill = () => setSkills((list) => [...list, { name: '', level: 3 }]);
  const removeSkill = (i) => setSkills((list) => list.filter((_, idx) => idx !== i));

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        headline: form.headline.trim(),
        bio: form.bio.trim(),
        location: form.location.trim(),
        interests: form.interests.split(',').map((s) => s.trim()).filter(Boolean),
        skills: skills.filter((s) => s.name.trim()).map((s) => ({ name: s.name.trim(), level: Number(s.level) })),
      };
      const { data } = await client.put('/profile', payload);
      updateLocalUser(data.user);
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save your profile.');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="container profile-page">
      <div className="profile-head">
        <span className="profile-avatar" style={{ background: user.avatarColor }}>
          {user.name?.[0]?.toUpperCase()}
        </span>
        <div>
          <h1>{user.name}</h1>
          <span className="hint">{user.email}</span>
        </div>
        {!editing && (
          <button className="btn btn-ghost btn-sm profile-edit-btn" onClick={() => setEditing(true)}>
            Edit profile
          </button>
        )}
      </div>

      {error && <div className="error-banner">{error}</div>}

      {!editing ? (
        <div className="profile-view">
          <div className="card profile-section">
            <span className="eyebrow">Headline</span>
            <p>{user.headline || 'No headline yet — add one to describe your target role.'}</p>
          </div>
          <div className="card profile-section">
            <span className="eyebrow">About</span>
            <p>{user.bio || 'No bio yet.'}</p>
          </div>
          <div className="card profile-section">
            <span className="eyebrow">Location</span>
            <p>{user.location || 'Not set'}</p>
          </div>
          <div className="card profile-section">
            <span className="eyebrow">Interests</span>
            <div className="tag-row">
              {(user.interests || []).length
                ? user.interests.map((i) => <span key={i} className="tag">{i}</span>)
                : <p className="hint">No interests added yet.</p>}
            </div>
          </div>
          <div className="card profile-section">
            <span className="eyebrow">Skill base</span>
            <div className="tag-row">
              {(user.skills || []).length
                ? user.skills.map((s) => <SkillTag key={s.name} name={s.name} level={s.level} />)
                : <p className="hint">No skills added yet — completing roadmap waypoints will grow this automatically too.</p>}
            </div>
          </div>
        </div>
      ) : (
        <form className="card profile-form" onSubmit={handleSave}>
          <div className="field">
            <label>Full name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="field">
            <label>Headline</label>
            <input
              value={form.headline}
              onChange={(e) => setForm({ ...form, headline: e.target.value })}
              placeholder="e.g. Aspiring SOC Analyst"
            />
          </div>
          <div className="field">
            <label>About</label>
            <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} />
          </div>
          <div className="field">
            <label>Location</label>
            <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Dhaka, Bangladesh" />
          </div>
          <div className="field">
            <label>Interests (comma separated)</label>
            <input value={form.interests} onChange={(e) => setForm({ ...form, interests: e.target.value })} placeholder="Cybersecurity, Data Analytics" />
          </div>

          <div className="field">
            <label>Skill base</label>
            {skills.map((s, i) => (
              <div key={i} className="skill-row">
                <input
                  value={s.name}
                  onChange={(e) => updateSkill(i, { name: e.target.value })}
                  placeholder="Skill name"
                />
                <select value={s.level} onChange={(e) => updateSkill(i, { level: e.target.value })}>
                  {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>Level {n}</option>)}
                </select>
                <button type="button" className="btn btn-danger btn-sm" onClick={() => removeSkill(i)}>×</button>
              </div>
            ))}
            <button type="button" className="btn btn-ghost btn-sm" onClick={addSkill}>+ Add skill</button>
          </div>

          <div className="profile-form-actions">
            <button type="button" className="btn btn-ghost" onClick={() => setEditing(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save profile'}</button>
          </div>
        </form>
      )}
    </div>
  );
}
