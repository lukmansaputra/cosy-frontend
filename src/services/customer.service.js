import { api, handleApiError, unwrapApiData } from "@/lib/api";

export async function getCustomers() {
  try {
    const response = await api.get("/customers");

    return unwrapApiData(response);
  } catch (error) {
    handleApiError(error);
  }
}

export async function createCustomer(payload) {
  try {
    const response = await api.post("/customers", payload);

    return unwrapApiData(response);
  } catch (error) {
    handleApiError(error);
  }
}

export async function updateCustomer(id, payload) {
  try {
    const response = await api.patch(`/customers/${id}`, payload);

    return unwrapApiData(response);
  } catch (error) {
    handleApiError(error);
  }
}

export async function deleteCustomer(id) {
  try {
    const response = await api.delete(`/customers/${id}`);

    return unwrapApiData(response);
  } catch (error) {
    handleApiError(error);
  }
}
