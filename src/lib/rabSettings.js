import { api, handleApiError, unwrapApiData } from "@/lib/api";

export const DEFAULT_RAB_NOTE =
  "Harga berlaku sesuai item pada RAB. Perubahan desain, ukuran, material, atau penambahan item akan dikenakan biaya tambahan.";

const DEFAULT_RAB_SETTINGS = {
  note: DEFAULT_RAB_NOTE,
  discountMode: "percent",
  discountPercent: "",
  discountFinalTotal: "",
};

export function normalizeRabSettings(settings = {}) {
  return {
    note: settings.notes ?? settings.note ?? DEFAULT_RAB_SETTINGS.note,
    discountMode:
      settings.discount_type ?? settings.discountMode ?? DEFAULT_RAB_SETTINGS.discountMode,
    discountPercent: String(
      settings.discount_percent ?? settings.discountPercent ?? "",
    ),
    discountFinalTotal:
      settings.discount_final_total ?? settings.discountFinalTotal ?? "",
  };
}

export function serializeRabSettings(settings) {
  return {
    notes: settings.note,
    discount_type: settings.discountMode,
    discount_percent: Number(settings.discountPercent || 0),
    discount_final_total:
      settings.discountFinalTotal === "" || settings.discountFinalTotal == null
        ? null
        : Number(settings.discountFinalTotal),
  };
}

export async function getRabSettings(projectId) {
  try {
    const response = await api.get(`/projects/${projectId}/rab/settings`);

    return normalizeRabSettings(unwrapApiData(response));
  } catch (error) {
    handleApiError(error);
  }
}

export async function updateRabSettings(projectId, settings) {
  try {
    const response = await api.put(
      `/projects/${projectId}/rab/settings`,
      serializeRabSettings(settings),
    );

    return normalizeRabSettings(unwrapApiData(response));
  } catch (error) {
    handleApiError(error);
  }
}

export function calculateRabTotals(grandTotal, settings) {
  const total = Number(grandTotal || 0);
  const mode = settings?.discountMode || "percent";
  let discountAmount = 0;
  let discountPercent = 0;
  let finalTotal = total;

  if (mode === "static") {
    const requestedFinalTotal = Number(settings?.discountFinalTotal || 0);

    if (requestedFinalTotal > 0 && requestedFinalTotal < total) {
      finalTotal = requestedFinalTotal;
      discountAmount = total - requestedFinalTotal;
      discountPercent = total > 0 ? (discountAmount / total) * 100 : 0;
    }
  } else {
    discountPercent = Number(settings?.discountPercent || 0);

    if (discountPercent > 0) {
      discountAmount = total * (discountPercent / 100);
      finalTotal = total - discountAmount;
    }
  }

  return {
    discountAmount,
    discountPercent,
    finalTotal,
  };
}
