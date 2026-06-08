import { useEffect, useState } from "react";

import Sheet from "@/components/ui/Sheet";

const DOCUMENT_TYPES = [
  { label: "Design", value: "design" },
  { label: "RAB", value: "rab" },
  { label: "Invoice", value: "invoice" },
  { label: "Kontrak", value: "contract" },
  { label: "Progress", value: "progress" },
];

export default function DocumentUploadSheet({
  open,
  saving = false,
  onClose,
  onSubmit,
}) {
  const [file, setFile] = useState(null);
  const [documentType, setDocumentType] = useState("design");
  const [notes, setNotes] = useState("");

  function resetForm() {
    setFile(null);
    setDocumentType("design");
    setNotes("");
  }

  useEffect(() => {
    if (!open) resetForm();
  }, [open]);

  return (
    <Sheet open={open} onClose={onClose} title="Upload Dokumen">
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm text-[#8B9388]">Tipe Dokumen</label>
          <select
            value={documentType}
            onChange={(event) => setDocumentType(event.target.value)}
            className="w-full rounded-xl border border-[#252A27] bg-[#101311] p-3 text-white outline-none"
          >
            {DOCUMENT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm text-[#8B9388]">File</label>
          <input
            type="file"
            onChange={(event) => setFile(event.target.files?.[0] || null)}
            className="w-full rounded-xl border border-[#252A27] bg-[#101311] p-3 text-sm text-[#8B9388]"
          />
          {file && <p className="mt-2 text-xs text-[#7C9A72]">{file.name}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm text-[#8B9388]">Catatan</label>
          <textarea
            rows={3}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Catatan dokumen"
            className="w-full rounded-xl border border-[#252A27] bg-[#101311] p-3 text-white outline-none"
          />
        </div>

        <button
          disabled={!file || saving}
          onClick={() => {
            onSubmit({
              file,
              documentType,
              notes,
            });
          }}
          className="w-full rounded-xl bg-[#4A5B45] py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Mengupload..." : "Upload Dokumen"}
        </button>
      </div>
    </Sheet>
  );
}
