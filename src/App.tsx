import { useState } from 'react';
import { Header } from './components/Header';
import { SearchPage } from './components/SearchPage';
import { AdminLogin } from './components/AdminLogin';
import { RegisterOng } from './components/RegisterOng';
import { AdminDashboard } from './components/AdminDashboard';
import { DatabaseInitializer } from './components/DatabaseInitializer';
import { Toaster } from 'sonner@2.0.3';

export type Page = 'search' | 'admin' | 'register' | 'dashboard';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('search');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('search');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DatabaseInitializer />
      <Toaster position="top-right" richColors />
      <Header 
        currentPage={currentPage} 
        onNavigate={setCurrentPage} 
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />
      
      {currentPage === 'search' && <SearchPage />}
      {currentPage === 'admin' && <AdminLogin onLogin={handleLogin} />}
      {currentPage === 'register' && <RegisterOng onNavigate={setCurrentPage} />}
      {currentPage === 'dashboard' && <AdminDashboard onLogout={handleLogout} />}
    </div>
  );
}
