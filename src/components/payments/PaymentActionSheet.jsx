import { Pencil, Trash2 } from "lucide-react";

import Sheet from "@/components/ui/Sheet";

export default function PaymentActionSheet({
  open,
  onClose,
  payment,
  onEdit,
  onDelete,
}) {
  if (!payment) return null;

  return (
    <Sheet open={open} onClose={onClose} title="Aksi Pembayaran">
      <div className="space-y-3">
        <div className="rounded-2xl bg-[#101311] p-4">
          <p className="text-white">{payment.title}</p>

          <p className="mt-1 text-sm text-[#8B9388]">{payment.date}</p>

          <p className="mt-3 text-[#7C9A72]">{payment.amount}</p>
        </div>

        <button
          onClick={() => {
            onEdit(payment);
            onClose();
          }}
          className="
            flex w-full items-center gap-3
            rounded-2xl
            bg-[#101311]
            p-4
            text-white
          "
        >
          <Pencil size={18} />
          Edit Pembayaran
        </button>

        <button
          onClick={() => {
            onDelete(payment.id);
            onClose();
          }}
          className="
            flex w-full items-center gap-3
            rounded-2xl
            bg-red-500/10
            p-4
            text-red-400
          "
        >
          <Trash2 size={18} />
          Hapus Pembayaran
        </button>
      </div>
    </Sheet>
  );
}
