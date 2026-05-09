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
        <div className="w-full max-w-[520px] bg-white border border-[#E5E5E5] rounded-[20px] px-8 md:px-10 py-10 shadow-sm">
          {/* TITLE */}
          <h1 className="text-[32px] font-bold text-black leading-[100%]">
            {isRegister ? "Create Account" : "Welcome Back!"}
          </h1>

          {/* SUBTITLE */}
          <p className="text-[16px] font-medium text-black mt-4 leading-[160%]">
            {isRegister
              ? "Create your account and start practicing smarter interviews today."
              : "Sign in to continue reducing food waste and making a positive impact today."}
          </p>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col gap-6"
          >
            {/* FULL NAME */}
            {isRegister && (
              <div>
                <label className="text-[20px] font-bold text-black mb-3 block">
                  Full Name
                </label>

                <input
                  type="text"
                  name="username"
                  placeholder="Enter your full name"
                  required
                  onChange={handleChange}
                  value={formData.username}
                  className="
                    w-full
                    h-[58px]
                    rounded-[14px]
                    border
                    border-[#D9D9D9]
                    px-5
                    text-[16px]
                    font-medium
                    outline-none
                    focus:border-[#8C5EAD]
                    transition-all
                  "
                />
              </div>
            )}

            {/* EMAIL */}
            <div>
              <label className="text-[20px] font-bold text-black mb-3 block">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                required
                onChange={handleChange}
                value={formData.email}
                className="
                  w-full
                  h-[58px]
                  rounded-[14px]
                  border
                  border-[#D9D9D9]
                  px-5
                  text-[16px]
                  font-medium
                  outline-none
                  focus:border-[#8C5EAD]
                  transition-all
                "
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-[20px] font-bold text-black mb-3 block">
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
                className="
                  w-full
                  h-[58px]
                  rounded-[14px]
                  border
                  border-[#D9D9D9]
                  px-5
                  text-[16px]
                  font-medium
                  outline-none
                  focus:border-[#8C5EAD]
                  transition-all
                "
              />
            </div>

            {/* CONFIRM PASSWORD */}
            {isRegister && (
              <div>
                <label className="text-[20px] font-bold text-black mb-3 block">
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
                  className={`
                    w-full
                    h-[58px]
                    rounded-[14px]
                    border
                    px-5
                    text-[16px]
                    font-medium
                    outline-none
                    transition-all
                    ${
                      passError
                        ? "border-red-500"
                        : "border-[#D9D9D9] focus:border-[#8C5EAD]"
                    }
                  `}
                />
              </div>
            )}

            {/* FORGOT PASSWORD */}
            {!isRegister && (
              <div className="flex justify-end">
                <p className="text-[16px] font-medium text-black cursor-pointer hover:text-[#8C5EAD] transition-all">
                  Forgot your password?
                </p>
              </div>
            )}

            {/* BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              className="
                w-full
                h-[58px]
                rounded-[16px]
                bg-[#8C5EAD]
                text-white
                text-[20px]
                font-bold
                mt-2
                hover:opacity-90
                transition-all
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
          <div className="flex items-center gap-3 my-8">
            <div className="flex-1 h-[1px] bg-[#D9D9D9]" />

            <span className="text-[14px] text-[#999] font-medium">
              Or continue with
            </span>

            <div className="flex-1 h-[1px] bg-[#D9D9D9]" />
          </div>

          {/* SOCIAL LOGIN */}
          <div className="flex items-center justify-center gap-5">
            <button className="w-[58px] h-[58px] rounded-full border border-[#E5E5E5] flex items-center justify-center hover:border-[#8C5EAD] transition-all">
              <img
                src="/icons/facebook.png"
                alt="facebook"
                className="w-7 h-7"
              />
            </button>

            <button className="w-[58px] h-[58px] rounded-full border border-[#E5E5E5] flex items-center justify-center hover:border-[#8C5EAD] transition-all">
              <img
                src="/icons/google.png"
                alt="google"
                className="w-7 h-7"
              />
            </button>

            <button className="w-[58px] h-[58px] rounded-full border border-[#E5E5E5] flex items-center justify-center hover:border-[#8C5EAD] transition-all">
              <img
                src="/icons/icloud.png"
                alt="icloud"
                className="w-7 h-7"
              />
            </button>
          </div>

          {/* SWITCH */}
          <p className="mt-8 text-center text-[18px] font-medium text-black">
            {isRegister
              ? "Already have an account?"
              : "Don’t have an account?"}

            <span
              onClick={() => setIsRegister(!isRegister)}
              className="text-[#8C5EAD] font-bold cursor-pointer ml-2"
            >
              {isRegister ? "Sign In" : "Sign Up"}
            </span>
          </p>

          {/* TERMS */}
          {isRegister && (
            <div className="flex items-start gap-3 mt-8">
              <input type="checkbox" className="mt-1 accent-[#8C5EAD]" />

              <p className="text-[13px] leading-[170%] text-[#666]">
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