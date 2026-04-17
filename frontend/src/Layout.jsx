import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { AppProvider } from './state/AppContext';

export default function Layout() {
  return (
    <AppProvider>
      <div className="app">
        <Header />
        <main className="main"><Outlet /></main>
        <Footer />
      </div>
    </AppProvider>
  );
}
