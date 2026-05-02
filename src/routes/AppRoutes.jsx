import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import semua halaman dari folder containers
import LandingPage from '../containers/LandingPage';
import LoginPage from '../containers/LoginPage';
import InterviewRoom from '../containers/InterviewRoom';
import HistoryPage from '../containers/HistoryPage';
import ProfilePage from '../containers/ProfilePage';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Halaman Utama / Landing Page */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Halaman Login */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Halaman Utama Fitur AI (Interview) */}
            <Route path="/interview" element={<InterviewRoom />} />
            
            {/* Halaman Riwayat */}
            <Route path="/history" element={<HistoryPage />} />

            {/* Halaman Profile */}
            <Route path="/profile" element={<ProfilePage />} />
            
            {/* Halaman 404 (Opsional - Jika link tidak ditemukan) */}
            <Route path="*" element={<div className="section container"><h2>Halaman Tidak Ditemukan</h2></div>} />
        </Routes>
    );
};

export default AppRoutes;