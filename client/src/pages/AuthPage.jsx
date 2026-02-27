import { useState } from "react";
import { loginApi, registerApi } from "../api/auth";

function isValidEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

export default function AuthPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    bio: "", // UI용(백엔드에 안 보냄)
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

    // ✅ 프론트 유효성(서버 규칙과 맞춤)
    if (!isValidEmail(form.email)) {
      setError("올바른 이메일 형식이 아닙니다.");
      return;
    }
    if (form.password.length < 8) {
      setError("비밀번호는 최소 8자 이상이어야 합니다.");
      return;
    }
    if (!isLogin && !form.name.trim()) {
      setError("이름을 입력해주세요.");
      return;
    }

    setLoading(true);

    try {
      let data;

      if (isLogin) {
        data = await loginApi({
          email: form.email,
          password: form.password,
        });
      } else {
        data = await registerApi({
          email: form.email,
          password: form.password,
          name: form.name,
        });
      }

      // ✅ 토큰/유저 저장(로그인 유지)
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ 앱 상태 업데이트
      onLogin({
        ...data.user,
        // bio는 서버에 없으니 UI용으로 남기고 싶으면 여기에서 세팅
        bio: form.bio || "자기소개 없음",
      });
    } catch (err) {
      const status = err?.response?.status;
      const resData = err?.response?.data;

      // 서버: { errors: [{ msg, param }] } 형태(회원가입 검증 실패)
      if (status === 400 && resData?.errors?.length) {
        setError(resData.errors[0].msg || "요청 실패");
      } else {
        setError(resData?.message || "요청 실패");
      }
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
            placeholder="비밀번호 (8자 이상)"
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
                placeholder="자기소개(선택)"
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