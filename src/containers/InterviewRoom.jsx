import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { API_BASE_URL, INTERVIEW_QUESTIONS } from '../utils/constants';
import WebcamOverlay from '../components/WebcamOverlay';
import Swal from 'sweetalert2';

const InterviewRoom = () => {
    // Di dalam komponen InterviewRoom
    const [isLoading, setIsLoading] = useState(false);
    const webcamRef = useRef(null);
    const resultRef = useRef(null); // Untuk scroll otomatis
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    // LOGIKA SAPAAN WAKTU
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 11) return "Pagi";
        if (hour < 15) return "Siang";
        if (hour < 19) return "Sore";
        return "Malam";
    };
    const greeting = getGreeting();

    // --- STATE UTAMA ---
    const [status, setStatus] = useState('IDLE'); 
    const [timer, setTimer] = useState(5);
    const [selectedDuration, setSelectedDuration] = useState(60);
    const [allQuestions, setAllQuestions] = useState([...INTERVIEW_QUESTIONS]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isAddingQuestion, setIsAddingQuestion] = useState(false);
    const [tempQuestion, setTempQuestion] = useState("");
    const [userAnswer, setUserAnswer] = useState(""); 
    const [emotionLogs, setEmotionLogs] = useState([]); 
    const [liveEmotion, setLiveEmotion] = useState("STANDBY");
    const [liveQuote, setLiveQuote] = useState(""); 
    const [capturedUserPhoto, setCapturedUserPhoto] = useState(null);
    // --- STATE REKAMAN VIDEO ---
    const mediaRecorderRef = useRef(null);
    const videoChunksRef = useRef([]); // Tambahkan ini untuk menyimpan data video secara stabil
    const [recordedVideoURL, setRecordedVideoURL] = useState(null);

    // --- 1. PROTEKSI LOGIN ---
    useEffect(() => {
        if (!user) {
            navigate('/login', { state: { from: location.pathname } });
        }
    }, [user, navigate, location]);

    // --- 2. LOGIKA SIMPAN KE DATABASE (SAAT RESULT) ---
    useEffect(() => {
        if (status === 'RESULT' && user) {
            saveFinalResultToDB();
        }
    }, [status]);

    const startRecording = () => {
        videoChunksRef.current = [];
        setRecordedVideoURL(null);

        // Pastikan webcam sudah siap
        if (!webcamRef.current || !webcamRef.current.video.srcObject) {
            console.error("Webcam belum siap");
            return;
        }

        const stream = webcamRef.current.video.srcObject;
        
        // Gunakan format standar yang paling aman
        const mediaRecorder = new MediaRecorder(stream, { 
            mimeType: 'video/webm' 
        });

        mediaRecorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) {
                videoChunksRef.current.push(e.data);
            }
        };

        mediaRecorder.onstop = () => {
            // Gabungkan data rekaman menjadi Blob
            const blob = new Blob(videoChunksRef.current, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            setRecordedVideoURL(url);
        };

        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.start(500); // Minta data setiap 0.5 detik agar lebih stabil
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
            mediaRecorderRef.current.stop();
        }
    };

    const saveFinalResultToDB = async () => {
        const dominant = getDominantEmotion();
        const stats = calculateStats();
        
        const finalQuestion = allQuestions[currentQuestionIndex];
        const finalAnswer = userAnswer;
        const finalDuration = selectedDuration;

        if (!dominant || stats.length === 0) return;

        setIsLoading(true); 
        try {
            await axios.post(`${API_BASE_URL}/history/save`, {
                // Gunakan user._id (ID asli dari MongoDB) bukan user.id (ID Google)
                userId: user._id || user.id, 
                // ... data lainnya tetap sama
                emotion: dominant.label,
                motivation: dominant.message,
                confidence: dominant.value / 100,
                allStats: stats,
                question: finalQuestion, 
                duration: finalDuration, 
                answer: finalAnswer,
                userPhoto: capturedUserPhoto     
            });
            console.log("History Berhasil Disimpan!");
        } catch (err) {
            console.error("Gagal simpan ke DB:", err);
            // Tampilkan alert jika gagal agar kamu tahu masalahnya bukan di tampilan
            Swal.fire('Error', 'Gagal menyimpan ke database. Cek koneksi backend.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // --- 3. LOGIKA TIMER ---
    // --- 3. LOGIKA TIMER (DENGAN REKAMAN) ---
    useEffect(() => {
        let interval;
        if ((status === 'PREPARE' || status === 'RECORDING') && timer > 0) {
            interval = setInterval(() => setTimer(prev => prev - 1), 1000);
        } else if (timer === 0) {
            if (status === 'PREPARE') {
                // Logic Ambil Foto Selfie
                if (webcamRef.current) {
                    const imageSrc = webcamRef.current.getScreenshot();
                    setCapturedUserPhoto(imageSrc);
                }
                setStatus('RECORDING');
                setTimer(selectedDuration);
                startRecording(); // <--- START REKAM DI SINI
            } else if (status === 'RECORDING') {
                setStatus('RESULT');
                stopRecording(); // <--- STOP REKAM DI SINI
            }
        }
        return () => clearInterval(interval);
    }, [status, timer, selectedDuration]);

    // --- 4. LOGIKA CAPTURE WEBCAM ---
    useEffect(() => {
        let captureInterval;
        if (status === 'RECORDING') {
            captureInterval = setInterval(() => captureFrame(), 1000); 
        }
        return () => clearInterval(captureInterval);
    }, [status]);

    const captureFrame = async () => {
        if (!webcamRef.current || !user || status !== 'RECORDING') return;
        const imageSrc = webcamRef.current.getScreenshot();
        if (!imageSrc) return;
        try {
            const blob = await fetch(imageSrc).then(r => r.blob());
            const formData = new FormData();
            formData.append('userId', user.id); 
            formData.append('file', blob);
            const response = await axios.post(`${API_BASE_URL}/predict`, formData);
            if (response.data) {
                setLiveEmotion(response.data.emotion);
                const quote = response.data.motivation_quote || response.data.motivation;
                if (quote) setLiveQuote(quote);
                setEmotionLogs(prev => [...prev, response.data.emotion]);
            }
        } catch (e) { console.error("AI Error:", e); }
    };

    // --- 5. FUNGSI HELPER ---
    const handleReset = () => {
        setStatus('IDLE');
        setTimer(5);
        setEmotionLogs([]);
        setLiveEmotion("STANDBY");
        setLiveQuote("");
        setUserAnswer("");
        setCapturedUserPhoto(null);
    };

    const handleAddNewQuestion = () => {
        if (tempQuestion.trim() !== "") {
            const newList = [...allQuestions, tempQuestion];
            setAllQuestions(newList);
            setCurrentQuestionIndex(newList.length - 1); 
            setIsAddingQuestion(false);
            setTempQuestion("");
        }
    };

    const calculateStats = () => {
        if (emotionLogs.length === 0) return [];
        const counts = {};
        emotionLogs.forEach(e => counts[e] = (counts[e] || 0) + 1);
        return Object.keys(counts).map(key => ({
            label: key,
            value: Math.round((counts[key] / emotionLogs.length) * 100)
        }));
    };

    const getDominantEmotion = () => {
        const stats = calculateStats();
        if (stats.length === 0) return null;
        const dominant = stats.reduce((prev, current) => (prev.value > current.value) ? prev : current);
        const messages = {
            'Happy': "Luar biasa! Aura positif Anda terpancar. Pertahankan senyuman ini!",
            'Neutral': "Anda terlihat sangat tenang. Ini kunci jawaban yang profesional.",
            'Sad': "Coba lebih rileks dan tunjukkan antusiasme melalui ekspresi wajah.",
            'Fear': "Tarik napas dalam. Persiapan Anda sudah sangat baik!",
            'Surprise': "Ekspresi ketertarikkanmu dalam interview ini sudah bagus!",
            'Disgust': "Cobalah untuk berpikir lebih positif ya! Tunjukkan kendali penuh atas ekspresi wajahmu.",
            'Angry': "Tenangkan pikiran, tetap fokus pada jawaban profesional Anda."
        };
        return { ...dominant, message: messages[dominant.label] || "Terus asah ekspresi Anda!" };
    };

    // --- 6. SCROLL OTOMATIS ---
    // --- 6. SCROLL OTOMATIS KE HASIL ---
    useEffect(() => {
        if (status === 'RESULT' && !isLoading) { // Tambahkan pengecekan !isLoading
            setTimeout(() => {
                if (resultRef.current) {
                    resultRef.current.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' // Ubah ke 'center' agar lebih pas di tengah layar
                    });
                }
            }, 300); // Beri jeda sedikit lebih lama (300ms) agar elemen muncul sempurna
        }
    }, [status, isLoading]); // Tambahkan isLoading di dependency

    if (!user) return null;

    return (
    <main className="interview-main" style={{ position: 'relative', minHeight: '80vh', background: '#FFF' }}>
        {/* TAMBAHKAN INI: CSS khusus untuk membetulkan kontrol video */}
        <style>{`
            .mirror-fix {
                transform: scaleX(-1);
                -webkit-transform: scaleX(-1);
            }
            /* Membalikkan kembali bar kontrol agar terlihat normal */
            .mirror-fix::-webkit-media-controls-panel {
                transform: scaleX(-1);
                -webkit-transform: scaleX(-1);
            }
        `}</style>
            {/* --- LOGIKA LOADING BARU --- */}
            {isLoading && (
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0,
                    width: '100%', height: '100%',
                    background: '#FFFFFF', // Putih solid
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 100,
                    color: '#8C5EAD'
                }}>
                    <div className="spinner" style={{ 
                        width: '50px', height: '50px', 
                        border: '5px solid #F3EAFB', 
                        borderTop: '5px solid #8C5EAD', 
                        borderRadius: '50%', 
                        animation: 'spin 1s linear infinite' 
                    }}></div>
                    <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>Menyimpan hasil analisismu...</p>
                    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                </div>
            )}
            <div className="container interview-container">
                {/* --- JUDUL SAPAAN DINAMIS --- */}
                <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
                    <h2 style={{ color: '#8C5EAD', fontSize: '1.2rem', fontWeight: '700', margin: 0 }}>
                        Selamat {greeting}, {user?.username?.split(' ')[0] || 'User'}! 👋
                    </h2>
                    <p style={{ color: '#888', fontSize: '0.9rem', margin: '1px 0 0 0' }}>
                        Siap untuk mempertajam kemampuan interview-mu hari ini?
                    </p>
                </div>
                {/* --- HEADER BOX --- */}
                <div className="interview-top-bar">
                    <div className="live-emotion-box">
                        <h4 className="emotion-title">Live Emosi: <span>{liveEmotion}</span></h4>
                        <p className="emotion-quote">"{liveQuote || "Menganalisis wajah..."}"</p>
                    </div>

                    <div className="duration-controls">
                        <div className="duration-inner">
                            <span className="label-text">Durasi:</span>
                            <div className="btn-group">
                                {[10, 15, 30, 60].map(d => (
                                    <button key={d} onClick={() => setSelectedDuration(d)} disabled={status !== 'IDLE'} className={selectedDuration === d ? "active" : ""}>{d}s</button>
                                ))}
                            </div>
                        </div>
                        <div className="session-controls">
                            {status === 'RECORDING' && (
                                <div className="recording-status">
                                    <span className="timer-text"><i className='bx bxs-circle bx-flashing'></i> {timer}s</span>
                                    <button onClick={() => setStatus('RESULT')} className="btn-finish">Selesai</button>
                                </div>
                            )}
                            {status === 'RESULT' && (
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    {/* TOMBOL DOWNLOAD MANDIRI */}
                                    <a href={recordedVideoURL} download="Hasil-Latihan-Interview.webm" className="button btn-reset" style={{ textDecoration: 'none' }}>
                                        <i className='bx bx-download' style={{ marginRight: '5px' }}></i> Simpan Video
                                    </a>
                                    <button onClick={handleReset} className="button btn-reset">Reset Sesi</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="interview-content-grid">
                    {/* --- KOLOM KIRI (WEBCAM) --- */}
                    <div className="interview-column column-left">
                        <div className="webcam-wrapper" style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', background: '#000' }}>
                            
                            {/* LOGIC REPLAY: Jika sudah RESULT dan URL video sudah ada, munculkan VIDEO. Jika belum, munculkan KAMERA */}
                            {/* LOGIC REPLAY: Diperbaiki agar tombol tidak terbalik & tidak autoplay */}
                            {/* LOGIC REPLAY: Diperbaiki agar tombol NORMAL (tidak terbalik), tidak autoplay, dan menu download muncul */}
                            {status === 'RESULT' ? (
                                recordedVideoURL ? (
                                    // Cari bagian <video ... > di dalam InterviewRoom.jsx (sekitar baris 313)
                                    // Tambahkan transform: 'scaleX(-1)' di dalam style-nya
                                    // Cari dan ganti bagian tag <video> menjadi ini:
                                    <video 
                                        controls 
                                        playsInline
                                        className="scan__video mirror-fix" // TAMBAHKAN CLASS INI
                                        style={{ 
                                            width: '100%', 
                                            height: '100%', 
                                            objectFit: 'cover', 
                                            display: 'block',
                                            borderRadius: '20px',
                                            background: '#000'
                                            // HAPUS transform: 'scaleX(-1)' dari sini
                                        }} 
                                    >
                                        <source src={recordedVideoURL} type="video/webm" />
                                        Browser kamu tidak mendukung pemutaran video.
                                    </video>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#FFF' }}>
                                        <div className="spinner" style={{ width: '30px', height: '30px', border: '3px solid #333', borderTop: '3px solid #8C5EAD', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                                        <p style={{ marginTop: '10px', fontSize: '0.8rem' }}>Menyiapkan rekaman...</p>
                                    </div>
                                )
                            ) : (
                                <WebcamOverlay webcamRef={webcamRef} />
                            )}

                            {/* Indikator RECORD Merah */}
                            {status === 'RECORDING' && (
                                <div style={{
                                    position: 'absolute', top: '20px', left: '20px',
                                    background: 'rgba(255,0,0,0.8)', color: '#FFF',
                                    padding: '5px 12px', borderRadius: '50px',
                                    fontSize: '0.8rem', fontWeight: 'bold', display: 'flex',
                                    alignItems: 'center', gap: '8px', zIndex: 10,
                                    animation: 'pulse 1s infinite'
                                }}>
                                    <span style={{ width: '10px', height: '10px', background: '#FFF', borderRadius: '50%' }}></span>
                                    REC
                                </div>
                            )}

                            {/* Overlay PREPARE & IDLE tetap sama di bawah sini... */}
                            {status === 'PREPARE' && (
                                <div className="webcam-overlay-state prepare">
                                    <h1 className="countdown-text">{timer}</h1>
                                    <p className="prepare-text">Siapkan posisi & jawabanmu!</p>
                                </div>
                            )}
                            {status === 'IDLE' && (
                                <div className="webcam-overlay-state idle">
                                    <button className="button btn-start" onClick={() => { setStatus('PREPARE'); setTimer(5); }}>Mulai Simulasi</button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* --- KOLOM KANAN (PERTANYAAN & HASIL) --- */}
                    <div className="interview-column column-right">
                        {/* BOX PERTANYAAN DENGAN NAVIGASI PANAH */}
                        <div className="question-box">
                            <div className="question-nav">
                                <div className="nav-controls">
                                    {/* TOMBOL PANAH KIRI */}
                                    <button 
                                        className="nav__btn" 
                                        onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))} 
                                        disabled={status !== 'IDLE' || isAddingQuestion}
                                    >
                                        <i className='bx bx-chevron-left'></i>
                                    </button>

                                    <span className="question-count">
                                        SOAL {isAddingQuestion ? allQuestions.length + 1 : currentQuestionIndex + 1}/{allQuestions.length}
                                    </span>

                                    {/* TOMBOL PANAH KANAN */}
                                    <button 
                                        className="nav__btn" 
                                        onClick={() => setCurrentQuestionIndex(prev => Math.min(allQuestions.length - 1, prev + 1))} 
                                        disabled={status !== 'IDLE' || isAddingQuestion}
                                    >
                                        <i className='bx bx-chevron-right'></i>
                                    </button>
                                </div>

                                {status === 'IDLE' && !isAddingQuestion && (
                                    <button onClick={() => { setIsAddingQuestion(true); setTempQuestion(""); }} className="btn-add">
                                        <i className='bx bx-plus'></i>
                                    </button>
                                )}
                            </div>

                            {isAddingQuestion ? (
                                <div className="add-question-form">
                                    <input type="text" className="account__input" value={tempQuestion} onChange={(e) => setTempQuestion(e.target.value)} autoFocus placeholder="Tulis pertanyaanmu..." />
                                    <div className="add-actions">
                                        <button onClick={handleAddNewQuestion} className="button btn-small"><i className='bx bx-check'></i></button>
                                        <button onClick={() => setIsAddingQuestion(false)} className="button btn-small btn-danger"><i className='bx bx-x'></i></button>
                                    </div>
                                </div>
                            ) : (
                                <h4 className="current-question">"{allQuestions[currentQuestionIndex]}"</h4>
                            )}
                        </div>

                        <div className={`answer-box ${status === 'RESULT' ? 'compact' : ''}`}>
                            <label className="account__label">Draft Jawaban:</label>
                            <textarea 
                                className="account__textarea" 
                                placeholder="Tulis jawaban di sini agar kamu lebih siap..." 
                                value={userAnswer} 
                                onChange={(e) => setUserAnswer(e.target.value)}
                            ></textarea>
                        </div>

                        {/* PANEL HASIL RINGKASAN */}
                        {status === 'RESULT' && (
                            <div ref={resultRef} className="result-panel reveal-from-top">
                                <h3 className="result-title"><i className='bx bx-bar-chart-alt-2'></i> Ringkasan Ekspresi</h3>
                                <div className="stats-grid-mini">
                                    {calculateStats().map(stat => (
                                        <div key={stat.label} className="stat-item">
                                            <span className="stat-label">{stat.label}</span>
                                            <span className="stat-value">{stat.value}%</span>
                                        </div>
                                    ))}
                                </div>
                                {/* ... bagian atas Ringkasan Ekspresi ... */}
                                {/* ... bagian dominan box kamu ... */}
                                {getDominantEmotion() && (
                                    <div className="dominant-box" style={{ marginTop: '15px', padding: '15px', background: '#916fae', borderRadius: '12px' }}>
                                        <p style={{ fontWeight: 'bold', color: '#ffffff', margin: 0, fontSize: '1rem' }}>Dominan: {getDominantEmotion().label}</p>
                                        <p style={{ fontStyle: 'italic', fontSize: '0.85rem', margin: '5px 0 0 0', color: '#ffffff' }}>"{getDominantEmotion().message}"</p>
                                    </div>
                                )}

                                {/* ------------------------------------------- */}
                                <button 
                                    onClick={() => {
                                        if (isLoading) {
                                            // Jika database masih proses menyimpan, cegah pindah halaman
                                            Swal.fire({
                                                title: 'Sabar ya!',
                                                text: 'Sedang menyimpan hasil simulasi ke profilmu...',
                                                icon: 'info',
                                                timer: 2000,
                                                showConfirmButton: false
                                            });
                                        } else {
                                            // Jika sudah selesai simpan (isLoading false), baru boleh pindah
                                            navigate('/history');
                                        }
                                    }} 
                                    className="button" 
                                    style={{ 
                                        marginTop: '15px', 
                                        width: '100%', 
                                        background: isLoading ? '#eee' : '#8C5EAD', 
                                        color: '#8C5EAD', 
                                        border: '1px solid #8C5EAD',
                                        cursor: isLoading ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    <i className='bx bx-export'></i> {isLoading ? 'Menyimpan...' : 'Export & Share Hasil Ini'}
                                </button>
                                {/* Taruh di bawah button "Export & Share Hasil Ini" */}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default InterviewRoom;