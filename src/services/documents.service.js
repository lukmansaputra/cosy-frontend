import { api, handleApiError, unwrapApiData } from "@/lib/api";

export async function getProjectDocuments(projectId) {
  try {
    const response = await api.get(`/projects/${projectId}/documents`);

    return unwrapApiData(response);
  } catch (error) {
    handleApiError(error);
  }
}

export async function uploadProjectDocument(projectId, { file, documentType, notes }) {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("document_type", documentType);
    formData.append("notes", notes || "");

    const response = await api.post(`/projects/${projectId}/documents`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return unwrapApiData(response);
  } catch (error) {
    handleApiError(error);
  }
}

export async function deleteProjectDocument(id) {
  try {
    const response = await api.delete(`/project-documents/${id}`);

    return unwrapApiData(response);
  } catch (error) {
    handleApiError(error);
  }
}
