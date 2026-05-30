import { useState } from "react";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import OtpForm from "../components/OtpForm";

export default function Auth() {
  const [currentView, setCurrentView] = useState("login");
  const [registeredEmail, setRegisteredEmail] = useState("");
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
