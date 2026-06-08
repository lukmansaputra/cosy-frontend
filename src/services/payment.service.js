import { api, handleApiError, unwrapApiData } from "@/lib/api";

export async function getPayments() {
  try {
    const response = await api.get("/project-payments");

    return unwrapApiData(response);
  } catch (error) {
    handleApiError(error);
  }
}

export async function getProjectPayments(projectId) {
  try {
    const response = await api.get(`/projects/${projectId}/payments`);

    return unwrapApiData(response);
  } catch (error) {
    handleApiError(error);
  }
}

export async function createPayment(projectId, payload) {
  try {
    const response = await api.post(`/projects/${projectId}/payments`, payload);

    return unwrapApiData(response);
  } catch (error) {
    handleApiError(error);
  }
}

export async function deletePayment(id) {
  try {
    const response = await api.delete(`/project-payments/${id}`);

    return unwrapApiData(response);
  } catch (error) {
    handleApiError(error);
  }
}
