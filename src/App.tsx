import { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { Layout } from './components/Layout/Layout';
import { HomePage } from './pages/HomePage';
import { NewsPage } from './pages/NewsPage';
import { LearnPage } from './pages/LearnPage';
import { LawsPage } from './pages/LawsPage';
import { SettingsPage } from './pages/SettingsPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'news':
        return <NewsPage />;
      case 'learn':
        return <LearnPage />;
      case 'laws':
        return <LawsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <ThemeProvider>
      <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
        {renderPage()}
      </Layout>
    </ThemeProvider>
  );
}

export default App;
