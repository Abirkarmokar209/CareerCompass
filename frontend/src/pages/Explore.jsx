import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext.jsx';
import Loader from '../components/Loader.jsx';
import './Explore.css';

export default function Explore() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    client.get('/roadmaps/templates')
      .then((res) => setTemplates(res.data.templates))
      .catch(() => setError('Could not load curated roadmaps right now.'))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(
    () => ['All', ...new Set(templates.map((t) => t.category))],
    [templates]
  );

  const visible = category === 'All' ? templates : templates.filter((t) => t.category === category);

  const followTemplate = async (template, customize) => {
    if (!user) return navigate('/login');
    setBusyId(template.id);
    try {
      const { data } = await client.post('/my-roadmaps', {
        title: template.title,
        category: template.category,
        source: customize ? 'customized' : 'template',
        templateId: template.id,
      });
      navigate(`/roadmaps/${data.roadmap.id}`, { state: { editing: customize } });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not start that roadmap.');
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <Loader full label="Loading curated roadmaps" />;

  return (
    <div className="container explore">
      <div className="explore-head">
        <span className="eyebrow">Curated guides</span>
        <h1>Explore roadmaps</h1>
        <p className="hint">Follow a guide exactly as written, or customize it once it's on your profile.</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="chip-row">
        {categories.map((c) => (
          <button
            key={c}
            className={`chip ${category === c ? 'chip-active' : ''}`}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="template-grid">
        {visible.map((t) => (
          <div key={t.id} className="template-card card">
            <div className="template-card-head">
              <span className="eyebrow">{t.category}</span>
              <span className="badge-level">{t.level}</span>
            </div>
            <h3>{t.title}</h3>
            <p className="hint">{t.summary}</p>
            <ol className="template-milestones">
              {t.milestones.slice(0, 4).map((m) => (
                <li key={m.id}>{m.title}</li>
              ))}
              {t.milestones.length > 4 && <li className="hint">+{t.milestones.length - 4} more waypoints</li>}
            </ol>
            <div className="template-actions">
              <button className="btn btn-primary btn-sm" disabled={busyId === t.id} onClick={() => followTemplate(t, false)}>
                Follow as-is
              </button>
              <button className="btn btn-ghost btn-sm" disabled={busyId === t.id} onClick={() => followTemplate(t, true)}>
                Customize
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
