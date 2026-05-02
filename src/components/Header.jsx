import React, { useState, useContext, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Tambahkan useNavigate jika perlu redirect
import { AuthContext } from '../context/AuthContext';
import Swal from 'sweetalert2'; // Pastikan sudah import ini

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            // Jika scroll lebih dari 20 pixel, aktifkan bayangan
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // --- FUNGSI LOGOUT DENGAN SWEETALERT ---
    // --- FUNGSI LOGOUT DENGAN SWEETALERT ---
    const handleLogout = async () => {
        // Tutup dropdown agar tidak mengganggu visual pop-up
        setIsProfileDropdownOpen(false);

        const result = await Swal.fire({
            title: 'Apakah kamu yakin?',
            text: "Kamu akan keluar dari sesi latihan ini.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#8C5EAD',
            cancelButtonColor: '#FF4D4D',
            confirmButtonText: 'Ya, Logout!',
            cancelButtonText: 'Batal'
        });
        // Header.jsx
        if (result.isConfirmed) {
            await Swal.fire({
                title: 'Berhasil Keluar!',
                text: 'Sampai jumpa lagi di sesi berikutnya.',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });

            logout(); 
            navigate('/'); // KEMBALI KE ROOT (Landing Page)
        }
    };

    return (
        // Cari tag <header ... > dan ganti bagian style-nya menjadi ini:
        <header className="header" style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100%', 
            backgroundColor: '#FFF', 
            zIndex: 1000, 
            // DYNAMIC SHADOW: Jika discroll muncul bayangan tebal, jika tidak maka bersih (none)
            boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.08)' : 'none',
            transition: '0.3s ease-in-out' // Agar bayangan munculnya halus
        }}>
            <nav className="nav container" style={{ height: '70px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                
                {/* LOGO */}
                <Link to="/" className="nav__logo" style={{ color: '#8C5EAD', fontWeight: '700', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                    <i className='bx bx-brain'></i> Interview-AI
                </Link>

                {/* --- MENU NAVIGASI UTAMA --- */}
                <div className={`nav__menu ${isMenuOpen ? 'show-menu' : ''}`} style={{ transition: '0.4s' }}>
                    <ul className="nav__list" style={{ display: 'flex', alignItems: 'center', gap: '20px', listStyle: 'none', margin: 0, padding: 0 }}>
                        <li>
                            <Link to="/" className={`nav__link ${location.pathname === '/' ? 'active-link' : ''}`} onClick={() => setIsMenuOpen(false)}>
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/interview" className={`nav__link ${location.pathname === '/interview' ? 'active-link' : ''}`} onClick={() => setIsMenuOpen(false)}>
                                Interview AI
                            </Link>
                        </li>
                        {/* TOMBOL LOGIN DI DALAM LIST SUDAH DIHAPUS */}
                    </ul>
                    <div className="nav__close" onClick={() => setIsMenuOpen(false)}><i className='bx bx-x'></i></div>
                </div>

                {/* --- SEKSI KANAN --- */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    {user && (
                        /* TAMPILAN DROPDOWN HANYA MUNCUL JIKA SUDAH LOGIN */
                        <div className="nav__profile-container" style={{ position: 'relative' }}>
                            <div 
                                className="nav__profile-toggle" 
                                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', userSelect: 'none' }}
                            >
                                <img 
                                    src={user.profileImage || `https://ui-avatars.com/api/?name=${user.username}&background=8C5EAD&color=fff`} 
                                    alt="Avatar" 
                                    referrerPolicy="no-referrer" // Tambahkan ini
                                    style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #F3EAFB' }} 
                                />

                                {/* GANTI bagian <span> nama user menjadi seperti ini: */}
                                <span style={{ 
                                    fontSize: '0.9rem', 
                                    fontWeight: '600', 
                                    color: '#444',
                                    maxWidth: '100px', // Perkecil sedikit agar pas untuk 1 kata
                                    overflow: 'hidden', 
                                    textOverflow: 'ellipsis', 
                                    whiteSpace: 'nowrap' 
                                }}>
                                    {/* Logika: Ambil nama, pecah berdasarkan spasi, ambil kata ke-0 (paling depan) */}
                                    {user.username ? user.username.split(' ')[0] : 'User'}
                                </span>

                                <i className={`bx bx-chevron-down ${isProfileDropdownOpen ? 'bx-rotate-180' : ''}`} style={{ color: '#888', transition: '0.3s' }}></i>
                            </div>

                            {/* MENU DROPDOWN */}
                            {isProfileDropdownOpen && (
                                <div className="nav__profile-dropdown reveal-from-top" style={{ position: 'absolute', top: '50px', right: 0, width: '220px', backgroundColor: '#FFF', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: '15px', border: '1px solid #F3EAFB', zIndex: 1100 }}>
                                    <div style={{ marginBottom: '12px', paddingBottom: '10px', borderBottom: '1px solid #F3EAFB' }}>
                                        <p style={{ fontWeight: '600', color: '#333', margin: 0, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.username}</p>
                                        <p style={{ fontSize: '0.7rem', color: '#999', margin: 0 }}>{user.email}</p>
                                    </div>
                                    
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                        <li>
                                            <Link to="/profile" className="dropdown__link" onClick={() => setIsProfileDropdownOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#555', textDecoration: 'none', padding: '8px', borderRadius: '6px', fontSize: '0.85rem' }}>
                                                <i className='bx bx-user'></i> Profile Saya
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/history" className="dropdown__link" onClick={() => setIsProfileDropdownOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#555', textDecoration: 'none', padding: '8px', borderRadius: '6px', fontSize: '0.85rem' }}>
                                                <i className='bx bx-history'></i> History Simulasi
                                            </Link>
                                        </li>
                                        <li style={{ marginTop: '5px', paddingTop: '5px', borderTop: '1px solid #F8F5FA' }}>
                                            {/* Ganti bagian button logout di dalam dropdown menjadi ini: */}
                                            <button 
                                                onClick={handleLogout} 
                                                style={{ 
                                                    background: 'none', 
                                                    color: '#FF4D4D', 
                                                    cursor: 'pointer', 
                                                    border: 'none', 
                                                    fontWeight: '600', 
                                                    width: '100%', 
                                                    textAlign: 'left', 
                                                    padding: '8px', 
                                                    fontSize: '0.85rem', 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    gap: '10px' 
                                                }}
                                                >
                                                <i className='bx bx-log-out'></i> Logout
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                    {/* TOMBOL LOGIN DI SEBELAH HAMBURGER JUGA SUDAH DIHAPUS */}

                    {/* TOGGLE HAMBURGER (Untuk Mobile) */}
                    <div className="nav__toggle" onClick={() => setIsMenuOpen(true)} style={{ fontSize: '1.5rem', cursor: 'pointer', color: '#333' }}>
                        <i className='bx bx-grid-alt'></i>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;