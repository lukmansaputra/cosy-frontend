import { useState } from "react";
import Sheet from "@/components/ui/Sheet";

export default function ExpenseSheet({ open, onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("material");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [receipt, setReceipt] = useState(null);

  return (
    <Sheet open={open} onClose={onClose} title="Tambah Pengeluaran">
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm text-[#8B9388]">
            Nama Pengeluaran
          </label>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Triplek 18mm"
            className="
              w-full rounded-xl
              border border-[#252A27]
              bg-[#101311]
              p-3
              text-white
            "
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-[#8B9388]">Kategori</label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="
              w-full rounded-xl
              border border-[#252A27]
              bg-[#101311]
              p-3
              text-white
            "
          >
            <option value="material">Material</option>
            <option value="upah">Upah</option>
            <option value="transport">Transport</option>
            <option value="operasional">Operasional</option>
            <option value="lainnya">Lainnya</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm text-[#8B9388]">Jumlah</label>

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="450000"
            className="
              w-full rounded-xl
              border border-[#252A27]
              bg-[#101311]
              p-3
              text-white
            "
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-[#8B9388]">Tanggal</label>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="
              w-full rounded-xl
              border border-[#252A27]
              bg-[#101311]
              p-3
              text-white
            "
          />
        </div>
        <div>
          <label className="mb-2 block text-sm text-[#8B9388]">
            Struk Pembelian
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setReceipt(e.target.files?.[0] || null)}
            className="
      w-full rounded-xl
      border border-[#252A27]
      bg-[#101311]
      p-3
      text-sm
      text-[#8B9388]
    "
          />

          {receipt && (
            <p className="mt-2 text-xs text-[#7C9A72]">{receipt.name}</p>
          )}
        </div>
        <button
          onClick={() => {
            onSubmit({
              name,
              category,
              amount: Number(amount),
              date,
            });

            onClose();
          }}
          className="
            w-full rounded-xl
            bg-[#4A5B45]
            py-3
            font-medium
            text-white
          "
        >
          Simpan Pengeluaran
        </button>
      </div>
    </Sheet>
  );
}
