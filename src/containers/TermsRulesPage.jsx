import React, { useState, useEffect } from "react";

const ff = { fontFamily: "'Plus Jakarta Sans', sans-serif" };

const TERMS = [
  {
    title: "1. Penerimaan Ketentuan",
    content:
      "Dengan mengakses dan menggunakan platform Intersight, kamu menyetujui untuk terikat oleh Ketentuan Layanan ini. Platform ini dikembangkan oleh tim CC26-PSU188 sebagai bagian dari Coding Camp 2026 yang didukung oleh DBS Foundation. Karena ini merupakan proyek awal dari kelompok kami, kami mengakui masih terdapat kekurangan dan terus berupaya meningkatkan kualitas layanan.",
  },
  {
    title: "2. Deskripsi Layanan",
    content:
      "Intersight adalah platform latihan wawancara berbasis AI yang dirancang untuk membantu pengguna mempersiapkan diri menghadapi proses rekrutmen kerja. Layanan mencakup simulasi wawancara, analisis performa, dashboard perkembangan, asisten chatbot AI, serta materi pembelajaran karier.",
  },
  {
    title: "3. Akun Pengguna",
    content:
      "Untuk mengakses fitur lengkap Intersight, kamu perlu membuat akun dengan informasi yang akurat dan terkini. Kamu bertanggung jawab menjaga kerahasiaan kata sandi dan seluruh aktivitas yang terjadi di bawah akunmu. Segera hubungi kami jika terjadi penggunaan akun yang tidak sah.",
  },
  {
    title: "4. Privasi & Keamanan Data",
    content:
      "Kami berkomitmen menjaga privasi penggunamu. Data yang kamu masukkan — termasuk hasil wawancara dan informasi profil — hanya digunakan untuk keperluan layanan Intersight dan tidak akan dibagikan kepada pihak ketiga tanpa persetujuanmu. Meski kami berupaya semaksimal mungkin, kami mengingatkan bahwa platform ini masih dalam tahap pengembangan awal.",
  },
  {
    title: "5. Penggunaan yang Diperbolehkan",
    content:
      "Kamu diperbolehkan menggunakan Intersight untuk keperluan pribadi dalam mempersiapkan karier. Kamu tidak diperbolehkan menggunakan platform ini untuk tujuan komersial tanpa izin, menyebarkan konten yang melanggar hak cipta, atau melakukan tindakan yang dapat merugikan pengguna lain maupun sistem kami.",
  },
  {
    title: "6. Batasan Tanggung Jawab",
    content:
      "Intersight disediakan 'sebagaimana adanya' sebagai proyek pembelajaran. Kami tidak menjamin hasil wawancara kerja berdasarkan penggunaan platform ini. Tim pengembang tidak bertanggung jawab atas kerugian langsung maupun tidak langsung yang mungkin timbul dari penggunaan layanan ini.",
  },
  {
    title: "7. Perubahan Layanan",
    content:
      "Karena platform ini masih terus berkembang, kami berhak mengubah, menambah, atau menghentikan fitur sewaktu-waktu. Kami akan berusaha memberikan pemberitahuan sebelum perubahan besar dilakukan. Penggunaan berkelanjutan setelah perubahan berarti kamu menyetujui ketentuan yang diperbarui.",
  },
  {
    title: "8. Hubungi Kami",
    content:
      "Jika kamu memiliki pertanyaan tentang Ketentuan Layanan ini, silakan hubungi kami melalui halaman Hubungi Kami atau email ke CC26-PSU188@student.devacademy.id. Kami senang mendengar masukan darimu untuk terus memperbaiki platform ini.",
  },
];

const RULES = [
  {
    title: "1. Gunakan Platform dengan Jujur",
    content:
      "Intersight dirancang untuk membantumu berkembang secara nyata. Gunakan fitur simulasi wawancara dengan sungguh-sungguh dan jujur agar hasil evaluasi AI dapat memberikan umpan balik yang akurat dan bermanfaat bagimu.",
  },
  {
    title: "2. Hormati Sesama Pengguna",
    content:
      "Jika terdapat fitur komunitas atau berbagi, bersikaplah sopan dan saling menghargai. Konten yang bersifat diskriminatif, menyerang, atau menyinggung pengguna lain tidak diperbolehkan dan dapat menyebabkan akunmu dinonaktifkan.",
  },
  {
    title: "3. Tidak Menyalahgunakan AI",
    content:
      "Fitur AI pada Intersight — termasuk chatbot dan evaluasi wawancara — hanya boleh digunakan sesuai tujuan platform. Dilarang mencoba memanipulasi, mengeksploitasi, atau menggunakan AI untuk menghasilkan konten berbahaya, menyesatkan, atau melanggar hukum.",
  },
  {
    title: "4. Keamanan Akun",
    content:
      "Jangan bagikan kata sandi atau akses akunmu kepada siapa pun. Setiap akun hanya boleh digunakan oleh satu orang. Penggunaan akun bersama atau pemindahan akun kepada pihak lain melanggar ketentuan ini.",
  },
  {
    title: "5. Tidak Mengganggu Sistem",
    content:
      "Dilarang melakukan tindakan yang dapat mengganggu, merusak, atau mengeksploitasi sistem Intersight, termasuk percobaan hacking, injeksi kode berbahaya, atau penggunaan bot/scraper tanpa izin.",
  },
  {
    title: "6. Konten yang Diunggah",
    content:
      "Jika platform memungkinkan pengunggahan konten (foto profil, jawaban, dll), pastikan konten tersebut tidak mengandung materi dewasa, kekerasan, ujaran kebencian, atau pelanggaran hak cipta. Tim kami berhak menghapus konten yang tidak sesuai.",
  },
  {
    title: "7. Laporkan Masalah",
    content:
      "Jika kamu menemukan bug, celah keamanan, atau perilaku yang mencurigakan di platform, kami sangat mengapresiasi jika kamu melaporkannya kepada kami melalui halaman Hubungi Kami. Hal ini membantu kami terus memperbaiki platform untuk semua pengguna.",
  },
  {
    title: "8. Sanksi Pelanggaran",
    content:
      "Pelanggaran terhadap aturan ini dapat mengakibatkan peringatan, pembatasan fitur, atau penonaktifan akun secara permanen, tergantung tingkat pelanggaran. Kami berupaya menangani setiap kasus secara adil dan transparan.",
  },
];

export default function TermsRulesPage() {
  const searchParams = new URLSearchParams(window.location.search);
  const initialTab = searchParams.get("tab") === "rules" ? "rules" : "terms";
  const [activeTab, setActiveTab] = useState(initialTab);

  const data = activeTab === "terms" ? TERMS : RULES;

  return (
    <div
      className="min-h-screen w-full bg-[#faf9ff] px-4 py-20"
      style={ff}
    >
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1
            className="text-[32px] md:text-[40px] font-bold mb-3"
            style={{
              background: "linear-gradient(90deg, #8039FF, #fe63c8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {activeTab === "terms" ? "Terms of Service" : "Rules of Use"}
          </h1>
          <p className="text-[#999] text-[14px]">
            Terakhir diperbarui: Juni 2026 · Intersight by CC26-PSU188
          </p>

          {/* Disclaimer banner */}
          <div className="mt-5 bg-[#f3eeff] border border-[#d4b8ff] rounded-2xl px-5 py-3 text-[13px] text-[#7a3fbf] leading-relaxed">
            🌱 Intersight adalah platform baru yang masih terus berkembang. Kami berkomitmen menjaga privasi penggunamu dan terbuka atas masukan untuk menjadi lebih baik.
          </div>
        </div>

        {/* Tab toggle */}
        <div className="flex bg-white rounded-2xl p-1.5 shadow-sm border border-[#ede8fa] mb-8 w-fit mx-auto">
          <button
            onClick={() => setActiveTab("terms")}
            className="px-7 py-2.5 rounded-xl text-[14px] font-semibold transition-all duration-300"
            style={
              activeTab === "terms"
                ? {
                    background: "linear-gradient(90deg, #8039FF, #fe63c8)",
                    color: "#fff",
                    boxShadow: "0 2px 12px rgba(128,57,255,0.25)",
                  }
                : { color: "#999" }
            }
          >
            Terms
          </button>
          <button
            onClick={() => setActiveTab("rules")}
            className="px-7 py-2.5 rounded-xl text-[14px] font-semibold transition-all duration-300"
            style={
              activeTab === "rules"
                ? {
                    background: "linear-gradient(90deg, #8039FF, #fe63c8)",
                    color: "#fff",
                    boxShadow: "0 2px 12px rgba(128,57,255,0.25)",
                  }
                : { color: "#999" }
            }
          >
            Rules
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-4">
          {data.map(({ title, content }) => (
            <div
              key={title}
              className="bg-white rounded-2xl px-6 py-5 shadow-sm border border-[#f0ebfa] hover:border-[#c9b0f5] transition-colors duration-200"
            >
              <h3 className="text-[15px] font-bold text-[#8039FF] mb-2">
                {title}
              </h3>
              <p className="text-[14px] text-[#666] leading-relaxed">
                {content}
              </p>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-center text-[12px] text-[#bbb] mt-10">
          Ada pertanyaan?{" "}
          <a
            href="/contact"
            className="text-[#8039FF] hover:underline"
          >
            Hubungi kami
          </a>
        </p>
      </div>
    </div>
  );
}
