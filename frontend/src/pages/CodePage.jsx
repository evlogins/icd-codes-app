import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ContextSelector from '../components/ContextSelector';
import SEO from '../components/SEO';
import { getCodeDetail, CONTEXT_NOTES } from '../api/icdApi';
import { getCodeFromDataset } from '../data/codes';
import { useAppContext } from '../state/AppContext';
import './CodePage.css';

export default function CodePage() {
  const { code } = useParams();
  const { context } = useAppContext();
  const seed = getCodeFromDataset(code, context);

  const [runtimeState, setRuntimeState] = useState(
    seed
      ? { loading: false, data: seed, error: null }
      : { loading: true, data: null, error: null }
  );
  const [copied, setCopied] = useState(false);

  // When a fresh context is picked, swap the bundled note in-place.
  const data = runtimeState.data
    ? { ...runtimeState.data, context: CONTEXT_NOTES[context] || CONTEXT_NOTES.clinical }
    : null;

  useEffect(() => {
    if (seed) {
      // Dataset hit: no network needed; the seed already has what we render.
      setRuntimeState({ loading: false, data: seed, error: null });
      return;
    }
    let cancelled = false;
    setRuntimeState({ loading: true, data: null, error: null });
    getCodeDetail(code, context)
      .then((d) => { if (!cancelled) setRuntimeState({ loading: false, data: d, error: null }); })
      .catch((err) => { if (!cancelled) setRuntimeState({ loading: false, data: null, error: err.message || 'Could not load code.' }); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  if (runtimeState.loading) {
    return (
      <div className="code-page container">
        <div className="page-loading"><span className="bar-loader" aria-hidden="true" /><span>Loading code…</span></div>
      </div>
    );
  }

  if (runtimeState.error || !data) {
    return (
      <div className="code-page container">
        <SEO
          title={`Code ${code} not found`}
          description={`ICD-10-CM code ${code} does not appear in the FY 2026 code set.`}
          path={`/code/${code}`}
          noindex
        />
        <Link to="/" className="back-link">← Back to search</Link>
        <div className="code-not-found">
          <h1>Code not found</h1>
          <p>{runtimeState.error || 'This code does not appear in the ICD-10-CM code set.'}</p>
          <p>It may have been retired, or the URL may be malformed.</p>
        </div>
      </div>
    );
  }

  const specific = data.details?.isSpecific;

  return (
    <div className="code-page container">
      <SEO
        title={`ICD-10 ${data.code} — ${data.description}`}
        description={`${data.code}: ${data.description}. ICD-10-CM diagnosis code, FY 2026. ${specific ? 'Billable.' : 'Unspecified — not billable as-is.'}`}
        path={`/code/${data.code}`}
        code={data.code}
        codeDescription={data.description}
      />
      <Link to="/" className="back-link">← Back to search</Link>

      <header className="code-head">
        <div className="code-head-left">
          <div className="code-big mono">{data.code}</div>
          <div className="code-version">{data.version || 'ICD-10-CM'}</div>
        </div>
        <div className="code-head-right">
          <span className={'pill ' + (specific ? 'pill-success' : 'pill-warn')}>
            {specific ? 'Specific' : 'Unspecified'}
          </span>
        </div>
      </header>

      <h1 className="code-description">{data.description}</h1>

      <div className="code-grid">
        <section className="code-main">
          <dl className="def-list">
            <div>
              <dt>Category</dt>
              <dd className="mono">{data.details?.category || '—'}</dd>
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
              href={`https://www.icd10data.com/ICD10CM/Codes/${data.code}`}
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
          {data.context && (
            <div className="context-panel">
              <div className="context-panel-head">
                <span className="context-panel-label">Purpose</span>
                <span className="context-panel-title">{data.context.label}</span>
              </div>
              <p className="context-panel-note">{data.context.note}</p>
              {data.context.tip && <p className="context-panel-tip">{data.context.tip}</p>}
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
