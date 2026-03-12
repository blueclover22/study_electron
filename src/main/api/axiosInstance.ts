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

export default api;
