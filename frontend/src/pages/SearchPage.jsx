import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import ResultsList from '../components/ResultsList';
import ContextSelector from '../components/ContextSelector';
import SEO from '../components/SEO';
import { searchCodes } from '../api/icdApi';
import { useAppContext } from '../state/AppContext';
import './SearchPage.css';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const { context } = useAppContext();
  const [state, setState] = useState({ loading: false, data: null, error: null });

  useEffect(() => {
    const query = q.trim();
    if (!query) {
      setState({ loading: false, data: null, error: null });
      return;
    }
    let cancelled = false;
    setState({ loading: true, data: null, error: null });
    searchCodes(query, { context, limit: 50 })
      .then((data) => { if (!cancelled) setState({ loading: false, data, error: null }); })
      .catch((err) => { if (!cancelled) setState({ loading: false, data: null, error: err.message || 'Search failed.' }); });
    return () => { cancelled = true; };
  }, [q, context]);

  const title = q ? `Search results for "${q}"` : 'Search ICD-10-CM Codes';
  const description = q
    ? `ICD-10-CM codes matching "${q}". Diagnosis code lookups with descriptions and billability.`
    : 'Search every ICD-10-CM diagnosis code by keyword or code number.';

  return (
    <div className="search-page container">
      <SEO title={title} description={description} path="/search" noindex />
      <div className="search-page-top">
        <SearchBar initialQuery={q} />
        <ContextSelector variant="compact" />
      </div>

      {state.error && <div className="error-banner">{state.error}</div>}

      {state.loading && (
        <div className="page-loading"><span className="bar-loader" aria-hidden="true" /><span>Searching…</span></div>
      )}

      {!state.loading && state.data && (
        <ResultsList data={state.data} query={q} />
      )}

      {!state.loading && !state.error && !q && (
        <div className="empty">Enter a term above to search ICD-10-CM codes.</div>
      )}
    </div>
  );
}
