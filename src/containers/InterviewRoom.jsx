import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { API_BASE_URL, AI_URL, INTERVIEW_QUESTIONS } from "../utils/constants";
import WebcamOverlay from "../components/WebcamOverlay";
import Swal from "sweetalert2";
import { ChevronLeft, ChevronRight, Plus, Mic, MicOff, Camera, CameraOff } from "lucide-react";

const fontFamily = "'Plus Jakarta Sans', sans-serif";

// Sidebar item (sama dengan Dashboard)
const SidebarItem = ({ imgSrc, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 h-[44px] rounded-[14px] text-[14px] font-semibold transition-all duration-200 ${
      active
        ? "bg-[#7B4DFF] text-white shadow-[0_4px_12px_rgba(123,77,255,0.3)]"
        : "text-[#666] hover:bg-[#F5F2FF] hover:text-[#7B4DFF]"
    }`}
    style={{ fontFamily }}
  >
    <img
      src={imgSrc}
      alt={label}
      className="w-[18px] h-[18px] object-contain"
      style={{ filter: active ? "brightness(0) invert(1)" : "none" }}
    />
    {label}
  </button>
);

const InterviewRoom = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // ── state ──────────────────────────────────────────────
  const [isLoading, setIsLoading] = useState(false);
  const webcamRef = useRef(null);

  const [status, setStatus] = useState("IDLE"); // IDLE | PREPARE | RECORDING | RESULT
  const [timer, setTimer] = useState(5);
  const [selectedDuration, setSelectedDuration] = useState(60);

  const [allQuestions, setAllQuestions] = useState([...INTERVIEW_QUESTIONS]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [tempQuestion, setTempQuestion] = useState("");
  const [userAnswer, setUserAnswer] = useState("");

  const [emotionLogs, setEmotionLogs] = useState([]);
  const [liveEmotion, setLiveEmotion] = useState("Standby");
  const [liveQuote, setLiveQuote] = useState("");
  const [capturedUserPhoto, setCapturedUserPhoto] = useState(null);

  const mediaRecorderRef = useRef(null);
  const videoChunksRef = useRef([]);
  const [recordedVideoURL, setRecordedVideoURL] = useState(null);

  // Mission form state
  const [positionApplied, setPositionApplied] = useState("");
  const [employmentLevel, setEmploymentLevel] = useState("");
  const [companyType, setCompanyType] = useState("");
  const [simulationLevel, setSimulationLevel] = useState("Normal");

  // ── auth guard ─────────────────────────────────────────
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user]);

  // ── save result ────────────────────────────────────────
  useEffect(() => {
    if (status === "RESULT" && user) saveFinalResultToDB();
  }, [status]);

  const saveFinalResultToDB = async () => {
    const dominant = getDominantEmotion();
    const stats = calculateStats();
    if (!dominant || stats.length === 0) return;
    setIsLoading(true);
    try {
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
      Swal.fire("Error", "Gagal menyimpan ke database", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // ── recording helpers ──────────────────────────────────
  const startRecording = () => {
    videoChunksRef.current = [];
    setRecordedVideoURL(null);
    if (!webcamRef.current?.video?.srcObject) return;
    const mediaRecorder = new MediaRecorder(webcamRef.current.video.srcObject, { mimeType: "video/webm" });
    mediaRecorder.ondataavailable = (e) => { if (e.data?.size > 0) videoChunksRef.current.push(e.data); };
    mediaRecorder.onstop = () => {
      const blob = new Blob(videoChunksRef.current, { type: "video/webm" });
      setRecordedVideoURL(URL.createObjectURL(blob));
    };
    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start(500);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state !== "inactive") mediaRecorderRef.current.stop();
  };

  // ── timer ──────────────────────────────────────────────
  useEffect(() => {
    let interval;
    if ((status === "PREPARE" || status === "RECORDING") && timer > 0) {
      interval = setInterval(() => setTimer((p) => p - 1), 1000);
    } else if (timer === 0) {
      if (status === "PREPARE") {
        if (webcamRef.current) setCapturedUserPhoto(webcamRef.current.getScreenshot());
        setStatus("RECORDING");
        setTimer(selectedDuration);
        startRecording();
      } else if (status === "RECORDING") {
        setStatus("RESULT");
        stopRecording();
      }
    }
    return () => clearInterval(interval);
  }, [status, timer, selectedDuration]);

  // ── capture frame ──────────────────────────────────────
  useEffect(() => {
    let captureInterval;
    if (status === "RECORDING") {
      captureInterval = setInterval(captureFrame, 1000);
    }
    return () => clearInterval(captureInterval);
  }, [status]);

  const captureFrame = async () => {
    if (!webcamRef.current || !user || status !== "RECORDING") return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;
    try {
      const blob = await fetch(imageSrc).then((r) => r.blob());
      const formData = new FormData();
      formData.append("userId", user.id);
      formData.append("file", blob);
      const response = await axios.post(`${AI_URL}/predict`, formData);
      if (response.data) {
        setLiveEmotion(response.data.emotion);
        setLiveQuote(response.data.motivation_quote || response.data.motivation);
        setEmotionLogs((prev) => [...prev, response.data.emotion]);
      }
    } catch (e) { console.error("AI Error:", e); }
  };

  // ── stats ──────────────────────────────────────────────
  const calculateStats = () => {
    if (!emotionLogs.length) return [];
    const counts = {};
    emotionLogs.forEach((e) => { counts[e] = (counts[e] || 0) + 1; });
    return Object.keys(counts).map((key) => ({
      label: key,
      value: Math.round((counts[key] / emotionLogs.length) * 100),
    }));
  };

  const getDominantEmotion = () => {
    const stats = calculateStats();
    if (!stats.length) return null;
    const dominant = stats.reduce((p, c) => p.value > c.value ? p : c);
    const messages = {
      Happy: "Amazing! Your positive energy shines naturally.",
      Neutral: "You look calm and professional.",
      Sad: "Try to relax more and show enthusiasm.",
      Fear: "Take a deep breath. You're prepared.",
      Surprise: "Your expression shows genuine interest.",
      Disgust: "Try to stay more positive and composed.",
      Angry: "Stay calm and focus on professional answers.",
    };
    return { ...dominant, message: messages[dominant.label] || "Keep improving your confidence!" };
  };

  const handleReset = () => {
    setStatus("IDLE");
    setTimer(5);
    setEmotionLogs([]);
    setLiveEmotion("Standby");
    setLiveQuote("");
    setUserAnswer("");
    setCapturedUserPhoto(null);
  };

  const handleAddNewQuestion = () => {
    if (tempQuestion.trim()) {
      const newList = [...allQuestions, tempQuestion];
      setAllQuestions(newList);
      setCurrentQuestionIndex(newList.length - 1);
      setIsAddingQuestion(false);
      setTempQuestion("");
    }
  };

  if (!user) return null;

  const isActive = status === "RECORDING" || status === "PREPARE";
  const isDone = status === "RESULT";

  return (
    <div className="min-h-screen flex bg-[#F7F7FB]" style={{ fontFamily }}>

      {/* LOADING OVERLAY */}
      {isLoading && (
        <div className="fixed inset-0 bg-white/90 z-[9999] flex flex-col items-center justify-center">
          <div className="spinner" />
          <p className="mt-5 text-[#7B4DFF] font-semibold">Saving your interview result...</p>
        </div>
      )}

      {/* ── SIDEBAR ─────────────────────────────────────── */}
      <aside className="hidden lg:flex w-[220px] bg-white border-r border-[#ECECEC] px-5 py-7 flex-col justify-between shrink-0">
        <div>
          <div onClick={() => navigate("/")} className="flex items-center gap-2.5 cursor-pointer mb-8">
            <img src="/logo/Icon_Insight.png" alt="logo" className="w-9 h-9" />
            <h1 className="text-[22px] font-bold fontIntersight">Intersight</h1>
          </div>

          <p className="text-[10px] font-bold text-[#BBBBBB] tracking-widest mb-3 px-1">OVERVIEW</p>
          <div className="flex flex-col gap-1.5">
            <SidebarItem imgSrc="/icons/overviewdashboard.png" label="Dashboard" onClick={() => navigate("/dashboard")} />
            <SidebarItem imgSrc="/icons/overviewinterview.png" label="Interview" active onClick={() => navigate("/interview")} />
            <SidebarItem imgSrc="/icons/overviewai.png" label="AI Assistant" onClick={() => navigate("/chatbot")} />
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold text-[#BBBBBB] tracking-widest mb-3 px-1">SETTINGS</p>
          <div className="flex flex-col gap-1.5">
            <SidebarItem imgSrc="/icons/setting.png" label="Setting" onClick={() => navigate("/profile")} />
            <SidebarItem imgSrc="/icons/logout.png" label="Log Out" onClick={logout} />
          </div>
        </div>
      </aside>

      {/* ── MAIN ────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0">

        {/* Top Bar */}
        <div className="bg-white border-b border-[#ECECEC] px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 bg-[#F7F7FB] rounded-full px-4 py-2 w-[320px]">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input type="text" placeholder="Find past interviews, resources, or tips..."
              className="bg-transparent outline-none text-[13px] text-[#999] w-full" />
          </div>
          <div className="flex items-center gap-4">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7B4DFF] to-[#C7B5FF] flex items-center justify-center text-white text-[12px] font-bold">
                {user?.username?.[0]?.toUpperCase() || "A"}
              </div>
              <span className="text-[14px] font-semibold text-[#1E1E1E]">{user?.username?.split(" ")[0] || "Angel"}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 px-6 py-6 overflow-auto">

          {/* ════════════════════════════════════════
              IDLE — Prepare for Your AI Interview
          ════════════════════════════════════════ */}
          {status === "IDLE" && (
            <>
              <h1 className="text-[24px] md:text-[28px] font-bold text-[#1E1E1E] mb-1">
                Prepare for Your AI Interview Simulation
              </h1>
              <p className="text-[14px] text-[#777] mb-6">
                Practice your interview skills in real-time with our advanced AI coach. Get instant feedback on your performance and confidence.
              </p>

              <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5">
                {/* LEFT — Webcam + Mission Form */}
                <div className="flex flex-col gap-5">

                  {/* Live emotion badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-white border border-[#ECECEC] rounded-[14px] px-4 py-2 flex items-center gap-2">
                        <span className="text-[12px] text-[#777]">Live emotion detection:</span>
                        <span className="text-[13px] font-bold text-[#7B4DFF]">{liveEmotion}</span>
                      </div>
                      <p className="text-[12px] text-[#999]">Analyze your emotions...</p>
                    </div>
                    {/* Duration selector */}
                    <div className="relative">
                      <select
                        value={selectedDuration}
                        onChange={(e) => setSelectedDuration(Number(e.target.value))}
                        className="appearance-none bg-white border border-[#ECECEC] rounded-[14px] px-4 py-2 text-[13px] font-semibold text-[#1E1E1E] outline-none cursor-pointer pr-8"
                      >
                        {[10, 15, 30, 60].map((d) => (
                          <option key={d} value={d}>Set Duration: {d}s</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Webcam */}
                  <div className="relative rounded-[20px] overflow-hidden bg-black h-[280px] md:h-[340px]">
                    <WebcamOverlay webcamRef={webcamRef} />
                  </div>

                  {/* Mission Form */}
                  <div className="bg-white rounded-[20px] border border-[#ECECEC] p-6">
                    <p className="text-[11px] font-bold text-[#999] tracking-widest mb-4">SET YOUR MISSION</p>

                    {/* Position */}
                    <div className="mb-4">
                      <label className="text-[14px] font-bold text-[#1E1E1E] mb-2 block">Position Applied</label>
                      <input
                        type="text"
                        placeholder="Type your position applied"
                        value={positionApplied}
                        onChange={(e) => setPositionApplied(e.target.value)}
                        className="w-full h-[44px] border border-[#E5E5E5] rounded-[12px] px-4 text-[13px] outline-none focus:border-[#7B4DFF]"
                      />
                    </div>

                    {/* Employment Level */}
                    <div className="mb-4">
                      <label className="text-[14px] font-bold text-[#1E1E1E] mb-2 block">Employment Level</label>
                      <div className="flex gap-2 flex-wrap">
                        {["Internship", "Full-Time", "Part-Time", "Freelance"].map((lvl) => (
                          <button
                            key={lvl}
                            onClick={() => setEmploymentLevel(lvl)}
                            className={`px-4 py-2 rounded-full text-[13px] font-semibold border transition ${
                              employmentLevel === lvl
                                ? "bg-[#7B4DFF] text-white border-[#7B4DFF]"
                                : "bg-white text-[#666] border-[#E5E5E5] hover:border-[#7B4DFF]"
                            }`}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Company Type */}
                    <div className="mb-4">
                      <label className="text-[14px] font-bold text-[#1E1E1E] mb-2 block">Company Type Context</label>
                      <div className="flex gap-2 flex-wrap">
                        {["Startup", "Corporate", "Agency", "Tech Company"].map((type) => (
                          <button
                            key={type}
                            onClick={() => setCompanyType(type)}
                            className={`px-4 py-2 rounded-full text-[13px] font-semibold border transition ${
                              companyType === type
                                ? "bg-[#7B4DFF] text-white border-[#7B4DFF]"
                                : "bg-white text-[#666] border-[#E5E5E5] hover:border-[#7B4DFF]"
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Simulation Level */}
                    <div>
                      <label className="text-[14px] font-bold text-[#1E1E1E] mb-2 block">Simulation Level</label>
                      <div className="flex gap-2">
                        {["Easy", "Normal", "Hard"].map((lvl) => (
                          <button
                            key={lvl}
                            onClick={() => setSimulationLevel(lvl)}
                            className={`px-6 py-2 rounded-full text-[13px] font-semibold border transition ${
                              simulationLevel === lvl
                                ? "bg-[#7B4DFF] text-white border-[#7B4DFF]"
                                : "bg-white text-[#666] border-[#E5E5E5] hover:border-[#7B4DFF]"
                            }`}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT — Blueprint + Tech + Launch */}
                <div className="flex flex-col gap-4">

                  {/* Interview Blueprint */}
                  <div className="bg-white rounded-[20px] border border-[#ECECEC] p-5">
                    <p className="text-[14px] font-bold text-[#1E1E1E] mb-4">Interview Blueprint</p>
                    <div className="flex flex-col gap-3">
                      {[
                        { icon: "📋", title: "15 Questions", sub: "Curated for your level" },
                        { icon: "⭐", title: "STAR Method", sub: "AI Evaluation Strategy" },
                        { icon: "🎭", title: "Emotional Analysis Enabled", sub: "Vibe & Confidence check" },
                      ].map((item) => (
                        <div key={item.title} className="flex items-start gap-3">
                          <span className="text-[18px]">{item.icon}</span>
                          <div>
                            <p className="text-[13px] font-bold text-[#1E1E1E]">{item.title}</p>
                            <p className="text-[12px] text-[#999]">{item.sub}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tech Readiness */}
                  <div className="bg-white rounded-[20px] border border-[#ECECEC] p-5">
                    <p className="text-[14px] font-bold text-[#1E1E1E] mb-4">Tech Readiness</p>
                    <div className="flex flex-col gap-3">
                      {[
                        { icon: <Mic size={15} />, label: "Microphone Access" },
                        { icon: <Camera size={15} />, label: "Camera Access" },
                        { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1"/></svg>, label: "Connection Access" },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-[#555]">
                            {item.icon}
                            <span className="text-[13px]">{item.label}</span>
                          </div>
                          <span className="text-[11px] font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-full">READY</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Launch Button */}
                  <button
                    onClick={() => { setStatus("PREPARE"); setTimer(5); }}
                    className="w-full h-[52px] rounded-full text-white font-bold text-[15px] flex items-center justify-center gap-2 transition hover:opacity-90"
                    style={{ background: "linear-gradient(90deg, #7B4DFF, #C026D3)" }}
                  >
                    Launch Simulation →
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ════════════════════════════════════════
              PREPARE / RECORDING / RESULT
          ════════════════════════════════════════ */}
          {(status === "PREPARE" || status === "RECORDING" || status === "RESULT") && (
            <>
              <h1 className="text-[24px] md:text-[28px] font-bold text-[#1E1E1E] mb-1">
                Master Your Next Interview with AI
              </h1>
              <p className="text-[14px] text-[#777] mb-6">
                Practice in real-time with an advanced AI coach. Get instant feedback on your answers, body language, and confidence.
              </p>

              {/* Current Mood + Duration */}
              <div className="flex items-center justify-between mb-5">
                <div className="bg-white border border-[#ECECEC] rounded-[14px] px-4 py-2 flex items-center gap-2">
                  <span className="text-[12px] text-[#777]">Current Mood:</span>
                  <span className="text-[13px] font-bold text-[#7B4DFF]">{liveEmotion}</span>
                </div>
                <div className="bg-white border border-[#ECECEC] rounded-[14px] px-4 py-2 text-[13px] font-semibold text-[#1E1E1E]">
                  Set Duration: {selectedDuration}s
                </div>
              </div>

              {/* Session active bar */}
              {status === "RECORDING" && (
                <div className="bg-[#F3ECFF] rounded-[14px] px-5 py-3 flex items-center gap-3 mb-5">
                  <div className="w-2 h-2 bg-[#7B4DFF] rounded-full animate-pulse" />
                  <span className="text-[13px] font-semibold text-[#7B4DFF]">Session Active | {String(Math.floor(timer / 60)).padStart(2, "0")}:{String(timer % 60).padStart(2, "0")}</span>
                  <span className="text-[13px] text-[#999] ml-2">Your words will appear here as you speak...</span>
                </div>
              )}

              <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5">
                {/* LEFT — Video + Notes */}
                <div className="flex flex-col gap-5">

                  {/* Video */}
                  <div className="relative rounded-[20px] overflow-hidden bg-black h-[300px] md:h-[380px]">
                    {status === "RESULT" ? (
                      recordedVideoURL ? (
                        <video controls playsInline className="w-full h-full object-cover scale-x-[-1]">
                          <source src={recordedVideoURL} type="video/webm" />
                        </video>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white text-[14px]">Preparing video...</div>
                      )
                    ) : (
                      <WebcamOverlay webcamRef={webcamRef} />
                    )}

                    {/* PREPARE countdown */}
                    {status === "PREPARE" && (
                      <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white">
                        <h1 className="text-[80px] font-bold leading-none">{timer}</h1>
                        <p className="text-[16px] mt-2">Prepare your answer...</p>
                      </div>
                    )}

                    {/* REC badge */}
                    {status === "RECORDING" && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1.5 rounded-full flex items-center gap-2 text-[12px] font-bold">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        REC {timer}s
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  <div className="bg-white rounded-[20px] border border-[#ECECEC] p-5">
                    <label className="text-[13px] font-bold text-[#999] tracking-wider">Notes:</label>
                    <textarea
                      placeholder="You can write your draft answers here..."
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      className="w-full mt-3 h-[140px] rounded-[16px] border border-[#E7E7E7] p-4 outline-none resize-none text-[14px] text-[#444]"
                    />
                  </div>

                  {/* Control bar — RECORDING */}
                  {status === "RECORDING" && (
                    <div className="bg-white rounded-[20px] border border-[#ECECEC] px-5 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button className="w-10 h-10 rounded-full bg-[#F3F3F7] flex items-center justify-center hover:bg-[#EDE9FF] transition">
                          <Mic size={16} className="text-[#555]" />
                        </button>
                        <button
                          onClick={() => { setStatus("RESULT"); stopRecording(); }}
                          className="px-5 h-[40px] rounded-full bg-red-100 text-red-500 font-semibold text-[13px] hover:bg-red-500 hover:text-white transition"
                        >
                          End Session
                        </button>
                        <button className="w-10 h-10 rounded-full bg-[#F3F3F7] flex items-center justify-center hover:bg-[#EDE9FF] transition">
                          <Camera size={16} className="text-[#555]" />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setCurrentQuestionIndex((p) => Math.min(allQuestions.length - 1, p + 1))}
                          className="px-5 h-[40px] rounded-full text-white font-semibold text-[13px]"
                          style={{ background: "linear-gradient(90deg, #7B4DFF, #C026D3)" }}
                        >
                          Next Question →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Result buttons */}
                  {status === "RESULT" && (
                    <div className="bg-white rounded-[20px] border border-[#ECECEC] p-5 flex flex-col gap-3">
                      <a href={recordedVideoURL} download="Interview-Result.webm"
                        className="w-full h-[48px] rounded-full border border-[#7B4DFF] text-[#7B4DFF] flex items-center justify-center font-semibold text-[14px]">
                        Download Video
                      </a>
                      <button onClick={() => navigate("/history")}
                        className="w-full h-[48px] rounded-full bg-[#7B4DFF] text-white font-semibold text-[14px]">
                        Export & Share Result
                      </button>
                      <button onClick={handleReset}
                        className="w-full h-[48px] rounded-full bg-[#F4F4F7] text-[#444] font-semibold text-[14px]">
                        Reset Session
                      </button>
                    </div>
                  )}
                </div>

                {/* RIGHT — Star Framework + Q&A */}
                <div className="flex flex-col gap-4">

                  {/* Star Framework */}
                  <div className="bg-white rounded-[20px] border border-[#ECECEC] p-5">
                    <p className="text-[14px] font-bold text-[#1E1E1E] mb-4">Star Framework</p>
                    <div className="flex flex-col gap-2.5">
                      {[
                        { key: "S", desc: "Contextualize your current role" },
                        { key: "T", desc: "Describe the backend challenges" },
                        { key: "A", desc: "Focus on specific tech stack used" },
                        { key: "R", desc: "Quantify your impact (e.g., latency reduction)" },
                      ].map((item) => (
                        <div key={item.key} className="flex items-start gap-3">
                          <span className="text-[13px] font-bold text-[#7B4DFF] w-4">{item.key}:</span>
                          <span className="text-[13px] text-[#555]">{item.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Questions & Recap */}
                  <div className="bg-white rounded-[20px] border border-[#ECECEC] p-5">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-[14px] font-bold text-[#1E1E1E]">Questions & Response</p>
                      <button onClick={() => setIsAddingQuestion(true)}
                        className="w-8 h-8 rounded-full bg-[#7B4DFF] text-white flex items-center justify-center">
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <button onClick={() => setCurrentQuestionIndex((p) => Math.max(0, p - 1))}
                        className="w-7 h-7 rounded-full border border-[#E5E5E5] flex items-center justify-center">
                        <ChevronLeft size={14} />
                      </button>
                      <span className="text-[12px] text-[#666] flex-1 text-center">
                        Question {currentQuestionIndex + 1}/{allQuestions.length}
                      </span>
                      <button onClick={() => setCurrentQuestionIndex((p) => Math.min(allQuestions.length - 1, p + 1))}
                        className="w-7 h-7 rounded-full border border-[#E5E5E5] flex items-center justify-center">
                        <ChevronRight size={14} />
                      </button>
                    </div>

                    {isAddingQuestion ? (
                      <div className="flex gap-2">
                        <input type="text" value={tempQuestion} onChange={(e) => setTempQuestion(e.target.value)}
                          placeholder="Add custom question..." className="flex-1 h-[40px] rounded-[12px] border border-[#E7E7E7] px-3 outline-none text-[13px]" />
                        <button onClick={handleAddNewQuestion} className="px-3 rounded-[12px] bg-[#7B4DFF] text-white font-semibold text-[12px]">Save</button>
                      </div>
                    ) : (
                      <p className="text-[14px] font-semibold text-[#1E1E1E] leading-relaxed mb-4">
                        "{allQuestions[currentQuestionIndex]}"
                      </p>
                    )}

                    {/* Emotion recap */}
                    {calculateStats().length > 0 && (
                      <div className="mt-4 pt-4 border-t border-[#F0F0F0]">
                        <p className="text-[12px] font-bold text-[#999] mb-3">EMOTION RECAP</p>
                        <div className="space-y-2">
                          {calculateStats().map((stat) => (
                            <div key={stat.label}>
                              <div className="flex justify-between mb-1">
                                <span className="text-[12px] text-[#444]">{stat.label}</span>
                                <span className="text-[12px] font-bold text-[#7B4DFF]">{stat.value}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-[#ECECEC] rounded-full overflow-hidden">
                                <div className="h-full bg-[#7B4DFF] rounded-full" style={{ width: `${stat.value}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                        {getDominantEmotion() && (
                          <div className="mt-3 bg-[#7B4DFF] text-white rounded-[14px] p-3">
                            <p className="text-[12px] font-bold">Dominant: {getDominantEmotion().label}</p>
                            <p className="text-[11px] opacity-90 mt-1">"{getDominantEmotion().message}"</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default InterviewRoom;
