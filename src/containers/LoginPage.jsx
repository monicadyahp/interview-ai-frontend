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

      Swal.fire({
        title: "Berhasil!",
        text: `Halo, ${decoded.name}!`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => navigate(location.state?.from || "/"));
    } catch (err) {
      Swal.fire({
        title: "Gagal",
        text: "Gagal sinkronisasi data database",
        icon: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // LOGIN / REGISTER
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
          text: `Mari berlatih interview kamu, ${res.data.user.username}!`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        navigate(location.state?.from || "/interview");
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
    <div className="min-h-screen bg-white flex flex-col">
      {/* CONTENT */}
      <div className="flex-1 flex items-center justify-center px-4 pt-[140px] pb-20">
        {/* CARD */}
        <div
          className="
            w-full
            max-w-[520px]
            bg-white
            border
            border-[#D9D9D9]
            rounded-[12px]
            px-8
            py-10
          "
        >
          {/* TITLE */}
          <h1
            className="
              text-[32px]
              font-bold
              text-[#000000]
              leading-[100%]
              font-['Plus_Jakarta_Sans']
            "
          >
            {isRegister ? "Create Account" : "Welcome Back!"}
          </h1>

          {/* SUBTITLE */}
          <p
            className="
              mt-3
              text-[16px]
              font-medium
              text-[#000000]
              leading-[160%]
              font-['Plus_Jakarta_Sans']
            "
          >
            {isRegister
              ? "Sign up to continue reducing food waste and making a positive impact today."
              : "Sign in to continue reducing food waste and making a positive impact today."}
          </p>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col gap-5"
          >
            {/* FULL NAME */}
            {isRegister && (
              <div>
                <label
                  className="
                    block
                    text-[20px]
                    font-bold
                    text-[#000000]
                    mb-2
                    font-['Plus_Jakarta_Sans']
                  "
                >
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
                    h-[48px]
                    border
                    border-[#D9D9D9]
                    rounded-[8px]
                    px-4
                    text-[14px]
                    font-medium
                    outline-none
                    focus:border-[#8039FF]
                    font-['Plus_Jakarta_Sans']
                  "
                />
              </div>
            )}

            {/* EMAIL */}
            <div>
              <label
                className="
                  block
                  text-[20px]
                  font-bold
                  text-[#000000]
                  mb-2
                  font-['Plus_Jakarta_Sans']
                "
              >
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
                  h-[48px]
                  border
                  border-[#D9D9D9]
                  rounded-[8px]
                  px-4
                  text-[14px]
                  font-medium
                  outline-none
                  focus:border-[#8039FF]
                  font-['Plus_Jakarta_Sans']
                "
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label
                className="
                  block
                  text-[20px]
                  font-bold
                  text-[#000000]
                  mb-2
                  font-['Plus_Jakarta_Sans']
                "
              >
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
                  h-[48px]
                  border
                  border-[#D9D9D9]
                  rounded-[8px]
                  px-4
                  text-[14px]
                  font-medium
                  outline-none
                  focus:border-[#8039FF]
                  font-['Plus_Jakarta_Sans']
                "
              />
            </div>

            {/* CONFIRM PASSWORD */}
            {isRegister && (
              <div>
                <label
                  className="
                    block
                    text-[20px]
                    font-bold
                    text-[#000000]
                    mb-2
                    font-['Plus_Jakarta_Sans']
                  "
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

                    if (passError) {
                      setPassError(false);
                    }
                  }}
                  value={formData.confirmPassword}
                  className={`
                    w-full
                    h-[48px]
                    border
                    rounded-[8px]
                    px-4
                    text-[14px]
                    font-medium
                    outline-none
                    font-['Plus_Jakarta_Sans']
                    ${
                      passError
                        ? "border-red-500"
                        : "border-[#D9D9D9] focus:border-[#8039FF]"
                    }
                  `}
                />
              </div>
            )}

            {/* FORGOT PASSWORD */}
            {!isRegister && (
              <div
                className="
                  text-[16px]
                  font-medium
                  text-[#000000]
                  cursor-pointer
                  font-['Plus_Jakarta_Sans']
                "
              >
                Forgot your password?
              </div>
            )}

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
                mt-2
                font-['Plus_Jakarta_Sans']
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
          <div className="flex items-center gap-4 my-7">
            <div className="flex-1 h-[1px] bg-[#D9D9D9]" />

            <span
              className="
                text-[14px]
                text-[#000000]
                font-medium
                font-['Plus_Jakarta_Sans']
              "
            >
              Or sign up with
            </span>

            <div className="flex-1 h-[1px] bg-[#D9D9D9]" />
          </div>

          {/* SOCIAL LOGIN */}
          <div className="flex items-center justify-center gap-8">
            <img
              src="/icons/facebook.png"
              alt="facebook"
              className="w-9 h-9 cursor-pointer"
            />

            <img
              src="/icons/google.png"
              alt="google"
              className="w-9 h-9 cursor-pointer"
            />

            <img
              src="/icons/icloud.png"
              alt="icloud"
              className="w-9 h-9 cursor-pointer"
            />
          </div>

          {/* GOOGLE LOGIN HIDDEN */}
          <div className="hidden">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() =>
                Swal.fire("Gagal", "Login Google gagal", "error")
              }
            />
          </div>

          {/* SWITCH */}
          <div
            className="
              text-center
              mt-8
              text-[16px]
              font-medium
              text-[#000000]
              font-['Plus_Jakarta_Sans']
            "
          >
            {isRegister
              ? "Already have an account?"
              : "Don't have an account?"}

            <span
              onClick={() => setIsRegister(!isRegister)}
              className="
                ml-2
                text-[#8039FF]
                font-bold
                cursor-pointer
              "
            >
              {isRegister ? "Sign In" : "Sign Up"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;