import SearchBar from '../components/SearchBar';
import SEO from '../components/SEO';
import './NotFoundPage.css';

export default function NotFoundPage() {
  return (
    <div className="notfound container">
      <SEO
        title="Page not found"
        description="This page doesn't exist. Search ICD-10-CM diagnosis codes instead."
        path="/404"
        noindex
      />
      <h1>Page not found</h1>
      <p>The URL you followed doesn't match a page on this site. Try a code lookup instead.</p>
      <SearchBar />
    </div>
  );
}
