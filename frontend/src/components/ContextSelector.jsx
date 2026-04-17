import React from 'react';
import './ContextSelector.css';

const CONTEXTS = [
  { id: 'clinical',     label: 'Clinical',     icon: '🏨', desc: 'Patient care and EHR' },
  { id: 'billing',      label: 'Billing',       icon: '💰', desc: 'Claims and reimbursement' },
  { id: 'research',     label: 'Research',      icon: '🔬', desc: 'Studies and cohorts' },
  { id: 'public_health',label: 'Public Health', icon: '📊', desc: 'Surveillance and stats' }
];

function ContextSelector({ context, onContextChange }) {
  return (
    <div className="context-selector">
      <label className="context-label">Purpose / Context:</label>
      <div className="context-buttons">
        {CONTEXTS.map(ctx => (
          <button
            key={ctx.id}
            className={"context-btn " + (context === ctx.id ? 'active' : '')}
            onClick={() => onContextChange(ctx.id)}
            title={ctx.desc}
          >
            <span className="ctx-icon">{ctx.icon}</span>
            <span className="ctx-label">{ctx.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default ContextSelector;
