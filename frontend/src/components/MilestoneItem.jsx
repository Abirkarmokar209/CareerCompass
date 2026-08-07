import { useState } from 'react';
import './MilestoneItem.css';

export default function MilestoneItem({ milestone, index, onToggleComplete, onAddLog, onRemove, active, onFocus }) {
  const [expanded, setExpanded] = useState(false);
  const [note, setNote] = useState('');
  const [percent, setPercent] = useState(25);
  const [submitting, setSubmitting] = useState(false);

  const handleLogSubmit = async (e) => {
    e.preventDefault();
    if (!note.trim()) return;
    setSubmitting(true);
    try {
      await onAddLog(milestone.id, { note, percent: Number(percent) });
      setNote('');
      setPercent(25);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      id={`milestone-${milestone.id}`}
      className={`milestone-item card ${active ? 'milestone-active' : ''} ${milestone.completed ? 'milestone-done' : ''}`}
      onMouseEnter={() => onFocus && onFocus(milestone.id)}
    >
      <div className="milestone-head" onClick={() => setExpanded((v) => !v)}>
        <div className="milestone-num">{String(index + 1).padStart(2, '0')}</div>
        <div className="milestone-title-wrap">
          <h4>{milestone.title}</h4>
          <span className="hint">{milestone.description}</span>
          <div className="milestone-meta">
            <span className="tag">{milestone.skill}</span>
            <span className="badge-level">~{milestone.estimatedDays} days</span>
            <span className="badge-level">{milestone.dailyLogs.length} log{milestone.dailyLogs.length === 1 ? '' : 's'}</span>
          </div>
        </div>
        <button
          className={`milestone-check ${milestone.completed ? 'milestone-check-done' : ''}`}
          onClick={(e) => { e.stopPropagation(); onToggleComplete(milestone.id); }}
          title={milestone.completed ? 'Mark as not complete' : 'Mark as complete'}
        >
          {milestone.completed ? '✓' : ''}
        </button>
      </div>

      {expanded && (
        <div className="milestone-body">
          <form className="log-form" onSubmit={handleLogSubmit}>
            <label className="hint" htmlFor={`note-${milestone.id}`}>Today's progress note</label>
            <textarea
              id={`note-${milestone.id}`}
              placeholder="What did you study or build today? (supports plain markdown-style notes)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
            <div className="log-form-row">
              <label className="hint" htmlFor={`percent-${milestone.id}`}>Progress made today: {percent}%</label>
              <input
                id={`percent-${milestone.id}`}
                type="range"
                min="0"
                max="100"
                step="5"
                value={percent}
                onChange={(e) => setPercent(e.target.value)}
              />
              <button className="btn btn-brass btn-sm" type="submit" disabled={submitting || !note.trim()}>
                {submitting ? 'Saving…' : 'Log today'}
              </button>
            </div>
          </form>

          {milestone.dailyLogs.length > 0 && (
            <ul className="log-history">
              {[...milestone.dailyLogs].reverse().map((log) => (
                <li key={log.id}>
                  <span className="log-date">{log.date}</span>
                  <span className="log-note">{log.note}</span>
                  <span className="log-percent">{log.percent}%</span>
                </li>
              ))}
            </ul>
          )}

          <button className="btn btn-danger btn-sm" onClick={() => onRemove(milestone.id)} style={{ marginTop: 12 }}>
            Remove waypoint
          </button>
        </div>
      )}
    </div>
  );
}
