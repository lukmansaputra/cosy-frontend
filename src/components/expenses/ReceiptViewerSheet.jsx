import Sheet from "@/components/ui/Sheet";

export default function ReceiptViewerSheet({ open, receipt, onClose }) {
  if (!receipt) return null;

  return (
    <Sheet open={open} onClose={onClose} title="Struk Pembelian">
      <div className="space-y-4">
        <div className="rounded-2xl bg-[#101311] p-4">
          <p className="font-medium text-white">{receipt.name}</p>

          <p className="mt-1 text-sm text-[#8B9388]">{receipt.date}</p>
        </div>

        {receipt.receipt instanceof File ? (
          <img
            src={URL.createObjectURL(receipt.receipt)}
            alt="Struk"
            className="
              w-full
              rounded-2xl
              border border-[#252A27]
            "
          />
        ) : (
          <div
            className="
              rounded-2xl
              border border-[#252A27]
              p-8
              text-center
              text-[#8B9388]
            "
          >
            Tidak ada struk
          </div>
        )}
      </div>
    </Sheet>
  );
}
