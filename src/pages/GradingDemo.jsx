import React from 'react';
import GradeReport, { GradeBadge, SummaryCard, BreakdownList, TrendSparkline } from '../components/grading/GradeComponents.jsx';

const mockBreakdown = [
  { label: 'Recording UX', score: 4.2, hint: 'Title prompt, short-note confirm, permission help' },
  { label: 'Share & Embed', score: 3.8, hint: 'Local links and iframe embed via /n/:id' },
  { label: 'Privacy', score: 3.0, hint: 'Noindex, local-only links, delete token' },
  { label: 'Respond Flow', score: 2.5, hint: 'replyTo banner and navigation' },
  { label: 'Reliability', score: 2.5, hint: 'Local-first, warning guard on unload' },
];

const mockTrend = [2.6, 3.1, 3.7, 3.9, 4.0, 4.2];

const GradingDemo = () => {
  return (
    <div className="grading-demo" style={{ paddingBottom: 40 }}>
      <section style={{ padding: '32px 16px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(110px, 1fr))', gap: 12, marginBottom: 16 }}>
          <div className="glass" style={{ padding: 16, borderRadius: 16, display: 'grid', placeItems: 'center' }}>
            <GradeBadge score={4.2} label="Recording" />
          </div>
          <div className="glass" style={{ padding: 16, borderRadius: 16, display: 'grid', placeItems: 'center' }}>
            <GradeBadge score={3.8} label="Share" />
          </div>
          <div className="glass" style={{ padding: 16, borderRadius: 16, display: 'grid', placeItems: 'center' }}>
            <GradeBadge score={3.0} label="Privacy" />
          </div>
          <div className="glass" style={{ padding: 16, borderRadius: 16, display: 'grid', placeItems: 'center' }}>
            <GradeBadge score={2.5} label="Respond" />
          </div>
        </div>
        <div className="glass reveal" style={{ padding: 16, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Overall trend</div>
            <div style={{ marginTop: 8 }}>
              <TrendSparkline data={mockTrend} />
            </div>
          </div>
          <SummaryCard title="Overall" score={4.0} subtitle="Local-first milestone" />
        </div>
      </section>

      <GradeReport title="RecordNow PRD Coverage" overall={4.0} breakdown={mockBreakdown} trend={mockTrend} />
    </div>
  );
};

export default GradingDemo;
