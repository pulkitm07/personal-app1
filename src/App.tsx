import { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { Layout } from './components/Layout/Layout';
import { HomePage } from './pages/HomePage';
import { NewsPage } from './pages/NewsPage';
import { LearnPage } from './pages/LearnPage';
import { SettingsPage } from './pages/SettingsPage';
import { SleepPage } from './pages/SleepPage';

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
      case 'sleep':
        return <SleepPage />;
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

