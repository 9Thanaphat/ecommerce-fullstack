import { useState, useEffect } from "react";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import OtpForm from "../components/auth/OtpForm";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [currentView, setCurrentView] = useState("login");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Checking authentication...");
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(`${apiUrl}/users/check-auth`, {
          method: "GET",
          credentials: "include", // Include cookies for authentication
        });

        const data = await response.json();
        if (response.ok && data.authenticated) {
          console.log("User is authenticated, redirecting to home page...");
          navigate("/");
        } else {
          console.log("User is not authenticated, showing login page...");
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-300">
        <h1 className="text-xl font-bold animate-pulse">
          Checking authentication...
        </h1>
      </div>
    );
  }

  return (
    <div className="p-8 flex flex-col gap-y-4 bg-gray-300 min-h-screen">
      <h1 className="text-3xl font-bold">Authentication 🔐</h1>
      {currentView === "login" && (
        <LoginForm onSwitchToRegister={() => setCurrentView("register")} />
      )}
      {currentView === "register" && (
        <RegisterForm
          onSwitchToLogin={() => setCurrentView("login")}
          onSwitchToOtp={(email) => {
            setRegisteredEmail(email);
            setCurrentView("otp");
          }}
        />
      )}
      {currentView === "otp" && (
        <OtpForm
          email={registeredEmail}
          onSwitchToLogin={() => setCurrentView("login")}
        />
      )}
    </div>
  );
}
