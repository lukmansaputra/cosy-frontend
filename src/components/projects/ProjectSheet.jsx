import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sheet from "@/components/ui/Sheet";

const STATUS_OPTIONS = [
  { label: "Survey", value: "survey" },
  { label: "Quotation", value: "quotation" },
  { label: "Menunggu DP", value: "waiting_dp" },
  { label: "Produksi", value: "production" },
  { label: "Instalasi", value: "installation" },
  { label: "Selesai", value: "completed" },
];

export default function ProjectSheet({
  open,
  onClose,
  onSubmit,
  customers = [],
}) {
  const navigate = useNavigate();
  const [customerId, setCustomerId] = useState("");
  const [projectName, setProjectName] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("survey");
  const [startDate, setStartDate] = useState("");
  const [targetFinishDate, setTargetFinishDate] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (open && customers.length > 0 && !customerId) {
      setCustomerId(customers[0].id);
    }
  }, [customerId, customers, open]);

  function resetForm() {
    setCustomerId(customers[0]?.id || "");
    setProjectName("");
    setLocation("");
    setStatus("survey");
    setStartDate("");
    setTargetFinishDate("");
    setNotes("");
  }

  return (
    <Sheet open={open} onClose={onClose} title="Tambah Proyek">
      <div className="space-y-4">
        <Field label="Customer">
          <select
            value={customerId}
            onChange={(event) => {
              if (event.target.value === "__new_customer__") {
                onClose();
                navigate("/customers");
                return;
              }

              setCustomerId(event.target.value);
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

        <Field label="Nama Proyek">
          <input
            value={projectName}
            onChange={(event) => setProjectName(event.target.value)}
            placeholder="Masukkan nama proyek"
            className={inputClassName}
          />
        </Field>

        <Field label="Lokasi">
          <input
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="Masukkan lokasi proyek"
            className={inputClassName}
          />
        </Field>

        <Field label="Status">
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className={inputClassName}
          >
            {STATUS_OPTIONS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Tanggal Mulai">
          <input
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
            className={inputClassName}
          />
        </Field>

        <Field label="Target Selesai">
          <input
            type="date"
            value={targetFinishDate}
            onChange={(event) => setTargetFinishDate(event.target.value)}
            className={inputClassName}
          />
        </Field>

        <Field label="Catatan">
          <textarea
            rows={3}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Catatan proyek"
            className={inputClassName}
          />
        </Field>

        <button
          disabled={!projectName || !customerId}
          onClick={() => {
            onSubmit({
              customer_id: customerId,
              survey_id: null,
              project_name: projectName,
              location,
              contract_value: 0,
              status,
              start_date: startDate || null,
              target_finish_date: targetFinishDate || null,
              notes,
            });

            resetForm();
            onClose();
          }}
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
          Simpan Proyek
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
