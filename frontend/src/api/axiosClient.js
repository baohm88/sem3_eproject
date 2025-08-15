import axios from "axios";
import { API_BASE_URL } from "../config/env";

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Thêm token vào request
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Xử lý lỗi từ server
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);

export default axiosClient;
