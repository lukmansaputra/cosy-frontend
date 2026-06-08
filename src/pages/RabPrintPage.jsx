import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Printer } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { getProject } from "@/services/project.service";
import { getProjectItems } from "@/services/projectItem.service";
import {
  calculateRabTotals,
  getRabSettings,
  normalizeRabSettings,
} from "@/lib/rabSettings";

export default function RabPrintPage() {
  const { id: projectId } = useParams();
  const [project, setProject] = useState(null);
  const [items, setItems] = useState([]);
  const [rabSettings, setRabSettings] = useState(() =>
    normalizeRabSettings(),
  );
  const [logoFailed, setLogoFailed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadRab() {
      try {
        setLoading(true);
        setError("");

        const [projectData, itemData, settingsData] = await Promise.all([
          getProject(projectId),
          getProjectItems(projectId),
          getRabSettings(projectId),
        ]);

        if (active) {
          setProject(projectData);
          setItems(itemData || []);
          setRabSettings(settingsData);
        }
      } catch (loadError) {
        if (active) setError(loadError.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadRab();

    return () => {
      active = false;
    };
  }, [projectId]);

  useEffect(() => {
    if (!project) return;

    const projectName = sanitizeTitle(project.project_name || "Project");
    const customerName = sanitizeTitle(
      project.customer?.full_name || "Customer",
    );

    document.title = `RAB - ${projectName} ${customerName} - COSY MUSEUM`;

    return () => {
      document.title = "Cosy";
    };
  }, [project]);

  const sections = useMemo(() => groupItemsBySection(items), [items]);
  const grandTotal = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.subtotal || 0), 0),
    [items],
  );
  const rabTotals = useMemo(
    () => calculateRabTotals(grandTotal, rabSettings),
    [grandTotal, rabSettings],
  );
  const downPayment = rabTotals.finalTotal * 0.5;

  if (loading) {
    return <PrintState text="Memuat RAB..." />;
  }

  if (error || !project) {
    return <PrintState text={error || "RAB tidak ditemukan."} />;
  }

  return (
    <div className="min-h-screen bg-[#e7eadf] px-4 py-6 text-[#1f241f] print:bg-white print:p-0">
      <div className="mx-auto mb-4 flex max-w-[980px] items-center justify-between gap-3 print:hidden">
        <Link
          to={`/projects/${projectId}`}
          className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-[#4A5B45]"
        >
          <ArrowLeft size={16} />
          Kembali
        </Link>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-xl bg-[#4A5B45] px-4 py-2 text-sm font-medium text-white"
        >
          <Printer size={16} />
          Print / Save PDF
        </button>
      </div>

      <main className="rab-print-page mx-auto max-w-[980px] border-t-8 border-[#3f4f3d] bg-white p-7 shadow-xl print:min-h-screen print:max-w-none print:p-8 print:shadow-none">
        <header className="mb-7 flex items-start justify-between gap-8 border-b border-[#d9ecd0] pb-5">
          <div className="min-w-0 text-[12px] leading-5">
            <p className="mb-2 inline-flex rounded-full bg-[#eaf4e4] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#3f4f3d]">
              RAB COSY MUSEUM
            </p>
            <p>
              <span className="inline-block w-20 font-semibold">Client</span>:{" "}
              {project.customer?.full_name || "-"}
            </p>
            <p>
              <span className="inline-block w-20 font-semibold">Alamat</span>:{" "}
              {project.location || project.customer?.address || "-"}
            </p>
            <p>
              <span className="inline-block w-20 font-semibold">Proyek</span>:{" "}
              {project.project_name}
            </p>
          </div>

          <div className="text-right">
            {!logoFailed ? (
              <img
                src="/cosy-logo.png"
                alt="COSY"
                onError={() => setLogoFailed(true)}
                className="ml-auto h-12 w-auto object-contain"
              />
            ) : (
              <h1 className="text-4xl font-black tracking-[0.08em] text-[#3f4f3d]">
                COSY
              </h1>
            )}
            <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-[#6b7565]">
              Interior & Furniture
            </p>
          </div>
        </header>

        {sections.length === 0 && (
          <div className="border border-dashed border-[#9bbb86] p-8 text-center text-sm text-[#6b7565]">
            Belum ada item RAB.
          </div>
        )}

        <div className="space-y-7">
          {sections.map((section, sectionIndex) => (
            <section
              key={section.name}
              className="rab-print-section break-inside-avoid"
            >
              <h2 className="mb-2 text-[13px] font-bold uppercase tracking-[0.08em] text-[#3f4f3d]">
                {section.name}
              </h2>

              <div className="overflow-hidden border border-[#9bbb86]">
                <table className="w-full border-collapse text-[10px]">
                  <thead>
                    <tr className="bg-[#5c9d43] text-white print:bg-[#5c9d43] print:text-white">
                      <th className="w-10 border border-[#9bbb86] px-2 py-2 text-center">
                        NO
                      </th>
                      <th className="border border-[#9bbb86] px-2 py-2 text-left">
                        ITEM
                      </th>
                      <th className="w-28 border border-[#9bbb86] px-2 py-2 text-left">
                        MATERIAL
                      </th>
                      <th className="w-28 border border-[#9bbb86] px-2 py-2 text-left">
                        UKURAN
                      </th>
                      <th className="w-16 border border-[#9bbb86] px-2 py-2 text-center">
                        VOL
                      </th>
                      <th className="w-14 border border-[#9bbb86] px-2 py-2 text-center">
                        SAT
                      </th>
                      <th className="w-28 border border-[#9bbb86] px-2 py-2 text-right">
                        HARGA / SATUAN
                      </th>
                      <th className="w-28 border border-[#9bbb86] px-2 py-2 text-right">
                        TOTAL
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {section.items.map((item, index) => (
                      <tr key={item.id} className="bg-[#eaf4e4]">
                        <td className="border border-white/70 px-2 py-1.5 text-center">
                          {sectionIndex + 1}.{index + 1}
                        </td>
                        <td className="border border-white/70 px-2 py-1.5">
                          {item.item_name}
                        </td>
                        <td className="border border-white/70 px-2 py-1.5">
                          {item.material || "-"}
                        </td>
                        <td className="border border-white/70 px-2 py-1.5">
                          {item.size || "-"}
                        </td>
                        <td className="border border-white/70 px-2 py-1.5 text-center">
                          {formatNumber(item.qty)}
                        </td>
                        <td className="border border-white/70 px-2 py-1.5 text-center">
                          {item.unit || "-"}
                        </td>
                        <td className="border border-white/70 px-2 py-1.5 text-right">
                          {formatCurrency(item.unit_price)}
                        </td>
                        <td className="border border-white/70 px-2 py-1.5 text-right font-semibold">
                          {formatCurrency(item.subtotal)}
                        </td>
                      </tr>
                    ))}

                    <tr className="bg-[#94c780] font-bold">
                      <td colSpan={7} className="px-2 py-2 text-right">
                        Total
                      </td>
                      <td className="px-2 py-2 text-right">
                        {formatCurrency(section.total)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>

        <div className="rab-print-closing">
          <div className="mt-7 grid grid-cols-2 items-start gap-12">
            <div>
              {rabSettings.note?.trim() && (
                <div className="text-[10px] leading-4 text-[#5d6658]">
                  <span className="font-semibold text-[#1f241f]">Catatan:</span>{" "}
                  {rabSettings.note}
                </div>
              )}
            </div>

            <div className="w-full">
              <div
                className={`grid text-[11px] ${
                  rabTotals.discountAmount > 0 ? "grid-cols-4" : "grid-cols-3"
                }`}
              >
                <SummaryTile
                  label="Grand Total"
                  value={formatCurrency(grandTotal)}
                  strong
                />
                {rabTotals.discountAmount > 0 && (
                  <SummaryTile
                    label={`Diskon ${formatPercent(rabTotals.discountPercent)}`}
                    value={`- ${formatCurrency(rabTotals.discountAmount)}`}
                  />
                )}
                <SummaryTile
                  label="Total Akhir"
                  value={formatCurrency(rabTotals.finalTotal)}
                  strong
                />
                <SummaryTile
                  label="DP 50%"
                  value={formatCurrency(downPayment)}
                />
              </div>
            </div>
          </div>

          <footer className="mt-10 flex justify-end text-[11px]">
            <div className="w-56 text-center">
              <p>Pimpinan</p>
              <div className="mx-auto my-8 flex h-16 w-40 items-center justify-center">
                <img
                  src="/ttd-pimpinan.png"
                  alt="Tanda tangan pimpinan"
                  className="max-h-16 max-w-40 object-contain"
                />
              </div>
              <p className="font-semibold uppercase">Ardi Ardiansyah, S.Ikom.</p>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}

function PrintState({ text }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0F1110] p-4 text-sm text-[#8B9388]">
      {text}
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

function formatNumber(value) {
  return new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 3,
  }).format(Number(value || 0));
}

function sanitizeTitle(value) {
  return String(value)
    .replace(/[\\/:*?"<>|]/g, "")
    .trim();
}

function formatPercent(value) {
  return `${Number(value || 0).toLocaleString("id-ID", {
    maximumFractionDigits: 2,
  })}%`;
}

function SummaryTile({ label, value, strong = false }) {
  return (
    <div
      className={`border border-white px-2 py-2 ${
        strong ? "bg-[#5c9d43] font-bold text-white" : "bg-[#d9ecd0]"
      }`}
    >
      <div>{label}</div>
      <div className="mt-1 text-right font-semibold">{value}</div>
    </div>
  );
}
