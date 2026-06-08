import { useEffect, useState } from "react";

import Sheet from "@/components/ui/Sheet";

export default function CustomerSheet({ open, customer, onClose, onSubmit }) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (!open) return;

    setFullName(customer?.full_name || "");
    setPhone(customer?.phone || "");
    setAddress(customer?.address || "");
  }, [customer, open]);

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={customer ? "Edit Customer" : "Tambah Customer"}
    >
      <div className="space-y-4">
        <Field label="Nama Customer">
          <input
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="Masukkan nama customer"
            className={inputClassName}
          />
        </Field>

        <Field label="Nomor Telepon">
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="Masukkan nomor telepon"
            className={inputClassName}
          />
        </Field>

        <Field label="Alamat">
          <textarea
            rows={3}
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder="Masukkan alamat customer"
            className={inputClassName}
          />
        </Field>

        <button
          disabled={!fullName}
          onClick={() => {
            onSubmit({
              full_name: fullName,
              phone,
              address,
            });
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
          Simpan Customer
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
