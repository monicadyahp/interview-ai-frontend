import React, { useEffect } from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import Header from "./components/Header";
import AppRoutes from "./routes/AppRoutes";
import ChatAssistant from "./components/ChatAssistant";
import { Navbar } from "./layout/Navbar";
import Footer from "./layout/Footer";

// 2. Buat fungsi bantuan kecil di dalam file yang sama (di atas function App)
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
};

function App() {
  return (
    <Router>
      <div className="App">
        <ScrollToTop />
        <main className="main">
          <Navbar />
          <AppRoutes />
          <Footer />
        </main>

        {/* Pindahkan ke sini, tepat di bawah main */}
        <ChatAssistant />
      </div>
    </Router>
  );
}

export default App;
