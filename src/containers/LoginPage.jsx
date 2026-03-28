import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { API_BASE_URL } from '../utils/constants';
import Swal from 'sweetalert2';
// Import Google Login & JWT Decoder
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

const LoginPage = () => {
    // Di dalam komponen LoginPage
    const [isLoading, setIsLoading] = useState(false);
    const [isRegister, setIsRegister] = useState(false);
    // Di bawah state isRegister (sekitar baris 15)
    const [passError, setPassError] = useState(false);
    const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // --- LOGIKA LOGIN GOOGLE ---
    // --- LOGIKA LOGIN GOOGLE ---
    // Ganti isi fungsi handleGoogleSuccess menjadi ini:
    const handleGoogleSuccess = async (credentialResponse) => {
        setIsLoading(true); 
        try {
            const decoded = jwtDecode(credentialResponse.credential);
            
            // KIRIM KE BACKEND UNTUK SYNC (Gunakan endpoint updateProfile yang sudah ada)
            const res = await axios.put(`${API_BASE_URL}/auth/profile/google-sync`, {
                username: decoded.name,
                email: decoded.email,
                profileImage: decoded.picture
            });

            // Simpan hasil dari DATABASE (bukan dari Google saja)
            const dbUser = { ...res.data, isGoogle: true };
            setUser(dbUser);
            localStorage.setItem('token', credentialResponse.credential);

            setIsLoading(false);
            Swal.fire({ title: 'Berhasil!', text: `Halo, ${decoded.name}!`, icon: 'success', timer: 2000, showConfirmButton: false })
                .then(() => navigate(location.state?.from || '/'));

        } catch (err) {
            setIsLoading(false);
            Swal.fire({ title: 'Gagal', text: 'Gagal sinkronisasi data database', icon: 'error' });
        }
    };

    // Baris 56 (Di dalam handleSubmit)
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // VALIDASI PASSWORD
        if (isRegister && formData.password !== formData.confirmPassword) {
            setPassError(true); // Aktifkan warna merah
            return Swal.fire({ 
                title: 'Gagal', 
                text: 'Konfirmasi password tidak cocok!', 
                icon: 'error',
                timer: 2000, // Hilang dalam 2 detik
                showConfirmButton: false // Hilangkan tombol OK
            });
        }

        setPassError(false); // Reset jika sudah benar
        try {
            // Cari bagian if (isRegister) di dalam handleSubmit (sekitar baris 73)
            if (isRegister) {
                await axios.post(`${API_BASE_URL}/auth/register`, formData);
                
                // PERBAIKAN DI SINI
                Swal.fire({ 
                    title: 'Berhasil!', 
                    text: 'Akun kamu sudah terdaftar. Silakan login ya!', 
                    icon: 'success',
                    timer: 2500, // Akan hilang otomatis dalam 2.5 detik
                    showConfirmButton: false // Menghilangkan tombol OK
                });
                
                setIsRegister(false);
            } else {
                const res = await axios.post(`${API_BASE_URL}/auth/login`, {
                    email: formData.email,
                    password: formData.password
                });
                setUser(res.data.user);
                localStorage.setItem('token', res.data.token);
                Swal.fire({ title: 'Selamat Datang!', text: `Mari berlatih untuk interview kamu, ${res.data.user.username}!`, icon: 'success', timer: 2000, showConfirmButton: false });
                const origin = location.state?.from || '/';
                navigate(origin);
            }
        } catch (err) {
            Swal.fire({ title: 'Oops...', text: err.response?.data?.msg || 'Gagal!', icon: 'error' });
        } finally {
            setIsLoading(false); // Matikan loading
        }
    };

    return (
        <section className="login-page-container" style={{ height: '100vh', overflow: 'hidden' }}>
            <div className="login-left-side" style={{ height: '100%' }}>
                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=1000" alt="Auth" className="login-hero-image" />
            </div>
            <div className="login-right-side" style={{ height: '100%', overflowY: 'auto', padding: '2rem 0' }}>
                <div className="login-form-wrapper">
                    <h2 className="login-title">{isRegister ? 'Buat Akun' : 'Selamat Datang'}</h2>
                    
                    <form className="login-form" onSubmit={handleSubmit}>
                        {isRegister && (
                            <div className="input-field-container">
                                <label>Nama Lengkap</label>
                                <input type="text" name="username" className="payment-input" required onChange={handleChange} />
                            </div>
                        )}
                        <div className="input-field-container">
                            <label>Email</label>
                            <input type="email" name="email" className="payment-input" required onChange={handleChange} />
                        </div>
                        <div className="input-field-container">
                            <label>Password</label>
                            <input type="password" name="password" className="payment-input" required onChange={handleChange} />
                        </div>

                        {/* KOLOM KONFIRMASI PASSWORD */}
                        {/* Cari bagian input Konfirmasi Password di bawah */}
                        {isRegister && (
                            <div className="input-field-container">
                                <label>Konfirmasi Password</label>
                                <input 
                                    type="password" 
                                    name="confirmPassword" 
                                    className="payment-input" 
                                    placeholder="Ulangi password"
                                    required 
                                    onChange={(e) => {
                                        handleChange(e);
                                        if (passError) setPassError(false); // Hilangkan merah saat user mulai mengetik ulang
                                    }}
                                    style={{ 
                                        borderColor: passError ? '#FF4D4D' : '#EAEAEA',
                                        borderWidth: passError ? '2px' : '1.5px'
                                    }}
                                />
                            </div>
                        )}

                        <button type="submit" className="btn-login-purple" disabled={isLoading}>
                            {isLoading ? <span className="loader-span">Mohon Tunggu...</span> : (isRegister ? 'Daftar' : 'Masuk')}
                        </button>
                    </form>

                    {/* --- DIVIDER --- */}
                    <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', color: '#ccc' }}>
                        <div style={{ flex: 1, height: '1px', background: '#eee' }}></div>
                        <span style={{ padding: '0 10px', fontSize: '0.8rem' }}>atau masuk dengan</span>
                        <div style={{ flex: 1, height: '1px', background: '#eee' }}></div>
                    </div>

                    {/* --- TOMBOL GOOGLE --- */}
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => Swal.fire('Gagal', 'Login Google Gagal', 'error')}
                            useOneTap
                            theme="outline"
                            shape="pill"
                        />
                    </div>

                    <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
                        {isRegister ? 'Sudah punya akun?' : 'Belum punya akun?'} {' '}
                        <span onClick={() => setIsRegister(!isRegister)} style={{ color: 'var(--primary-color)', cursor: 'pointer', fontWeight: 'bold' }}>
                            {isRegister ? 'Login' : 'Daftar'}
                        </span>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default LoginPage;