import SearchBar from '../components/SearchBar';
import ContextSelector from '../components/ContextSelector';
import SEO from '../components/SEO';
import './HomePage.css';

export default function HomePage() {
  return (
    <div className="home">
      <SEO
        title="ICD-10-CM Code Lookup — Search Medical Diagnosis Codes"
        description="Look up any ICD-10-CM diagnosis code by keyword or code number. Descriptions, categories, billability, and purpose-specific notes for the FY 2026 code set."
        path="/"
      />
      <div className="home-inner container">
        <h1 className="home-title">ICD-10-CM Code Lookup</h1>
        <p className="home-sub">Search diagnosis codes by keyword or code number.</p>
        <SearchBar autoFocus size="hero" />
        <ContextSelector variant="compact" />
      </div>
    </div>
  );
}
