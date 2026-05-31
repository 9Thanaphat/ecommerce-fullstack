import { useState } from "react";
import Swal from "sweetalert2";

interface OtpFormProps {
  email: string;
  onSwitchToLogin: () => void;
}

export default function OtpForm({ email, onSwitchToLogin }: OtpFormProps) {
  const [otp, setOtp] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyNumbers = e.target.value.replace(/[^0-9]/g, "");
    setOtp(onlyNumbers);
  };

  const handleVerifyOtp = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/users/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        // OTP verified successfully, you can redirect the user or show a success message
        Swal.fire("Success", "OTP verified successfully! You can now log in.", "success");
        onSwitchToLogin();
      } else {
        setError(data.message || "OTP verification failed");
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
      setError("An error occurred while verifying the OTP.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/users/resend-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        Swal.fire("Success", "OTP resent successfully! Please check your email.", "success");
      } else {
        setError(data.message || "Failed to resend OTP");
      }
    } catch (error) {
      console.error("Error during OTP resend:", error);
      setError("An error occurred while resending the OTP.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 flex flex-col gap-y-4 bg-white rounded shadow-md w-full max-w-md mx-auto">
      <h2>OTP Verification</h2>
      <p className="text-gray-600">An OTP has been sent to {email}</p>
      <input
        type="text"
        maxLength={6}
        className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter OTP"
        value={otp}
        onChange={handleOtpChange}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      {isSubmitting && <p className="text-sm text-blue-500">Verifying...</p>}
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded transition-colors hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        disabled={otp.length !== 6}
        onClick={handleVerifyOtp}
      >
        Verify OTP
      </button>
      <button
        onClick={handleResendOtp}
        disabled={isSubmitting}
        className="text-sm text-gray-500 hover:text-black hover:underline mt-2"
      >
        Didn't receive code? Resend
      </button>
      <button
          onClick={onSwitchToLogin}
          className="text-sm text-gray-500 hover:text-black hover:underline transition-colors"
        >
          ← Back to Login
        </button>
    </div>
  );
}
