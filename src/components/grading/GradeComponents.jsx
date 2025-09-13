import React from 'react';

// Props:
// - score: number (0-5)
// - size: number (px)
// - label: string (optional)
export const GradeBadge = ({ score, size = 56, label }) => {
  const pct = Math.max(0, Math.min(5, score)) / 5;
  const hue = 10 + pct * 110; // red -> green
  const bg = `linear-gradient(135deg, hsl(${hue} 85% 52%), hsl(${hue} 70% 42%))`;
  const shadow = `0 6px 18px hsla(${hue} 80% 45% / .35)`;
  const formatted = score.toFixed(1);

  return (
    <div className="grade-badge" style={{ width: size, height: size, background: bg, boxShadow: shadow }}>
      <div className="grade-badge__score">{formatted}</div>
      {label && <div className="grade-badge__label" title={label}>{label}</div>}
    </div>
  );
};

// Props:
// - title: string
// - score: number (0-5)
// - subtitle?: string
// - actions?: ReactNode
export const SummaryCard = ({ title, score, subtitle, actions }) => {
  const pct = Math.max(0, Math.min(5, score)) / 5;
  const hue = 10 + pct * 110;
  return (
    <div className="summary-card glass reveal">
      <div className="summary-card__header">
        <h3 className="summary-card__title">{title}</h3>
        <GradeBadge score={score} size={48} />
      </div>
      {subtitle && <p className="summary-card__subtitle">{subtitle}</p>}
      {actions && <div className="summary-card__actions">{actions}</div>}
      <div className="summary-card__bar">
        <div className="summary-card__bar-fill" style={{ width: `${pct * 100}%`, background: `linear-gradient(90deg, hsl(${hue} 85% 52%), hsl(${hue} 70% 42%))` }} />
      </div>
    </div>
  );
};

// Props:
// - items: Array<{ label: string, score: number (0-5), hint?: string }>
export const BreakdownList = ({ items = [] }) => {
  return (
    <div className="breakdown-list">
      {items.map((it) => {
        const pct = Math.max(0, Math.min(5, it.score)) / 5;
        const hue = 10 + pct * 110;
        return (
          <div key={it.label} className="breakdown-item">
            <div className="breakdown-item__row">
              <div className="breakdown-item__label">{it.label}</div>
              <div className="breakdown-item__score">{it.score.toFixed(1)} / 5</div>
            </div>
            <div className="breakdown-item__bar">
              <div className="breakdown-item__bar-fill" style={{ width: `${pct * 100}%`, background: `linear-gradient(90deg, hsl(${hue} 85% 52%), hsl(${hue} 70% 42%))` }} />
            </div>
            {it.hint && <div className="breakdown-item__hint">{it.hint}</div>}
          </div>
        );
      })}
    </div>
  );
};

// Props:
// - data: number[] (0-5)
export const TrendSparkline = ({ data = [] }) => {
  if (data.length === 0) return null;
  const w = 160;
  const h = 42;
  const max = 5;
  const step = w / Math.max(1, data.length - 1);
  const points = data.map((v, i) => [i * step, h - (Math.max(0, Math.min(max, v)) / max) * h]);
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(2)} ${p[1].toFixed(2)}`).join(' ');
  return (
    <svg width={w} height={h} className="sparkline" viewBox={`0 0 ${w} ${h}`}>
      <path d={path} fill="none" stroke="url(#g)" strokeWidth="2.5" />
      <defs>
        <linearGradient id="g" x1="0" x2="1">
          <stop offset="0%" stopColor="#7c4dff" />
          <stop offset="100%" stopColor="#6ad6ff" />
        </linearGradient>
      </defs>
    </svg>
  );
};

// Props:
// - title: string
// - overall: number (0-5)
// - breakdown: Array<{ label, score, hint? }>
// - trend?: number[]
export const GradeReport = ({ title, overall, breakdown, trend }) => {
  return (
    <section className="grade-report">
      <div className="grade-report__header">
        <div>
          <h2 className="grade-report__title">{title}</h2>
          <p className="grade-report__subtitle">Implementation Quality Report</p>
        </div>
        <div className="grade-report__badge">
          <GradeBadge score={overall} size={72} label="Overall" />
        </div>
      </div>
      {trend && (
        <div className="grade-report__trend glass reveal">
          <div className="grade-report__trend-title">Trend (recent)</div>
          <TrendSparkline data={trend} />
        </div>
      )}
      <div className="grade-report__grid">
        <div className="grade-report__left">
          <SummaryCard title="Overall Score" score={overall} subtitle="Scale: 0–5 (higher is better)" />
          <div className="grade-report__breakdown glass reveal">
            <BreakdownList items={breakdown} />
          </div>
        </div>
        <div className="grade-report__right">
          <div className="grade-report__cards">
            {breakdown.slice(0, 3).map((it) => (
              <SummaryCard key={it.label} title={it.label} score={it.score} subtitle={it.hint} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GradeReport;
