import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { API_BASE_URL } from "../utils/constants";
import Swal from "sweetalert2";

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
        <div className="w-full max-w-[500px] bg-white border border-[#D9D9D9] rounded-[16px] px-8 py-10 shadow-sm">
          {/* TITLE */}
          <h1
            className="
              text-[32px]
              font-bold
              text-[#000000]
              leading-tight
            "
            style={{
              fontFamily: "Plus Jakarta Sans",
              fontWeight: 700,
            }}
          >
            Welcome Back!
          </h1>

          <p
            className="
              text-[16px]
              text-[#000000]
              mt-3
              leading-relaxed
            "
            style={{
              fontFamily: "Plus Jakarta Sans",
              fontWeight: 500,
            }}
          >
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
                <label
                  className="block mb-2 text-[#000000]"
                  style={{
                    fontFamily: "Plus Jakarta Sans",
                    fontWeight: 700,
                    fontSize: "20px",
                  }}
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
                    h-[52px]
                    border
                    border-[#D9D9D9]
                    rounded-[10px]
                    px-4
                    outline-none
                    focus:border-[#8039FF]
                  "
                  style={{
                    fontFamily: "Plus Jakarta Sans",
                    fontSize: "14px",
                  }}
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
                  fontSize: "20px",
                }}
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
                  h-[52px]
                  border
                  border-[#D9D9D9]
                  rounded-[10px]
                  px-4
                  outline-none
                  focus:border-[#8039FF]
                "
                style={{
                  fontFamily: "Plus Jakarta Sans",
                  fontSize: "14px",
                }}
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label
                className="block mb-2 text-[#000000]"
                style={{
                  fontFamily: "Plus Jakarta Sans",
                  fontWeight: 700,
                  fontSize: "20px",
                }}
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
                  h-[52px]
                  border
                  border-[#D9D9D9]
                  rounded-[10px]
                  px-4
                  outline-none
                  focus:border-[#8039FF]
                "
                style={{
                  fontFamily: "Plus Jakarta Sans",
                  fontSize: "14px",
                }}
              />
            </div>

            {/* CONFIRM PASSWORD */}
            {isRegister && (
              <div>
                <label
                  className="block mb-2 text-[#000000]"
                  style={{
                    fontFamily: "Plus Jakarta Sans",
                    fontWeight: 700,
                    fontSize: "20px",
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

                    if (passError) {
                      setPassError(false);
                    }
                  }}
                  value={formData.confirmPassword}
                  className={`
                    w-full
                    h-[52px]
                    border
                    rounded-[10px]
                    px-4
                    outline-none
                    ${
                      passError
                        ? "border-red-500"
                        : "border-[#D9D9D9] focus:border-[#8039FF]"
                    }
                  `}
                  style={{
                    fontFamily: "Plus Jakarta Sans",
                    fontSize: "14px",
                  }}
                />
              </div>
            )}

            {/* FORGOT PASSWORD */}
            <div
              className="text-[#000000]"
              style={{
                fontFamily: "Plus Jakarta Sans",
                fontWeight: 500,
                fontSize: "16px",
              }}
            >
              Forgot your password?
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              className="
                w-full
                h-[56px]
                rounded-full
                text-white
                bg-gradient-to-r
                from-[#071097]
                via-[#8039FF]
                to-[#FE63C8]
                hover:opacity-90
                transition
                mt-2
              "
              style={{
                fontFamily: "Plus Jakarta Sans",
                fontWeight: 700,
                fontSize: "24px",
              }}
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

            <span
              className="text-[#999999]"
              style={{
                fontFamily: "Plus Jakarta Sans",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              Or sign up with
            </span>

            <div className="flex-1 h-[1px] bg-[#D9D9D9]" />
          </div>

          {/* SOCIAL */}
          <div className="flex items-center justify-center gap-5">
            {/* FACEBOOK */}
            <button
              type="button"
              className="
                w-[52px]
                h-[52px]
                rounded-full
                border
                border-[#E5E5E5]
                flex
                items-center
                justify-center
                hover:scale-105
                transition
                bg-white
              "
            >
              <img
                src="/icons/facebook.png"
                alt="facebook"
                className="w-[24px] h-[24px] object-contain"
              />
            </button>

            {/* GOOGLE */}
            <button
              type="button"
              className="
                w-[52px]
                h-[52px]
                rounded-full
                border
                border-[#E5E5E5]
                flex
                items-center
                justify-center
                hover:scale-105
                transition
                bg-white
              "
            >
              <img
                src="/icons/google.png"
                alt="google"
                className="w-[24px] h-[24px] object-contain"
              />
            </button>

            {/* ICLOUD */}
            <button
              type="button"
              className="
                w-[52px]
                h-[52px]
                rounded-full
                border
                border-[#E5E5E5]
                flex
                items-center
                justify-center
                hover:scale-105
                transition
                bg-white
              "
            >
              <img
                src="/icons/icloud.png"
                alt="icloud"
                className="w-[24px] h-[24px] object-contain"
              />
            </button>
          </div>

          {/* SWITCH */}
          <div
            className="text-center mt-8 text-[#666666]"
            style={{
              fontFamily: "Plus Jakarta Sans",
              fontWeight: 500,
              fontSize: "16px",
            }}
          >
            {isRegister
              ? "Already have an account?"
              : "Don't have an account?"}

            <span
              onClick={() => setIsRegister(!isRegister)}
              className="
                ml-2
                text-[#8039FF]
                cursor-pointer
              "
              style={{
                fontWeight: 700,
              }}
            >
              {isRegister ? "Sign In" : "Sign Up"}
            </span>
          </div>

          {/* TERMS */}
          {isRegister && (
            <div className="flex items-start gap-2 mt-6">
              <input type="checkbox" className="mt-1" />

              <p
                className="leading-relaxed text-[#666666]"
                style={{
                  fontFamily: "Plus Jakarta Sans",
                  fontSize: "12px",
                  fontWeight: 500,
                }}
              >
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