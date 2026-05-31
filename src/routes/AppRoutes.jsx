import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

import LandingPage from '../containers/LandingPage';
import LoginPage from '../containers/LoginPage';
import Dashboard from '../containers/Dashboard';
import InterviewRoom from '../containers/InterviewRoom';
import HistoryPage from '../containers/HistoryPage';
import ProfilePage from '../containers/ProfilePage';
import ChatbotPage from "../containers/ChatbotPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<Navigate to="/login?mode=signup" replace />} />

      {/* Dashboard (Protected) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Interview (Protected) */}
      <Route
        path="/interview"
        element={
          <ProtectedRoute>
            <InterviewRoom />
          </ProtectedRoute>
        }
      />

      {/* History (Protected) */}
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <HistoryPage />
          </ProtectedRoute>
        }
      />

      {/* Chatbot (Protected) */}
      <Route 
        path="/chatbot" 
        element={
        <ProtectedRoute>
            <ChatbotPage />
          </ProtectedRoute>
        } 
      />

      {/* Profile / Setting (Protected) */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h2
                className="text-[48px] font-bold text-[#8039FF]"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                404
              </h2>
              <p
                className="text-[18px] text-[#666666] mt-2"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
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
