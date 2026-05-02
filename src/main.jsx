import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext"; // Tambahkan ini
import { GoogleOAuthProvider } from "@react-oauth/google";
// Import CSS Global (Aesthetics Skin Design)
import "./App.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* Ganti dengan Client ID asli kamu */}
    <GoogleOAuthProvider clientId="158352528695-fupam1ncdn5fonnlhndc6a7vkgioke9b.apps.googleusercontent.com">
      <AuthProvider>
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
);
