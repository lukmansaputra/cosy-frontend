import { AlertTriangle } from "lucide-react";

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmText = "Hapus",
  cancelText = "Batal",
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-2xl border border-[#252A27] bg-[#161917] p-5 shadow-2xl">
          <div className="mb-4 flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
              <AlertTriangle size={20} />
            </div>

            <div className="min-w-0">
              <h2 className="font-semibold text-white">{title}</h2>
              <p className="mt-1 text-sm leading-6 text-[#8B9388]">
                {description}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onCancel}
              className="rounded-xl border border-[#252A27] bg-[#101311] py-3 text-sm font-medium text-[#F5F5F2]"
            >
              {cancelText}
            </button>

            <button
              onClick={onConfirm}
              className="rounded-xl bg-red-500/90 py-3 text-sm font-medium text-white"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
