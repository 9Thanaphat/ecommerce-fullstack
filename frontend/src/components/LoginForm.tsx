import { useState } from "react";

interface LoginFormProps {
  //type definition for the props of LoginForm component
  onSwitchToRegister: () => void;
}

export default function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isFormValid = email.trim() !== "" && password.trim() !== "";

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
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        disabled={!isFormValid}
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
