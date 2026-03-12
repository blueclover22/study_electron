import { useState } from 'react';
import { authService } from '../api/authService';
import { LoginRequest, LoginResponse } from '../types/auth';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async (credentials: LoginRequest): Promise<LoginResponse | null> => {
    setIsLoading(true);
    setError("");

    try {
      console.log('[Hook] Attempting login with credentials:', { userId: credentials.userId });
      const userInfo = await authService.login(credentials);
      console.log('[Hook] Login successful, userInfo:', userInfo);
      return userInfo;
    } catch (err) {
      const message = err.message || "로그인 중 오류가 발생했습니다";
      console.log('[Hook] Login failed, setting error:', message);
      setError(message);
      console.error("[Hook] Login Error:", err);
      // 에러 발생 시 null을 반환하여 handleSubmit에서 후속 처리가 되지 않도록 함
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError("");

  return { login, isLoading, error, setError, clearError };
};
