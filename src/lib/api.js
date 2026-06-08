import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const apiKey = import.meta.env.VITE_COSY_API_KEY;
  const legacyToken = localStorage.getItem("cosy_auth_token");

  if (apiKey) {
    config.headers["x-cosy-api-key"] = apiKey;
  }

  if (legacyToken) {
    config.headers.authorization = `Bearer ${legacyToken}`;
  }

  return config;
});

export function unwrapApiData(response) {
  return response.data?.data ?? response.data;
}

export function handleApiError(error) {
  const message =
    error.response?.data?.message || error.message || "Terjadi kesalahan";

  throw new Error(message);
}
