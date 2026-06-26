import { useState } from "react";
import { Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";

interface RegisterFormProps {
  onSwitchToLogin: () => void;
  onSwitchToOtp?: (email: string) => void;
}

export default function RegisterForm({ onSwitchToLogin, onSwitchToOtp }: RegisterFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordsMatch = password !== "" && password === confirmPassword;
  const passwordMismatch = confirmPassword !== "" && password !== confirmPassword;
  const isFormValid = email.trim() !== "" && password.trim() !== "" && passwordsMatch;

  const handleRegister = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onSwitchToOtp?.(email);
      } else {
        setError(data.message || "สมัครสมาชิกไม่สำเร็จ");
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
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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

      {/* Confirm Password */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">ยืนยันรหัสผ่าน</label>
        <div className="relative">
          <input
            type={showPw ? "text" : "password"}
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && isFormValid && handleRegister()}
            className={`w-full border rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 transition ${
              passwordMismatch
                ? "border-red-300 focus:ring-red-300"
                : passwordsMatch
                ? "border-green-300 focus:ring-green-300"
                : "border-gray-200 focus:ring-blue-500"
            }`}
          />
          {passwordsMatch && (
            <CheckCircle2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
          )}
        </div>
        {passwordMismatch && (
          <p className="text-xs text-red-500">รหัสผ่านไม่ตรงกัน</p>
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {/* Submit */}
      <button
        onClick={handleRegister}
        disabled={!isFormValid || isSubmitting}
        className="w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting && <Loader2 size={15} className="animate-spin" />}
        สมัครสมาชิก
      </button>

      <p className="text-center text-sm text-gray-500">
        มีบัญชีอยู่แล้ว?{" "}
        <button onClick={onSwitchToLogin} className="text-gray-900 font-semibold hover:underline">
          เข้าสู่ระบบ
        </button>
      </p>
    </div>
  );
}
