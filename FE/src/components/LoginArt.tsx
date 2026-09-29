// DESIGN §5.15: ilustrasi garis Masuk (dekorasi)
export function LoginArt() {
  const ink = { stroke: 'var(--ink)' };
  const soft = { stroke: 'var(--line-soft)' };
  return (
    <svg viewBox="0 0 330 330" role="img" aria-label="Ilustrasi dumbel dan daftar centang">
      <g fill="none" strokeWidth="1.5" style={soft}>
        <circle cx="165" cy="165" r="160" />
        <circle cx="165" cy="165" r="120" />
        <circle cx="165" cy="165" r="80" />
      </g>

      {/* Tiga kotak centang, satu terisi lime */}
      <g strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="112" y="92" width="26" height="26" rx="6" fill="none" style={ink} />
        <rect x="152" y="92" width="26" height="26" rx="6" style={{ ...ink, fill: 'var(--accent)' }} />
        <path d="M158 105l5 5 9-10" fill="none" style={ink} />
        <rect x="192" y="92" width="26" height="26" rx="6" fill="none" style={ink} />
      </g>

      {/* Dumbel */}
      <g fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={ink}>
        <line x1="112" y1="170" x2="218" y2="170" />
        <rect x="96" y="146" width="16" height="48" rx="5" />
        <rect x="84" y="154" width="12" height="32" rx="4" />
        <rect x="218" y="146" width="16" height="48" rx="5" />
        <rect x="234" y="154" width="12" height="32" rx="4" />
      </g>

      {/* Bar kecil setengah terisi */}
      <rect x="125" y="226" width="80" height="12" rx="6" fill="none" strokeWidth="2" style={ink} />
      <rect x="125" y="226" width="40" height="12" rx="6" style={{ fill: 'var(--ink)' }} />
    </svg>
  );
}
