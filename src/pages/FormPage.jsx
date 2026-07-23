// FormPage.jsx – Simple interior‑survey registration form
// -----------------------------------------------------------
// This page provides a lightweight registration form for interior surveys.
// It captures the surveyor's name, the survey location (address), and a contact number.
// The form demonstrates the UI conventions used in the existing codebase
// (inputClassName, button styling, etc.) and posts the data to the backend
// using the existing `createSurvey` service.
//
// Required fields for the backend payload:
//   - customer_id   – the associated customer (selected from the API list).
//   - project_type  – we use a static value "Interior" for this form.
//   - project_location – the address entered by the user.
//   - surveyor_name – the name entered by the user.
//   - notes – we store the contact number here (as the original API does not have a dedicated field).
//
// The component mirrors the style of other pages (e.g. SurveysPage) and
// re‑uses the `inputClassName` constant defined in SurveySheet for visual
// consistency.

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

import { createSurvey } from "@/services/survey.service";
import { getCustomers } from "@/services/customer.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// Re‑use the same input styling as SurveySheet for a cohesive UI.
const inputClassName =
  "w-full rounded-xl border border-[#252A27] bg-[#101311] p-3 text-white outline-none";

export default function FormPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    customer_id: "",
    surveyor_name: "",
    project_location: "",
    contact_number: "",
    saving: false,
    error: "",
  });

  // Load customers so the user can pick an existing one.
  const { data: customers = [], isPending, error: customersError } = useQuery({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });

  // Helper to update a single field.
  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const canSubmit =
    form.customer_id && form.surveyor_name && form.project_location && !form.saving;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setForm((p) => ({ ...p, saving: true, error: "" }));
    try {
      await createSurvey({
        customer_id: form.customer_id,
        project_type: "Interior", // static for this simple form
        project_location: form.project_location,
        surveyor_name: form.surveyor_name,
        estimated_budget: null,
        status: "pending",
        notes: `Contact: ${form.contact_number}`,
      });
      // Invalidate the surveys list so the new entry appears elsewhere.
      queryClient.invalidateQueries({ queryKey: ["surveys"] });
      navigate("/surveys");
    } catch (e) {
      updateField("error", e.message ?? "Gagal menyimpan survey");
    } finally {
      updateField("saving", false);
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-6 p-6">
      <h1 className="text-2xl font-bold text-white">Registrasi Survey Interior</h1>

      {customersError && (
        <p className="text-red-400">Gagal memuat data pelanggan: {customersError.message}</p>
      )}

      <label className="block text-sm text-[#8B9388]">Pelanggan</label>
      <select
        className={inputClassName}
        value={form.customer_id}
        onChange={(e) => updateField("customer_id", e.target.value)}
        disabled={isPending}
      >
        <option value="">-- Pilih pelanggan --</option>
        {customers.map((c) => (
          <option key={c.id} value={c.id}>
            {c.full_name}
          </option>
        ))}
      </select>

      <label className="block text-sm text-[#8B9388]">Nama Surveyor</label>
      <input
        className={inputClassName}
        type="text"
        placeholder="Nama surveyor"
        value={form.surveyor_name}
        onChange={(e) => updateField("surveyor_name", e.target.value)}
      />

      <label className="block text-sm text-[#8B9388]">Alamat / Lokasi Survey</label>
      <textarea
        className={inputClassName}
        rows={3}
        placeholder="Alamat lengkap"
        value={form.project_location}
        onChange={(e) => updateField("project_location", e.target.value)}
      />

      <label className="block text-sm text-[#8B9388]">Nomor Kontak</label>
      <input
        className={inputClassName}
        type="tel"
        placeholder="08xx‑xxxx‑xxxx"
        value={form.contact_number}
        onChange={(e) => updateField("contact_number", e.target.value)}
      />

      {form.error && <p className="text-red-400">{form.error}</p>}

      <button
        disabled={!canSubmit}
        onClick={handleSubmit}
        className={
          "flex w-full items-center justify-center gap-2 rounded-xl bg-[#4A5B45] py-3 font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed"
        }
      >
        {form.saving ? "Menyimpan…" : "Simpan Survey"}
        <Plus size={16} />
      </button>
    </div>
  );
}
