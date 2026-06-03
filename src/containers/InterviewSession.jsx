import React, { useState, useEffect, useRef, useCallback } from "react";
import WebcamOverlay from "../components/WebcamOverlay";
import { sendFrameToPrediction } from "../services/api";

const InterviewSession = () => {
  const webcamRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(5);
  const [isCounting, setIsCounting] = useState(false);
  const [question] = useState("Sebutkan kelebihan dan kekurangan Anda?");
  const [result, setResult] = useState(null);

  const handleAutoCapture = useCallback(async () => {
    setIsLoading(true);
    setResult(null);
    try {
      const imageBase64 = webcamRef.current.getScreenshot();
      const data = await sendFrameToPrediction(imageBase64);
      setResult(data);
    } catch (error) {
      console.error("Gagal menganalisis:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let interval;
    if (isCounting && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      setTimeout(() => {
        handleAutoCapture();
        setIsCounting(false);
      }, 0);
    }
    return () => clearInterval(interval);
  }, [isCounting, timer, handleAutoCapture]);

  // Ganti bagian return di InterviewSession.jsx menjadi ini:
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <div
        className="question-header"
        style={{
          background: "#f0f2f5",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "10px",
        }}
      >
        <h3 style={{ color: "#1a73e8" }}>{question}</h3>
        {isCounting && <h2 style={{ color: "red" }}>Mulai dalam: {timer}s</h2>}
      </div>

      <WebcamOverlay webcamRef={webcamRef} />

      <div style={{ marginTop: "20px" }}>
        {!isCounting && (
          <button
            onClick={() => {
              setIsCounting(true);
              setTimer(5);
            }}
            className="button"
          >
            Mulai Menjawab
          </button>
        )}
      </div>
      {/* --- LOGIKA LOADING --- */}
      {isLoading && (
        <div style={{ marginTop: "20px", padding: "20px" }}>
          <div
            className="spinner-mini"
            style={{
              margin: "0 auto",
              width: "30px",
              height: "30px",
              border: "4px solid #f3f3f3",
              borderTop: "4px solid #1a73e8",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          ></div>
          <p style={{ color: "#666", marginTop: "10px" }}>
            AI sedang menganalisis ekspresimu...
          </p>
        </div>
      )}

      {result && !isLoading && (
        <div
          style={{
            marginTop: "20px",
            border: "1px solid #EFE9F5",
            padding: "20px",
            borderRadius: "15px",
            background: "#F8F5FA",
          }}
        >
          <h4 style={{ color: "var(--primary-color)" }}>
            Emosi Terdeteksi:{" "}
            {result.predicted_class
              ? result.predicted_class.charAt(0).toUpperCase() + result.predicted_class.slice(1)
              : "—"}
          </h4>
          {result.confidence != null && (
            <p style={{ color: "#7B4DFF", fontWeight: "bold", margin: "4px 0" }}>
              Confidence: {(result.confidence * 100).toFixed(2)}%
            </p>
          )}
          {result.meets_confidence_threshold === false && (
            <p style={{ color: "#EF4444", fontSize: "13px" }}>
              Wajah kurang terlihat jelas. Pastikan pencahayaan baik dan wajah menghadap kamera.
            </p>
          )}
          <p style={{ fontStyle: "italic", color: "#555", marginTop: "8px" }}>
            "{result.suggestion || "Tetap semangat!"}"
          </p>
        </div>
      )}
    </div>
  );
};

export default InterviewSession;
