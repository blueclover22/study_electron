import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:6808',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'User-Agent': 'IM-POS',
    'Accept': 'application/json; charset=utf-8',
  },
  responseType: 'arraybuffer',
  transformResponse: [(data) => {
    try {
      if (Buffer.isBuffer(data)) {
        let text = data.toString('utf-8');

        // 한글 깨짐 감지 및 복구
        if (text.includes('?') || /[\uFFFD]/g.test(text)) {
          // EUC-KR로 인코딩된 데이터를 UTF-8로 해석한 경우
          try {
            const latin1Text = data.toString('latin1');
            text = Buffer.from(latin1Text, 'latin1').toString('utf-8');
          } catch (e) {
            // 실패 시 원본 유지
          }
        }

        return JSON.parse(text);
      }
      return data;
    } catch (error) {
      console.error('[Axios TransformResponse] Error:', error);
      return data;
    }
  }],
});

export default api;
