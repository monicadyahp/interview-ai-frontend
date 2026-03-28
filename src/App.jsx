import React, { useEffect } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';import Header from './components/Header';
import Footer from './components/Footer';
import AppRoutes from './routes/AppRoutes';

// Import CSS Global (Aesthetics Skin Design)
import './assets/css/styles.css';

// 2. Buat fungsi bantuan kecil di dalam file yang sama (di atas function App)
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
};

function App() {
  return (
    <Router>
      <div className="App">
        {/* 3. Masukkan komponen ScrollToTop di sini, di bawah Router */}
        <ScrollToTop />
        
        <Header />
        <main className="main">
          <AppRoutes />
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;