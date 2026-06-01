import { useState } from "react";

interface RegisterFormProps {
  onSwitchToLogin: () => void;
  onSwitchToOtp?: (email: string) => void;
}

export default function RegisterForm({
  onSwitchToLogin,
  onSwitchToOtp,
}: RegisterFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        if (onSwitchToOtp) {
          onSwitchToOtp(email);
        }
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setError("An error occurred during registration. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPasswordsMatch = password === confirmPassword;
  const isFormValid =
    email.trim() !== "" && password.trim() !== "" && isPasswordsMatch;

  return (
    <div className="p-8 flex flex-col gap-y-4 bg-white rounded shadow-md w-full max-w-md mx-auto">
      <h2>Register</h2>
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="password"
        placeholder="Confirm Password"
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <p
        className={`text-sm ${isPasswordsMatch ? "text-green-500" : "text-red-500"}`}
      >
        {isPasswordsMatch ? "" : "Passwords do not match"}
      </p>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {isSubmitting && <p className="text-sm text-blue-500">Registering...</p>}
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        disabled={!isFormValid}
        onClick={handleRegister}
      >
        Register
      </button>
      <button
        onClick={onSwitchToLogin}
        className="text-sm text-blue-500 hover:underline mt-2"
      >
        Already have an account? Login
      </button>
    </div>
  );
}
