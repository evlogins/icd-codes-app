import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import ResultsList from './components/ResultsList';
import CodeDetail from './components/CodeDetail';
import ContextSelector from './components/ContextSelector';
import Header from './components/Header';
import './App.css';

function App() {
  const [results, setResults] = useState([]);
  const [selectedCode, setSelectedCode] = useState(null);
  const [context, setContext] = useState('clinical');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = (searchResults) => {
    setResults(searchResults);
    setSelectedCode(null);
    setError(null);
  };

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="search-section">
          <ContextSelector context={context} onContextChange={setContext} />
          <SearchBar
            context={context}
            onResults={handleSearch}
            onError={setError}
            onLoading={setLoading}
          />
        </div>

        {error && <div className="error-banner">⚠️ {error}</div>}

        {loading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Searching ICD codes...</p>
          </div>
        )}

        {!loading && !selectedCode && results.length > 0 && (
          <ResultsList
            results={results}
            context={context}
            onSelectCode={setSelectedCode}
          />
        )}

        {!loading && selectedCode && (
          <CodeDetail
            code={selectedCode}
            context={context}
            onBack={() => setSelectedCode(null)}
          />
        )}

        {!loading && !error && results.length === 0 && !selectedCode && (
          <div className="welcome-section">
            <div className="welcome-card">
              <h2>ICD Code Explorer</h2>
              <p>Search ICD-10 diagnosis and procedure codes by keyword or code number.</p>
              <div className="use-cases">
                <div className="use-case"><span>💰</span><h3>Billing</h3><p>Insurance claims and reimbursement</p></div>
                <div className="use-case"><span>🔬</span><h3>Research</h3><p>Cohort definitions and studies</p></div>
                <div className="use-case"><span>🏨</span><h3>Clinical</h3><p>EHR documentation and care</p></div>
                <div className="use-case"><span>📊</span><h3>Public Health</h3><p>Surveillance and statistics</p></div>
              </div>
              <p className="tip">Try: <em>diabetes</em>, <em>hypertension</em>, <em>E11.9</em>, or <em>fracture</em></p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
