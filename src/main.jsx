import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext"; // Tambahkan ini
import { GoogleOAuthProvider } from "@react-oauth/google";
// Import CSS Global (Aesthetics Skin Design)
import "./App.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* Client ID harus sama dengan GOOGLE_CLIENT_ID di backend .env & origins di Google Console */}
    <GoogleOAuthProvider clientId="596272309967-7ol6vcpag8lot6tu28vq6i0nd7f2krc1.apps.googleusercontent.com">
      <AuthProvider>
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
);
