import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ContextSelector from '../components/ContextSelector';
import { getCodeDetail } from '../api/icdApi';
import { useAppContext } from '../state/AppContext';
import './CodePage.css';

export default function CodePage() {
  const { code } = useParams();
  const { context } = useAppContext();
  const [state, setState] = useState({ loading: true, data: null, error: null });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setState({ loading: true, data: null, error: null });
    getCodeDetail(code, context)
      .then((data) => { if (!cancelled) setState({ loading: false, data, error: null }); })
      .catch((err) => { if (!cancelled) setState({ loading: false, data: null, error: err.message || 'Could not load code.' }); });
    return () => { cancelled = true; };
  }, [code, context]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // noop — clipboard may be unavailable in some contexts
    }
  };

  if (state.loading) {
    return (
      <div className="code-page container">
        <div className="page-loading"><span className="bar-loader" aria-hidden="true" /><span>Loading code…</span></div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="code-page container">
        <Link to="/" className="back-link">← Back to search</Link>
        <div className="code-not-found">
          <h1>Code not found</h1>
          <p>{state.error}</p>
          <p>This code may not exist in the current ICD-10-CM code set, or it may have been retired.</p>
        </div>
      </div>
    );
  }

  const d = state.data;
  const specific = d.details?.isSpecific;

  return (
    <div className="code-page container">
      <Link to="/" className="back-link">← Back to search</Link>

      <header className="code-head">
        <div className="code-head-left">
          <div className="code-big mono">{d.code}</div>
          <div className="code-version">{d.version || 'ICD-10-CM'}</div>
        </div>
        <div className="code-head-right">
          <span className={'pill ' + (specific ? 'pill-success' : 'pill-warn')}>
            {specific ? 'Specific' : 'Unspecified'}
          </span>
        </div>
      </header>

      <h1 className="code-description">{d.description}</h1>

      <div className="code-grid">
        <section className="code-main">
          <dl className="def-list">
            <div>
              <dt>Category</dt>
              <dd className="mono">{d.details?.category || '—'}</dd>
            </div>
            <div>
              <dt>Code set</dt>
              <dd>ICD-10-CM · FY 2026</dd>
            </div>
            <div>
              <dt>Billable</dt>
              <dd>{specific ? 'Yes, code is specific enough for claims' : 'No, add specificity before submitting'}</dd>
            </div>
          </dl>

          <div className="actions">
            <button type="button" className="btn btn-primary" onClick={handleCopy}>
              {copied ? 'Copied' : 'Copy code'}
            </button>
            <a
              className="btn btn-ghost"
              href={`https://www.icd10data.com/ICD10CM/Codes/${d.code}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View on icd10data.com
              <svg aria-hidden="true" viewBox="0 0 16 16" width="14" height="14">
                <path fill="currentColor" d="M9.5 2h4.5v4.5h-1V3.7L7.7 9.03l-.7-.7L12.3 3H9.5V2Z"/>
                <path fill="currentColor" d="M3 4h4v1H4v7h7V9h1v4H3V4Z"/>
              </svg>
            </a>
          </div>
        </section>

        <aside className="code-side">
          {d.context && (
            <div className="context-panel">
              <div className="context-panel-head">
                <span className="context-panel-label">Purpose</span>
                <span className="context-panel-title">{d.context.label}</span>
              </div>
              <p className="context-panel-note">{d.context.note}</p>
              {d.context.tip && <p className="context-panel-tip">{d.context.tip}</p>}
              <div className="context-panel-switch">
                <ContextSelector variant="compact" />
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
