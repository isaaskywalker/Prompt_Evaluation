import React, { useState, useEffect } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link, 
  useLocation,
  Navigate 
} from 'react-router-dom';
import Home from './pages/Home';
import Settings from './pages/Settings';
import { AuthProvider, useAuth } from './hooks/useAuth';
import './styles/global.css';

type Theme = 'light' | 'dark';

interface NavItem {
  path: string;
  label: string;
  requiresAuth?: boolean;
}

const navItems: NavItem[] = [
  { path: '/', label: '홈' },
  { path: '/settings', label: '설정', requiresAuth: true }
];

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-blue-500"></div>
  </div>
);

const Navigation = () => {
  const location = useLocation();
  const { currentUser, signInWithGoogle, signOut, loading } = useAuth();

  if (loading) return null;

  return (
    <nav className="fixed top-0 w-full bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex gap-6">
            {navItems.map(({ path, label, requiresAuth }) => (
              (!requiresAuth || currentUser) && (
                <Link
                  key={path}
                  to={path}
                  className={`text-gray-800 hover:text-gray-600 transition-colors px-3 py-2 rounded-md text-sm font-medium
                    ${location.pathname === path ? 'bg-gray-100' : ''}`}
                >
                  {label}
                </Link>
              )
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            {currentUser ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-700">
                  {currentUser.displayName || currentUser.email}
                </span>
                <button
                  onClick={() => signOut()}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <button
                onClick={() => signInWithGoogle()}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Google 로그인
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!currentUser) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen pt-16">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme as Theme) || 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <AuthProvider>
      <Router>
        <div className={`theme-${theme} min-h-screen bg-gray-50`}>
          <Navigation />
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } 
              />
              <Route
                path="*"
                element={
                  <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      페이지를 찾을 수 없습니다
                    </h2>
                    <Link 
                      to="/" 
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      홈으로 돌아가기
                    </Link>
                  </div>
                }
              />
            </Routes>
          </Layout>
          
          <button
            onClick={toggleTheme}
            className="fixed bottom-4 right-4 p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;