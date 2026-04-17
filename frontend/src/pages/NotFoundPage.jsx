import SearchBar from '../components/SearchBar';
import './NotFoundPage.css';

export default function NotFoundPage() {
  return (
    <div className="notfound container">
      <h1>Page not found</h1>
      <p>The URL you followed doesn't match a page on this site. Try a code lookup instead.</p>
      <SearchBar />
    </div>
  );
}
