import { useEffect, useState } from "react";

import Sheet from "@/components/ui/Sheet";

export default function RabItemSheet({
  open,
  item,
  saving = false,
  onClose,
  onSubmit,
}) {
  const [sectionName, setSectionName] = useState("");
  const [itemName, setItemName] = useState("");
  const [material, setMaterial] = useState("");
  const [size, setSize] = useState("");
  const [qty, setQty] = useState("");
  const [unit, setUnit] = useState("");
  const [unitPrice, setUnitPrice] = useState("");

  useEffect(() => {
    if (!open) return;

    setSectionName(item?.section_name || "");
    setItemName(item?.item_name || "");
    setMaterial(item?.material || "");
    setSize(item?.size || "");
    setQty(item?.qty ? String(item.qty) : "");
    setUnit(item?.unit || "");
    setUnitPrice(item?.unit_price ? String(item.unit_price) : "");
  }, [item, open]);

  return (
    <Sheet open={open} onClose={onClose} title={item ? "Edit Item RAB" : "Tambah Item RAB"}>
      <div className="space-y-4">
        <Field label="Area / Section">
          <input
            value={sectionName}
            onChange={(event) => setSectionName(event.target.value)}
            placeholder="Contoh: Living Room"
            className={inputClassName}
          />
        </Field>

        <Field label="Nama Item">
          <input
            value={itemName}
            onChange={(event) => setItemName(event.target.value)}
            placeholder="Masukkan item pekerjaan"
            className={inputClassName}
          />
        </Field>

        <Field label="Material">
          <input
            value={material}
            onChange={(event) => setMaterial(event.target.value)}
            placeholder="Contoh: Gypsum, Multiplek 18mm"
            className={inputClassName}
          />
        </Field>

        <Field label="Ukuran">
          <input
            value={size}
            onChange={(event) => setSize(event.target.value)}
            placeholder="Contoh: P 5,20m x T 3,14m"
            className={inputClassName}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Qty">
            <input
              type="number"
              value={qty}
              onChange={(event) => setQty(event.target.value)}
              placeholder="1"
              className={inputClassName}
            />
          </Field>

          <Field label="Satuan">
            <input
              value={unit}
              onChange={(event) => setUnit(event.target.value)}
              placeholder="m2, unit, ls"
              className={inputClassName}
            />
          </Field>
        </div>

        <Field label="Harga Satuan">
          <input
            type="number"
            value={unitPrice}
            onChange={(event) => setUnitPrice(event.target.value)}
            placeholder="200000"
            className={inputClassName}
          />
        </Field>

        <button
          disabled={saving || !sectionName || !itemName || !qty || !unitPrice}
          onClick={() => {
            onSubmit({
              section_name: sectionName,
              item_name: itemName,
              material,
              size,
              qty: Number(qty),
              unit,
              unit_price: Number(unitPrice),
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
          {saving ? "Menyimpan..." : item ? "Simpan Perubahan" : "Simpan Item"}
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
