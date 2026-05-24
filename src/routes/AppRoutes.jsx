import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

import LandingPage from '../containers/LandingPage';
import LoginPage from '../containers/LoginPage';
import InterviewRoom from '../containers/InterviewRoom';
import HistoryPage from '../containers/HistoryPage';
import Profile from '../containers/ProfilePage'; 

const AppRoutes = () => {
  return (
    <Routes>
      {/* Halaman Utama / Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Halaman Sign In — default mode isRegister=false */}
      <Route path="/login" element={<LoginPage />} />

      {/* Halaman Sign Up — alias ke LoginPage, isRegister akan true otomatis
          Catatan: karena LoginPage pakai internal state, kita redirect ke /login
          tapi kamu bisa extend LoginPage untuk terima prop/query param jika diperlukan */}
      <Route path="/signup" element={<Navigate to="/login" replace />} />

      {/* Halaman Interview (Protected) */}
      <Route
        path="/interview"
        element={
          <ProtectedRoute>
            <InterviewRoom />
          </ProtectedRoute>
        }
      />

      {/* Halaman Riwayat (Protected) */}
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <HistoryPage />
          </ProtectedRoute>
        }
      />

      {/* Halaman Profile (Protected) */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Halaman 404 */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h2
                className="text-[48px] font-bold text-[#8039FF]"
                style={{ fontFamily: 'Plus Jakarta Sans' }}
              >
                404
              </h2>
              <p
                className="text-[18px] text-[#666666] mt-2"
                style={{ fontFamily: 'Plus Jakarta Sans' }}
              >
                Halaman tidak ditemukan
              </p>
            </div>
          </div>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
