import React, { useState, useEffect } from 'react';
import { getCodeDetail } from '../api/icdApi';
import './CodeDetail.css';

function CodeDetail({ code, context, onBack }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const data = await getCodeDetail(code.code, context);
        setDetail(data);
      } catch (err) {
        setDetail({ ...code, context: null });
        setError('Could not load full details. Showing basic info.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [code, context]);

  if (loading) {
    return <div className="code-detail loading"><div className="spinner small"></div><p>Loading...</p></div>;
  }

  const d = detail || code;

  return (
    <div className="code-detail">
      <button className="back-btn" onClick={onBack}>← Back to results</button>
      {error && <div className="detail-warning">{error}</div>}
      <div className="detail-card">
        <div className="detail-header">
          <span className="detail-code">{d.code}</span>
          <span className="detail-version">{d.version || 'ICD-10-CM'}</span>
        </div>
        <h2 className="detail-description">{d.description}</h2>
        {d.details && (
          <div className="detail-meta">
            <div className="meta-item">
              <span className="meta-label">Category</span>
              <span className="meta-value">{d.details.category}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Specificity</span>
              <span className={"meta-value " + (d.details.isSpecific ? 'specific' : 'unspecific')}>
                {d.details.isSpecific ? '✅ Specific' : '⚠️ Unspecified'}
              </span>
            </div>
          </div>
        )}
        {d.context && (
          <div className="context-panel">
            <h3>{d.context.label}</h3>
            <p>{d.context.note}</p>
            <div className="context-tip"><span>💡 </span><span>{d.context.tip}</span></div>
          </div>
        )}
        <div className="detail-actions">
          <button className="action-btn copy" onClick={() => navigator.clipboard.writeText(d.code).then(() => alert('Copied: ' + d.code))}>
            📋 Copy Code
          </button>
          <a className="action-btn external" href={"https://www.icd10data.com/ICD10CM/Codes/" + d.code} target="_blank" rel="noopener noreferrer">
            🔗 View on ICD10Data.com
          </a>
        </div>
      </div>
    </div>
  );
}

export default CodeDetail;
