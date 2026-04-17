import { Link, NavLink } from 'react-router-dom';
import './Header.css';

export default function Header() {
  return (
    <header className="header">
      <div className="header-inner container">
        <Link to="/" className="brand" aria-label="ICD Code Explorer home">
          <span className="brand-mark mono" aria-hidden="true">icd</span>
          <span className="brand-name">Code Explorer</span>
        </Link>
        <nav className="header-nav" aria-label="Primary">
          <NavLink to="/" end className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>Home</NavLink>
          <a className="nav-link" href="https://www.cms.gov/Medicare/Coding/ICD10" target="_blank" rel="noopener noreferrer">CMS</a>
          <a className="nav-link" href="https://clinicaltables.nlm.nih.gov/" target="_blank" rel="noopener noreferrer">NLM</a>
        </nav>
      </div>
    </header>
  );
}
