import React, { useState, useEffect, useRef } from 'react';
import WebcamOverlay from '../components/WebcamOverlay';
import { sendFrameToPrediction } from '../services/api';

const InterviewSession = () => {
    const webcamRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [timer, setTimer] = useState(5);
    const [isCounting, setIsCounting] = useState(false);
    const [question, setQuestion] = useState("Sebutkan kelebihan dan kekurangan Anda?");
    const [result, setResult] = useState(null);

    useEffect(() => {
        let interval;
        if (isCounting && timer > 0) {
            interval = setInterval(() => setTimer(prev => prev - 1), 1000);
        } else if (timer === 0) {
            handleAutoCapture();
            setIsCounting(false);
        }
        return () => clearInterval(interval);
    }, [isCounting, timer]);

    const handleAutoCapture = async () => {
        setIsLoading(true); // Mulai loading tepat setelah timer habis
        setResult(null);    // Reset hasil sebelumnya jika ada
        
        try {
            const imageSrc = webcamRef.current.getScreenshot();
            const blob = await fetch(imageSrc).then(res => res.blob());
            const data = await sendFrameToPrediction(blob);
            setResult(data);
        } catch (error) {
            console.error("Gagal menganalisis:", error);
        } finally {
            setIsLoading(false); // Matikan loading setelah data didapat atau error
        }
    };

    // Ganti bagian return di InterviewSession.jsx menjadi ini:
    return (
        
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <div className="question-header" style={{ background: '#f0f2f5', padding: '15px', borderRadius: '8px', marginBottom: '10px' }}>
                <h3 style={{ color: '#1a73e8' }}>{question}</h3>
                {isCounting && <h2 style={{ color: 'red' }}>Mulai dalam: {timer}s</h2>}
            </div>

            <WebcamOverlay webcamRef={webcamRef} />

            <div style={{ marginTop: '20px' }}>
                {!isCounting && (
                    <button onClick={() => {setIsCounting(true); setTimer(5);}} className="button">
                        Mulai Menjawab
                    </button>
                )}
            </div>
            {/* --- LOGIKA LOADING --- */}
            {isLoading && (
                <div style={{ marginTop: '20px', padding: '20px' }}>
                    <div className="spinner-mini" style={{ 
                        margin: '0 auto', 
                        width: '30px', 
                        height: '30px', 
                        border: '4px solid #f3f3f3', 
                        borderTop: '4px solid #1a73e8', 
                        borderRadius: '50%', 
                        animation: 'spin 1s linear infinite' 
                    }}></div>
                    <p style={{ color: '#666', marginTop: '10px' }}>AI sedang menganalisis ekspresimu...</p>
                </div>
            )}

            {/* --- HASIL ANALISIS --- */}
            {result && !isLoading && (
                <div style={{ marginTop: '20px', border: '1px solid #EFE9F5', padding: '20px', borderRadius: '15px', background: '#F8F5FA' }}>
                    {/* ... isi hasil analisis kamu ... */}
                </div>
            )}
            {/* --- PERBAIKAN LOGIKA HASIL --- */}
            {result && (
                <div style={{ marginTop: '20px', border: '1px solid #EFE9F5', padding: '20px', borderRadius: '15px', background: '#F8F5FA' }}>
                    <h4 style={{ color: 'var(--primary-color)' }}>Hasil Analisis: {result.emotion}</h4>
                    
                    {/* --- PERBAIKAN DI SINI --- */}
                    <p style={{ fontStyle: 'italic', color: '#555' }}>
                        "{result.motivation_quote || result.motivation || "Tetap semangat!"}"
                    </p>
                </div>
            )}

        </div>
    );
};

export default InterviewSession;