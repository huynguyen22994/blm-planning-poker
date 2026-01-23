import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// optional: interceptor
api.interceptors.response.use(
  (res) => res.data,
  (err) => Promise.reject(err.response?.data ?? err),
);

export default api;
