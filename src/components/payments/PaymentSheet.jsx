import { useState } from "react";
import Sheet from "@/components/ui/Sheet";

export default function PaymentSheet({ open, onClose, onSubmit }) {
  const [type, setType] = useState("DP");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [method, setMethod] = useState("");
  const [note, setNote] = useState("");

  return (
    <Sheet open={open} onClose={onClose} title="Tambah Pembayaran">
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm text-[#8B9388]">
            Jenis Pembayaran
          </label>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="
              w-full rounded-xl
              border border-[#252A27]
              bg-[#101311]
              p-3
              text-white
            "
          >
            <option>DP</option>
            <option>Pelunasan</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm text-[#8B9388]">Jumlah</label>

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="4000000"
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
            Metode Pembayaran
          </label>

          <input
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            placeholder="Transfer BCA"
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
          <label className="mb-2 block text-sm text-[#8B9388]">Catatan</label>

          <textarea
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Transfer BCA"
            className="
              w-full rounded-xl
              border border-[#252A27]
              bg-[#101311]
              p-3
              text-white
            "
          />
        </div>

        <button
          onClick={() => {
            onSubmit({
              title: type,
              amount: Number(amount),
              date,
              method,
              note,
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
          Simpan Pembayaran
        </button>
      </div>
    </Sheet>
  );
}
