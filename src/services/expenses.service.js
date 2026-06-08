import { api, handleApiError, unwrapApiData } from "@/lib/api";

export async function getExpenses() {
  try {
    const response = await api.get("/project-expenses");

    return unwrapApiData(response);
  } catch (error) {
    handleApiError(error);
  }
}

export async function getProjectExpenses(projectId) {
  try {
    const response = await api.get(`/projects/${projectId}/expenses`);

    return unwrapApiData(response);
  } catch (error) {
    handleApiError(error);
  }
}

export async function createExpense(projectId, payload) {
  try {
    const response = await api.post(`/projects/${projectId}/expenses`, payload);

    return unwrapApiData(response);
  } catch (error) {
    handleApiError(error);
  }
}

export async function deleteExpense(id) {
  try {
    const response = await api.delete(`/project-expenses/${id}`);

    return unwrapApiData(response);
  } catch (error) {
    handleApiError(error);
  }
}
