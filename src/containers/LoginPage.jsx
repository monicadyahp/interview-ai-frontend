import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { API_BASE_URL } from "../utils/constants";
import Swal from "sweetalert2";

const fontFamily = "'Plus Jakarta Sans', sans-serif";

const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(searchParams.get("mode") === "signup");
  const [passError, setPassError] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "", password: "", confirmPassword: "" });

  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRegister && formData.password !== formData.confirmPassword) {
      setPassError(true);
      return Swal.fire({ title: "Gagal", text: "Konfirmasi password tidak cocok!", icon: "error", timer: 2000, showConfirmButton: false });
    }
    setPassError(false);
    try {
      setIsLoading(true);
      if (isRegister) {
        await axios.post(`${API_BASE_URL}/auth/register`, formData);
        Swal.fire({ title: "Berhasil!", text: "Akun kamu sudah terdaftar. Silakan login ya!", icon: "success", timer: 2500, showConfirmButton: false });
        setIsRegister(false);
        navigate("/login", { replace: true });
        setFormData({ username: "", email: "", password: "", confirmPassword: "" });
      } else {
        const res = await axios.post(`${API_BASE_URL}/auth/login`, { email: formData.email, password: formData.password });
        setUser(res.data.user);
        localStorage.setItem("token", res.data.token);
        Swal.fire({ title: "Selamat Datang!", text: `Mari berlatih untuk interview kamu, ${res.data.user.username}!`, icon: "success", timer: 2000, showConfirmButton: false });
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      Swal.fire({ title: "Oops...", text: err.response?.data?.msg || "Gagal!", icon: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchMode = () => {
    const next = !isRegister;
    setIsRegister(next);
    setPassError(false);
    setFormData({ username: "", email: "", password: "", confirmPassword: "" });
    navigate(next ? "/login?mode=signup" : "/login", { replace: true });
  };

  const labelStyle = { fontFamily, fontWeight: 700, fontSize: "14px", color: "#000000" };
  const inputClass = `w-full h-[44px] border border-[#D9D9D9] rounded-[8px] px-4 outline-none focus:border-[#8039FF] text-[14px] text-[#444444] placeholder:text-[#BBBBBB]`;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{
        background: "#F2EBFF",
        fontFamily,
        paddingTop: "120px",
        paddingBottom: "60px",
      }}
    >
      {/* ===== WHITE CARD ===== */}
      <div
        className="w-full bg-white flex overflow-hidden"
        style={{
          maxWidth: "860px",
          borderRadius: "20px",
          boxShadow: "0 8px 40px rgba(128, 57, 255, 0.12)",
          border: "1px solid #E5E5E5",
          minHeight: "520px",
        }}
      >
        {/* LEFT — gambar */}
        <div
          className="hidden md:block flex-shrink-0"
          style={{
            width: "42%",
            borderRadius: "20px 0 0 20px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <img
            src={isRegister ? "/hero/signup.png" : "/hero/signin.png"}
            alt={isRegister ? "Sign Up" : "Sign In"}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        </div>

        {/* RIGHT — form */}
        <div
          className="flex-1 overflow-y-auto"
          style={{ padding: "40px 32px" }}
        >
          <h1 style={{ fontFamily, fontWeight: 700, fontSize: "22px", color: "#000000", lineHeight: 1.2, marginBottom: "6px" }}>
            {isRegister ? "Get Started with Intersight" : "Welcome Back!"}
          </h1>

          <p style={{ fontFamily, fontWeight: 400, fontSize: "13px", color: "#444444", marginBottom: "20px", lineHeight: 1.5 }}>
            {isRegister
              ? "Join us to unlock deeper, AI-powered insights from your interviews."
              : "Sign in to access your interview insights and analytics."}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">

            {isRegister && (
              <div className="flex flex-col gap-1.5">
                <label style={labelStyle}>Full Name</label>
                <input type="text" name="username" placeholder="e.g. Justin Bieber" required
                  onChange={handleChange} value={formData.username} className={inputClass} style={{ fontFamily }} />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label style={labelStyle}>Email Address</label>
              <input type="email" name="email" placeholder="name@company.com" required
                onChange={handleChange} value={formData.email} className={inputClass} style={{ fontFamily }} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label style={labelStyle}>Password</label>
              <input type="password" name="password"
                placeholder={isRegister ? "min. 8 characters with a number" : "enter your password"}
                required onChange={handleChange} value={formData.password} className={inputClass} style={{ fontFamily }} />
            </div>

            {isRegister && (
              <div className="flex flex-col gap-1.5">
                <label style={labelStyle}>Confirm Password</label>
                <input type="password" name="confirmPassword" placeholder="Re-enter your password" required
                  onChange={(e) => { handleChange(e); if (passError) setPassError(false); }}
                  value={formData.confirmPassword}
                  className={`${inputClass} ${passError ? "!border-red-500" : ""}`} style={{ fontFamily }} />
              </div>
            )}

            {!isRegister && (
              <div style={{ marginTop: "-4px" }}>
                <span className="cursor-pointer hover:text-[#8039FF] transition-colors"
                  style={{ fontFamily, fontSize: "13px", fontWeight: 400, color: "#9CA3AF" }}>
                  Forgot your password?
                </span>
              </div>
            )}

            {isRegister && (
              <div className="flex items-start gap-2">
                <input type="checkbox" className="mt-0.5 accent-[#8039FF]" required />
                <p style={{ fontFamily, fontSize: "11px", fontWeight: 400, color: "#666666", lineHeight: 1.5 }}>
                  By signing up, you agree to our{" "}
                  <span className="text-[#8039FF] cursor-pointer hover:underline">Terms of Service</span>{" "}
                  and{" "}
                  <span className="text-[#8039FF] cursor-pointer hover:underline">Privacy Policy</span>.
                </p>
              </div>
            )}

            <button type="submit" disabled={isLoading}
              className="w-full h-[48px] rounded-full text-white bg-gradient-to-r from-[#071097] via-[#8039FF] to-[#FE63C8] hover:opacity-90 transition mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ fontFamily, fontWeight: 700, fontSize: "18px" }}>
              {isLoading ? "Loading..." : isRegister ? "Sign Up" : "Sign In"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-[1px] bg-[#E5E5E5]" />
            <span style={{ fontFamily, fontSize: "12px", fontWeight: 500, color: "#999999" }}>
              {isRegister ? "Or sign up with" : "Or continue with"}
            </span>
            <div className="flex-1 h-[1px] bg-[#E5E5E5]" />
          </div>

          {isRegister && (
            <p className="text-center mb-4" style={{ fontFamily, fontSize: "13px", color: "#666666" }}>
              Already have an account?{" "}
              <span onClick={handleSwitchMode} className="text-[#8039FF] cursor-pointer hover:underline font-bold">
                Sign In
              </span>
            </p>
          )}

          <div className="flex items-center justify-center gap-4">
            <button type="button"
              className="w-[48px] h-[48px] rounded-full flex items-center justify-center hover:scale-105 transition bg-[#1877F2]">
              <img src="/icons/facebook.png" alt="Facebook" className="w-[26px] h-[26px] object-contain" />
            </button>
            <button type="button"
              className="w-[48px] h-[48px] rounded-full border border-[#E5E5E5] flex items-center justify-center hover:scale-105 transition bg-white">
              <img src="/icons/google.png" alt="Google" className="w-[22px] h-[22px] object-contain" />
            </button>
            <button type="button"
              className="w-[48px] h-[48px] rounded-full border border-[#E5E5E5] flex items-center justify-center hover:scale-105 transition bg-white">
              <img src="/icons/icloud.png" alt="iCloud" className="w-[36px] h-[36px] object-contain" />
            </button>
          </div>

          {!isRegister && (
            <p className="text-center mt-5" style={{ fontFamily, fontSize: "13px", color: "#666666" }}>
              New to Intersight?{" "}
              <span onClick={handleSwitchMode} className="text-[#8039FF] cursor-pointer hover:underline font-bold">
                Create an account
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
