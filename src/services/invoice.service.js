import { api, handleApiError, unwrapApiData } from "@/lib/api";

export async function getProjectInvoices(projectId) {
  try {
    const response = await api.get(`/projects/${projectId}/invoices`);

    return unwrapApiData(response);
  } catch (error) {
    handleApiError(error);
  }
}

export async function saveProjectInvoice(projectId, payload) {
  try {
    const response = await api.put(`/projects/${projectId}/invoices`, payload);

    return unwrapApiData(response);
  } catch (error) {
    handleApiError(error);
  }
}
