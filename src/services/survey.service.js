import { api, handleApiError, unwrapApiData } from "@/lib/api";

export async function getSurveys() {
  try {
    const response = await api.get("/surveys");

    return unwrapApiData(response);
  } catch (error) {
    handleApiError(error);
  }
}

export async function createSurvey(payload) {
  try {
    const response = await api.post("/surveys", payload);

    return unwrapApiData(response);
  } catch (error) {
    handleApiError(error);
  }
}

export async function updateSurvey(id, payload) {
  try {
    const response = await api.patch(`/surveys/${id}`, payload);

    return unwrapApiData(response);
  } catch (error) {
    handleApiError(error);
  }
}

export async function deleteSurvey(id) {
  try {
    const response = await api.delete(`/surveys/${id}`);

    return unwrapApiData(response);
  } catch (error) {
    handleApiError(error);
  }
}
