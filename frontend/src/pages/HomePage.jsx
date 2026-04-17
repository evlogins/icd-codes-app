import SearchBar from '../components/SearchBar';
import ContextSelector from '../components/ContextSelector';
import './HomePage.css';

export default function HomePage() {
  return (
    <div className="home">
      <div className="home-inner container">
        <h1 className="home-title">ICD-10-CM Code Lookup</h1>
        <p className="home-sub">Search diagnosis codes by keyword or code number.</p>
        <SearchBar autoFocus size="hero" />
        <ContextSelector variant="compact" />
      </div>
    </div>
  );
}
