import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Settings from './pages/Settings';
import { AuthProvider } from './hooks/useAuth';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <nav style={styles.nav}>
          <Link to="/" style={styles.link}>홈</Link>
          <Link to="/settings" style={styles.link}>설정</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

// 간단한 인라인 스타일링 예시
const styles = {
  nav: {
    padding: '10px',
    backgroundColor: '#f0f0f0',
    marginBottom: '20px',
    display: 'flex',
    gap: '10px',
  },
  link: {
    textDecoration: 'none',
    color: '#333',
    fontWeight: 'bold',
  },
};

export default App;
