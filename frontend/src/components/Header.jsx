import React from 'react';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-logo">
          <span className="header-icon">🏥</span>
          <span className="header-title">ICD Code Explorer</span>
        </div>
        <nav className="header-nav">
          <a href="https://www.icd10data.com/" target="_blank" rel="noopener noreferrer">ICD-10 Data</a>
          <a href="https://icd.who.int/en" target="_blank" rel="noopener noreferrer">ICD-11 (WHO)</a>
          <a href="https://clinicaltables.nlm.nih.gov/" target="_blank" rel="noopener noreferrer">NLM API</a>
        </nav>
      </div>
    </header>
  );
}

export default Header;
