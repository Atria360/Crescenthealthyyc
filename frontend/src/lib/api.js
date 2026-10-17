import axios from "axios";

export const API = `${process.env.REACT_APP_BACKEND_URL || ""}/api`;

export const TOKEN_KEY = "cwc_admin_token";

export const api = axios.create({ baseURL: API });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
