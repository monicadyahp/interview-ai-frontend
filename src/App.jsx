import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  useLocation,
} from "react-router-dom";

import Header from "./components/Header";
import AppRoutes from "./routes/AppRoutes";
import ChatAssistant from "./components/ChatAssistant";
import { Navbar } from "./layout/Navbar";
import Footer from "./layout/Footer";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return null;
};

const AppContent = () => {
  return (
    <div className="App">
      <ScrollToTop />

      <main className="main">
        <Navbar />

        <AppRoutes />
        
        <Footer />
      </main>

      <ChatAssistant />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;