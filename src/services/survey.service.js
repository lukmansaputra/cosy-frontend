import { api, handleApiError, unwrapApiData } from "@/lib/api";

export async function getSurveys() {
  try {
    const response = await api.get("/surveys");

    return unwrapApiData(response);
  } catch (error) {
    handleApiError(error);
  }
}
