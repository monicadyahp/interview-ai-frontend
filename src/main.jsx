import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext"; // Tambahkan ini
import { GoogleOAuthProvider } from "@react-oauth/google";
// Import CSS Global (Aesthetics Skin Design)
import "./App.css";

// Client ID diambil dari env (VITE_GOOGLE_CLIENT_ID), dengan fallback ke nilai
// produksi agar build tidak pernah memakai Client ID yang salah.
const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  "596272309967-7ol6vcpag8lot6tu28vq6i0nd7f2krc1.apps.googleusercontent.com";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
);
