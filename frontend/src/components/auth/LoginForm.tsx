import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useCart } from "../../context/CartContext";

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onSwitchToOtp: (email: string) => void;
}

export default function LoginForm({ onSwitchToRegister, onSwitchToOtp }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [isRemember, setIsRemember] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { setAuthUser } = useCart();
  const apiUrl = import.meta.env.VITE_API_URL;
  const isFormValid = email.trim() !== "" && password.trim() !== "";

  const handleLogin = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, isRemember }),
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const authRes = await fetch(`${apiUrl}/auth/check-auth`, { credentials: "include" });
        const authData = await authRes.json();
        if (authData.authenticated && authData.user) {
          setAuthUser({
            id: authData.user.id,
            email: authData.user.email,
            firstName: authData.user.firstName ?? null,
            lastName: authData.user.lastName ?? null,
          });
        }
        navigate("/");
      } else if (data.message?.includes("not verified")) {
        // Account exists but OTP not verified — resend OTP and go to OTP screen
        await fetch(`${apiUrl}/auth/resend-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        onSwitchToOtp(email);
      } else {
        setError(data.message || "อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      }
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">อีเมล</label>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && isFormValid && handleLogin()}
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
        />
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">รหัสผ่าน</label>
        <div className="relative">
          <input
            type={showPw ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && isFormValid && handleLogin()}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
          />
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
            tabIndex={-1}
          >
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {/* Remember me */}
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={isRemember}
          onChange={(e) => setIsRemember(e.target.checked)}
          className="w-4 h-4 accent-gray-900"
        />
        <span className="text-sm text-gray-600">จำฉันไว้ 7 วัน</span>
      </label>

      {/* Submit */}
      <button
        onClick={handleLogin}
        disabled={!isFormValid || isSubmitting}
        className="w-full bg-gray-900 text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-gray-700 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting && <Loader2 size={15} className="animate-spin" />}
        เข้าสู่ระบบ
      </button>

      <p className="text-center text-sm text-gray-500">
        ยังไม่มีบัญชี?{" "}
        <button onClick={onSwitchToRegister} className="text-gray-900 font-semibold hover:underline">
          สมัครสมาชิก
        </button>
      </p>
    </div>
  );
}
