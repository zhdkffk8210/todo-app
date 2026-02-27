import { useState } from "react";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";

export default function App() {
  const [user, setUser] = useState(null);

  return user ? (
    <HomePage user={user} onLogout={() => setUser(null)} />
  ) : (
    <AuthPage onLogin={setUser} />
  );
}