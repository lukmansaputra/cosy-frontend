import { api, handleApiError, unwrapApiData } from "@/lib/api";

export async function getDashboardSummary() {
  try {
    const response = await api.get("/dashboard");

    return unwrapApiData(response);
  } catch (error) {
    handleApiError(error);
  }
}

export async function getProjectFinancialDetail(projectId) {
  try {
    const response = await api.get(`/dashboard/projects/${projectId}/financials`);

    return unwrapApiData(response);
  } catch (error) {
    handleApiError(error);
  }
}
