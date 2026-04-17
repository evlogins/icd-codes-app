import React from 'react';
import './ResultsList.css';

function ResultsList({ results, context, onSelectCode }) {
  const data = results.results || results;
  const contextInfo = results.context;
  const total = results.total || data.length;
  const query = results.query;

  return (
    <div className="results-list">
      <div className="results-header">
        <div className="results-meta">
          <span className="results-count">{total} result{total !== 1 ? 's' : ''}</span>
          {query && <span> for "<strong>{query}</strong>"</span>}
        </div>
        {contextInfo && <div className="context-badge">{contextInfo.label}</div>}
      </div>
      {contextInfo && (
        <div className="context-tip-bar">
          <span>💡 </span><span>{contextInfo.tip}</span>
        </div>
      )}
      <div className="results-grid">
        {data.map((item, i) => (
          <button key={i} className="result-card" onClick={() => onSelectCode(item)}>
            <span className="result-code">{item.code}</span>
            <span className="result-desc">{item.description}</span>
            <span className="result-arrow">→</span>
          </button>
        ))}
      </div>
      {data.length === 0 && <div className="no-results"><p>No codes found.</p></div>}
    </div>
  );
}

export default ResultsList;
