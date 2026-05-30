import React, { useEffect } from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import ChatAssistant from "./components/ChatAssistant";
import { Navbar } from "./layout/Navbar";
import Footer from "./layout/Footer";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
};

// Halaman yang TIDAK perlu Navbar & Footer landing page
const AUTH_AND_APP_ROUTES = [
  "/dashboard",
  "/interview",
  "/history",
  "/profile",
];

const AppContent = () => {
  const { pathname } = useLocation();
  const hideLayout = AUTH_AND_APP_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  return (
    <div className="App">
      <ScrollToTop />
      <main className="main">
        {!hideLayout && <Navbar />}
        <AppRoutes />
        {!hideLayout && <Footer />}
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
