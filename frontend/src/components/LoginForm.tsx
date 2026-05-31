import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

interface LoginFormProps {
  //type definition for the props of LoginForm component
  onSwitchToRegister: () => void;
}

export default function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRemember, setIsRemember] = useState(false);
  const isFormValid = email.trim() !== "" && password.trim() !== "";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const onLoginSuccess = () => {
    Swal.fire("Success", "Login successful!", "success");
    navigate("/"); // Redirect to home page after successful login
  };

  const handleLogin = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, isRemember }),
        credentials: "include", // Include cookies for authentication
      });
      const data = await response.json();
      if (response.ok && data.success) {
        // Login successful, you can redirect the user or show a success message
        onLoginSuccess();
      } else {
        setError(data.message || "Login failed");
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 flex flex-col gap-y-4 bg-white rounded shadow-md w-full max-w-md mx-auto">
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p className="text-red-500">{error}</p>}
      {isSubmitting && <p className="text-blue-500">Logging in...</p>}
      <div>
        <input
          type="checkbox"
          id="remember"
          className="mr-2"
          checked={isRemember}
          onChange={(e) => setIsRemember(e.target.checked)}
        />
        <label htmlFor="remember" className="text-sm text-gray-600">
          Remember me
        </label>
      </div>
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        disabled={!isFormValid}
        onClick={handleLogin}
      >
        Login
      </button>
      <button
        onClick={onSwitchToRegister}
        className="text-sm text-blue-500 hover:underline mt-2"
      >
        Don't have an account? Register
      </button>
    </div>
  );
}
