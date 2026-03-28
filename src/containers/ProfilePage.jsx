import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import Swal from 'sweetalert2';
import { getHistory } from '../services/api';

const ProfilePage = () => {
    const { user, setUser } = useContext(AuthContext);
    const defaultImg = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

    // Logika deteksi User Google: ID Google biasanya string angka yang sangat panjang
    // Logika baru: Cek apakah ID hanya berisi angka (Google) dan panjangnya pas
    const isGoogleUser = user?.isGoogle === true;
    // Tambahkan state untuk loading halaman
    const [pageLoading, setPageLoading] = React.useState(true);
    const [totalSessions, setTotalSessions] = React.useState(0);
    // Matikan loading setelah komponen selesai memuat data user
    React.useEffect(() => {
        const loadInitialData = async () => {
            if (user) {
                try {
                    // Ambil riwayat untuk menghitung total sesi
                    const historyData = await getHistory(user.id || user._id);
                    setTotalSessions(historyData.length);
                } catch (err) {
                    console.error("Gagal mengambil statistik");
                }
                // Matikan loading setelah data siap
                setTimeout(() => setPageLoading(false), 800);
            }
        };
        loadInitialData();
    }, [user]);
    // 1. Fungsi Update Data (Surgical Fix)
    // Tambahkan parameter 'type' dengan default 'data'
    const updateProfileData = async (formData, type = 'data') => {
        const currentUser = user || JSON.parse(localStorage.getItem('user'));
        const emailToConfirm = currentUser?.email;

        if (!emailToConfirm) {
            Swal.fire('Error', 'Email tidak ditemukan. Silakan login ulang.', 'error');
            return;
        }

        // TAMPILKAN LOADING SEBELUM AXIOS JALAN
        Swal.fire({
            title: 'Loading',
            text: type === 'photo' ? 'Sedang memperbarui foto profil...' : 'Sedang memperbarui profil...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading(); // Animasi loading bawaan SweetAlert2
            }
        });

        try {
            const dataToSend = { 
                profileImage: user.profileImage, 
                ...formData, 
                email: user.email, 
                username: formData.username || user.username || user.name
            };
            
            const res = await axios.put(`${API_BASE_URL}/auth/profile/${user.id || user._id}`, dataToSend);
            
            setUser(res.data);
            
            // TAMPILKAN BERHASIL SESUAI JENIS UPDATE
            Swal.fire({ 
                icon: 'success', 
                title: 'Berhasil!', 
                text: type === 'photo' ? 'Foto profil telah diperbarui' : 'Profil sudah diperbarui',
                timer: 2000, 
                showConfirmButton: false 
            });
        } catch (err) {
            console.error("Detail Error:", err.response?.data);
            Swal.fire('Gagal', 'Terjadi kesalahan saat menyimpan.', 'error');
        }
    };

    // --- FUNGSI OTOMATIS KOMPRES GAMBAR ---
    // --- FUNGSI OTOMATIS KOMPRES GAMBAR (VERSI TRANSPARAN) ---
    const resizeImage = (base64Str) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = base64Str;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 400; 
                const MAX_HEIGHT = 400; 
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                
                // Bersihkan canvas agar benar-benar kosong/transparan sebelum digambar
                ctx.clearRect(0, 0, width, height); 
                ctx.drawImage(img, 0, 0, width, height);

                // UBAH DARI 'image/jpeg' MENJADI 'image/png'
                // PNG mendukung latar belakang transparan
                resolve(canvas.toDataURL('image/png'));
            };
        });
    };

    // 2. Fungsi Pilih Foto dari Galeri + Auto Resize
    const handleEditPhoto = async () => {
        const { value: file } = await Swal.fire({
            title: 'Pilih Foto Profil',
            input: 'file',
            inputAttributes: { 'accept': 'image/*', 'aria-label': 'Pilih foto' },
            // Preview awal menggunakan foto profil saat ini
            imageUrl: user.profileImage || defaultImg,
            imageWidth: 120,
            imageHeight: 120,
            imageAlt: 'Preview Foto',
            confirmButtonText: 'Upload',
            confirmButtonColor: '#8C5EAD',
            showCancelButton: true,
            // --- LOGIKA PREVIEW OTOMATIS ---
            didOpen: () => {
                const img = Swal.getImage();
                // Buat preview berbentuk lingkaran
                img.style.borderRadius = '50%';
                img.style.objectFit = 'cover';
                img.style.border = '4px solid #F3EAFB';
                // Tambahkan ini agar jika PNG transparan, dia tidak menumpuk dengan warna background Swal
                img.style.background = 'transparent';

                const input = Swal.getInput();
                input.onchange = () => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        img.src = e.target.result; // Ganti gambar preview saat file dipilih
                    };
                    if (input.files[0]) reader.readAsDataURL(input.files[0]);
                };
            }
        });

        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                // Kompres gambar otomatis agar ringan
                const compressedBase64 = await resizeImage(e.target.result);
                // Ubah baris pemanggilan di akhir handleEditPhoto menjadi:
                updateProfileData({ profileImage: compressedBase64 }, 'photo');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleResetPhoto = () => {
        Swal.fire({
            title: 'Hapus foto?',
            text: "Foto akan kembali ke default",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Ya, Hapus'
        }).then((result) => {
            // Ubah baris pemanggilan di handleResetPhoto menjadi:
            if (result.isConfirmed) updateProfileData({ profileImage: defaultImg }, 'photo');
        });
    };

    const handleEditProfile = async () => {
        const { value: formValues } = await Swal.fire({
            title: 'Edit Profil',
            html: `
                <div style="text-align: left; display: flex; flex-direction: column; gap: 10px;">
                    <label style="font-size: 0.8rem; font-weight: bold;">Nama Lengkap ${isGoogleUser ? '(Akun Google)' : ''}</label>
                    <input id="swal-username" class="swal2-input" 
                        style="margin:0; width: 100%; background: ${isGoogleUser ? '#f5f5f5' : '#fff'}; color: ${isGoogleUser ? '#888' : '#333'};" 
                        value="${user.username || user.name || ''}" 
                        ${isGoogleUser ? 'readonly' : ''}>
                    ${isGoogleUser ? '<small style="color: #888; display: block; margin-top: 5px;">Nama akun Google tidak dapat diubah di sini.</small>' : ''}
                    
                    <label style="font-size: 0.8rem; font-weight: bold;">Link LinkedIn</label>
                    <input id="swal-linkedin" class="swal2-input" style="margin:0; width: 100%;" 
                        placeholder="https://linkedin.com/in/username" value="${user.linkedinUrl || ''}">

                    <label style="font-size: 0.8rem; font-weight: bold;">Target Pekerjaan</label>
                    <input id="swal-job" class="swal2-input" style="margin:0; width: 100%;" placeholder="Contoh: Web Developer" value="${user.targetJob || ''}">
                    
                    <div style="display: flex; gap: 10px;">
                        <div style="flex: 1;">
                            <label style="font-size: 0.8rem; font-weight: bold;">Umur</label>
                            <input id="swal-age" type="number" class="swal2-input" style="margin:0; width: 100%;" value="${user.age || ''}">
                        </div>
                        <div style="flex: 2;">
                            <label style="font-size: 0.8rem; font-weight: bold;">Pendidikan</label>
                            <input id="swal-edu" class="swal2-input" style="margin:0; width: 100%;" value="${user.education || ''}">
                        </div>
                    </div>

                    <label style="font-size: 0.8rem; font-weight: bold;">Bio Singkat</label>
                    <textarea id="swal-bio" class="swal2-textarea" style="margin:0; width: 100%; height: 80px;" placeholder="Ceritakan sedikit tentang dirimu...">${user.bio || ''}</textarea>
                </div>
            `,
            focusConfirm: false,
            confirmButtonText: 'Simpan Profil',
            confirmButtonColor: '#8C5EAD',
            showCancelButton: true,
            preConfirm: () => ({
                username: document.getElementById('swal-username').value,
                linkedinUrl: document.getElementById('swal-linkedin').value,
                targetJob: document.getElementById('swal-job').value,
                age: document.getElementById('swal-age').value,
                education: document.getElementById('swal-edu').value,
                bio: document.getElementById('swal-bio').value
            })
        });

        if (formValues) updateProfileData(formValues, 'data');
    };

    // Ganti bagian if (!user) return null; menjadi ini:
    if (pageLoading) {
        return (
            <div style={{ 
                height: '90vh', display: 'flex', flexDirection: 'column', 
                alignItems: 'center', justifyContent: 'center', gap: '1rem' 
            }}>
                <div className="spinner"></div> {/* Pakai class spinner yang sudah ada di CSS-mu */}
                <p style={{ color: '#8C5EAD', fontWeight: '600' }}>Memuat Profil...</p>
            </div>
        );
    }

    if (!user) return null;

    return (
        // KUNCI PERBAIKAN: Tambahkan flexDirection: 'column' agar elemen menumpuk ke bawah
        // Ganti baris <section ... > menjadi:
        <section className="section container" style={{ 
            height: 'calc(100vh - 4.5rem)', // Pas sisa layar setelah header
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: '1rem' // Biarkan flexbox yang mengatur posisi tengah
        }}>
            
            {/* 1. KARTU PROFIL UTAMA */}
            <div className="profile-card" style={{ 
                background: '#FFF', width: '100%', maxWidth: '400px', padding: '1.5rem', 
                borderRadius: '30px', boxShadow: '0 20px 60px rgba(140, 94, 173, 0.12)', 
                textAlign: 'center', border: '1px solid #F3EAFB' 
            }}>
                {/* Avatar Section */}
                {/* Cari bagian Avatar Section di dalam return */}
                {/* Cari bagian Avatar Section di dalam return */}
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1rem' }}>
                    <img 
                        src={user.profileImage || defaultImg} 
                        alt="Profile" 
                        style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #F3EAFB' }} 
                    />
                    
                    {/* KUNCI: Hanya muncul jika BUKAN User Google */}
                    {!isGoogleUser && (
                        <>
                            <button onClick={handleEditPhoto} title="Ganti Foto" style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#8C5EAD', color: '#FFF', border: '2px solid #FFF', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <i className='bx bxs-pencil' style={{ fontSize: '0.9rem' }}></i>
                            </button>
                            <button onClick={handleResetPhoto} title="Hapus Foto" style={{ position: 'absolute', bottom: '-5px', left: '-5px', background: '#FFEDED', color: '#FF4D4D', border: '2px solid #FFF', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <i className='bx bxs-trash' style={{ fontSize: '0.9rem' }}></i>
                            </button>
                        </>
                    )}
                </div>
                
                <h2 style={{ fontSize: '1.5rem', color: '#1F1F1F', margin: 0 }}>
                    {user.username || user.name || "User Baru"}
                </h2>
                <p style={{ color: '#8C5EAD', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>{user.targetJob || "Professional Candidate"}</p>
                {/* --- TAMBAHKAN LOGIKA IKON LINKEDIN DI SINI --- */}
                {user.linkedinUrl && (
                    <a href={user.linkedinUrl} target="_blank" rel="noopener noreferrer" 
                    style={{ color: '#0077B5', fontSize: '1.5rem', display: 'inline-block', marginBottom: '0.5rem', transition: '0.3s' }}>
                        <i className='bx bxl-linkedin-square'></i>
                    </a>
                )}
                <p style={{ color: '#888', fontSize: '0.8rem', marginBottom: '1.5rem', fontStyle: 'italic' }}>"{user.bio || "Belum Mengisi Biodata"}"</p>

                {/* Info Grid - Bagian yang diperbaiki agar Pendidikan di pojok kanan */}
                <div style={{ textAlign: 'left', background: '#FDFBFF', padding: '1.2rem', borderRadius: '20px', border: '1px solid #F3EAFB' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <span style={{ color: '#AAA', fontSize: '0.75rem', fontWeight: '700' }}>UMUR</span>
                        <span style={{ fontWeight: '600', fontSize: '0.85rem' }}>{user.age ? `${user.age} Thn` : '-'}</span>
                    </div>
                    
                    {/* Perbaikan: Ganti flexDirection: 'column' menjadi justifyContent: 'space-between' */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '15px' }}>
                        <span style={{ color: '#AAA', fontSize: '0.75rem', fontWeight: '700', whiteSpace: 'nowrap' }}>PENDIDIKAN</span>
                        <span style={{ fontWeight: '600', fontSize: '0.85rem', textAlign: 'right' }}>{user.education || "Belum diisi"}</span>
                    </div>
                </div>

                <button onClick={handleEditProfile} className="button" style={{ marginTop: '1.5rem', width: '100%', borderRadius: '15px', padding: '12px' }}>
                    Edit Profil <i className='bx bx-right-arrow-alt'></i>
                </button>
            </div>

            {/* 2. BAGIAN STATISTIK RINGKAS (TIDAK LAGI KE SAMPING) */}
            <div style={{ 
                marginTop: '1rem', display: 'flex', gap: '1rem', 
                justifyContent: 'center', width: '100%', maxWidth: '400px' 
            }}>
                <div style={{ 
                    background: '#FFF', flex: 1, padding: '1.2rem', borderRadius: '25px', 
                    textAlign: 'center', border: '1px solid #F3EAFB',
                    boxShadow: '0 10px 30px rgba(140, 94, 173, 0.08)'
                }}>
                    <span style={{ display: 'block', fontSize: '1.8rem', fontWeight: '800', color: '#8C5EAD' }}>
                        {totalSessions}
                    </span>
                    <span style={{ fontSize: '0.65rem', color: '#AAA', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Total Sesi
                    </span>
                </div>

                <div style={{ 
                    background: '#FFF', flex: 1, padding: '1.2rem', borderRadius: '25px', 
                    textAlign: 'center', border: '1px solid #F3EAFB',
                    boxShadow: '0 10px 30px rgba(140, 94, 173, 0.08)'
                }}>
                    <span style={{ display: 'block', fontSize: '1.8rem', fontWeight: '800', color: '#8C5EAD' }}>
                        {totalSessions > 5 ? 'Pro' : totalSessions > 0 ? 'Ready' : 'Newbie'}
                    </span>
                    <span style={{ fontSize: '0.65rem', color: '#AAA', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Level
                    </span>
                </div>
            </div>
        </section>
    );
};

export default ProfilePage;