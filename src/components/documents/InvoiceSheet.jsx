import { useEffect, useMemo, useState } from "react";
import { FileText } from "lucide-react";

import Sheet from "@/components/ui/Sheet";

const INVOICE_TYPES = [
  { label: "DP", value: "dp" },
  { label: "Pelunasan", value: "pelunasan" },
];

export default function InvoiceSheet({
  open,
  project,
  existingInvoices = [],
  saving = false,
  onClose,
  onSubmit,
}) {
  const [invoiceType, setInvoiceType] = useState("dp");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const contractValue = Number(project?.contract_value || 0);

  const defaultAmount = useMemo(() => contractValue * 0.5, [contractValue]);

  useEffect(() => {
    if (!open) return;

    const existingInvoice = existingInvoices.find(
      (invoice) => invoice.invoice_type === invoiceType,
    );

    setAmount(String((existingInvoice?.amount ?? defaultAmount) || ""));
    setNotes(existingInvoice?.notes || getDefaultNote(invoiceType));
  }, [defaultAmount, existingInvoices, invoiceType, open]);

  function handleSubmit() {
    onSubmit({
      invoice_type: invoiceType,
      amount: Number(amount || 0),
      status: "draft",
      notes,
    });
  }

  return (
    <Sheet open={open} onClose={onClose} title="Buat Invoice">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2 rounded-xl bg-[#101311] p-1">
          {INVOICE_TYPES.map((type) => (
            <button
              key={type.value}
              onClick={() => setInvoiceType(type.value)}
              className={`rounded-lg py-2 text-sm ${
                invoiceType === type.value
                  ? "bg-[#4A5B45] text-white"
                  : "text-[#8B9388]"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-[#252A27] bg-[#101311] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4A5B45]/20 text-[#7C9A72]">
              <FileText size={18} />
            </div>
            <div>
              <p className="text-xs text-[#8B9388]">Nilai Kontrak</p>
              <p className="font-semibold text-white">
                {formatCurrency(contractValue)}
              </p>
            </div>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm text-[#8B9388]">
            Nominal Tagihan
          </label>
          <input
            type="number"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="Masukkan nominal invoice"
            className="w-full rounded-xl border border-[#252A27] bg-[#101311] p-3 text-white outline-none"
          />
          <p className="mt-2 text-xs text-[#8B9388]">
            Default 50%, tapi bisa kamu ubah untuk kebutuhan khusus.
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm text-[#8B9388]">Catatan</label>
          <textarea
            rows={3}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Catatan invoice"
            className="w-full rounded-xl border border-[#252A27] bg-[#101311] p-3 text-white outline-none"
          />
        </div>

        <button
          disabled={saving || Number(amount || 0) <= 0}
          onClick={handleSubmit}
          className="w-full rounded-xl bg-[#4A5B45] py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Menyiapkan..." : "Simpan & Buka PDF"}
        </button>
      </div>
    </Sheet>
  );
}

function getDefaultNote(type) {
  if (type === "pelunasan") return "Tagihan pelunasan setelah pekerjaan selesai.";

  return "Tagihan DP untuk memulai proses proyek.";
}

function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}
