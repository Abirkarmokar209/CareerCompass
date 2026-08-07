export default function SkillTag({ name, level = 0 }) {
  return (
    <span className="tag" style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
      {name}
      {level > 0 && (
        <span style={{ display: 'inline-flex', gap: 2 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <span
              key={i}
              style={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: i <= level ? 'var(--trail)' : 'rgba(76,110,93,0.25)',
              }}
            />
          ))}
        </span>
      )}
    </span>
  );
}
