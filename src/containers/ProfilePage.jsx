import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { API_BASE_URL } from "../utils/constants";
import Swal from "sweetalert2";

const fontFamily = "'Plus Jakarta Sans', sans-serif";

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
    <img src={imgSrc} alt={label} className="w-[18px] h-[18px] object-contain"
      style={{ filter: active ? "brightness(0) invert(1)" : "none" }} />
    {label}
  </button>
);

const InputField = ({ label, placeholder, value, onChange, fullWidth = true }) => (
  <div className={fullWidth ? "col-span-2" : ""}>
    <label className="block text-[13px] font-semibold text-[#1E1E1E] mb-1.5">{label}</label>
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full h-[44px] border border-[#E5E5E5] rounded-[12px] px-4 text-[13px] text-[#444] outline-none focus:border-[#7B4DFF] bg-[#FAFAFA]"
      style={{ fontFamily }}
    />
  </div>
);

const defaultImg = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

export default function ProfilePage() {
  const { user, setUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // form state — pre-fill dari user
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [education, setEducation] = useState(user?.education || "");
  const [currentPosition, setCurrentPosition] = useState(user?.position || "");
  const [industry, setIndustry] = useState(user?.industry || "");
  const [country, setCountry] = useState(user?.country || "");
  const [employmentLevel, setEmploymentLevel] = useState(user?.employment || "");
  const [preferenceCompany, setPreferenceCompany] = useState(user?.preferences || "");
  const [isSaving, setIsSaving] = useState(false);

  if (!user) { navigate("/login"); return null; }

  // ── photo handler ──────────────────────────────────
  const resizeImage = (base64Str) =>
    new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX = 400;
        let { width, height } = img;
        if (width > height) { if (width > MAX) { height *= MAX / width; width = MAX; } }
        else { if (height > MAX) { width *= MAX / height; height = MAX; } }
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/png"));
      };
    });

  const handleEditPhoto = async () => {
    const { value: file } = await Swal.fire({
      title: "Pilih Foto Profil",
      input: "file",
      inputAttributes: { accept: "image/*", "aria-label": "Pilih foto" },
      imageUrl: user.avatarUrl || user.avatar || defaultImg,
      imageWidth: 120, imageHeight: 120, imageAlt: "Preview",
      confirmButtonText: "Upload", confirmButtonColor: "#7B4DFF",
      showCancelButton: true,
      didOpen: () => {
        const img = Swal.getImage();
        img.style.borderRadius = "50%";
        img.style.objectFit = "cover";
        const input = Swal.getInput();
        input.onchange = () => {
          const reader = new FileReader();
          reader.onload = (e) => { img.src = e.target.result; };
          if (input.files[0]) reader.readAsDataURL(input.files[0]);
        };
      },
    });
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const compressed = await resizeImage(e.target.result);
        saveToAPI({ avatar: compressed }, "photo");
      };
      reader.readAsDataURL(file);
    }
  };

  const saveToAPI = async (data, type = "data") => {
    setIsSaving(true);
    try {
      // Token disimpan sudah berikut prefix "Bearer " saat login → pakai apa adanya.
      const token = localStorage.getItem("token");
      const res = await axios.put(`${API_BASE_URL}/auth/profile`, data, {
        headers: { Authorization: token },
      });
      setUser(res.data.user);
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: type === "photo" ? "Foto profil diperbarui" : "Profil disimpan",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
      Swal.fire(
        "Gagal",
        err.response?.data?.message || "Terjadi kesalahan saat menyimpan.",
        "error",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveChanges = () => {
    // Kirim memakai nama field backend. Field yang bebas kosong dikirim apa adanya;
    // field dengan aturan ketat (firstName min 3, enum employment/preferences)
    // hanya dikirim bila terisi agar tidak memicu error validasi.
    const payload = {
      lastName: lastName.trim(),
      bio: bio.trim(),
      education: education.trim(),
      position: currentPosition.trim(),
      industry: industry.trim(),
      country: country.trim(),
    };
    if (firstName.trim()) payload.firstName = firstName.trim();
    if (employmentLevel) payload.employment = employmentLevel;
    if (preferenceCompany) payload.preferences = preferenceCompany;
    saveToAPI(payload);
  };

  return (
    <div className="min-h-screen flex bg-[#F7F7FB]" style={{ fontFamily }}>

      {/* SIDEBAR */}
      <aside className="hidden lg:flex w-[220px] bg-white border-r border-[#ECECEC] px-5 py-7 flex-col justify-between shrink-0">
        <div>
          <div onClick={() => navigate("/")} className="flex items-center gap-2.5 cursor-pointer mb-8">
            <img src="/logo/Icon_Insight.png" alt="logo" className="w-9 h-9" />
            <h1 className="text-[22px] font-bold fontIntersight">Intersight</h1>
          </div>
          <p className="text-[10px] font-bold text-[#BBBBBB] tracking-widest mb-3 px-1">OVERVIEW</p>
          <div className="flex flex-col gap-1.5">
            <SidebarItem imgSrc="/icons/overviewdashboard.png" label="Dashboard" onClick={() => navigate("/dashboard")} />
            <SidebarItem imgSrc="/icons/overviewinterview.png" label="Interview" onClick={() => navigate("/interview")} />
            <SidebarItem imgSrc="/icons/overviewai.png" label="AI Assistant" onClick={() => navigate("/chatbot")} />
          </div>
        </div>
        <div>
          <p className="text-[10px] font-bold text-[#BBBBBB] tracking-widest mb-3 px-1">SETTINGS</p>
          <div className="flex flex-col gap-1.5">
            <SidebarItem imgSrc="/icons/setting.png" label="Setting" active onClick={() => navigate("/profile")} />
            <SidebarItem imgSrc="/icons/logout.png" label="Log Out" onClick={logout} />
          </div>
        </div>
      </aside>

      {/* MAIN */}
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
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-[#7B4DFF] to-[#C7B5FF] flex items-center justify-center text-white text-[12px] font-bold">
                {user?.avatar ? (
                  <img src={user.avatarUrl || user.avatar} alt={user?.firstName || "User"}
                    referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                ) : (
                  user?.firstName?.[0]?.toUpperCase() || "U"
                )}
              </div>
              <span className="text-[14px] font-semibold text-[#1E1E1E]">{user?.firstName || "User"}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-6 py-6 overflow-auto">

          {/* Page title */}
          <h1 className="text-[22px] font-bold text-[#1E1E1E] mb-1">Account Settings</h1>
          <p className="text-[13px] text-[#999] mb-6">Manage your profile information and account preferences.</p>

          {/* Card */}
          <div className="bg-white rounded-[20px] border border-[#E5E5E5] p-6 max-w-[700px]">

            {/* Section header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[16px] font-bold text-[#1E1E1E]">Personal Profile</h2>
              <button
                onClick={handleEditPhoto}
                className="px-4 py-2 rounded-[10px] border border-[#7B4DFF] text-[#7B4DFF] text-[13px] font-semibold hover:bg-[#7B4DFF] hover:text-white transition"
              >
                Edit Profile
              </button>
            </div>

            {/* Photo */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <img
                  src={user.avatarUrl || user.avatar || defaultImg}
                  alt="Profile"
                  referrerPolicy="no-referrer"
                  className="w-[80px] h-[80px] rounded-full object-cover border-2 border-[#E5E5E5]"
                />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-[#1E1E1E]">Photo Profile</p>
                <p className="text-[12px] text-[#999]">*upload your png or jpg up to 25 mb</p>
              </div>
            </div>

            {/* Form fields */}
            <div className="grid grid-cols-2 gap-4">

              {/* First Name + Last Name */}
              <div>
                <label className="block text-[13px] font-semibold text-[#1E1E1E] mb-1.5">First Name</label>
                <input type="text" placeholder="Enter Your Name" value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full h-[44px] border border-[#E5E5E5] rounded-[12px] px-4 text-[13px] text-[#444] outline-none focus:border-[#7B4DFF] bg-[#FAFAFA]" />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-[#1E1E1E] mb-1.5">Last Name</label>
                <input type="text" placeholder="Enter Your Name" value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full h-[44px] border border-[#E5E5E5] rounded-[12px] px-4 text-[13px] text-[#444] outline-none focus:border-[#7B4DFF] bg-[#FAFAFA]" />
              </div>

              {/* Bio */}
              <div className="col-span-2">
                <label className="block text-[13px] font-semibold text-[#1E1E1E] mb-1.5">Bio</label>
                <input type="text" placeholder="Enter Your Name" value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full h-[44px] border border-[#E5E5E5] rounded-[12px] px-4 text-[13px] text-[#444] outline-none focus:border-[#7B4DFF] bg-[#FAFAFA]" />
              </div>

              {/* Education */}
              <div className="col-span-2">
                <label className="block text-[13px] font-semibold text-[#1E1E1E] mb-1.5">Education</label>
                <input type="text" placeholder="Enter Your Name" value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  className="w-full h-[44px] border border-[#E5E5E5] rounded-[12px] px-4 text-[13px] text-[#444] outline-none focus:border-[#7B4DFF] bg-[#FAFAFA]" />
              </div>

              {/* Current Position */}
              <div className="col-span-2">
                <label className="block text-[13px] font-semibold text-[#1E1E1E] mb-1.5">Current Position</label>
                <input type="text" placeholder="Enter Your Name" value={currentPosition}
                  onChange={(e) => setCurrentPosition(e.target.value)}
                  className="w-full h-[44px] border border-[#E5E5E5] rounded-[12px] px-4 text-[13px] text-[#444] outline-none focus:border-[#7B4DFF] bg-[#FAFAFA]" />
              </div>

              {/* Industry */}
              <div className="col-span-2">
                <label className="block text-[13px] font-semibold text-[#1E1E1E] mb-1.5">Industry</label>
                <input type="text" placeholder="Enter Your Name" value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full h-[44px] border border-[#E5E5E5] rounded-[12px] px-4 text-[13px] text-[#444] outline-none focus:border-[#7B4DFF] bg-[#FAFAFA]" />
              </div>

              {/* Country / Region */}
              <div className="col-span-2">
                <label className="block text-[13px] font-semibold text-[#1E1E1E] mb-1.5">Country / Region</label>
                <input type="text" placeholder="Enter Your Name" value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full h-[44px] border border-[#E5E5E5] rounded-[12px] px-4 text-[13px] text-[#444] outline-none focus:border-[#7B4DFF] bg-[#FAFAFA]" />
              </div>

              {/* Employment Level */}
              <div className="col-span-2">
                <label className="block text-[13px] font-semibold text-[#1E1E1E] mb-2">Employment Level</label>
                <div className="flex gap-2 flex-wrap">
                  {["Internship", "Full-Time", "Part-Time", "Freelance"].map((lvl) => (
                    <button key={lvl} onClick={() => setEmploymentLevel(lvl)}
                      className={`px-4 py-2 rounded-full text-[12px] font-semibold border transition ${
                        employmentLevel === lvl
                          ? "bg-[#7B4DFF] text-white border-[#7B4DFF]"
                          : "bg-white text-[#666] border-[#E5E5E5] hover:border-[#7B4DFF]"
                      }`}>
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferences Company */}
              <div className="col-span-2">
                <label className="block text-[13px] font-semibold text-[#1E1E1E] mb-2">Preferences Company</label>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { label: "Startup", value: "Startup" },
                    { label: "Corporate", value: "Corporate" },
                    { label: "Agency", value: "Agency" },
                    { label: "Tech Company", value: "Tech-Company" },
                  ].map(({ label, value }) => (
                    <button key={value} onClick={() => setPreferenceCompany(value)}
                      className={`px-4 py-2 rounded-full text-[12px] font-semibold border transition ${
                        preferenceCompany === value
                          ? "bg-[#7B4DFF] text-white border-[#7B4DFF]"
                          : "bg-white text-[#666] border-[#E5E5E5] hover:border-[#7B4DFF]"
                      }`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <div className="col-span-2 mt-2">
                <button
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                  className="w-full h-[48px] rounded-full text-white font-bold text-[15px] transition hover:opacity-90 disabled:opacity-60"
                  style={{ background: "linear-gradient(90deg, #C084FC, #E879F9, #FB923C)" }}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
