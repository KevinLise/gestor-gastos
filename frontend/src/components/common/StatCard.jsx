// =============================================
// components/common/StatCard.jsx
// =============================================
import React from 'react';

const StatCard = ({ icon, label, value, sub, color = 'var(--accent)', loading }) => {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
          {label}
        </span>
        <span
          style={{
            width: 36,
            height: 36,
            borderRadius: 'var(--radius-md)',
            background: `${color}22`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
          }}
          aria-hidden="true"
        >
          {icon}
        </span>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
          <div className="skeleton" style={{ height: 28, width: '70%', borderRadius: 6 }} />
          <div className="skeleton" style={{ height: 16, width: '50%', borderRadius: 4 }} />
        </div>
      ) : (
        <>
          <div
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color,
              fontFamily: 'var(--font-mono)',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}
          >
            {value}
          </div>
          {sub && (
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{sub}</div>
          )}
        </>
      )}
    </div>
  );
};

export default StatCard;
