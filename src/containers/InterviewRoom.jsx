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
} from "lucide-react";

const InterviewRoom = () => {
  const [isLoading, setIsLoading] = useState(false);

  const webcamRef = useRef(null);
  const resultRef = useRef(null);

  const { user, setUser } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 11) return "Morning";
    if (hour < 15) return "Afternoon";
    if (hour < 19) return "Evening";

    return "Night";
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

  const handleLogout = () => {
    localStorage.removeItem("token");

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

      console.log("History berhasil disimpan!");
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

    return dominant;
  };

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#F8F8FC] flex">
      {/* SIDEBAR */}
      <div className="w-[260px] bg-white border-r border-[#ECECEC] px-6 py-8 hidden lg:flex flex-col justify-between">
        <div>
          {/* LOGO */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-3 cursor-pointer"
          >
            <img
              src="/logo/Icon_Insight.png"
              alt="logo"
              className="w-10 h-10"
            />

            <h1 className="text-[28px] font-bold fontIntersight">
              Intersight
            </h1>
          </div>

          {/* PROFILE */}
          <div className="mt-10 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#7B4DFF] to-[#C7B5FF]" />

            <div>
              <h2 className="font-bold text-[15px]">
                {user?.username || "Angel"}'s Dashboard
              </h2>

              <p className="text-[12px] text-[#777]">
                What's your plan for today?
              </p>
            </div>
          </div>

          {/* MENU */}
          <div className="mt-10 flex flex-col gap-4">
            <button className="flex items-center gap-3 text-[#1E1E1E] font-medium">
              <LayoutDashboard size={18} />
              Dashboard
            </button>

            <button className="flex items-center gap-3 text-[#1E1E1E] font-medium">
              <BriefcaseBusiness size={18} />
              Interview
            </button>

            <button className="flex items-center gap-3 text-[#1E1E1E] font-medium">
              <Settings size={18} />
              Setting
            </button>
          </div>
        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="
            w-full
            h-[50px]
            rounded-full
            bg-[#D7B8FF]
            text-white
            font-bold
            hover:opacity-90
            transition
            flex items-center justify-center gap-2
          "
        >
          <LogOut size={18} />
          Log Out
        </button>
      </div>

      {/* CONTENT */}
      <div className="flex-1 px-8 py-7">
        {/* TOPBAR */}
        <div className="bg-white rounded-[24px] px-7 py-5 flex items-center justify-between border border-[#ECECEC]">
          <input
            type="text"
            placeholder="Find post interview, resources, or tips..."
            className="w-[420px] outline-none text-sm"
          />

          <div className="flex items-center gap-5">
            <Bell size={20} />

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#7B4DFF] to-[#C7B5FF]" />

              <p className="font-medium">
                {user?.username || "Angel"}
              </p>
            </div>
          </div>
        </div>

        {/* HEADER */}
        <div className="mt-8">
          <h1 className="text-[42px] font-bold text-[#1E1E1E]">
            Ready for your mission,{" "}
            {user?.username?.split(" ")[0] || "Angel"} ?
          </h1>

          <p className="text-[#777] mt-2">
            Finalize your setup. Choose your target role
            and difficulty level to begin your
            personalized AI-powered interview
            simulation.
          </p>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 mt-8">
          {/* LEFT */}
          <div>
            {/* IMAGE / VIDEO */}
            <div className="bg-white rounded-[24px] p-4 border border-[#ECECEC]">
              <div className="rounded-[20px] overflow-hidden bg-black h-[320px] relative">
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

                {status === "PREPARE" && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-[100px] font-bold">
                    {timer}
                  </div>
                )}
              </div>

              {/* FORM */}
              <div className="mt-6">
                <h2 className="text-[28px] font-bold">
                  Set Your Mission
                </h2>

                <p className="text-[#777] text-sm mt-1">
                  What position are you aiming for?
                </p>

                <select className="w-full mt-4 h-[50px] rounded-[12px] border border-[#E7E7E7] px-4 outline-none">
                  <option>Select your position</option>
                  <option>Frontend Developer</option>
                  <option>Backend Developer</option>
                  <option>UI/UX Designer</option>
                </select>

                {/* EXPERIENCE */}
                <div className="mt-5">
                  <p className="font-medium mb-3">
                    Experience Level
                  </p>

                  <div className="flex gap-3 flex-wrap">
                    {[
                      "Internship",
                      "Junior",
                      "Associate",
                    ].map((item) => (
                      <button
                        key={item}
                        className="px-4 h-[38px] rounded-full border border-[#E7E7E7] text-sm"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                {/* COMPANY */}
                <div className="mt-5">
                  <p className="font-medium mb-3">
                    Preferences Company (Optional)
                  </p>

                  <input
                    type="text"
                    placeholder="e.g Google, GoTo, or Shopee"
                    className="w-full h-[50px] rounded-[12px] border border-[#E7E7E7] px-4 outline-none"
                  />
                </div>

                {/* AI DIFFICULTY */}
                <div className="mt-5">
                  <p className="font-medium mb-3">
                    AI Difficulty Level
                  </p>

                  <div className="flex gap-3">
                    {["Easy", "Medium", "Hard"].map(
                      (item) => (
                        <button
                          key={item}
                          className="px-5 h-[40px] rounded-full border border-[#E7E7E7]"
                        >
                          {item}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* STATUS */}
                <div className="mt-6 bg-[#FAFAFA] rounded-[18px] border border-[#ECECEC] px-5 py-4 flex flex-wrap gap-6 justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <Mic size={16} />
                    Tech Readiness
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Mic size={16} />
                    Microphone
                    <span className="text-green-500">
                      ● READY
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Camera size={16} />
                    Camera
                    <span className="text-green-500">
                      ● READY
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Wifi size={16} />
                    Connection
                    <span className="text-green-500">
                      ● READY
                    </span>
                  </div>
                </div>

                {/* BUTTON */}
                <button
                  onClick={() => {
                    setStatus("PREPARE");
                    setTimer(5);
                  }}
                  className="
                    w-full
                    mt-6
                    h-[58px]
                    rounded-full
                    bg-[#5B4DFF]
                    text-white
                    font-bold
                    text-lg
                    hover:opacity-90
                    transition
                  "
                >
                  Launch Simulation →
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex flex-col gap-5">
            {/* RECAP */}
            <div className="bg-white rounded-[24px] p-6 border border-[#ECECEC]">
              <h2 className="text-[24px] font-bold mb-6">
                Your Interview Recap
              </h2>

              <div className="w-[180px] h-[180px] rounded-full border-[14px] border-[#5B4DFF] mx-auto flex items-center justify-center text-[42px] font-bold text-[#1E1E1E]">
                {getDominantEmotion()
                  ? `${getDominantEmotion().value}%`
                  : "63%"}
              </div>

              <div className="mt-6 text-sm text-[#666] space-y-2">
                <p>
                  <span className="font-semibold">
                    Total Sessions
                  </span>
                  <br />
                  4 sessions
                </p>

                <p>
                  <span className="font-semibold">
                    Top Skills
                  </span>
                  <br />
                  Speaking, confident, situational.
                </p>
              </div>
            </div>

            {/* BLUEPRINT */}
            <div className="bg-white rounded-[24px] p-6 border border-[#ECECEC]">
              <h2 className="text-[22px] font-bold mb-5">
                Interview Blueprint
              </h2>

              <div className="space-y-4 text-sm">
                <div>
                  ✨ 15 Questions
                  <p className="text-[#777]">
                    Curated for your level
                  </p>
                </div>

                <div>
                  ⚡ STAR Method
                  <p className="text-[#777]">
                    AI evaluation strategy
                  </p>
                </div>

                <div>
                  🎯 Emotional Analysis Enabled
                  <p className="text-[#777]">
                    Vibe & confidence check
                  </p>
                </div>
              </div>
            </div>

            {/* RESULT BUTTONS */}
            {status === "RESULT" && (
              <div className="bg-white rounded-[24px] p-5 border border-[#ECECEC] flex flex-col gap-3">
                <a
                  href={recordedVideoURL}
                  download="Interview-Result.webm"
                  className="w-full h-[52px] rounded-full border border-[#5B4DFF] text-[#5B4DFF] flex items-center justify-center font-semibold"
                >
                  Download Video
                </a>

                <button
                  onClick={() => navigate("/history")}
                  className="w-full h-[52px] rounded-full bg-[#5B4DFF] text-white font-semibold"
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
      </div>
    </main>
  );
};

export default InterviewRoom;