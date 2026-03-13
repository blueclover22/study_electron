import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:6808',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'User-Agent': 'IM-POS',
    'Accept': 'application/json; charset=utf-8',
  },
});

/**
 * 로그인 성공 후 인증 토큰을 axios 인스턴스에 등록합니다.
 * 이후 모든 요청에 Authorization 헤더가 자동으로 포함됩니다.
 *
 * @param token  JWT 토큰 문자열. null 전달 시 헤더를 제거합니다 (로그아웃).
 */
export const setAuthToken = (token: string | null): void => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api;
