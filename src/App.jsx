import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

function App() {
  const webcamRef = useRef(null);
  const [result, setResult] = useState(null);
  const [isAuto, setIsAuto] = useState(false); // Status apakah sedang mode otomatis
  const [loading, setLoading] = useState(false);

  // Fungsi untuk ambil foto dan kirim ke API
  const captureAndPredict = async () => {
    if (!webcamRef.current) return;
    
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    const blob = await fetch(imageSrc).then(res => res.blob());
    const formData = new FormData();
    formData.append('file', blob, 'camera.jpg');

    try {
      const response = await axios.post('http://127.0.0.1:8000/predict', formData);
      setResult(response.data);
    } catch (error) {
      console.error("Gagal memanggil API", error);
    }
  };

  // Logika "Detak Jantung" (Interval)
  useEffect(() => {
    let interval = null;

    if (isAuto) {
      // Jalankan analisis setiap 3 detik (3000ms)
      // Jangan terlalu cepat (misal 1 detik) agar API tidak overload
      interval = setInterval(() => {
        captureAndPredict();
      }, 3000);
    } else {
      clearInterval(interval);
    }

    // Membersihkan interval saat komponen ditutup atau mode mati
    return () => clearInterval(interval);
  }, [isAuto]);

  return (
    <div style={{ textAlign: 'center', padding: '20px', fontFamily: 'Arial', backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      <h1 style={{ color: '#2c3e50' }}>🤖 Interview-AI Real-Time</h1>
      <p>Mode otomatis akan menganalisis ekspresimu setiap 3 detik.</p>
      
      <div style={{ position: 'relative', display: 'inline-block', marginBottom: '20px' }}>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={480}
          style={{ borderRadius: '20px', border: '8px solid white', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
        />
        
        {/* Indikator Live */}
        {isAuto && (
          <div style={{ position: 'absolute', top: '20px', left: '20px', backgroundColor: 'red', color: 'white', padding: '5px 15px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', animation: 'pulse 1.5s infinite' }}>
            ● LIVE ANALYSIS
          </div>
        )}
      </div>

      <br />

      <button 
        onClick={() => setIsAuto(!isAuto)} 
        style={{ 
          padding: '15px 40px', 
          fontSize: '18px', 
          cursor: 'pointer', 
          borderRadius: '30px', 
          border: 'none',
          backgroundColor: isAuto ? '#e74c3c' : '#2ecc71',
          color: 'white',
          fontWeight: 'bold',
          transition: '0.3s'
        }}
      >
        {isAuto ? '🛑 Berhenti Latihan' : '🚀 Mulai Latihan Real-Time'}
      </button>

      {result && (
        <div style={{ maxWidth: '500px', margin: '30px auto', padding: '20px', backgroundColor: 'white', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
          <h2 style={{ margin: '0' }}>
            Kamu Terlihat: <span style={{ color: '#3498db' }}>{result.emotion}</span>
          </h2>
          <p style={{ color: '#7f8c8d' }}>Confidence: {(result.confidence * 100).toFixed(1)}%</p>
          <div style={{ marginTop: '15px', padding: '15px', borderLeft: '5px solid #3498db', backgroundColor: '#ecf0f1', textAlign: 'left' }}>
            <strong style={{ display: 'block', marginBottom: '5px' }}>Saran AI:</strong>
            <span style={{ fontStyle: 'italic', color: '#34495e' }}>"{result.motivation_quote}"</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;