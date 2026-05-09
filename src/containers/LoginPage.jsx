import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { API_BASE_URL } from "../utils/constants";
import Swal from "sweetalert2";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(true);
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

  // GOOGLE LOGIN
  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);

    try {
      const decoded = jwtDecode(credentialResponse.credential);

      const res = await axios.put(
        `${API_BASE_URL}/auth/profile/google-sync`,
        {
          username: decoded.name,
          email: decoded.email,
          profileImage: decoded.picture,
        }
      );

      const dbUser = {
        ...res.data,
        isGoogle: true,
      };

      setUser(dbUser);

      localStorage.setItem("token", credentialResponse.credential);

      setIsLoading(false);

      Swal.fire({
        title: "Berhasil!",
        text: `Halo, ${decoded.name}!`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => navigate(location.state?.from || "/"));
    } catch (err) {
      setIsLoading(false);

      Swal.fire({
        title: "Gagal",
        text: "Gagal sinkronisasi data database",
        icon: "error",
      });
    }
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

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex flex-col">
      {/* CONTENT */}
      <div className="flex-1 flex flex-col items-center pt-[140px] pb-20 px-4">
        {/* CARD */}
        <div className="w-full max-w-[500px] bg-white border border-[#D9D9D9] rounded-[12px] px-8 py-10 shadow-sm">
          {/* TITLE */}
          <h1 className="text-[36px] font-bold text-[#1F1F1F] leading-tight">
            Welcome Back!
          </h1>

          <p className="text-[13px] text-[#666] mt-2 leading-relaxed">
            Sign in to continue reducing food waste and making a positive
            impact today.
          </p>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col gap-5"
          >
            {/* FULL NAME */}
            {isRegister && (
              <div>
                <label className="block text-[14px] font-semibold text-[#1F1F1F] mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  name="username"
                  placeholder="Enter your fullname"
                  required
                  onChange={handleChange}
                  value={formData.username}
                  className="w-full h-[42px] border border-[#D9D9D9] rounded-[6px] px-4 text-[13px] outline-none focus:border-[#8039FF]"
                />
              </div>
            )}

            {/* EMAIL */}
            <div>
              <label className="block text-[14px] font-semibold text-[#1F1F1F] mb-2">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                placeholder="Your Email"
                required
                onChange={handleChange}
                value={formData.email}
                className="w-full h-[42px] border border-[#D9D9D9] rounded-[6px] px-4 text-[13px] outline-none focus:border-[#8039FF]"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-[14px] font-semibold text-[#1F1F1F] mb-2">
                Password
              </label>

              <input
                type="password"
                name="password"
                placeholder={
                  isRegister
                    ? "Create a strong password"
                    : "Enter your password"
                }
                required
                onChange={handleChange}
                value={formData.password}
                className="w-full h-[42px] border border-[#D9D9D9] rounded-[6px] px-4 text-[13px] outline-none focus:border-[#8039FF]"
              />
            </div>

            {/* CONFIRM PASSWORD */}
            {isRegister && (
              <div>
                <label className="block text-[14px] font-semibold text-[#1F1F1F] mb-2">
                  Confirm Password
                </label>

                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Re-enter your password"
                  required
                  onChange={(e) => {
                    handleChange(e);

                    if (passError) {
                      setPassError(false);
                    }
                  }}
                  value={formData.confirmPassword}
                  className={`w-full h-[42px] border rounded-[6px] px-4 text-[13px] outline-none ${
                    passError
                      ? "border-red-500"
                      : "border-[#D9D9D9] focus:border-[#8039FF]"
                  }`}
                />
              </div>
            )}

            {/* FORGOT PASSWORD */}
            <div className="text-[12px] text-[#666]">
              Forgot your password?
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              className="
                w-full
                h-[52px]
                rounded-full
                text-white
                font-bold
                text-[24px]
                bg-gradient-to-r
                from-[#071097]
                via-[#8039FF]
                to-[#FE63C8]
                hover:opacity-90
                transition
                mt-1
              "
            >
              {isLoading
                ? "Loading..."
                : isRegister
                ? "Sign Up"
                : "Sign In"}
            </button>
          </form>

          {/* DIVIDER */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-[1px] bg-[#D9D9D9]" />

            <span className="text-[12px] text-[#999]">
              Or sign up with
            </span>

            <div className="flex-1 h-[1px] bg-[#D9D9D9]" />
          </div>

          {/* SOCIAL */}
          <div className="flex items-center justify-center gap-6">
            <img
              src="/icons/facebook.png"
              alt="facebook"
              className="w-8 h-8 cursor-pointer"
            />

            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() =>
                Swal.fire("Gagal", "Login Google Gagal", "error")
              }
              theme="outline"
              shape="circle"
            />

            <div className="text-[11px] text-[#666] font-medium">
               iCloud
            </div>
          </div>

          {/* SWITCH */}
          <div className="text-center mt-6 text-[13px] text-[#666]">
            {isRegister
              ? "Already have an account?"
              : "Don't have an account?"}

            <span
              onClick={() => setIsRegister(!isRegister)}
              className="ml-2 text-[#8039FF] font-semibold cursor-pointer"
            >
              {isRegister ? "Sign In" : "Sign Up"}
            </span>
          </div>

          {/* TERMS */}
          {isRegister && (
            <div className="flex items-start gap-2 mt-6">
              <input type="checkbox" className="mt-1" />

              <p className="text-[11px] leading-relaxed text-[#666]">
                By signing up, you agree to our Terms of Service and Privacy
                Policy.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;