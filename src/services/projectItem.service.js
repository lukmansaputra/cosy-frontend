import { api, handleApiError, unwrapApiData } from "@/lib/api";

export async function getProjectItems(projectId) {
  try {
    const response = await api.get(`/projects/${projectId}/items`);

    return unwrapApiData(response);
  } catch (error) {
    handleApiError(error);
  }
}

export async function createProjectItem(projectId, payload) {
  try {
    const response = await api.post(`/projects/${projectId}/items`, payload);

    return unwrapApiData(response);
  } catch (error) {
    handleApiError(error);
  }
}

export async function updateProjectItem(itemId, payload) {
  try {
    const response = await api.patch(`/project-items/${itemId}`, payload);

    return unwrapApiData(response);
  } catch (error) {
    handleApiError(error);
  }
}

export async function deleteProjectItem(itemId) {
  try {
    const response = await api.delete(`/project-items/${itemId}`);

    return unwrapApiData(response);
  } catch (error) {
    handleApiError(error);
  }
}
