import React, { useEffect, useState, useContext, useRef } from 'react';
import { getHistory } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import Swal from 'sweetalert2';
import { toPng } from 'html-to-image';
import { QRCodeCanvas } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';

const HistoryPage = () => {
    const [histories, setHistories] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Set default ke true
    const [selectedHistory, setSelectedHistory] = useState(null);
    const { user } = useContext(AuthContext);
    const exportAreaRef = useRef(null);
    const navigate = useNavigate(); // <--- TAMBAHKAN BARIS INI
    // Tambahkan di bawah const navigate = useNavigate();
    const emotionColors = {
        Happy: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',    // Hijau
        Neutral: 'linear-gradient(135deg, #8C5EAD 0%, #6A4687 100%)',  // Ungu (Default)
        Sad: 'linear-gradient(135deg, #2196F3 0%, #1565C0 100%)',      // Biru
        Angry: 'linear-gradient(135deg, #F44336 0%, #C62828 100%)',    // Merah
        Fear: 'linear-gradient(135deg, #FF9800 0%, #E65100 100%)',     // Oranye
        Surprised: 'linear-gradient(135deg, #FFD700 0%, #FFA000 100%)',// Kuning Emas
        Disgust: 'linear-gradient(135deg, #795548 0%, #4E342E 100%)',  // Cokelat
    };
    const [filterDate, setFilterDate] = useState('');
    const [filterEmotion, setFilterEmotion] = useState('');
    const [filterQuestion, setFilterQuestion] = useState('');

    useEffect(() => {
        if (user?.id) loadHistory();
    }, [user]);

    const loadHistory = async () => {
        setIsLoading(true); // Mulai loading
        try {
            const data = await getHistory(user.id);
            const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setHistories(sortedData);
        } catch (err) {
            console.error("Gagal muat history");
        } finally {
            setIsLoading(false); // Selesai loading, apa pun hasilnya
        }
    };

    const exportImage = async () => {
        if (exportAreaRef.current === null) return;
        Swal.fire({
            title: 'Menciptakan Story...',
            html: 'Menyiapkan desain terbaik untukmu...',
            allowOutsideClick: false,
            didOpen: () => { Swal.showLoading(); }
        });

        try {
            await new Promise(resolve => setTimeout(resolve, 600));
            const dataUrl = await toPng(exportAreaRef.current, {
                cacheBust: true,
                pixelRatio: 3,
                backgroundColor: '#ffffff'
            });

            const link = document.createElement('a');
            link.download = `InterviewAI-Story-${selectedHistory?._id.slice(-5)}.png`;
            link.href = dataUrl;
            link.click();

            // --- PERBAIKAN DI SINI ---
            Swal.fire({
                title: 'Berhasil!',
                text: 'Gambar Instastory telah disimpan.',
                icon: 'success',
                showConfirmButton: false, // Menghilangkan tombol OK
                timer: 2000,              // Akan hilang otomatis dalam 2 detik
                timerProgressBar: true    // Opsional: indikator waktu jalan
            });

            // -------------------------
        } catch (err) {
            console.error("Export Error:", err);
            Swal.fire('Gagal', 'Gagal memproses gambar. Coba lagi ya.', 'error');
        }
    };

    const shareImage = async () => {
        if (exportAreaRef.current === null) return;
        try {
            const dataUrl = await toPng(exportAreaRef.current, { cacheBust: true, pixelRatio: 2 });
            const blob = await (await fetch(dataUrl)).blob();
            const file = new File([blob], 'InterviewAI-Story.png', { type: 'image/png' });
            if (navigator.share) {
                await navigator.share({ title: 'Simulasi Interview AI', files: [file] });
            } else { Swal.fire('Info', 'Gunakan fitur Download untuk berbagi.', 'info'); }
        } catch (err) { console.error(err); }
    };

    const copyToClipboard = (text) => {
        if (!text || text === "-") {
            Swal.fire('Info', 'Tidak ada jawaban untuk disalin.', 'info');
            return;
        }
        navigator.clipboard.writeText(text);
        Swal.fire({
            icon: 'success',
            title: 'Tersalin!',
            text: 'Draf jawaban berhasil disalin ke clipboard.',
            timer: 1500,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
        });
    };

    const deleteHistoryItem = async (e, id) => {
        e.stopPropagation(); // Agar tidak memicu modal detail saat klik tong sampah
        // 1. Pop up Konfirmasi
        const result = await Swal.fire({
            title: 'Hapus?',
            text: "Yakin Anda ingin menghapus riwayat ini?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Tidak'
        });

        if (result.isConfirmed) {
            // 2. Tampilkan Loading saat proses hapus berlangsung
            Swal.fire({
                title: 'Sedang menghapus riwayat...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            try {
                // Proses hapus ke API
                await axios.delete(`${API_BASE_URL}/history/${id}`);
                // Update state local agar tampilan lgsg berubah
                setHistories(histories.filter(item => item._id !== id));
                if(selectedHistory?._id === id) setSelectedHistory(null);

                // 3. Pop up Sukses
                Swal.fire({
                    title: 'Terhapus!',
                    text: 'Riwayat sudah terhapus.',
                    icon: 'success',
                    timer: 1500, // Hilang otomatis dalam 1.5 detik
                    showConfirmButton: false
                });

            } catch (err) {
                console.error("Gagal hapus:", err);
                Swal.fire('Gagal!', 'Terjadi kesalahan saat menghapus data.', 'error');
            }
        }
    };

    // Tambahkan logika ini sebelum "if (isLoading)"
    const filteredHistories = histories.filter(item => {
        const matchesDate = filterDate ? new Date(item.createdAt).toLocaleDateString('en-CA') === filterDate : true;
        const matchesEmotion = filterEmotion ? item.emotion === filterEmotion : true;
        // TAMBAHKAN BARIS INI: filter berdasarkan teks pertanyaan
        const matchesQuestion = filterQuestion ? item.question.toLowerCase().includes(filterQuestion.toLowerCase()) : true;
        
        return matchesDate && matchesEmotion && matchesQuestion;
    });

    // --- KODE BARU: LOGIKA STATISTIK ---
    const getMonthlyStats = () => {
        if (histories.length === 0) return null;
        const now = new Date();
        const thisMonth = histories.filter(item => {
            const d = new Date(item.createdAt);
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        });

        if (thisMonth.length === 0) return null;

        // Hitung rata-rata durasi
        const totalDuration = thisMonth.reduce((acc, item) => acc + (item.duration || 0), 0);
        const avgDuration = Math.round(totalDuration / thisMonth.length);

        const counts = {};
        thisMonth.forEach(item => counts[item.emotion] = (counts[item.emotion] || 0) + 1);
        const topEmotion = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
        
        return { emotion: topEmotion, count: counts[topEmotion], avgDuration: avgDuration };
    };
    const stats = getMonthlyStats();
    // ------------------------------------

    // --- KODE BARU: LOGIKA GRAFIK MINGGUAN ---
    const getWeeklyChartData = () => {
        const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
        return [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateString = d.toLocaleDateString('en-CA');
            const count = histories.filter(h => 
                new Date(h.createdAt).toLocaleDateString('en-CA') === dateString
            ).length;
            return { label: days[d.getDay()], count };
        }).reverse();
    };
    const weeklyData = getWeeklyChartData();
    const maxCount = Math.max(...weeklyData.map(d => d.count), 1); // Untuk skala tinggi grafik

    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                flexDirection: 'column',
                color: '#8C5EAD'
            }}>

                <div className="spinner" style={{
                    width: '50px',
                    height: '50px',
                    border: '5px solid #F3EAFB',
                    borderTop: '5px solid #8C5EAD',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}></div>
                <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>Memuat Riwayat...</p>
                <style>{`
                    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                `}</style>
            </div>
        );
    }

    return (
        <section className="section container" style={{ paddingTop: '7rem', paddingBottom: '5rem' }}>
            {/* Tambahkan Style khusus untuk responsif modal */}
            <style>{`
            .chart-container {
                background: #FFF;
                padding: 20px;
                border-radius: 25px;
                border: 1px solid #F3EAFB;
                margin-bottom: 2rem;
                box-shadow: 0 10px 30px rgba(140, 94, 173, 0.03);
            }
            .chart-title {
                font-size: 0.9rem;
                font-weight: 800;
                color: #8C5EAD;
                margin-bottom: 1.5rem;
                text-align: center;
            }
            .chart-bars {
                display: flex;
                justify-content: space-around;
                align-items: flex-end;
                height: 120px; /* Tinggi maksimal grafik */
                gap: 10px;
            }
            .bar-wrapper {
                display: flex;
                flex-direction: column;
                align-items: center;
                flex: 1;
            }
            .bar-fill {
                width: 100%;
                max-width: 30px;
                background: linear-gradient(180deg, #8C5EAD 0%, #DBC6EB 100%);
                border-radius: 8px 8px 4px 4px;
                transition: height 1s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
            }
            .bar-count {
                position: absolute;
                top: -20px;
                width: 100%;
                text-align: center;
                font-size: 0.7rem;
                font-weight: 800;
                color: #8C5EAD;
            }
            .bar-label {
                margin-top: 10px;
                font-size: 0.7rem;
                font-weight: 600;
                color: #AAA;
            }
            .stats-banner {
                display: flex;
                justify-content: center;
                margin-bottom: 20px;
            }

            .stats-pill {
                background: #FDFBFF;
                padding: 12px 25px;
                border-radius: 50px;
                border: 1px dashed #8C5EAD;
                display: flex;
                align-items: center;
                gap: 12px;
                box-shadow: 0 5px 15px rgba(140, 94, 173, 0.05);
            }

            .stats-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .stats-text {
                font-size: 0.85rem;
                color: #555;
                font-weight: 600;
            }

            .stats-highlight {
                color: #8C5EAD;
                font-weight: 800;
                text-transform: uppercase;
            }
            /* Gaya untuk Baris Filter */
            .filter-container {
                display: flex;
                justify-content: center;
                gap: 20px;
                margin-bottom: 3rem;
                flex-wrap: wrap;
                background: #FFF;
                padding: 1.5rem;
                border-radius: 20px;
                box-shadow: 0 10px 25px rgba(140, 94, 173, 0.05);
                border: 1px solid #F3EAFB;
            }

            .filter-group {
                display: flex;
                align-items: center;
                gap: 10px;
                background: #FDFBFF;
                padding: 8px 15px;
                border-radius: 15px;
                border: 1px solid #EFE9F5;
                transition: 0.3s;
            }

            .filter-group:focus-within {
                border-color: #8C5EAD;
                box-shadow: 0 0 0 3px rgba(140, 94, 173, 0.1);
            }

            .filter-input {
                border: none;
                background: none;
                outline: none;
                color: #555;
                font-weight: 600;
                font-size: 0.9rem;
            }

            .filter-icon {
                color: #8C5EAD;
                font-size: 1.2rem;
            }

            .btn-reset-filter {
                background: #FFE5E5;
                color: #FF4D4D;
                border: none;
                padding: 10px 20px;
                border-radius: 12px;
                font-weight: 700;
                font-size: 0.8rem;
                cursor: pointer;
                transition: 0.3s;
                display: flex;
                align-items: center;
                gap: 5px;
            }

            .btn-reset-filter:hover {
                background: #FF4D4D;
                color: #FFF;
            }
                .swal2-container {
                    z-index: 3000 !important; /* Pastikan lebih tinggi dari 2000 (z-index modal) */
                }
                .modal-header-custom {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                    padding-right: 40px; /* Beri ruang agar tidak tabrakan dengan tombol X */
                }
                .modal-actions-custom { display: flex; gap: 10px; }
                /* Tombol Close di Pojok Kanan Atas */
                .close-btn-custom {
                    position: absolute;
                    top: 25px;
                    right: 25px;
                    background: #F8F5FA;
                    border: none;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 100;
                }

                /* Area konten yang bisa di-scroll */
                .modal-scroll-area {
                    max-height: 65vh;
                    overflow-y: auto;
                    padding-right: 10px;
                }

                /* Desktop View: Foto di samping teks */
                .modal-info-flex { display: flex; gap: 20px; margin-bottom: 1.5rem; align-items: stretch; }
                /* Responsive Mobile */
                @media screen and (max-width: 576px) {
                    .modal-header-custom { flex-direction: column; align-items: flex-start; gap: 1rem; padding-right: 0; }
                    .modal-actions-custom { width: 100%; justify-content: center; flex-wrap: wrap; margin-bottom: 1rem; }
                    /* Foto pindah ke ATAS TENGAH di mobile */
                    .modal-info-flex { flex-direction: column !important; align-items: center !important; text-align: center; }
                    .modal-photo-wrapper { width: 150px !important; height: 120px !important; margin-bottom: 10px; }
                    .modal-content {
                        padding: 1.5rem !important;
                        width: 95% !important;
                        border-radius: 25px !important;
                        max-height: 90vh !important; /* Batasi tinggi agar tidak keluar layar */
                        display: flex !important;
                        flex-direction: column !important;
                    }
                    .close-btn-custom { top: 15px; right: 15px; width: 35px; height: 35px; }
                    .stats-pill {
                        flex-direction: column; /* Ikon petir di atas, teks di bawah */
                        border-radius: 25px;
                        padding: 15px;
                    }
                    .stats-content {
                        flex-direction: column; /* Teks emosi dan durasi jadi atas bawah */
                        gap: 5px;
                    }
                    .stats-separator {
                        display: none; /* Sembunyikan garis '|' di mobile */
                    }
                }
            `}</style>

            <h2 className="section__title" style={{ textAlign: 'center', marginBottom: '3rem' }}>Riwayat Simulasi</h2>
            {/* --- KODE BARU: BANNER STATISTIK --- */}
            {stats && (
                <div className="stats-banner reveal-from-top">
                    <div className="stats-pill">
                        <div className="stats-content">
                            <span className="stats-text">
                                Terbanyak: <span className="stats-highlight">{stats.emotion}</span> ({stats.count}x)
                            </span>
                            
                            {/* Garis pemisah ini akan hilang di mobile berkat CSS di atas */}
                            <span className="stats-separator" style={{ color: '#EFE9F5' }}>|</span>
                            
                            <span className="stats-text">
                                Rata-rata Durasi: <span className="stats-highlight">{stats.avgDuration} s</span>
                            </span>
                        </div>
                    </div>
                </div>
            )}
            {/* --- KODE BARU: VISUAL CHART MINGGUAN --- */}
            {histories.length > 0 && (
                <div className="chart-container reveal-from-bottom">
                    <p className="chart-title"><i className='bx bx-stats'></i> Aktivitas 7 Hari Terakhir</p>
                    <div className="chart-bars">
                        {weeklyData.map((data, idx) => (
                            <div key={idx} className="bar-wrapper">
                                <div 
                                    className="bar-fill" 
                                    style={{ height: `${(data.count / maxCount) * 100}%`, minHeight: data.count > 0 ? '10px' : '2px' }}
                                >
                                    {data.count > 0 && <span className="bar-count">{data.count}</span>}
                                </div>
                                <span className="bar-label">{data.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {/* ---------------------------------- */}            
            {/* --- UI FILTER YANG DIPERBAIKI --- */}
            <div className="filter-container reveal-from-top">
                {/* TAMBAHKAN BOX SEARCH INI */}
                <div className="filter-group" style={{ flex: '1 1 300px' }}>
                    <i className='bx bx-search filter-icon'></i>
                    <input 
                        type="text" 
                        className="filter-input" 
                        placeholder="Cari pertanyaan..." 
                        value={filterQuestion}
                        onChange={(e) => setFilterQuestion(e.target.value)}
                        style={{ width: '100%' }}
                    />
                </div>
                {/* Filter Tanggal */}
                <div className="filter-group">
                    <i className='bx bx-calendar filter-icon'></i>
                    <input 
                        type="date" 
                        className="filter-input"
                        value={filterDate} 
                        onChange={(e) => setFilterDate(e.target.value)}
                    />
                </div>

                {/* Filter Emosi */}
                <div className="filter-group">
                    <i className='bx bx-smile filter-icon'></i>
                    <select 
                        className="filter-input"
                        value={filterEmotion} 
                        onChange={(e) => setFilterEmotion(e.target.value)}
                    >
                        <option value="">Semua Emosi</option>
                        <option value="Neutral">Neutral</option>
                        <option value="Happy">Happy</option>
                        <option value="Sad">Sad</option>
                        <option value="Angry">Angry</option>
                        <option value="Fear">Fear</option>
                        <option value="Surprised">Surprised</option>
                        <option value="Disgust">Disgust</option>
                    </select>
                </div>

                {/* UPDATE TOMBOL RESET (Tambahkan setFilterQuestion) */}
                {(filterDate || filterEmotion || filterQuestion) && (
                    <button className="btn-reset-filter" onClick={() => { setFilterDate(''); setFilterEmotion(''); setFilterQuestion(''); }}>
                        <i className='bx bx-refresh'></i> Reset
                    </button>
                )}
            </div>
            {/* --- AKHIR BAGIAN FILTER --- */}

            {/* LOGIC EMPTY STATE MULAI DI SINI */}
            {filteredHistories.length > 0 ? (
                // Jika ada data, tampilkan Grid
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                    {filteredHistories.map((item, index) => (
                        <div key={index} className="reveal-from-bottom" onClick={() => setSelectedHistory(item)} style={{ background: '#FFF', padding: '1.5rem', borderRadius: '28px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #F3EAFB', position: 'relative', cursor: 'pointer', transition: '0.3s' }}>
                            {/* Tombol Hapus */}
                            <button onClick={(e) => deleteHistoryItem(e, item._id)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: '#FF4D4D', cursor: 'pointer', zIndex: 10 }}><i className='bx bx-trash'></i></button>

                            {/* BAGIAN ATAS: FOTO & WAKTU */}
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '1.2rem' }}>
                                {/* Foto Selfie Kecil */}
                                <div style={{ width: '55px', height: '55px', borderRadius: '12px', overflow: 'hidden', border: '2px solid #F3EAFB', flexShrink: 0, background: '#f9f9f9' }}>
                                    {item.userPhoto ? (
                                        <img src={item.userPhoto} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', fontSize: '0.5rem', color: '#CCC' }}>N/A</div>
                                    )}
                                </div>

                                {/* Info Tanggal & Jam Detail */}
                                <div>
                                    <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#8C5EAD' }}>
                                        {new Date(item.createdAt).toLocaleDateString('id-ID')}
                                    </span>
                                    <span style={{ display: 'block', fontSize: '0.7rem', color: '#AAA', marginBottom: '4px' }}>
                                        Pukul: {new Date(item.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                    </span>
                                    <span style={{ background: '#F3EAFB', color: '#8C5EAD', padding: '2px 8px', borderRadius: '10px', fontSize: '0.65rem', fontWeight: 'bold' }}>{item.duration || 0}s</span>
                                </div>
                            </div>

                            {/* Pertanyaan (Maksimal 2 baris agar rapi) */}
                            <p style={{ fontSize: '0.85rem', color: '#333', fontWeight: '700', marginBottom: '5px', display: '-webkit-box', WebkitLineClamp: '1', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                "{item.question}"
                            </p>

                            {/* JAWABAN SINGKAT (Maksimal 30 Karakter) */}
                            <p style={{ fontSize: '0.75rem', color: '#666', marginBottom: '12px', fontStyle: 'italic', borderLeft: '2px solid #F3EAFB', paddingLeft: '8px' }}>
                                Jawaban: {item.answer ? (item.answer.length > 30 ? item.answer.substring(0, 30) + "..." : item.answer) : "-"}
                            </p>

                            {/* Emosi Dominan */}
                            <div style={{ 
                                // Logic: Ambil dari objek warna berdasarkan emosi, jika tidak ada (null/salah ketik) gunakan warna Ungu default
                                background: emotionColors[item.emotion] || 'linear-gradient(135deg, #8C5EAD 0%, #6A4687 100%)', 
                                color: '#FFF', 
                                padding: '0.8rem', 
                                borderRadius: '15px',
                                transition: '0.3s' // Efek halus saat warna berubah
                            }}>
                                <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: '700' }}>Dominan: {item.emotion}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                // Jika data KOSONG, tampilkan gambar orang dan tombol
                <div style={{ 
                    textAlign: 'center', 
                    padding: '3rem 1rem', 
                    background: '#FFF', 
                    borderRadius: '30px', 
                    boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
                    border: '1px solid #F3EAFB'
                }}>
                    <img 
                        src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=1000" 
                        alt="Belum ada riwayat" 
                        style={{ 
                            width: '200px', 
                            height: '150px', 
                            objectFit: 'cover', 
                            borderRadius: '20px', 
                            marginBottom: '1.5rem',
                            border: '3px solid #F3EAFB'
                        }} 
                    />
                    <h3 style={{ color: '#8C5EAD', marginBottom: '0.5rem' }}>Kamu belum punya riwayat simulasi</h3>
                    <p style={{ color: '#666', marginBottom: '2rem' }}>Ayo, mulai simulasi pertamamu sekarang!</p>
                    
                    <button 
                        onClick={() => navigate('/interview')} 
                        className="button"
                        style={{ padding: '12px 35px' }}
                    >
                        Mulai Simulasi <i className='bx bx-right-arrow-alt' style={{ marginLeft: '8px' }}></i>
                    </button>
                </div>
                )}  {/* <--- PASTIKAN ADA TANDA INI DI SINI */}
                {selectedHistory && (
                    <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }} onClick={() => setSelectedHistory(null)}>
                        <div className="modal-content" style={{ background: '#FFF', width: '100%', maxWidth: '750px', borderRadius: '35px', padding: '2.5rem', position: 'relative', boxShadow: '0 25px 60px rgba(0,0,0,0.2)' }} onClick={(e) => e.stopPropagation()}>
                            {/* TOMBOL CLOSE (Sekarang mandiri di pojok kanan atas) */}
                            <button onClick={() => setSelectedHistory(null)} className="close-btn-custom">
                                <i className='bx bx-x' style={{ fontSize: '1.5rem', color: '#333' }}></i>
                            </button>
                            <div className="modal-header-custom">
                                <h3 style={{ color: '#8C5EAD', margin: 0 }}><i className='bx bx-detail'></i> Detail</h3>
                                <div className="modal-actions-custom">
                                    {/* TOMBOL SALIN (Tambahkan ini) */}
                                    <button 
                                        onClick={() => copyToClipboard(selectedHistory.answer)} 
                                        style={{ background: '#E3F2FD', color: '#2196F3', border: 'none', padding: '10px 18px', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem' }}
                                    >
                                        <i className='bx bx-copy'></i> Salin
                                    </button>
                                    <button onClick={(e) => deleteHistoryItem(e, selectedHistory._id)} style={{ background: '#FFE5E5', color: '#FF4D4D', border: 'none', padding: '10px 18px', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem' }}><i className='bx bx-trash'></i> Hapus</button>
                                    <button onClick={exportImage} style={{ background: '#F3EAFB', color: '#8C5EAD', border: 'none', padding: '10px 18px', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem' }}><i className='bx bx-download'></i> Export</button>
                                    <button onClick={shareImage} style={{ background: '#8C5EAD', color: '#FFF', border: 'none', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem' }}><i className='bx bx-share-alt'></i> Share</button>
                                </div>
                            </div>

                            {/* AREA SCROLL: Pakai className yang sudah kamu buat di CSS */}
                            <div className="modal-scroll-area" style={{ flex: 1 }}>
                                {/* CONTAINER FOTO & PERTANYAAN */}
                                <div className="modal-info-flex">
                                    <div className="modal-photo-wrapper" style={{ width: '160px', height: '120px', borderRadius: '15px', border: '3px solid #8C5EAD', overflow: 'hidden', flexShrink: 0 }}>
                                        {selectedHistory.userPhoto ? (
                                            <img src={selectedHistory.userPhoto} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ background: '#f0f0f0', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#999' }}>No Photo</div>
                                        )}
                                    </div>
                                    <div style={{ flex: 1, background: '#FDFBFF', border: '1px solid #F3EAFB', padding: '1.5rem', borderRadius: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <p style={{ fontSize: '0.7rem', color: '#8C5EAD', fontWeight: '800', margin: '0 0 5px 0' }}>PERTANYAAN ({selectedHistory.duration}s):</p>
                                        <p style={{ fontSize: '1rem', color: '#333', fontWeight: '700', margin: 0 }}>"{selectedHistory.question}"</p>
                                    </div>
                                </div>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <p style={{ fontSize: '0.75rem', color: '#AAA', fontWeight: 'bold' }}>DRAFT JAWABAN LENGKAP:</p>
                                    <p style={{ fontSize: '0.95rem', color: '#555', whiteSpace: 'pre-wrap' }}>{selectedHistory.answer || "-"}</p>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '1.5rem' }}>
                                    {selectedHistory.allStats?.map((s, i) => (
                                        <div key={i} style={{ background: '#F8F5FA', padding: '12px', borderRadius: '15px', textAlign: 'center' }}>
                                            <div style={{ fontSize: '0.65rem', color: '#AAA' }}>{s.label}</div>
                                            <div style={{ fontSize: '1.1rem', fontWeight: '800' }}>{s.value}%</div>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ background: 'linear-gradient(135deg, #8C5EAD 0%, #6A4687 100%)', color: '#FFF', padding: '1.5rem', borderRadius: '22px', textAlign: 'center', marginBottom: '1rem' }}>
                                    <h4 style={{ margin: 0 }}>Emosi Dominan: {selectedHistory.emotion}</h4>
                                    <p style={{ margin: '8px 0 0 0', fontSize: '0.85rem', fontStyle: 'italic' }}>"{selectedHistory.motivation}"</p>
                                </div>
                            </div>
                        {/* ========================================================================= */}
                        {/* --- AREA TERSEMBUNYI UNTUK CAPTURE (DESAIN PREMIUM & BERWARNA) --- */}
                        {/* ========================================================================= */}
                        <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
                            <div
                                ref={exportAreaRef}
                                style={{
                                    width: '500px',
                                    height: '888px', // Rasio 9:16 yang pas untuk Instastory
                                    background: 'linear-gradient(180deg, #F9F7FC 0%, #FFFFFF 100%)',
                                    padding: '40px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    fontFamily: "'Segoe UI', Roboto, sans-serif",
                                    boxSizing: 'border-box'
                                }}
                            >
                                {/* HEADER BERGRADASI CANTIK - Versi Lebih Ringkas */}
                                <div style={{
                                    background: 'linear-gradient(135deg, #8C5EAD 0%, #6A4687 100%)',
                                    color: '#FFF',
                                    padding: '20px 30px', // Padding atas-bawah dikurangi dari 30px ke 20px
                                    borderRadius: '25px',
                                    textAlign: 'center',
                                    marginBottom: '15px', // Margin bawah dikurangi dari 20px ke 15px
                                    boxShadow: '0 10px 25px rgba(140, 94, 173, 0.2)'
                                }}>
                                    <h1 style={{
                                        margin: 0,
                                        fontSize: '1.6rem', // Ukuran dikecilkan drastis dari 2.5rem
                                        letterSpacing: '2px', // Jarak antar huruf dirapatkan dari 5px
                                        fontWeight: '900'
                                    }}>
                                        INTERVIEW AI
                                    </h1>
                                    <p style={{
                                        margin: '4px 0 0 0',
                                        fontSize: '0.8rem', // Ukuran teks tanggal sedikit diperkecil
                                        opacity: 0.9,
                                        fontWeight: '500',
                                        letterSpacing: '0.5px'
                                    }}>
                                        {new Date(selectedHistory.createdAt).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}
                                    </p>
                                </div>
                                {/* Foto & Pertanyaan (Fiksasi Total) */}
                                {/* Foto & Pertanyaan (Fiksasi Total dengan limit 108 karakter) */}
                                <div style={{ display: 'flex', gap: '20px', marginBottom: '25px', alignItems: 'stretch' }}>
                                    <div style={{
                                        width: '160px',
                                        height: '120px',
                                        borderRadius: '15px',
                                        border: '3px solid #8C5EAD',
                                        backgroundColor: '#f0f0f0',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        {selectedHistory.userPhoto ? (
                                            <img
                                                src={selectedHistory.userPhoto}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                alt="Live Selfie"
                                            />
                                        ) : (
                                            <span style={{ fontSize: '0.6rem', color: '#999', textAlign: 'center' }}>
                                                Foto tidak<br/>tersedia
                                            </span>
                                        )}
                                    </div>
                                    <div style={{ flex: 1, background: '#FFF', padding: '15px', borderRadius: '15px', border: '1px solid #F3EAFB', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <p style={{ fontSize: '0.6rem', color: '#8C5EAD', fontWeight: '900', margin: '0 0 5px 0' }}>PERTANYAAN ({selectedHistory.duration}s):</p>
                                        <p style={{ fontSize: '0.9rem', fontWeight: '700', color: '#333', margin: 0, lineHeight: 1.2 }}>
                                            "{selectedHistory.question.length > 100
                                                ? `${selectedHistory.question.substring(0, 100)}...`
                                                : selectedHistory.question}"
                                        </p>
                                    </div>
                                </div>
                                {/* DRAFT JAWABAN (WARNA LEMBUT) */}
                                <div style={{
                                    background: '#FFF',
                                    padding: '20px',
                                    borderRadius: '20px',
                                    border: '1px solid #EEE',
                                    marginBottom: '20px',
                                    boxShadow: '0 5px 15px rgba(0,0,0,0.02)',
                                    minHeight: '100px'
                                }}>
                                    <p style={{ fontSize: '0.65rem', color: '#AAA', fontWeight: '900', margin: '0 0 8px 0', textTransform: 'uppercase' }}>
                                        Draft Jawaban Saya:
                                    </p>
                                    <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#555', fontStyle: 'italic', margin: 0 }}>
                                        {selectedHistory.answer && selectedHistory.answer.trim() !== ""
                                            ? (selectedHistory.answer.length > 100
                                                ? `${selectedHistory.answer.substring(0, 100)}...`
                                                : selectedHistory.answer)
                                            : "-"}
                                    </p>
                                </div>

                                {/* ANALISIS EKSPRESI (DESAIN KOMPAK & RAPAT) */}
                                <div style={{
                                    background: 'rgba(140, 94, 173, 0.05)',
                                    padding: '20px',
                                    borderRadius: '25px',
                                    border: '1px solid #F3EAFB',
                                    flex: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center'
                                }}>
                                    <p style={{ textAlign: 'center', margin: '0 0 12px 0', fontSize: '0.9rem', fontWeight: '800', color: '#8C5EAD', letterSpacing: '2px' }}>ANALISIS EKSPRESI</p>

                                    {/* Persentase Rapat */}
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '15px', flexWrap: 'wrap' }}>
                                        {selectedHistory.allStats?.map((s, i) => (
                                            <div key={i} style={{
                                                background: s.label === selectedHistory.emotion ? '#8C5EAD' : '#FFF',
                                                color: s.label === selectedHistory.emotion ? '#FFF' : '#888',
                                                padding: '5px 12px',
                                                borderRadius: '12px',
                                                fontSize: '0.8rem',
                                                fontWeight: 'bold',
                                                border: '1px solid #EFE9F5'
                                            }}>
                                                {s.label} {s.value}%
                                            </div>
                                        ))}
                                    </div>

                                    {/* Kotak Dominan Menarik */}
                                    <div style={{ textAlign: 'center', background: '#FFF', padding: '15px', borderRadius: '20px', border: '2px solid #8C5EAD', boxShadow: '0 5px 20px rgba(140, 94, 173, 0.1)' }}>
                                        <p style={{ margin: 0, fontSize: '0.6rem', fontWeight: '700', color: '#AAA', textTransform: 'uppercase' }}>Dominan Terdeteksi</p>
                                        <h2 style={{ margin: '2px 0', fontSize: '2.2rem', fontWeight: '900', color: '#8C5EAD' }}>{selectedHistory.emotion}</h2>
                                        <p style={{ fontSize: '0.85rem', fontStyle: 'italic', color: '#666', margin: 0, lineHeight: '1.4' }}>"{selectedHistory.motivation}"</p>
                                    </div>
                                </div>

                                {/* FOOTER PREMIUM */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #EEE', paddingTop: '20px', marginTop: '20px' }}>
                                    <div>
                                        <p style={{ margin: 0, fontSize: '0.7rem', color: '#AAA' }}>Coba simulasi mandiri di:</p>
                                        <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1rem', color: '#8C5EAD' }}>interview-ai.vercel.app</p>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 'bold', color: '#333' }}>Scan Me!</p>
                                            <p style={{ margin: 0, fontSize: '0.6rem', color: '#AAA' }}>AI Powered</p>
                                        </div>
                                        <div style={{ padding: '5px', background: '#FFF', borderRadius: '10px', border: '1px solid #EEE' }}>
                                            <QRCodeCanvas value={window.location.origin} size={60} fgColor="#8C5EAD" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>                        
                    </div>
                </div>
            )}
        </section>
    );
};
export default HistoryPage;