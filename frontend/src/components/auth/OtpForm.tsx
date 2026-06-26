import { useState } from "react";
import { Loader2, MailCheck } from "lucide-react";
import { toast } from "sonner";

interface OtpFormProps {
  email: string;
  onSwitchToLogin: () => void;
}

export default function OtpForm({ email, onSwitchToLogin }: OtpFormProps) {
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyNumbers = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
    setOtp(onlyNumbers);
  };

  const handleVerify = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      const res = await fetch(`${apiUrl}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("ยืนยันอีเมลสำเร็จ", { description: "เข้าสู่ระบบได้เลย" });
        onSwitchToLogin();
      } else {
        setError(data.message || "รหัส OTP ไม่ถูกต้อง");
      }
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      const res = await fetch(`${apiUrl}/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("ส่งรหัสใหม่แล้ว", { description: "กรุณาตรวจสอบอีเมล" });
      } else {
        setError(data.message || "ส่งรหัสไม่สำเร็จ");
      }
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Email hint */}
      <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl p-4">
        <MailCheck size={20} className="text-gray-400 flex-shrink-0" />
        <p className="text-sm text-gray-600">
          ส่งรหัสไปยัง <span className="font-semibold text-gray-900">{email}</span>
        </p>
      </div>

      {/* OTP input */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">รหัส OTP (6 หลัก)</label>
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={otp}
          onChange={handleOtpChange}
          onKeyDown={(e) => e.key === "Enter" && otp.length === 6 && handleVerify()}
          placeholder="000000"
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-center text-2xl font-bold tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <div className="flex justify-between mt-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`h-0.5 flex-1 mx-0.5 rounded-full transition-colors ${
                i < otp.length ? "bg-blue-600" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {/* Verify */}
      <button
        onClick={handleVerify}
        disabled={otp.length !== 6 || isSubmitting}
        className="w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting && <Loader2 size={15} className="animate-spin" />}
        ยืนยันรหัส OTP
      </button>

      <div className="flex items-center justify-between text-sm">
        <button
          onClick={handleResend}
          disabled={isSubmitting}
          className="text-gray-500 hover:text-gray-900 hover:underline transition disabled:opacity-40"
        >
          ไม่ได้รับรหัส? ส่งใหม่
        </button>
        <button
          onClick={onSwitchToLogin}
          className="text-gray-500 hover:text-gray-900 hover:underline transition"
        >
          ← กลับไปหน้า Login
        </button>
      </div>
    </div>
  );
}
