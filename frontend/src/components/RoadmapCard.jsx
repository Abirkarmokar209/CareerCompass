import { Link } from 'react-router-dom';
import ProgressRing from './ProgressRing.jsx';
import './RoadmapCard.css';

const SOURCE_LABEL = {
  manual: 'Built from scratch',
  template: 'Following a guide',
  customized: 'Customized guide',
};

export default function RoadmapCard({ roadmap, to }) {
  const progress = roadmap.progress || { percent: 0, completed: 0, total: roadmap.milestones?.length || 0 };

  return (
    <Link to={to} className="roadmap-card card">
      <div className="roadmap-card-top">
        <div>
          <span className="eyebrow">{roadmap.category}</span>
          <h3>{roadmap.title}</h3>
          <span className="hint">{SOURCE_LABEL[roadmap.source] || 'Roadmap'} · {progress.completed}/{progress.total} waypoints</span>
        </div>
        <ProgressRing percent={progress.percent} size={54} />
      </div>
    </Link>
  );
}
