import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'; // Tambahkan ini
import './assets/css/styles.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Ganti dengan Client ID asli kamu */}
    <GoogleOAuthProvider clientId="158352528695-fupam1ncdn5fonnlhndc6a7vkgioke9b.apps.googleusercontent.com">
      <AuthProvider>
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>
)