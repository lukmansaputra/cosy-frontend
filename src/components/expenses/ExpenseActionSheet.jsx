import { Eye, Pencil, Trash2 } from "lucide-react";

import Sheet from "@/components/ui/Sheet";

export default function ExpenseActionSheet({
  open,
  onClose,
  expense,
  onViewReceipt,
  onEdit,
  onDelete,
}) {
  if (!expense) return null;

  return (
    <Sheet open={open} onClose={onClose} title="Aksi Pengeluaran">
      <div className="space-y-3">
        <div className="rounded-2xl bg-[#101311] p-4">
          <p className="text-white">{expense.name}</p>

          <p className="mt-1 text-sm text-[#8B9388]">{expense.date}</p>

          <p className="mt-3 text-red-400">{expense.amount}</p>
        </div>

        <button
          onClick={() => {
            onViewReceipt(expense);
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
          <Eye size={18} />
          Lihat Struk
        </button>

        <button
          onClick={() => {
            onEdit(expense);
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
          Edit Pengeluaran
        </button>

        <button
          onClick={() => {
            onDelete(expense.id);
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
          Hapus Pengeluaran
        </button>
      </div>
    </Sheet>
  );
}
