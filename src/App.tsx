import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Settings from './pages/Settings';
import { useAuth } from './hooks/useAuth';
import './styles/variables.css';
import './styles/utilities.css';
import './styles/themes/lightTheme.css';
import './styles/themes/darkTheme.css';

const App = () => {
  const [theme, setTheme] = useState('light'); // 'light' 또는 'dark'

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <AuthProvider>
      <div className={`theme-${theme}`}>
        <Router>
          <nav style={styles.nav}>
            <Link to="/" style={styles.link}>홈</Link>
            <Link to="/settings" style={styles.link}>설정</Link>
            <button onClick={toggleTheme} style={styles.themeButton}>
              {theme === 'light' ? '다크 모드' : '라이트 모드'}
            </button>
          </nav>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
};

const styles = {
  nav: {
    padding: '10px',
    backgroundColor: '#f0f0f0',
    marginBottom: '20px',
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  link: {
    textDecoration: 'none',
    color: '#333',
    fontWeight: 'bold',
  },
  themeButton: {
    marginLeft: 'auto',
    padding: '5px 10px',
    cursor: 'pointer',
  },
};

export default App;
