import { api, handleApiError, unwrapApiData } from "@/lib/api";

export async function getNotifications() {
  try {
    return unwrapApiData(await api.get("/notifications"));
  } catch (error) {
    handleApiError(error);
  }
}

export async function markNotificationRead(id) {
  try {
    return unwrapApiData(await api.patch(`/notifications/${id}/read`));
  } catch (error) {
    handleApiError(error);
  }
}
