import { useNavigate } from "react-router-dom";

import Sheet from "@/components/ui/Sheet";

const STATUS_OPTIONS = [
  { label: "Pending", value: "pending" },
  { label: "Terjadwal", value: "scheduled" },
  { label: "Selesai", value: "completed" },
  { label: "Batal", value: "cancelled" },
];

export default function SurveySheet({
  open,
  form,
  editing,
  customers = [],
  saving,
  onChange,
  onClose,
  onSubmit,
}) {
  const navigate = useNavigate();
  const canSubmit = form.customer_id && form.project_type && form.project_location;

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={editing ? "Edit Survey" : "Tambah Survey"}
    >
      <div className="space-y-4">
        <Field label="Customer">
          <select
            value={form.customer_id}
            onChange={(event) => {
              if (event.target.value === "__new_customer__") {
                onClose();
                navigate("/customers");
                return;
              }

              onChange("customer_id", event.target.value);
            }}
            className={inputClassName}
          >
            {customers.length === 0 && (
              <option value="">Belum ada customer</option>
            )}

            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.full_name}
              </option>
            ))}

            <option value="__new_customer__">+ Tambah customer baru</option>
          </select>
        </Field>

        <Field label="Tanggal Survey">
          <input
            type="date"
            value={form.survey_date}
            onChange={(event) => onChange("survey_date", event.target.value)}
            className={inputClassName}
          />
        </Field>

        <Field label="Surveyor">
          <input
            value={form.surveyor_name}
            onChange={(event) => onChange("surveyor_name", event.target.value)}
            placeholder="Nama surveyor"
            className={inputClassName}
          />
        </Field>

        <Field label="Jenis Proyek">
          <input
            value={form.project_type}
            onChange={(event) => onChange("project_type", event.target.value)}
            placeholder="Contoh: Museum display"
            className={inputClassName}
          />
        </Field>

        <Field label="Lokasi">
          <textarea
            rows={3}
            value={form.project_location}
            onChange={(event) =>
              onChange("project_location", event.target.value)
            }
            placeholder="Lokasi survey"
            className={inputClassName}
          />
        </Field>

        <Field label="Estimasi Budget">
          <input
            type="number"
            min="0"
            value={form.estimated_budget}
            onChange={(event) =>
              onChange("estimated_budget", event.target.value)
            }
            placeholder="0"
            className={inputClassName}
          />
        </Field>

        <Field label="Status">
          <select
            value={form.status}
            onChange={(event) => onChange("status", event.target.value)}
            className={inputClassName}
          >
            {STATUS_OPTIONS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Catatan">
          <textarea
            rows={3}
            value={form.notes}
            onChange={(event) => onChange("notes", event.target.value)}
            placeholder="Catatan survey"
            className={inputClassName}
          />
        </Field>

        <button
          disabled={!canSubmit || saving}
          onClick={onSubmit}
          className="
            w-full rounded-xl
            bg-[#4A5B45]
            py-3
            font-medium
            text-white
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {saving ? "Menyimpan..." : "Simpan Survey"}
        </button>
      </div>
    </Sheet>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm text-[#8B9388]">{label}</label>
      {children}
    </div>
  );
}

const inputClassName =
  "w-full rounded-xl border border-[#252A27] bg-[#101311] p-3 text-white outline-none";
