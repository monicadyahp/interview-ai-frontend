import React, { useEffect } from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AppRoutes from "./routes/AppRoutes";
import ChatAssistant from "./components/ChatAssistant";
import Header2 from "./components/Header2";
import { Navbar } from "./components/Navbar";

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

        <Navbar />
        <main className="main">
          <AppRoutes />
        </main>

        {/* Pindahkan ke sini, tepat di bawah main */}
        <ChatAssistant />

        <Footer />
      </div>
    </Router>
  );
}

export default App;
