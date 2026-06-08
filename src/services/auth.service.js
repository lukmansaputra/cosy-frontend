import { api, handleApiError, unwrapApiData } from "@/lib/api";

export async function getAuthStatus() {
  try {
    const response = await api.get("/auth/status");

    return unwrapApiData(response);
  } catch (error) {
    handleApiError(error);
  }
}

export async function login(payload) {
  try {
    const response = await api.post("/auth/login", payload);

    return unwrapApiData(response);
  } catch (error) {
    handleApiError(error);
  }
}

export async function logout() {
  try {
    const response = await api.post("/auth/logout");

    return unwrapApiData(response);
  } catch (error) {
    handleApiError(error);
  }
}

export async function register(payload) {
  try {
    const response = await api.post("/auth/register", payload);

    return unwrapApiData(response);
  } catch (error) {
    handleApiError(error);
  }
}

export async function getMe() {
  try {
    const response = await api.get("/auth/me");

    return unwrapApiData(response);
  } catch (error) {
    handleApiError(error);
  }
}

export async function updateProfile(payload) {
  try {
    const response = await api.patch("/auth/profile", payload);

    return unwrapApiData(response);
  } catch (error) {
    handleApiError(error);
  }
}
