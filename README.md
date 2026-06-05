```markdown
# 💻 Interview-AI Assistant: Frontend Web Application (InterSight)

[![Production Deployment](https://img.shields.io/badge/Deploy-Vercel-black?style=flat&logo=vercel)](https://interview-ai-frontend-indol.vercel.app)
[![React Version](https://img.shields.io/badge/React-18.x-blue?style=flat&logo=react)](https://react.dev)
[![Bundler](https://img.shields.io/badge/Bundler-Vite-646CFF?style=flat&logo=vite)](https://vitejs.dev)
[![Styling](https://img.shields.io/badge/Styling-Tailwind%20CSS-06B6D4?style=flat&logo=tailwindcss)](https://tailwindcss.com)

Selamat datang di repositori sisi Frontend untuk **InterSight** (Capstone Team: `CC26-PSU188`). Aplikasi web ini dirancang menggunakan **React.js** dan dibundel dengan **Vite** untuk memberikan pengalaman antarmuka pengguna yang cepat, responsif, dan interaktif dalam melakukan simulasi wawancara kerja berbasis kecerdasan buatan.

---

## 🚀 1. Fitur Utama Antarmuka (UI/UX Features)

Aplikasi web InterSight Frontend mengimplementasikan kriteria *learning path* secara komprehensif, meliputi:
* **Slicing UI & Responsiveness:** Desain tata letak komponen (*layout*) yang responsif menggunakan **Tailwind CSS**, memastikan aplikasi berjalan dengan optimal di berbagai ukuran layar perangkat (Desktop, Tablet, dan Mobile).
* **Interactive Simulation Arena:** Fitur utama tempat pengguna dapat melihat skenario soal pewawancara, melakukan pengetikan draf jawaban secara mandiri, dan mengaktifkan kamera lokal untuk analisis ekspresi wajah.
* **Real-Time Emotion Display UI:** Menampilkan kotak pelacakan emosi secara visual yang bergerak dinamis di atas perangkat pengguna (melalui *networking calls* ke API model AI).
* **Instastory-Style Export Report:** Fitur pengeksporan hasil evaluasi performa wawancara ke dalam bentuk visual grafis estetik yang siap dibagikan ke media sosial atau disimpan secara lokal.
* **Secure Authentication & Personalization:** Integrasi sistem masuk (*login*) pengguna yang aman untuk mempersonalisasi riwayat latihan.

---

## 🛠️ 2. Arsitektur Komponen & Tech Stack

Sisi Frontend dikembangkan menggunakan kombinasi alat dan pustaka modern berstandar industri:
1. **React.js (JavaScript):** Library utama untuk membangun antarmuka berbasis komponen (*component-based UI*).
2. **Vite:** *Module bundler* generasi terbaru untuk mempercepat proses pengembangan lingkungan lokal (*HMR*) dan optimasi kompilasi produksi.
3. **Tailwind CSS & Bootstrap:** Framework utilitas CSS untuk mempercepat proses *styling* antarmuka yang modern, konsisten, dan rapi.
4. **Axios:** Pustaka klien HTTP untuk menangani *networking calls* (interaksi RESTful API) secara asinkron dengan server backend.

---

## ⚙️ 3. Panduan Menjalankan Proyek Secara Lokal (Local Development)

Ikuti langkah-langkah di bawah ini untuk memasang dan menjalankan server pengembangan Frontend di komputer Anda:

### Prasyarat (Prerequisites)
Pastikan Anda sudah menginstal **Node.js** (versi rekomendasi: v18.x atau yang terbaru) dan **npm** (Node Package Manager).

### 1. Kloning Repositori
```bash
git clone [https://github.com/monicadyahp/interview-ai-frontend.git](https://github.com/monicadyahp/interview-ai-frontend.git)
cd interview-ai-frontend

```

### 2. Pasang Package Dependencies

Unduh dan pasang seluruh pustaka eksternal yang terdaftar di dalam `package.json` dengan menjalankan perintah:

```bash
npm install

```

### 3. Konfigurasi Environment Variable

Salin file `.env.example` menjadi file `.env` baru di root direktori, lalu sesuaikan URL endpoint API backend Anda:

```bash
cp .env.example .env

```

Isi di dalam file `.env`:

```env
VITE_API_BASE_URL=[https://alamat-api-backend-anda.com](https://alamat-api-backend-anda.com)

```

### 4. Jalankan Server Pengembangan (Local Dev Server)

Untuk mengaktifkan server lokal dengan fitur *Hot Module Replacement* (HMR), jalankan perintah:

```bash
npm run dev

```

Setelah berhasil, terminal akan memunculkan alamat tautan lokal Anda (biasanya `http://localhost:5173`). Buka alamat tersebut di peramban web (*browser*) Anda.

---

## 📦 4. Proses Kompilasi Produksi (Production Build)

Jika aplikasi web sudah siap dirilis dan dideploy ke server produksi (seperti Vercel atau Netlify), Anda harus melakukan proses kompilasi (*compile/build*) terlebih dahulu.

### 1. Jalankan Perintah Build

Perintah ini akan menginstruksikan Vite untuk mengoptimasi kode JavaScript, melakukan minifikasi CSS, dan mengemas seluruh aset ke dalam folder produksi bernama `dist/`:

```bash
npm run build

```

### 2. Jalankan Pratinjau Build (Preview Build)

Untuk memastikan hasil kompilasi folder `dist/` berjalan dengan lancar tanpa ada kesalahan (*crash*) sebelum benar-benar diunggah ke server hosting, Anda bisa mengujinya secara lokal menggunakan perintah:

```bash
npm run preview

```

### 3. Otomasi Linter (Opsional)

Untuk memeriksa kerapian penulisan kode program dan mendeteksi potensi bug sesuai aturan ESLint, jalankan perintah:

```bash
npm run lint

```

---

## 👥 5. Tim Pengembang Antarmuka (Frontend Team)

Bagian Frontend dan Slicing UI aplikasi InterSight ini dikembangkan sepenuhnya dengan kolaborasi hebat oleh:

* **Syasmi Permata Oktavia** (Fullstack Developer - CFCC009D6X2797)
* **Dio Prasetyo** (Fullstack Developer - CFCC290D6Y1707)

> **Note:** Aplikasi ini dideploy secara otomatis menggunakan integrasi CI/CD Vercel Git Integration pada tautan produksi resmi kami.

```

```
