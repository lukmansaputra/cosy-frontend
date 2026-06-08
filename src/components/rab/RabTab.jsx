import { ChevronDown, FileText, Pencil, Plus, Settings, Trash2 } from "lucide-react";
import { useState } from "react";

export default function RabTab({
  projectId,
  items,
  grandTotal,
  settings,
  totals,
  onSettingsChange,
  onAddItem,
  onEditItem,
  onApprove,
  onDeleteItem,
  approving = false,
  deletingItemId = "",
}) {
  const sections = groupItemsBySection(items);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-[#252A27] bg-[#161917] p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm text-[#8B9388]">Grand Total RAB</p>
            <h2 className="mt-1 break-words text-2xl font-semibold text-white">
              {formatCurrency(grandTotal)}
            </h2>
          </div>

          <button
            onClick={onAddItem}
            className="flex shrink-0 items-center gap-2 rounded-xl bg-[#4A5B45] px-3 py-2 text-sm font-medium text-white"
          >
            <Plus size={16} />
            Item
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            onClick={() => setSettingsOpen((value) => !value)}
            className="flex items-center justify-center gap-2 rounded-xl border border-[#252A27] bg-[#101311] py-3 text-sm text-white"
          >
            <Settings size={16} />
            Pengaturan
            <ChevronDown
              size={15}
              className={`transition ${settingsOpen ? "rotate-180" : ""}`}
            />
          </button>

          <a
            href={`/projects/${projectId}/rab/print`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl border border-[#252A27] bg-[#101311] py-3 text-sm text-white"
          >
            <FileText size={16} />
            Print
          </a>
        </div>

        {settingsOpen && (
          <div className="mt-4 space-y-4 rounded-2xl border border-[#252A27] bg-[#101311] p-4">
            <div>
              <label className="mb-2 block text-sm text-[#8B9388]">
                Catatan RAB
              </label>
              <textarea
                rows={3}
                value={settings.note}
                onChange={(event) =>
                  onSettingsChange({ ...settings, note: event.target.value })
                }
                placeholder="Masukkan catatan RAB jika diperlukan"
                className="w-full rounded-xl border border-[#252A27] bg-[#161917] p-3 text-white outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 rounded-xl bg-[#161917] p-1">
              <button
                onClick={() =>
                  onSettingsChange({ ...settings, discountMode: "percent" })
                }
                className={`rounded-lg py-2 text-sm ${
                  settings.discountMode === "percent"
                    ? "bg-[#4A5B45] text-white"
                    : "text-[#8B9388]"
                }`}
              >
                Diskon %
              </button>

              <button
                onClick={() =>
                  onSettingsChange({ ...settings, discountMode: "static" })
                }
                className={`rounded-lg py-2 text-sm ${
                  settings.discountMode === "static"
                    ? "bg-[#4A5B45] text-white"
                    : "text-[#8B9388]"
                }`}
              >
                Total Akhir
              </button>
            </div>

            {settings.discountMode === "percent" ? (
              <div>
                <label className="mb-2 block text-sm text-[#8B9388]">
                  Diskon Persentase
                </label>
                <input
                  type="number"
                  value={settings.discountPercent}
                  onChange={(event) =>
                    onSettingsChange({
                      ...settings,
                      discountMode: "percent",
                      discountPercent: event.target.value,
                    })
                  }
                  placeholder="0"
                  className="w-full rounded-xl border border-[#252A27] bg-[#161917] p-3 text-white outline-none"
                />
              </div>
            ) : (
              <div>
                <label className="mb-2 block text-sm text-[#8B9388]">
                  Total Setelah Diskon
                </label>
                <input
                  type="number"
                  value={settings.discountFinalTotal}
                  onChange={(event) =>
                    onSettingsChange({
                      ...settings,
                      discountMode: "static",
                      discountFinalTotal: event.target.value,
                    })
                  }
                  placeholder="17500000"
                  className="w-full rounded-xl border border-[#252A27] bg-[#161917] p-3 text-white outline-none"
                />
                <p className="mt-2 text-xs text-[#8B9388]">
                  Setara diskon {formatPercent(totals.discountPercent)}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 text-sm">
              <SummaryPill label="Diskon" value={formatCurrency(totals.discountAmount)} />
              <SummaryPill label="Total Akhir" value={formatCurrency(totals.finalTotal)} />
            </div>
          </div>
        )}

        <button
          disabled={items.length === 0 || approving}
          onClick={onApprove}
          className="mt-3 w-full rounded-xl bg-[#7C9A72] py-3 text-sm font-medium text-[#101311] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {approving
            ? "Menyetujui RAB..."
            : "Setujui RAB & Pakai Sebagai Nilai Kontrak"}
        </button>
      </div>

      {items.length === 0 && (
        <div className="rounded-2xl border border-[#252A27] bg-[#161917] p-4 text-sm text-[#8B9388]">
          Belum ada item RAB.
        </div>
      )}

      {sections.map((section) => (
        <div
          key={section.name}
          className="overflow-hidden rounded-2xl border border-[#252A27] bg-[#161917]"
        >
          <div className="flex items-center justify-between gap-3 border-b border-[#252A27] bg-[#4A5B45]/20 p-4">
            <h3 className="font-semibold text-white">{section.name}</h3>
            <span className="shrink-0 text-sm font-medium text-[#7C9A72]">
              {formatCurrency(section.total)}
            </span>
          </div>

          <div className="divide-y divide-[#252A27]">
            {section.items.map((item) => (
              <div key={item.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h4 className="font-medium text-white">{item.item_name}</h4>
                    <p className="mt-1 text-xs text-[#8B9388]">
                      {item.material || "-"}
                      {item.size ? ` - ${item.size}` : ""} - {item.qty}{" "}
                      {item.unit || "-"} x{" "}
                      {formatCurrency(item.unit_price)}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-start gap-2">
                    <span className="text-sm font-medium text-[#7C9A72]">
                      {formatCurrency(item.subtotal)}
                    </span>
                    <button
                      onClick={() => onEditItem(item)}
                      className="rounded-lg bg-[#101311] p-2 text-[#8B9388]"
                    >
                      <Pencil size={15} />
                    </button>

                    <button
                      disabled={deletingItemId === item.id}
                      onClick={() => onDeleteItem(item.id)}
                      className="rounded-lg bg-red-500/10 p-2 text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function groupItemsBySection(items) {
  const groups = new Map();

  for (const item of items) {
    const sectionName = item.section_name || "RAB";
    const section = groups.get(sectionName) || {
      name: sectionName,
      items: [],
      total: 0,
    };

    section.items.push(item);
    section.total += Number(item.subtotal || 0);
    groups.set(sectionName, section);
  }

  return Array.from(groups.values());
}

function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function formatPercent(value) {
  return `${Number(value || 0).toLocaleString("id-ID", {
    maximumFractionDigits: 2,
  })}%`;
}

function SummaryPill({ label, value }) {
  return (
    <div className="rounded-xl bg-[#161917] p-3">
      <p className="text-xs text-[#8B9388]">{label}</p>
      <p className="mt-1 break-words font-medium text-white">{value}</p>
    </div>
  );
}
