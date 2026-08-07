/**
 * TrailPath renders roadmap milestones as waypoints along a winding trail —
 * CareerCompass's signature visual motif. Completed waypoints are filled
 * with trail green; the current one is marked in brass; the rest sit open.
 */
export default function TrailPath({ milestones = [], onSelect, activeId }) {
  const count = milestones.length || 1;
  const height = Math.max(count * 92, 92);
  const amplitude = 46;

  const points = milestones.map((m, i) => {
    const y = 46 + i * 92;
    const x = 60 + Math.sin(i * 1.15) * amplitude;
    return { ...m, x, y };
  });

  const pathD = points
    .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `Q ${points[i - 1].x + (p.x - points[i - 1].x) / 2} ${points[i - 1].y}, ${p.x} ${p.y}`))
    .join(' ');

  return (
    <svg
      width="120"
      height={height}
      viewBox={`0 0 120 ${height}`}
      className="trail-path"
      role="presentation"
    >
      <path d={pathD} fill="none" stroke="var(--paper-line)" strokeWidth="3" />
      <path
        d={pathD}
        fill="none"
        stroke="var(--trail)"
        strokeWidth="3"
        strokeDasharray="1000"
        strokeDashoffset={1000 - (points.filter((p) => p.completed).length / count) * 1000}
        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
      />
      {points.map((p) => (
        <g
          key={p.id}
          transform={`translate(${p.x}, ${p.y})`}
          onClick={() => onSelect && onSelect(p.id)}
          style={{ cursor: onSelect ? 'pointer' : 'default' }}
        >
          <circle
            r={p.id === activeId ? 10 : 8}
            fill={p.completed ? 'var(--trail)' : '#fff'}
            stroke={p.id === activeId ? 'var(--brass)' : p.completed ? 'var(--trail)' : 'var(--slate)'}
            strokeWidth={p.id === activeId ? 3 : 2}
          />
        </g>
      ))}
    </svg>
  );
}
