import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  API_BASE_URL,
  AI_URL,
  INTERVIEW_QUESTIONS,
} from "../utils/constants";
import WebcamOverlay from "../components/WebcamOverlay";
import Swal from "sweetalert2";

const InterviewRoom = () => {
  const [isLoading, setIsLoading] = useState(false);

  const webcamRef = useRef(null);
  const resultRef = useRef(null);

  const { user } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 11) return "Pagi";
    if (hour < 15) return "Siang";
    if (hour < 19) return "Sore";

    return "Malam";
  };

  const greeting = getGreeting();

  const [status, setStatus] = useState("IDLE");
  const [timer, setTimer] = useState(5);

  const [selectedDuration, setSelectedDuration] = useState(60);

  const [allQuestions, setAllQuestions] = useState([
    ...INTERVIEW_QUESTIONS,
  ]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [isAddingQuestion, setIsAddingQuestion] = useState(false);

  const [tempQuestion, setTempQuestion] = useState("");

  const [userAnswer, setUserAnswer] = useState("");

  const [emotionLogs, setEmotionLogs] = useState([]);

  const [liveEmotion, setLiveEmotion] = useState("STANDBY");

  const [liveQuote, setLiveQuote] = useState("");

  const [capturedUserPhoto, setCapturedUserPhoto] = useState(null);

  const mediaRecorderRef = useRef(null);

  const videoChunksRef = useRef([]);

  const [recordedVideoURL, setRecordedVideoURL] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login", {
        state: { from: location.pathname },
      });
    }
  }, [user, navigate, location]);

  useEffect(() => {
    if (status === "RESULT" && user) {
      saveFinalResultToDB();
    }
  }, [status]);

  const startRecording = () => {
    videoChunksRef.current = [];

    setRecordedVideoURL(null);

    if (!webcamRef.current || !webcamRef.current.video.srcObject) {
      return;
    }

    const stream = webcamRef.current.video.srcObject;

    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: "video/webm",
    });

    mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        videoChunksRef.current.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(videoChunksRef.current, {
        type: "video/webm",
      });

      const url = URL.createObjectURL(blob);

      setRecordedVideoURL(url);
    };

    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.start(500);
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
  };

  const saveFinalResultToDB = async () => {
    const dominant = getDominantEmotion();

    const stats = calculateStats();

    if (!dominant || stats.length === 0) return;

    try {
      setIsLoading(true);

      await axios.post(`${API_BASE_URL}/history/save`, {
        userId: user._id || user.id,

        emotion: dominant.label,

        motivation: dominant.message,

        confidence: dominant.value / 100,

        allStats: stats,

        question: allQuestions[currentQuestionIndex],

        duration: selectedDuration,

        answer: userAnswer,

        userPhoto: capturedUserPhoto,
      });
    } catch (err) {
      console.error(err);

      Swal.fire(
        "Error",
        "Gagal menyimpan hasil interview",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let interval;

    if (
      (status === "PREPARE" || status === "RECORDING") &&
      timer > 0
    ) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      if (status === "PREPARE") {
        if (webcamRef.current) {
          const imageSrc = webcamRef.current.getScreenshot();

          setCapturedUserPhoto(imageSrc);
        }

        setStatus("RECORDING");

        setTimer(selectedDuration);

        startRecording();
      } else if (status === "RECORDING") {
        stopRecording();

        setStatus("RESULT");
      }
    }

    return () => clearInterval(interval);
  }, [status, timer, selectedDuration]);

  useEffect(() => {
    let captureInterval;

    if (status === "RECORDING") {
      captureInterval = setInterval(() => {
        captureFrame();
      }, 1000);
    }

    return () => clearInterval(captureInterval);
  }, [status]);

  const captureFrame = async () => {
    if (!webcamRef.current || !user) return;

    const imageSrc = webcamRef.current.getScreenshot();

    if (!imageSrc) return;

    try {
      const blob = await fetch(imageSrc).then((r) => r.blob());

      const formData = new FormData();

      formData.append("userId", user.id);

      formData.append("file", blob);

      const response = await axios.post(
        `${AI_URL}/predict`,
        formData
      );

      if (response.data) {
        setLiveEmotion(response.data.emotion);

        setLiveQuote(
          response.data.motivation_quote ||
            response.data.motivation
        );

        setEmotionLogs((prev) => [
          ...prev,
          response.data.emotion,
        ]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const calculateStats = () => {
    if (emotionLogs.length === 0) return [];

    const counts = {};

    emotionLogs.forEach((e) => {
      counts[e] = (counts[e] || 0) + 1;
    });

    return Object.keys(counts).map((key) => ({
      label: key,
      value: Math.round(
        (counts[key] / emotionLogs.length) * 100
      ),
    }));
  };

  const getDominantEmotion = () => {
    const stats = calculateStats();

    if (stats.length === 0) return null;

    const dominant = stats.reduce((prev, current) =>
      prev.value > current.value ? prev : current
    );

    return dominant;
  };

  const handleReset = () => {
    setStatus("IDLE");

    setTimer(5);

    setEmotionLogs([]);

    setLiveEmotion("STANDBY");

    setLiveQuote("");

    setUserAnswer("");

    setRecordedVideoURL(null);
  };

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#F8F5FF] px-5 py-32">
      <div className="max-w-7xl mx-auto">

        {/* TOP TEXT */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#7C3AED]">
            Selamat {greeting},{" "}
            {user?.username?.split(" ")[0] || "User"} 👋
          </h1>

          <p className="text-[#8E8E8E] mt-2">
            Siap latihan interview hari ini?
          </p>
        </div>

        {/* GRID */}
        <div className="grid lg:grid-cols-2 gap-7">

          {/* LEFT */}
          <div className="bg-white rounded-[32px] shadow-sm p-6">

            {/* LIVE */}
            <div className="bg-[#F6F0FF] rounded-2xl p-5 mb-5">
              <h3 className="font-semibold text-[#7C3AED]">
                Live Emotion : {liveEmotion}
              </h3>

              <p className="text-sm text-[#6E6E6E] mt-2">
                {liveQuote || "AI sedang membaca ekspresimu..."}
              </p>
            </div>

            {/* WEBCAM */}
            <div className="relative overflow-hidden rounded-[28px] bg-black h-[420px]">

              {status === "RESULT" && recordedVideoURL ? (
                <video
                  controls
                  className="w-full h-full object-cover"
                >
                  <source
                    src={recordedVideoURL}
                    type="video/webm"
                  />
                </video>
              ) : (
                <WebcamOverlay webcamRef={webcamRef} />
              )}

              {status === "PREPARE" && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                  <h1 className="text-white text-7xl font-bold">
                    {timer}
                  </h1>

                  <p className="text-white mt-4">
                    Siapkan jawabanmu...
                  </p>
                </div>
              )}

              {status === "IDLE" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={() => {
                      setStatus("PREPARE");
                      setTimer(5);
                    }}
                    className="bg-[#7C3AED] hover:bg-[#6D28D9] transition-all text-white px-7 py-4 rounded-full font-semibold"
                  >
                    Mulai Simulasi
                  </button>
                </div>
              )}
            </div>

            {/* DURATION */}
            <div className="flex gap-3 mt-6 flex-wrap">
              {[10, 15, 30, 60].map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDuration(d)}
                  className={`px-5 py-2 rounded-full font-medium transition-all ${
                    selectedDuration === d
                      ? "bg-[#7C3AED] text-white"
                      : "bg-[#EFE7FF] text-[#7C3AED]"
                  }`}
                >
                  {d}s
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="bg-white rounded-[32px] shadow-sm p-6">

            {/* QUESTION */}
            <div className="bg-[#F6F0FF] rounded-2xl p-5">

              <div className="flex items-center justify-between mb-5">

                <button
                  onClick={() =>
                    setCurrentQuestionIndex((prev) =>
                      Math.max(0, prev - 1)
                    )
                  }
                  className="w-11 h-11 rounded-full bg-white text-[#7C3AED]"
                >
                  ←
                </button>

                <span className="font-semibold text-[#7C3AED]">
                  Question {currentQuestionIndex + 1}
                </span>

                <button
                  onClick={() =>
                    setCurrentQuestionIndex((prev) =>
                      Math.min(
                        allQuestions.length - 1,
                        prev + 1
                      )
                    )
                  }
                  className="w-11 h-11 rounded-full bg-white text-[#7C3AED]"
                >
                  →
                </button>
              </div>

              <h2 className="text-2xl font-bold text-[#242424] leading-relaxed">
                {allQuestions[currentQuestionIndex]}
              </h2>
            </div>

            {/* ANSWER */}
            <div className="mt-6">
              <label className="block mb-3 font-semibold text-[#5E5E5E]">
                Draft Jawaban
              </label>

              <textarea
                value={userAnswer}
                onChange={(e) =>
                  setUserAnswer(e.target.value)
                }
                placeholder="Tulis draft jawabanmu..."
                className="w-full h-[220px] rounded-3xl border border-[#ECECEC] p-5 outline-none resize-none"
              />
            </div>

            {/* RESULT */}
            {status === "RESULT" && (
              <div
                ref={resultRef}
                className="mt-6 bg-[#F6F0FF] rounded-3xl p-5"
              >
                <h3 className="text-xl font-bold text-[#7C3AED] mb-5">
                  Ringkasan Ekspresi
                </h3>

                <div className="space-y-4">
                  {calculateStats().map((stat) => (
                    <div key={stat.label}>
                      <div className="flex justify-between mb-2">
                        <span>{stat.label}</span>

                        <span>{stat.value}%</span>
                      </div>

                      <div className="w-full h-3 rounded-full bg-white overflow-hidden">
                        <div
                          className="h-full bg-[#7C3AED]"
                          style={{
                            width: `${stat.value}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 mt-7">

                  <button
                    onClick={handleReset}
                    className="flex-1 border border-[#7C3AED] text-[#7C3AED] py-3 rounded-full font-semibold"
                  >
                    Reset
                  </button>

                  <button
                    onClick={() => navigate("/history")}
                    className="flex-1 bg-[#7C3AED] text-white py-3 rounded-full font-semibold"
                  >
                    Export
                  </button>

                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default InterviewRoom;