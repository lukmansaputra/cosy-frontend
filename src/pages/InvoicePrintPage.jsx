import { useEffect, useState } from "react";
import { ArrowLeft, Printer } from "lucide-react";
import { Link, useParams, useSearchParams } from "react-router-dom";

import { getProject } from "@/services/project.service";
import {
  getProjectInvoices,
  saveProjectInvoice,
} from "@/services/invoice.service";

const BANK_ACCOUNT = {
  bank: "BCA",
  number: "095 393 8780",
  name: "Ardi Ardiansyah",
};

export default function InvoicePrintPage() {
  const { id: projectId } = useParams();
  const [searchParams] = useSearchParams();
  const invoiceType = searchParams.get("type") === "pelunasan" ? "pelunasan" : "dp";
  const [project, setProject] = useState(null);
  const [invoice, setInvoice] = useState(null);
  const [logoFailed, setLogoFailed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadInvoice() {
      try {
        setLoading(true);
        setError("");

        const projectData = await getProject(projectId);
        const contractValue = Number(projectData?.contract_value || 0);
        const invoiceAmount = contractValue * 0.5;
        const invoices = await getProjectInvoices(projectId);
        const existingInvoice = invoices?.find(
          (item) => item.invoice_type === invoiceType,
        );
        const invoiceData =
          existingInvoice ||
          (await saveProjectInvoice(projectId, {
            invoice_type: invoiceType,
            amount: invoiceAmount,
            status: "draft",
            notes:
              invoiceType === "pelunasan"
                ? "Tagihan pelunasan setelah DP diterima."
                : "Tagihan DP untuk memulai proses proyek.",
          }));

        if (active) {
          setProject(projectData);
          setInvoice(invoiceData);
        }
      } catch (loadError) {
        if (active) setError(loadError.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadInvoice();

    return () => {
      active = false;
    };
  }, [invoiceType, projectId]);

  useEffect(() => {
    if (!project) return;

    const projectName = sanitizeTitle(project.project_name || "Project");
    const customerName = sanitizeTitle(project.customer?.full_name || "Customer");

    const invoiceName = invoiceType === "pelunasan" ? "Pelunasan" : "DP";

    document.title = `Invoice ${invoiceName} - ${projectName} ${customerName} - COSY MUSEUM`;

    return () => {
      document.title = "Cosy";
    };
  }, [invoiceType, project]);

  const contractValue = Number(project?.contract_value || 0);
  const dpAmount = contractValue * 0.5;
  const invoiceAmount = Number(invoice?.amount ?? dpAmount);
  const remainingAmount =
    invoiceType === "dp" ? Math.max(contractValue - invoiceAmount, 0) : 0;
  const title = invoiceType === "pelunasan" ? "Tagihan Pelunasan" : "Tagihan DP";
  const invoiceLabel =
    invoiceType === "pelunasan" ? "Tagihan Pelunasan" : "Tagihan DP";

  if (loading) return <PrintState text="Memuat invoice..." />;
  if (error || !project) {
    return <PrintState text={error || "Invoice tidak ditemukan."} />;
  }

  return (
    <div className="min-h-screen bg-[#e7eadf] px-4 py-6 text-[#1f241f] print:bg-white print:p-0">
      <div className="mx-auto mb-4 flex max-w-[820px] items-center justify-between gap-3 print:hidden">
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

      <main className="mx-auto max-w-[820px] bg-white p-8 shadow-xl print:min-h-screen print:max-w-none print:p-8 print:shadow-none">
        <header className="mb-10 flex items-start justify-between gap-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6b7565]">
              Invoice
            </p>
            <h1 className="mt-2 text-3xl font-bold text-[#1f241f]">
              {title}
            </h1>
            <p className="mt-2 text-sm text-[#6b7565]">
              {new Intl.DateTimeFormat("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }).format(new Date())}
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
              <h2 className="text-4xl font-black tracking-[0.08em] text-[#3f4f3d]">
                COSY
              </h2>
            )}
            <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-[#6b7565]">
              Interior & Furniture
            </p>
          </div>
        </header>

        <section className="mb-8 grid grid-cols-2 gap-8 text-sm">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#6b7565]">
              Ditagihkan Kepada
            </p>
            <p className="font-semibold">{project.customer?.full_name || "-"}</p>
            <p className="mt-1 text-[#6b7565]">
              {project.customer?.address || project.location || "-"}
            </p>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#6b7565]">
              Proyek
            </p>
            <p className="font-semibold">{project.project_name}</p>
            <p className="mt-1 text-[#6b7565]">{project.location || "-"}</p>
          </div>
        </section>

        <section className="overflow-hidden border border-[#9bbb86]">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[#5c9d43] text-white">
                <th className="px-4 py-3 text-left">Deskripsi</th>
                <th className="px-4 py-3 text-right">Nominal</th>
              </tr>
            </thead>
            <tbody>
              <InvoiceRow label="Nilai Kontrak" value={contractValue} />
              <InvoiceRow label={invoiceLabel} value={invoiceAmount} strong />
              {invoiceType === "dp" && (
                <InvoiceRow label="Sisa Tagihan" value={remainingAmount} />
              )}
              <InvoiceRow label="Total Tagihan" value={invoiceAmount} strong />
            </tbody>
          </table>
        </section>

        <section className="mt-8 grid grid-cols-2 gap-8">
          <div className="rounded-xl border border-[#9bbb86] bg-[#edf6e9] p-4 text-sm">
            <p className="mb-3 font-semibold text-[#3f4f3d]">
              Rekening Pembayaran
            </p>
            <p>{BANK_ACCOUNT.bank}</p>
            <p className="text-xl font-bold tracking-wide">
              {BANK_ACCOUNT.number}
            </p>
            <p>a.n. {BANK_ACCOUNT.name}</p>
          </div>

          <div className="text-sm text-[#6b7565]">
            <p className="font-semibold text-[#1f241f]">Catatan</p>
            <p className="mt-2">
              {invoice?.notes ||
                "Mohon melakukan konfirmasi setelah pembayaran dilakukan agar proyek dapat diproses ke tahap berikutnya."}
            </p>
          </div>
        </section>

        <footer className="mt-14 flex justify-end text-[11px]">
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
      </main>
    </div>
  );
}

function InvoiceRow({ label, value, strong = false }) {
  return (
    <tr className={strong ? "bg-[#d9ecd0] font-bold" : "bg-[#f5faf2]"}>
      <td className="border border-white px-4 py-3">{label}</td>
      <td className="border border-white px-4 py-3 text-right">
        {formatCurrency(value)}
      </td>
    </tr>
  );
}

function PrintState({ text }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0F1110] p-4 text-sm text-[#8B9388]">
      {text}
    </div>
  );
}

function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function sanitizeTitle(value) {
  return String(value).replace(/[\\/:*?"<>|]/g, "").trim();
}
