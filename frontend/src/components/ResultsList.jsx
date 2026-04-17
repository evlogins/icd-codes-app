import { Link } from 'react-router-dom';
import './ResultsList.css';

export default function ResultsList({ data, query }) {
  const items = data?.results || [];
  const total = data?.total ?? items.length;

  if (items.length === 0) {
    return (
      <div className="results-empty">
        No codes match{query ? <> <q className="mono">{query}</q></> : '.'}
      </div>
    );
  }

  return (
    <div className="results">
      <div className="results-meta">
        <span className="results-count">
          <span className="tabular">{total}</span> {total === 1 ? 'result' : 'results'}
          {query && <> for <q className="mono">{query}</q></>}
        </span>
      </div>
      <ul className="results-list" role="list">
        {items.map((item) => (
          <li key={item.code} className="results-row">
            <Link to={`/code/${encodeURIComponent(item.code)}`} className="results-link">
              <span className="results-code mono">{item.code}</span>
              <span className="results-desc">{item.description}</span>
              <span className="results-arrow" aria-hidden="true">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
