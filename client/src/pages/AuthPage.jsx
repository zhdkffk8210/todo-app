import { useState } from "react";

function isValidEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

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
    setError("");

    // 🔥 공통 유효성 검사
    if (!isValidEmail(form.email)) {
      setError("올바른 이메일 형식이 아닙니다.");
      return;
    }

    if (form.password.length < 6) {
      setError("비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }

    // 🔥 회원가입일 때 추가 검사
    if (!isLogin && !form.name.trim()) {
      setError("이름을 입력해주세요.");
      return;
    }

    setLoading(true);

    try {
      // 실제 API 붙일 자리
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
            type="button"
            className={isLogin ? "active" : ""}
            onClick={() => {
              setIsLogin(true);
              setError("");
            }}
          >
            로그인
          </button>
          <button
            type="button"
            className={!isLogin ? "active" : ""}
            onClick={() => {
              setIsLogin(false);
              setError("");
            }}
          >
            회원가입
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            name="email"
            type="email"
            placeholder="이메일"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="비밀번호 (6자 이상)"
            value={form.password}
            onChange={handleChange}
            required
          />

          {!isLogin && (
            <>
              <input
                name="name"
                placeholder="이름"
                value={form.name}
                onChange={handleChange}
                required
              />
              <input
                name="bio"
                placeholder="자기소개"
                value={form.bio}
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