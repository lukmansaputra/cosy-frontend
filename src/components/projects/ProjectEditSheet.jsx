import { useEffect, useState } from "react";

import Sheet from "@/components/ui/Sheet";

const STATUS_OPTIONS = [
  { label: "Survey", value: "survey" },
  { label: "Quotation", value: "quotation" },
  { label: "Menunggu DP", value: "waiting_dp" },
  { label: "Produksi", value: "production" },
  { label: "Instalasi", value: "installation" },
  { label: "Selesai", value: "completed" },
  { label: "Batal", value: "cancelled" },
];

export default function ProjectEditSheet({
  open,
  project,
  saving = false,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState(getInitialForm(project));

  useEffect(() => {
    if (open) setForm(getInitialForm(project));
  }, [open, project]);

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  return (
    <Sheet open={open} onClose={onClose} title="Edit Proyek">
      <div className="space-y-4">
        <InputField
          label="Nama Proyek"
          value={form.project_name}
          onChange={(value) => updateField("project_name", value)}
          placeholder="Masukkan nama proyek"
        />

        <InputField
          label="Lokasi"
          value={form.location}
          onChange={(value) => updateField("location", value)}
          placeholder="Masukkan lokasi proyek"
        />

        <div>
          <label className="mb-2 block text-sm text-[#8B9388]">Status</label>
          <select
            value={form.status}
            onChange={(event) => updateField("status", event.target.value)}
            className="w-full rounded-xl border border-[#252A27] bg-[#101311] p-3 text-white outline-none"
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <InputField
            label="Mulai"
            type="date"
            value={form.start_date}
            onChange={(value) => updateField("start_date", value)}
          />

          <InputField
            label="Target Selesai"
            type="date"
            value={form.target_finish_date}
            onChange={(value) => updateField("target_finish_date", value)}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-[#8B9388]">Catatan</label>
          <textarea
            rows={3}
            value={form.notes}
            onChange={(event) => updateField("notes", event.target.value)}
            placeholder="Catatan internal proyek"
            className="w-full rounded-xl border border-[#252A27] bg-[#101311] p-3 text-white outline-none"
          />
        </div>

        <button
          disabled={saving || !form.project_name.trim()}
          onClick={() => onSubmit(form)}
          className="w-full rounded-xl bg-[#4A5B45] py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </Sheet>
  );
}

function InputField({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label className="mb-2 block text-sm text-[#8B9388]">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[#252A27] bg-[#101311] p-3 text-white outline-none"
      />
    </div>
  );
}

function getInitialForm(project) {
  return {
    project_name: project?.project_name || "",
    location: project?.location || "",
    status: project?.status || "survey",
    start_date: normalizeDate(project?.start_date),
    target_finish_date: normalizeDate(project?.target_finish_date),
    notes: project?.notes || "",
  };
}

function normalizeDate(value) {
  if (!value) return "";

  return String(value).slice(0, 10);
}
