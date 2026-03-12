import React, { useState } from "react";
import "./Login.css";

interface LoginProps {
  onLoginSuccess: (username: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!username.trim() || !password.trim()) {
        setError("사용자명과 비밀번호를 입력해주세요");
        setIsLoading(false);
        return;
      }

      // Electron 스타일의 임시 로그인 검증 (실제로는 IPC 호출 등이 올 수 있음)
      if (username === "admin" && password === "admin") {
        onLoginSuccess(username);
      } else {
        setError("사용자명 또는 비밀번호가 올바르지 않습니다");
      }
    } catch (err) {
      setError("로그인 중 오류가 발생했습니다");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>POS 시스템 (Electron)</h1>
          <p>관리자 로그인</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">사용자명</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="사용자명을 입력하세요 (admin)"
              disabled={isLoading}
              autoComplete="username"
              className={error ? "input-error" : ""}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요 (admin)"
                disabled={isLoading}
                autoComplete="current-password"
                className={error ? "input-error" : ""}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? "숨기기" : "표시"}
              </button>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <div className="login-footer">
          <p>POS System v1.0 | Electron Edition</p>
        </div>
      </div>

      <div className="login-background">
        <div className="gradient-overlay"></div>
      </div>
    </div>
  );
};
