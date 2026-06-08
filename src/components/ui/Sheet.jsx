import { X } from "lucide-react";

export default function Sheet({ open, onClose, title, children }) {
  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className="
          fixed inset-0 z-40
          bg-black/60
          backdrop-blur-sm
        "
      />

      {/* Sheet */}
      <div
        className="
          fixed bottom-5 left-0 right-0 z-50
          animate-in slide-in-from-bottom
          rounded-t-3xl
          border-t border-[#252A27]
          bg-[#161917]
          shadow-2xl
        "
      >
        {/* Handle */}
        <div className="flex justify-center pt-3">
          <div className="h-1.5 w-12 rounded-full bg-[#252A27]" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4">
          <h2 className="font-semibold text-white">{title}</h2>

          <button
            onClick={onClose}
            className="
              flex h-9 w-9 items-center justify-center
              rounded-full
              bg-[#101311]
            "
          >
            <X size={18} className="text-[#8B9388]" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] overflow-y-auto px-5 pb-32">
          {children}
        </div>
      </div>
    </>
  );
}
