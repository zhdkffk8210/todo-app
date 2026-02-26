import { useState } from "react";

export default function AuthPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    bio: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await new Promise((res) => setTimeout(res, 500));

      onLogin({
        name: form.name || "사용자",
        bio: form.bio || "자기소개 없음",
      });
    } catch {
      setError("요청 실패");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="center">
      <div className="card">
        <h1 className="logo">TODO</h1>

        <div className="toggle">
          <button
            className={isLogin ? "active" : ""}
            onClick={() => setIsLogin(true)}
          >
            로그인
          </button>
          <button
            className={!isLogin ? "active" : ""}
            onClick={() => setIsLogin(false)}
          >
            회원가입
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            name="email"
            placeholder="이메일"
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="비밀번호"
            onChange={handleChange}
            required
          />

          {!isLogin && (
            <>
              <input
                name="name"
                placeholder="이름"
                onChange={handleChange}
                required
              />
              <input
                name="bio"
                placeholder="자기소개"
                onChange={handleChange}
              />
            </>
          )}

          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "처리중..." : isLogin ? "로그인" : "회원가입"}
          </button>
        </form>
      </div>
    </div>
  );
}