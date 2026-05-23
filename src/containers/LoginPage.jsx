import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { API_BASE_URL } from "../utils/constants";
import Swal from "sweetalert2";

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  // FIX: Default ke false supaya halaman pertama kali dibuka = Sign In
  // Kalau kamu mau default Sign Up, ganti ke true
  const [isRegister, setIsRegister] = useState(false);
  const [passError, setPassError] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { setUser } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // SUBMIT LOGIN / REGISTER
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isRegister && formData.password !== formData.confirmPassword) {
      setPassError(true);
      return Swal.fire({
        title: "Gagal",
        text: "Konfirmasi password tidak cocok!",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
    }

    setPassError(false);

    try {
      setIsLoading(true);

      // REGISTER
      if (isRegister) {
        await axios.post(`${API_BASE_URL}/auth/register`, formData);

        Swal.fire({
          title: "Berhasil!",
          text: "Akun kamu sudah terdaftar. Silakan login ya!",
          icon: "success",
          timer: 2500,
          showConfirmButton: false,
        });

        setIsRegister(false);
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      }

      // LOGIN
      else {
        const res = await axios.post(`${API_BASE_URL}/auth/login`, {
          email: formData.email,
          password: formData.password,
        });

        setUser(res.data.user);
        localStorage.setItem("token", res.data.token);

        Swal.fire({
          title: "Selamat Datang!",
          text: `Mari berlatih untuk interview kamu, ${res.data.user.username}!`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        const origin = location.state?.from || "/";
        navigate(origin);
      }
    } catch (err) {
      Swal.fire({
        title: "Oops...",
        text: err.response?.data?.msg || "Gagal!",
        icon: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle switch mode + reset form
  const handleSwitchMode = () => {
    setIsRegister(!isRegister);
    setPassError(false);
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="min-h-screen bg-[#EDE8FF] flex flex-col">
      {/* CONTENT */}
      <div className="flex-1 flex flex-col items-center pt-[140px] pb-20 px-4">
        {/* CARD */}
        <div className="w-full max-w-[500px] bg-white border border-[#D9D9D9] rounded-[16px] px-8 py-10 shadow-sm">

          {/* ============================
              TITLE — beda teks Sign In vs Sign Up
          ============================ */}
          <h1
            className="text-[32px] font-bold text-[#000000] leading-tight"
            style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700 }}
          >
            {isRegister ? "Get Started with Intersight" : "Welcome Back!"}
          </h1>

          {/* FIX #1: Subtitle beda antara Sign In dan Sign Up */}
          <p
            className="text-[16px] text-[#000000] mt-3 leading-relaxed"
            style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 500 }}
          >
            {isRegister
              ? "Join us to unlock deeper, AI-powered insights from your interviews."
              : "Sign in to access your interview insights and analytics."}
          </p>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">

            {/* FULL NAME — hanya muncul di Sign Up */}
            {isRegister && (
              <div>
                <label
                  className="block mb-2 text-[#000000]"
                  style={{
                    fontFamily: "Plus Jakarta Sans",
                    fontWeight: 700,
                    fontSize: "16px",
                  }}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  name="username"
                  placeholder="e.g. Justin Bieber"
                  required
                  onChange={handleChange}
                  value={formData.username}
                  className="w-full h-[52px] border border-[#D9D9D9] rounded-[10px] px-4 outline-none focus:border-[#8039FF]"
                  style={{ fontFamily: "Plus Jakarta Sans", fontSize: "14px" }}
                />
              </div>
            )}

            {/* EMAIL */}
            <div>
              <label
                className="block mb-2 text-[#000000]"
                style={{
                  fontFamily: "Plus Jakarta Sans",
                  fontWeight: 700,
                  fontSize: "16px",
                }}
              >
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="name@company.com"
                required
                onChange={handleChange}
                value={formData.email}
                className="w-full h-[52px] border border-[#D9D9D9] rounded-[10px] px-4 outline-none focus:border-[#8039FF]"
                style={{ fontFamily: "Plus Jakarta Sans", fontSize: "14px" }}
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label
                className="block mb-2 text-[#000000]"
                style={{
                  fontFamily: "Plus Jakarta Sans",
                  fontWeight: 700,
                  fontSize: "16px",
                }}
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder={
                  isRegister
                    ? "min. 8 characters with a number"
                    : "enter your password"
                }
                required
                onChange={handleChange}
                value={formData.password}
                className="w-full h-[52px] border border-[#D9D9D9] rounded-[10px] px-4 outline-none focus:border-[#8039FF]"
                style={{ fontFamily: "Plus Jakarta Sans", fontSize: "14px" }}
              />
            </div>

            {/* CONFIRM PASSWORD — hanya muncul di Sign Up */}
            {isRegister && (
              <div>
                <label
                  className="block mb-2 text-[#000000]"
                  style={{
                    fontFamily: "Plus Jakarta Sans",
                    fontWeight: 700,
                    fontSize: "16px",
                  }}
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Re-enter your password"
                  required
                  onChange={(e) => {
                    handleChange(e);
                    if (passError) setPassError(false);
                  }}
                  value={formData.confirmPassword}
                  className={`w-full h-[52px] border rounded-[10px] px-4 outline-none ${
                    passError
                      ? "border-red-500"
                      : "border-[#D9D9D9] focus:border-[#8039FF]"
                  }`}
                  style={{ fontFamily: "Plus Jakarta Sans", fontSize: "14px" }}
                />
              </div>
            )}

            {/* FIX #2: FORGOT PASSWORD — abu-abu, hanya di Sign In, posisi setelah password */}
            {!isRegister && (
              <div className="flex justify-start -mt-2">
                <span
                  className="text-[#9CA3AF] cursor-pointer hover:text-[#8039FF] transition-colors"
                  style={{
                    fontFamily: "Plus Jakarta Sans",
                    fontWeight: 500,
                    fontSize: "14px",
                  }}
                >
                  Forgot your password?
                </span>
              </div>
            )}

            {/* TERMS CHECKBOX — hanya di Sign Up, sebelum tombol */}
            {isRegister && (
              <div className="flex items-start gap-2">
                <input type="checkbox" className="mt-1 accent-[#8039FF]" required />
                <p
                  className="leading-relaxed text-[#666666]"
                  style={{
                    fontFamily: "Plus Jakarta Sans",
                    fontSize: "12px",
                    fontWeight: 500,
                  }}
                >
                  By signing up, you agree to our{" "}
                  <span className="text-[#8039FF] cursor-pointer hover:underline">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="text-[#8039FF] cursor-pointer hover:underline">
                    Privacy Policy
                  </span>
                  .
                </p>
              </div>
            )}

            {/* BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[56px] rounded-full text-white bg-gradient-to-r from-[#071097] via-[#8039FF] to-[#FE63C8] hover:opacity-90 transition mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                fontFamily: "Plus Jakarta Sans",
                fontWeight: 700,
                fontSize: "20px",
              }}
            >
              {isLoading ? "Loading..." : isRegister ? "Sign Up" : "Sign In"}
            </button>
          </form>

          {/* DIVIDER */}
          <div className="flex items-center gap-3 my-8">
            <div className="flex-1 h-[1px] bg-[#D9D9D9]" />
            <span
              className="text-[#999999]"
              style={{
                fontFamily: "Plus Jakarta Sans",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              {/* FIX #3: Teks divider beda sesuai mode */}
              {isRegister ? "Or sign up with" : "Or continue with"}
            </span>
            <div className="flex-1 h-[1px] bg-[#D9D9D9]" />
          </div>

          {/* SOCIAL BUTTONS */}
          <div className="flex items-center justify-center gap-5">

            {/* FIX #3: FACEBOOK — background biru bulat seperti logo resmi FB */}
            <button
              type="button"
              className="w-[52px] h-[52px] rounded-full flex items-center justify-center hover:scale-105 transition overflow-hidden bg-[#1877F2]"
              aria-label="Sign in with Facebook"
            >
              <img
                src="/icons/facebook.png"
                alt="facebook"
                className="w-[28px] h-[28px] object-contain"
                style={{ filter: "brightness(0) invert(1)" }} // bikin putih kalau PNG-nya berwarna
              />
            </button>

            {/* GOOGLE — sudah benar, tetap dibungkus border */}
            <button
              type="button"
              className="w-[52px] h-[52px] rounded-full border border-[#E5E5E5] flex items-center justify-center hover:scale-105 transition bg-white"
              aria-label="Sign in with Google"
            >
              <img
                src="/icons/google.png"
                alt="google"
                className="w-[24px] h-[24px] object-contain"
              />
            </button>

            {/* FIX #3: ICLOUD — diperbesar jadi 30px */}
            <button
              type="button"
              className="w-[52px] h-[52px] rounded-full border border-[#E5E5E5] flex items-center justify-center hover:scale-105 transition bg-white"
              aria-label="Sign in with iCloud"
            >
              <img
                src="/icons/icloud.png"
                alt="icloud"
                className="w-[30px] h-[30px] object-contain"
              />
            </button>
          </div>

          {/* SWITCH MODE */}
          <div
            className="text-center mt-8 text-[#666666]"
            style={{
              fontFamily: "Plus Jakarta Sans",
              fontWeight: 500,
              fontSize: "16px",
            }}
          >
            {isRegister ? "Already have an account?" : "New to Intersight?"}
            <span
              onClick={handleSwitchMode}
              className="ml-2 text-[#8039FF] cursor-pointer hover:underline"
              style={{ fontWeight: 700 }}
            >
              {isRegister ? "Sign In" : "Create an account"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
