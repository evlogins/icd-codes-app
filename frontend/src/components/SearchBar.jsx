import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

export default function SearchBar({ autoFocus = false, initialQuery = '', size = 'default' }) {
  const [query, setQuery] = useState(initialQuery);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    if (!autoFocus) return;
    inputRef.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== '/') return;
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      e.preventDefault();
      inputRef.current?.focus();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (q.length < 2) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <form className={'search-bar' + (size === 'hero' ? ' search-bar--hero' : '')} onSubmit={handleSubmit} role="search">
      <input
        ref={inputRef}
        type="search"
        className="search-input"
        placeholder="Search ICD-10-CM codes"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search ICD-10-CM codes"
        autoComplete="off"
        spellCheck="false"
      />
      <kbd className="search-hint" aria-hidden="true">/</kbd>
      <button type="submit" className="search-submit" disabled={query.trim().length < 2}>
        Search
      </button>
    </form>
  );
}
