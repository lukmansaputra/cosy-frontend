import { api, handleApiError, unwrapApiData } from "@/lib/api";

export async function getProjects() {
  try {
    const response = await api.get("/projects");

    return unwrapApiData(response);
  } catch (error) {
    handleApiError(error);
  }
}

export async function getProject(projectId) {
  try {
    const response = await api.get(`/projects/${projectId}`);

    return unwrapApiData(response);
  } catch (error) {
    handleApiError(error);
  }
}

export async function createProject(payload) {
  try {
    const response = await api.post("/projects", payload);

    return unwrapApiData(response);
  } catch (error) {
    handleApiError(error);
  }
}

export async function updateProjectStatus(projectId, status) {
  try {
    const response = await api.patch(`/projects/${projectId}`, { status });

    return unwrapApiData(response);
  } catch (error) {
    handleApiError(error);
  }
}

export async function updateProject(projectId, payload) {
  try {
    const response = await api.patch(`/projects/${projectId}`, payload);

    return unwrapApiData(response);
  } catch (error) {
    handleApiError(error);
  }
}

export async function deleteProject(projectId) {
  try {
    const response = await api.delete(`/projects/${projectId}`);

    return unwrapApiData(response);
  } catch (error) {
    handleApiError(error);
  }
}
