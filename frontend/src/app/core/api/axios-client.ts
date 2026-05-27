// src/app/core/api/axios-client.ts
import axios from 'axios';
import { getAccessToken, removeAccessToken } from '../utils/tokens';

const getBaseURL = () => {
  // 1. Ưu tiên biến môi trường nếu được định nghĩa
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  // 2. Khi chạy build Production (ví dụ: trên Vercel), dùng relative path '/api' để gọi cùng domain
  if (import.meta.env.PROD) {
    return '/api';
  }
  // 3. Khi chạy ở Local Development, dùng mặc định cổng 8000
  return 'http://localhost:8000/api';
};

const axiosClient = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 giây đợi phản hồi
});

// Lớp chặn Gửi đi (Request Interceptor): Tự động nhét Token vào Header
axiosClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Lớp chặn Phản hồi về (Response Interceptor): Bắt lỗi hệ thống (Ví dụ: hết hạn đăng nhập)
axiosClient.interceptors.response.use(
  (response) => {
    return response.data; // Trả về thẳng dữ liệu sạch từ Backend
  },
  (error) => {
    // Nếu Backend báo lỗi 401 (Unauthorized) -> Token hết hạn hoặc fake -> Đá ra trang login
    if (error.response && error.response.status === 401) {
      removeAccessToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;