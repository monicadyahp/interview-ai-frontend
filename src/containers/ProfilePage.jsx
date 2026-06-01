import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { API_BASE_URL } from "../utils/constants";
import Swal from "sweetalert2";
import DashboardFooter from "../layout/DashboardFooter";
import DashboardTopBar from "../components/DashboardTopBar";

const fontFamily = "'Plus Jakarta Sans', sans-serif";

const SidebarItem = ({ imgSrc, activeImgSrc, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 h-[48px] rounded-[14px] text-[15px] font-semibold transition-all duration-200 ${
      active
        ? "bg-[#7B4DFF] text-white shadow-[0_4px_12px_rgba(123,77,255,0.3)]"
        : "text-[#666] hover:bg-[#F5F2FF] hover:text-[#7B4DFF]"
    }`}
    style={{ fontFamily }}
  >
    <img src={active && activeImgSrc ? activeImgSrc : imgSrc} alt={label} className="w-[22px] h-[22px] object-contain" />
    {label}
  </button>
);

const defaultImg = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

export default function ProfilePage() {
  const { user, setUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState(user?.username?.split(" ")[0] || "");
  const [lastName, setLastName] = useState(user?.username?.split(" ").slice(1).join(" ") || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [education, setEducation] = useState(user?.education || "");
  const [currentPosition, setCurrentPosition] = useState(user?.targetJob || "");
  const [industry, setIndustry] = useState(user?.industry || "");
  const [country, setCountry] = useState(user?.country || "");
  const [employmentLevel, setEmploymentLevel] = useState(user?.employmentLevel || "");
  const [preferenceCompany, setPreferenceCompany] = useState(user?.preferenceCompany || "");
  const [isSaving, setIsSaving] = useState(false);

  if (!user) { navigate("/login"); return null; }

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
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/png"));
      };
    });

  const handleEditPhoto = async () => {
    const { value: file } = await Swal.fire({
      title: "Pilih Foto Profil", input: "file",
      inputAttributes: { accept: "image/*", "aria-label": "Pilih foto" },
      imageUrl: user.profileImage || defaultImg,
      imageWidth: 120, imageHeight: 120, imageAlt: "Preview",
      confirmButtonText: "Upload", confirmButtonColor: "#7B4DFF", showCancelButton: true,
      didOpen: () => {
        const img = Swal.getImage();
        img.style.borderRadius = "50%"; img.style.objectFit = "cover";
        const input = Swal.getInput();
        input.onchange = () => { const r = new FileReader(); r.onload = (e) => { img.src = e.target.result; }; if (input.files[0]) r.readAsDataURL(input.files[0]); };
      },
    });
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => { const compressed = await resizeImage(e.target.result); saveToAPI({ profileImage: compressed }, "photo"); };
      reader.readAsDataURL(file);
    }
  };

  const saveToAPI = async (data, type = "data") => {
    setIsSaving(true);
    try {
      const payload = { profileImage: user.profileImage, ...data, email: user.email, username: data.username || user.username };
      const res = await axios.put(`${API_BASE_URL}/auth/profile/${user.id || user._id}`, payload);
      setUser(res.data);
      Swal.fire({ icon: "success", title: "Berhasil!", text: type === "photo" ? "Foto profil diperbarui" : "Profil disimpan", timer: 2000, showConfirmButton: false });
    } catch { Swal.fire("Gagal", "Terjadi kesalahan saat menyimpan.", "error"); }
    finally { setIsSaving(false); }
  };

  const handleSaveChanges = () => saveToAPI({ username: `${firstName} ${lastName}`.trim(), bio, education, targetJob: currentPosition, industry, country, employmentLevel, preferenceCompany });

  const inputClass = "w-full h-[44px] border border-[#E5E5E5] rounded-[12px] px-4 text-[13px] text-[#444] outline-none focus:border-[#7B4DFF] bg-[#FAFAFA]";
  const labelClass = "block text-[13px] font-semibold text-[#1E1E1E] mb-1.5";

  return (
    <div className="min-h-screen flex bg-[#F7F7FB]" style={{ fontFamily }}>

      {/* SIDEBAR */}
      <aside className="hidden lg:flex w-[240px] bg-white border-r border-[#ECECEC] px-5 py-7 flex-col justify-between shrink-0 fixed top-0 left-0 h-full z-10">
        <div>
          <div onClick={() => navigate("/")} className="flex items-center gap-2.5 cursor-pointer mb-8">
            <img src="/logo/Icon_Insight.png" alt="logo" className="w-10 h-10" />
            <h1 className="text-[24px] font-bold fontIntersight">Intersight</h1>
          </div>
          <p className="text-[11px] font-bold text-[#BBBBBB] tracking-widest mb-3 px-1">OVERVIEW</p>
          <div className="flex flex-col gap-1.5">
            <SidebarItem imgSrc="/icons/overviewdashboard.png" activeImgSrc="/icons/overviewdashboardungu.png" label="Dashboard" onClick={() => navigate("/dashboard")} />
            <SidebarItem imgSrc="/icons/overviewinterview.png" activeImgSrc="/icons/overviewinterviewungu.png" label="Interview" onClick={() => navigate("/interview")} />
            <SidebarItem imgSrc="/icons/overviewai.png" activeImgSrc="/icons/overviewaiungu.png" label="AI Assistant" onClick={() => navigate("/chatbot")} />
            <SidebarItem imgSrc="/icons/overviewhistory.png" activeImgSrc="/icons/overviewhistoryungu.png" label="History" onClick={() => navigate("/history")} />
            <SidebarItem imgSrc="/icons/overviewlearning.png" activeImgSrc="/icons/overviewlearningungu.png" label="Learning" onClick={() => navigate("/learning")} />
          </div>
        </div>
        <div>
          <p className="text-[11px] font-bold text-[#BBBBBB] tracking-widest mb-3 px-1">SETTINGS</p>
          <div className="flex flex-col gap-1.5">
            <SidebarItem imgSrc="/icons/setting.png" activeImgSrc="/icons/overviewsettingungu.png" label="Setting" active onClick={() => navigate("/profile")} />
            <SidebarItem imgSrc="/icons/logout.png" label="Log Out" onClick={logout} />
          </div>
        </div>
      </aside>

      {/* MAIN — offset sidebar */}
      <main className="flex-1 flex flex-col min-w-0 lg:ml-[240px]">
        <DashboardTopBar />

        {/* Content */}
        <div className="flex-1 px-6 py-8 overflow-auto flex flex-col items-center">
          <div className="w-full max-w-[680px]">
            <h1 className="text-[24px] font-bold text-[#1E1E1E] mb-1" style={{ fontFamily }}>Account Settings</h1>
            <p className="text-[14px] text-[#999] mb-6" style={{ fontFamily }}>Manage your profile information and account preferences.</p>

            {/* Card */}
            <div className="bg-white rounded-[24px] border border-[#E5E5E5] p-7 shadow-sm">

              {/* Section header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[16px] font-bold text-[#1E1E1E]" style={{ fontFamily }}>Personal Profile</h2>
                <button onClick={handleEditPhoto}
                  className="px-5 py-2 rounded-[12px] border border-[#7B4DFF] text-[#7B4DFF] text-[13px] font-semibold hover:bg-[#7B4DFF] hover:text-white transition"
                  style={{ fontFamily }}>
                  Edit Profile
                </button>
              </div>

              {/* Photo */}
              <div className="flex items-center gap-4 mb-7">
                <img src={user.profileImage || defaultImg} alt="Profile"
                  className="w-[80px] h-[80px] rounded-full object-cover border-2 border-[#E5E5E5] cursor-pointer hover:opacity-80 transition"
                  onClick={handleEditPhoto} />
                <div>
                  <p className="text-[14px] font-semibold text-[#1E1E1E]" style={{ fontFamily }}>Photo Profile</p>
                  <p className="text-[12px] text-[#999]" style={{ fontFamily }}>*upload your png or jpg up to 25 mb</p>
                </div>
              </div>

              {/* Form */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass} style={{ fontFamily }}>First Name</label>
                  <input type="text" placeholder="Enter Your Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputClass} style={{ fontFamily }} />
                </div>
                <div>
                  <label className={labelClass} style={{ fontFamily }}>Last Name</label>
                  <input type="text" placeholder="Enter Your Name" value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputClass} style={{ fontFamily }} />
                </div>

                {[
                  { label: "Bio", value: bio, setter: setBio },
                  { label: "Education", value: education, setter: setEducation },
                  { label: "Current Position", value: currentPosition, setter: setCurrentPosition },
                  { label: "Industry", value: industry, setter: setIndustry },
                  { label: "Country / Region", value: country, setter: setCountry },
                ].map(({ label, value, setter }) => (
                  <div key={label} className="col-span-2">
                    <label className={labelClass} style={{ fontFamily }}>{label}</label>
                    <input type="text" placeholder="Enter Your Name" value={value} onChange={(e) => setter(e.target.value)} className={inputClass} style={{ fontFamily }} />
                  </div>
                ))}

                <div className="col-span-2">
                  <label className={labelClass} style={{ fontFamily }}>Employment Level</label>
                  <div className="flex gap-2 flex-wrap">
                    {["Internship", "Full-Time", "Part-Time", "Freelance"].map((lvl) => (
                      <button key={lvl} onClick={() => setEmploymentLevel(lvl)}
                        className={`px-4 py-2 rounded-full text-[13px] font-semibold border transition ${employmentLevel === lvl ? "bg-[#7B4DFF] text-white border-[#7B4DFF]" : "bg-white text-[#666] border-[#E5E5E5] hover:border-[#7B4DFF]"}`}
                        style={{ fontFamily }}>{lvl}</button>
                    ))}
                  </div>
                </div>

                <div className="col-span-2">
                  <label className={labelClass} style={{ fontFamily }}>Preferences Company</label>
                  <div className="flex gap-2 flex-wrap">
                    {["Startup", "Corporate", "Agency", "Tech Company"].map((type) => (
                      <button key={type} onClick={() => setPreferenceCompany(type)}
                        className={`px-4 py-2 rounded-full text-[13px] font-semibold border transition ${preferenceCompany === type ? "bg-[#7B4DFF] text-white border-[#7B4DFF]" : "bg-white text-[#666] border-[#E5E5E5] hover:border-[#7B4DFF]"}`}
                        style={{ fontFamily }}>{type}</button>
                    ))}
                  </div>
                </div>

                <div className="col-span-2 mt-2">
                  <button onClick={handleSaveChanges} disabled={isSaving}
                    className="w-full h-[50px] rounded-full text-white font-bold text-[15px] hover:opacity-90 transition disabled:opacity-60"
                    style={{ background: "linear-gradient(90deg, #C084FC, #E879F9, #FB923C)", fontFamily }}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DashboardFooter />
      </main>
    </div>
  );
}
