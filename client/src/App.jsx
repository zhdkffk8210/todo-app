import { useEffect, useState } from "react";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";

export default function App() {
  const [user, setUser] = useState(null);

  // 새로고침 로그인 유지
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, []);

  function handleLogin(nextUser) {
    setUser(nextUser);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  return user ? (
    <HomePage user={user} onLogout={handleLogout} />
  ) : (
    <AuthPage onLogin={handleLogin} />
  );
}