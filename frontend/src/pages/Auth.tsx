import { useState, useEffect } from "react";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import OtpForm from "../components/auth/OtpForm";
import { useNavigate } from "react-router-dom";

type View = "login" | "register" | "otp";

export default function Auth() {
  const [view, setView] = useState<View>("login");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    fetch(`${apiUrl}/auth/check-auth`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated) navigate("/");
        else setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const titles: Record<View, { heading: string; sub: string }> = {
    login:    { heading: "ยินดีต้อนรับกลับ",    sub: "เข้าสู่ระบบ" },
    register: { heading: "สร้างบัญชีใหม่",       sub: "" },
    otp:      { heading: "ยืนยันอีเมล",           sub: `กรอกรหัส 6 หลักที่ส่งไปยัง ${registeredEmail}` },
  };

  return (
    <div className="min-h-screen flex">
      {/* Brand panel — desktop only */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-900 text-white flex-col justify-between p-14">
        <button onClick={() => navigate("/")} className="text-xl font-bold tracking-widest">
          BOSS IT
        </button>
        <p className="text-gray-600 text-xs">© 2025 BOSS IT. All rights reserved.</p>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white">
        {/* Mobile brand */}
        <button
          onClick={() => navigate("/")}
          className="lg:hidden text-lg font-bold tracking-widest mb-10"
        >
          BOSS IT
        </button>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{titles[view].heading}</h1>
            <p className="text-sm text-gray-500">{titles[view].sub}</p>
          </div>

          {view === "login" && (
            <LoginForm
              onSwitchToRegister={() => setView("register")}
              onSwitchToOtp={(email) => {
                setRegisteredEmail(email);
                setView("otp");
              }}
            />
          )}
          {view === "register" && (
            <RegisterForm
              onSwitchToLogin={() => setView("login")}
              onSwitchToOtp={(email) => {
                setRegisteredEmail(email);
                setView("otp");
              }}
            />
          )}
          {view === "otp" && (
            <OtpForm
              email={registeredEmail}
              onSwitchToLogin={() => setView("login")}
            />
          )}
        </div>
      </div>
    </div>
  );
}
