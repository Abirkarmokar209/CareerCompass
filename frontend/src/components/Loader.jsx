import './Loader.css';

export default function Loader({ full = false, label = 'Loading' }) {
  return (
    <div className={full ? 'loader-full' : 'loader-inline'}>
      <span className="loader-spinner" aria-hidden="true" />
      <span className="loader-label">{label}…</span>
    </div>
  );
}
