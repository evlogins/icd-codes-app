import React, { useState, useRef } from 'react';
import { searchCodes } from '../api/icdApi';
import './SearchBar.css';

function SearchBar({ context, onResults, onError, onLoading }) {
  const [query, setQuery] = useState('');
  const [version, setVersion] = useState('10');
  const inputRef = useRef(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim() || query.trim().length < 2) return;
    onLoading(true);
    onError(null);
    try {
      const data = await searchCodes(query.trim(), { version, context, limit: 25 });
      onResults(data);
    } catch (err) {
      onError(err.message || 'Search failed. Please try again.');
    } finally {
      onLoading(false);
    }
  };

  return (
    <form className="search-bar" onSubmit={handleSearch}>
      <div className="search-input-wrapper">
        <span className="search-icon">🔍</span>
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Search by keyword (diabetes) or code (E11.9)..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        {query && (
          <button type="button" className="clear-btn" onClick={() => { setQuery(''); onResults([]); }}>✕</button>
        )}
      </div>
      <div className="search-controls">
        <select className="version-select" value={version} onChange={e => setVersion(e.target.value)}>
          <option value="10">ICD-10-CM</option>
          <option value="11">ICD-11 (soon)</option>
        </select>
        <button type="submit" className="search-btn" disabled={!query.trim()}>Search</button>
      </div>
    </form>
  );
}

export default SearchBar;
