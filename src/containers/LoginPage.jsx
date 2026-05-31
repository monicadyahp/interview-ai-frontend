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
    <div style={{ background: "#FFFFFF", fontFamily }}>

      <div
        style={{
          background: "#F2EBFF",
          paddingTop: "120px",   
          paddingBottom: "60px",
          paddingLeft: "16px",
          paddingRight: "16px",
        }}
      >
        <div
          style={{
            maxWidth: "860px",
            margin: "0 auto",
            background: "#FFFFFF",
            borderRadius: "20px",
            boxShadow: "0 8px 40px rgba(128, 57, 255, 0.12)",
            border: "1px solid #E5E5E5",
            display: "flex",
            overflow: "hidden",
            minHeight: "520px",
          }}
        >
          {/* KIRI — foto */}
          <div
            className="hidden md:flex"
            style={{
              width: "42%",
              flexShrink: 0,
              padding: "16px",          
              alignItems: "stretch",
            }}
          >
            <img
              src={isRegister ? "/hero/signup.png" : "/hero/signin.png"}
              alt={isRegister ? "Sign Up" : "Sign In"}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                borderRadius: "12px",    
                display: "block",
              }}
            />
          </div>

          {/* KANAN — form */}
          <div style={{ flex: 1, padding: "40px 32px", overflowY: "auto" }}>

            <h1 style={{ fontFamily, fontWeight: 700, fontSize: "22px", color: "#000000", lineHeight: 1.2, marginBottom: "6px" }}>
              {isRegister ? "Get Started with Intersight" : "Welcome Back!"}
            </h1>

            <p style={{ fontFamily, fontWeight: 400, fontSize: "13px", color: "#444444", marginBottom: "20px", lineHeight: 1.5 }}>
              {isRegister
                ? "Join us to unlock deeper, AI-powered insights from your interviews."
                : "Sign in to access your interview insights and analytics."}
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

              {isRegister && (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={labelStyle}>Full Name</label>
                  <input type="text" name="username" placeholder="e.g. Justin Bieber" required
                    onChange={handleChange} value={formData.username} className={inputClass} style={{ fontFamily }} />
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={labelStyle}>Email Address</label>
                <input type="email" name="email" placeholder="name@company.com" required
                  onChange={handleChange} value={formData.email} className={inputClass} style={{ fontFamily }} />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={labelStyle}>Password</label>
                <input type="password" name="password"
                  placeholder={isRegister ? "min. 8 characters with a number" : "enter your password"}
                  required onChange={handleChange} value={formData.password} className={inputClass} style={{ fontFamily }} />
              </div>

              {isRegister && (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
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
                <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
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
                className="w-full h-[48px] rounded-full text-white bg-gradient-to-r from-[#071097] via-[#8039FF] to-[#FE63C8] hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ fontFamily, fontWeight: 700, fontSize: "18px", marginTop: "4px" }}>
                {isLoading ? "Loading..." : isRegister ? "Sign Up" : "Sign In"}
              </button>
            </form>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "20px 0" }}>
              <div style={{ flex: 1, height: "1px", background: "#E5E5E5" }} />
              <span style={{ fontFamily, fontSize: "12px", fontWeight: 500, color: "#999999" }}>
                {isRegister ? "Or sign up with" : "Or continue with"}
              </span>
              <div style={{ flex: 1, height: "1px", background: "#E5E5E5" }} />
            </div>

            {isRegister && (
              <p style={{ fontFamily, fontSize: "13px", color: "#666666", textAlign: "center", marginBottom: "16px" }}>
                Already have an account?{" "}
                <span onClick={handleSwitchMode} className="text-[#8039FF] cursor-pointer hover:underline font-bold">
                  Sign In
                </span>
              </p>
            )}

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px" }}>
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
              <p style={{ fontFamily, fontSize: "13px", color: "#666666", textAlign: "center", marginTop: "20px" }}>
                New to Intersight?{" "}
                <span onClick={handleSwitchMode} className="text-[#8039FF] cursor-pointer hover:underline font-bold">
                  Create an account
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
