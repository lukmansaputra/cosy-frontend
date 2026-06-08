import { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, X, XCircle } from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((toast) => {
    const id = crypto.randomUUID();
    const nextToast = {
      id,
      type: toast.type || "success",
      title: toast.title,
      message: toast.message,
    };

    setToasts((items) => [nextToast, ...items].slice(0, 3));
    window.setTimeout(() => {
      setToasts((items) => items.filter((item) => item.id !== id));
    }, 3600);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((items) => items.filter((item) => item.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed right-4 top-4 z-[80] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3">
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
}

function ToastCard({ toast, onClose }) {
  const isError = toast.type === "error";
  const Icon = isError ? XCircle : CheckCircle2;

  return (
    <div
      className={`rounded-2xl border p-4 shadow-2xl backdrop-blur ${
        isError
          ? "border-red-500/30 bg-red-950/90 text-red-100"
          : "border-[#7C9A72]/30 bg-[#172015]/95 text-white"
      }`}
    >
      <div className="flex items-start gap-3">
        <Icon
          size={19}
          className={isError ? "mt-0.5 text-red-300" : "mt-0.5 text-[#9fbd91]"}
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">{toast.title}</p>
          {toast.message && (
            <p className="mt-1 text-xs leading-relaxed opacity-80">
              {toast.message}
            </p>
          )}
        </div>
        <button
          onClick={() => onClose(toast.id)}
          className="rounded-lg p-1 opacity-70 transition hover:bg-white/10 hover:opacity-100"
          aria-label="Tutup notifikasi"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
