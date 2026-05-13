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

import {
  Bell,
  Mic,
  Camera,
  Wifi,
  LayoutDashboard,
  BriefcaseBusiness,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";

const InterviewRoom = () => {
  const [isLoading, setIsLoading] = useState(false);

  const webcamRef = useRef(null);

  const { user, setUser } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();

  const [status, setStatus] = useState("IDLE");
  const [timer, setTimer] = useState(5);

  const [selectedDuration, setSelectedDuration] =
    useState(60);

  const [allQuestions, setAllQuestions] = useState([
    ...INTERVIEW_QUESTIONS,
  ]);

  const [currentQuestionIndex, setCurrentQuestionIndex] =
    useState(0);

  const [isAddingQuestion, setIsAddingQuestion] =
    useState(false);

  const [tempQuestion, setTempQuestion] =
    useState("");

  const [userAnswer, setUserAnswer] = useState("");

  const [emotionLogs, setEmotionLogs] = useState([]);

  const [liveEmotion, setLiveEmotion] =
    useState("STANDBY");

  const [liveQuote, setLiveQuote] = useState("");

  const [capturedUserPhoto, setCapturedUserPhoto] =
    useState(null);

  const mediaRecorderRef = useRef(null);

  const videoChunksRef = useRef([]);

  const [recordedVideoURL, setRecordedVideoURL] =
    useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login", {
        state: { from: location.pathname },
      });
    }
  }, [user, navigate, location]);

  const handleLogout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("user");

    setUser(null);

    navigate("/");
  };

  useEffect(() => {
    if (status === "RESULT" && user) {
      saveFinalResultToDB();
    }
  }, [status]);

  const startRecording = () => {
    videoChunksRef.current = [];

    setRecordedVideoURL(null);

    if (
      !webcamRef.current ||
      !webcamRef.current.video.srcObject
    ) {
      console.error("Webcam belum siap");
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

    const finalQuestion =
      allQuestions[currentQuestionIndex];

    const finalAnswer = userAnswer;

    const finalDuration = selectedDuration;

    if (!dominant || stats.length === 0) return;

    setIsLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/history/save`, {
        userId: user._id || user.id,

        emotion: dominant.label,

        motivation: dominant.message,

        confidence: dominant.value / 100,

        allStats: stats,

        question: finalQuestion,

        duration: finalDuration,

        answer: finalAnswer,

        userPhoto: capturedUserPhoto,
      });
    } catch (err) {
      console.error("Gagal simpan:", err);

      Swal.fire(
        "Error",
        "Gagal menyimpan ke database",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let interval;

    if (
      (status === "PREPARE" ||
        status === "RECORDING") &&
      timer > 0
    ) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      if (status === "PREPARE") {
        if (webcamRef.current) {
          const imageSrc =
            webcamRef.current.getScreenshot();

          setCapturedUserPhoto(imageSrc);
        }

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
    if (
      !webcamRef.current ||
      !user ||
      status !== "RECORDING"
    )
      return;

    const imageSrc =
      webcamRef.current.getScreenshot();

    if (!imageSrc) return;

    try {
      const blob = await fetch(imageSrc).then((r) =>
        r.blob()
      );

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
      console.error("AI Error:", e);
    }
  };

  const handleReset = () => {
    setStatus("IDLE");

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

    const messages = {
      Happy:
        "Amazing! Your positive energy shines naturally.",

      Neutral:
        "You look calm and professional.",

      Sad:
        "Try to relax more and show enthusiasm.",

      Fear:
        "Take a deep breath. You're prepared.",

      Surprise:
        "Your expression shows genuine interest.",

      Disgust:
        "Try to stay more positive and composed.",

      Angry:
        "Stay calm and focus on professional answers.",
    };

    return {
      ...dominant,

      message:
        messages[dominant.label] ||
        "Keep improving your confidence!",
    };
  };

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#F7F7FB] flex">
      {/* LOADING */}
      {isLoading && (
        <div className="fixed inset-0 bg-white/90 z-[9999] flex flex-col items-center justify-center">
          <div className="spinner"></div>

          <p className="mt-5 text-[#7B4DFF] font-semibold">
            Saving your interview result...
          </p>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className="hidden lg:flex w-[260px] bg-white border-r border-[#ECECEC] px-6 py-8 flex-col justify-between">
        <div>
          {/* LOGO */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-3 cursor-pointer"
          >
            <img
              src="/logo/Icon_Insight.png"
              alt="logo"
              className="w-11 h-11"
            />

            <h1 className="text-[30px] font-bold fontIntersight">
              Intersight
            </h1>
          </div>

          {/* PROFILE */}
          <div className="mt-10 bg-[#FAF7FF] rounded-[20px] p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#7B4DFF] to-[#C7B5FF]" />

              <div>
                <h2 className="font-bold text-[15px] text-[#1E1E1E]">
                  {user?.username || "Angel"}
                </h2>

                <p className="text-[12px] text-[#777]">
                  AI Interview Practice
                </p>
              </div>
            </div>
          </div>

          {/* MENU */}
          <div className="mt-10 flex flex-col gap-3">
            <button className="flex items-center gap-3 px-4 h-[48px] rounded-[16px] text-[#555] hover:bg-[#F5F2FF] transition">
              <LayoutDashboard size={18} />
              Dashboard
            </button>

            <button className="flex items-center gap-3 px-4 h-[48px] rounded-[16px] bg-[#7B4DFF] text-white font-semibold">
              <BriefcaseBusiness size={18} />
              Interview
            </button>

            <button className="flex items-center gap-3 px-4 h-[48px] rounded-[16px] text-[#555] hover:bg-[#F5F2FF] transition">
              <Settings size={18} />
              Setting
            </button>
          </div>
        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="w-full h-[52px] rounded-full bg-[#EFE7FF] text-[#7B4DFF] font-bold flex items-center justify-center gap-2 hover:bg-[#7B4DFF] hover:text-white transition"
        >
          <LogOut size={18} />
          Log Out
        </button>
      </aside>

      {/* CONTENT */}
      <section className="flex-1 px-5 lg:px-8 py-6">
        {/* TOPBAR */}
        <div className="bg-white rounded-[24px] border border-[#ECECEC] px-6 py-4 flex items-center justify-between">
          <input
            type="text"
            placeholder="Search interview resources..."
            className="hidden md:block w-[350px] outline-none text-sm text-[#666]"
          />

          <div className="flex items-center gap-5 ml-auto">
            <Bell size={20} className="text-[#555]" />

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#7B4DFF] to-[#C7B5FF]" />

              <p className="font-semibold text-[#1E1E1E]">
                {user?.username || "Angel"}
              </p>
            </div>
          </div>
        </div>

        {/* HEADER */}
        <div className="mt-8">
          <h1 className="text-[38px] lg:text-[46px] leading-tight font-bold text-[#1E1E1E]">
            Ready for your mission,
            <br />
            {user?.username?.split(" ")[0] || "Angel"}?
          </h1>

          <p className="text-[#777] mt-3 max-w-2xl">
            Practice your confidence, improve your
            communication, and let AI analyze your
            emotional expression during interview
            simulation.
          </p>
        </div>

        {/* MAIN */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6 mt-8">
          {/* LEFT */}
          <div className="bg-white rounded-[30px] border border-[#ECECEC] p-5">
            {/* VIDEO */}
            <div className="relative rounded-[28px] overflow-hidden bg-black h-[540px] xl:h-[680px]">
              {status === "RESULT" ? (
                recordedVideoURL ? (
                  <video
                    controls
                    playsInline
                    className="w-full h-full object-cover scale-x-[-1]"
                  >
                    <source
                      src={recordedVideoURL}
                      type="video/webm"
                    />
                  </video>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white">
                    Preparing video...
                  </div>
                )
              ) : (
                <WebcamOverlay webcamRef={webcamRef} />
              )}

              {/* RECORDING */}
              {status === "RECORDING" && (
                <div className="absolute top-5 left-5 bg-red-500 text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold">
                  <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></div>

                  REC {timer}s
                </div>
              )}

              {/* PREPARE */}
              {status === "PREPARE" && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">
                  <h1 className="text-[100px] font-bold">
                    {timer}
                  </h1>

                  <p className="text-lg">
                    Prepare your answer...
                  </p>
                </div>
              )}
            </div>

            {/* LIVE STATUS */}
            <div className="mt-5 bg-[#FAFAFD] border border-[#ECECEC] rounded-[20px] px-5 py-4 flex flex-wrap gap-5 justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Mic size={16} />
                Microphone
                <span className="text-green-500 font-semibold">
                  READY
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Camera size={16} />
                Camera
                <span className="text-green-500 font-semibold">
                  READY
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Wifi size={16} />
                Connection
                <span className="text-green-500 font-semibold">
                  STABLE
                </span>
              </div>
            </div>

            {/* QUESTION */}
            <div className="mt-5 bg-[#FAFAFD] border border-[#ECECEC] rounded-[24px] p-5">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      setCurrentQuestionIndex((prev) =>
                        Math.max(0, prev - 1)
                      )
                    }
                    className="w-10 h-10 rounded-full border border-[#E5E5E5] flex items-center justify-center"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <p className="font-semibold text-[#666]">
                    Question{" "}
                    {currentQuestionIndex + 1}/
                    {allQuestions.length}
                  </p>

                  <button
                    onClick={() =>
                      setCurrentQuestionIndex((prev) =>
                        Math.min(
                          allQuestions.length - 1,
                          prev + 1
                        )
                      )
                    }
                    className="w-10 h-10 rounded-full border border-[#E5E5E5] flex items-center justify-center"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>

                <button
                  onClick={() =>
                    setIsAddingQuestion(true)
                  }
                  className="w-10 h-10 rounded-full bg-[#7B4DFF] text-white flex items-center justify-center"
                >
                  <Plus size={18} />
                </button>
              </div>

              {isAddingQuestion ? (
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={tempQuestion}
                    onChange={(e) =>
                      setTempQuestion(e.target.value)
                    }
                    placeholder="Add your custom question..."
                    className="flex-1 h-[52px] rounded-[14px] border border-[#E7E7E7] px-4 outline-none"
                  />

                  <button
                    onClick={handleAddNewQuestion}
                    className="px-5 rounded-[14px] bg-[#7B4DFF] text-white font-semibold"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <h2 className="text-[28px] leading-relaxed font-bold text-[#1E1E1E]">
                  "
                  {
                    allQuestions[currentQuestionIndex]
                  }
                  "
                </h2>
              )}
            </div>

            {/* ANSWER */}
            <div className="mt-5">
              <label className="font-semibold text-[#444]">
                Draft Answer
              </label>

              <textarea
                placeholder="Write your draft answer here..."
                value={userAnswer}
                onChange={(e) =>
                  setUserAnswer(e.target.value)
                }
                className="w-full mt-3 h-[180px] rounded-[24px] border border-[#E7E7E7] p-5 outline-none resize-none"
              ></textarea>
            </div>

            {/* BUTTON */}
            {status === "IDLE" && (
              <button
                onClick={() => {
                  setStatus("PREPARE");
                  setTimer(5);
                }}
                className="w-full mt-6 h-[58px] rounded-full bg-[#7B4DFF] text-white font-bold text-lg hover:bg-[#6939ff] transition"
              >
                Launch Simulation →
              </button>
            )}
          </div>

          {/* RIGHT */}
          <div className="flex flex-col gap-5">
            {/* LIVE EMOTION */}
            <div className="bg-white rounded-[30px] border border-[#ECECEC] p-6">
              <p className="text-sm text-[#777]">
                Live Emotion Detection
              </p>

              <h2 className="text-[32px] font-bold text-[#7B4DFF] mt-2">
                {liveEmotion}
              </h2>

              <p className="text-sm text-[#666] mt-3 leading-relaxed">
                "
                {liveQuote ||
                  "AI is analyzing your facial expression..."}
                "
              </p>

              <div className="mt-5 flex gap-2 flex-wrap">
                {[10, 15, 30, 60].map((d) => (
                  <button
                    key={d}
                    onClick={() =>
                      setSelectedDuration(d)
                    }
                    disabled={status !== "IDLE"}
                    className={`px-4 h-[40px] rounded-full text-sm font-semibold transition ${
                      selectedDuration === d
                        ? "bg-[#7B4DFF] text-white"
                        : "bg-[#F4F4F7] text-[#555]"
                    }`}
                  >
                    {d}s
                  </button>
                ))}
              </div>
            </div>

            {/* RECAP */}
            <div className="bg-white rounded-[30px] border border-[#ECECEC] p-6">
              <h2 className="text-[24px] font-bold mb-5">
                Interview Recap
              </h2>

              <div className="space-y-4">
                {calculateStats().map((stat) => (
                  <div key={stat.label}>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">
                        {stat.label}
                      </span>

                      <span className="font-bold text-[#7B4DFF]">
                        {stat.value}%
                      </span>
                    </div>

                    <div className="w-full h-3 bg-[#ECECEC] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#7B4DFF]"
                        style={{
                          width: `${stat.value}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              {getDominantEmotion() && (
                <div className="mt-6 bg-[#7B4DFF] text-white rounded-[20px] p-5">
                  <h3 className="font-bold text-lg">
                    Dominant Emotion:{" "}
                    {getDominantEmotion().label}
                  </h3>

                  <p className="mt-2 text-sm opacity-90">
                    "
                    {
                      getDominantEmotion().message
                    }
                    "
                  </p>
                </div>
              )}
            </div>

            {/* RESULT BUTTON */}
            {status === "RESULT" && (
              <div className="bg-white rounded-[30px] border border-[#ECECEC] p-5 flex flex-col gap-3">
                <a
                  href={recordedVideoURL}
                  download="Interview-Result.webm"
                  className="w-full h-[52px] rounded-full border border-[#7B4DFF] text-[#7B4DFF] flex items-center justify-center font-semibold"
                >
                  Download Video
                </a>

                <button
                  onClick={() => navigate("/history")}
                  className="w-full h-[52px] rounded-full bg-[#7B4DFF] text-white font-semibold"
                >
                  Export & Share Result
                </button>

                <button
                  onClick={handleReset}
                  className="w-full h-[52px] rounded-full bg-[#F4F4F7] text-[#444] font-semibold"
                >
                  Reset Session
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default InterviewRoom;