import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  User,
  Wallet,
  FileText,
  Briefcase,
  Calendar,
  FolderOpen,
  Download,
  Image,
  MoreVertical,
  Trash2,
  Pencil,
} from "lucide-react";
import { useParams, Link, useNavigate } from "react-router-dom";

import PaymentSheet from "@/components/payments/PaymentSheet";
import ExpenseSheet from "@/components/expenses/ExpenseSheet";
import PaymentActionSheet from "@/components/payments/PaymentActionSheet";
import ExpenseActionSheet from "@/components/expenses/ExpenseActionSheet";
import ReceiptViewerSheet from "@/components/expenses/ReceiptViewerSheet";
import DocumentUploadSheet from "@/components/documents/DocumentUploadSheet";
import InvoiceSheet from "@/components/documents/InvoiceSheet";
import ProjectEditSheet from "@/components/projects/ProjectEditSheet";
import RabItemSheet from "@/components/rab/RabItemSheet";
import RabTab from "@/components/rab/RabTab";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useToast } from "@/hooks/useToast";
import { useProjectDetail } from "@/hooks/useProjectDetail";
import {
  deleteProject,
  updateProject,
  updateProjectStatus,
} from "@/services/project.service";
import { createPayment, deletePayment } from "@/services/payment.service";
import { createExpense, deleteExpense } from "@/services/expenses.service";
import {
  createProjectItem,
  deleteProjectItem,
  getProjectItems,
  updateProjectItem,
} from "@/services/projectItem.service";
import {
  deleteProjectDocument,
  uploadProjectDocument,
} from "@/services/documents.service";
import {
  getProjectInvoices,
  saveProjectInvoice,
} from "@/services/invoice.service";
import {
  calculateRabTotals,
  getRabSettings,
  normalizeRabSettings,
  updateRabSettings,
} from "@/lib/rabSettings";

const STATUS_OPTIONS = [
  { label: "Survey", value: "survey" },
  { label: "Quotation", value: "quotation" },
  { label: "Menunggu DP", value: "waiting_dp" },
  { label: "Produksi", value: "production" },
  { label: "Instalasi", value: "installation" },
  { label: "Selesai", value: "completed" },
  { label: "Batal", value: "cancelled" },
];

const PROGRESS_MAP = {
  survey: 10,
  quotation: 40,
  waiting_dp: 45,
  production: 60,
  installation: 90,
  completed: 100,
  cancelled: 0,
};
const EMPTY_ARRAY = [];

export default function ProjectDetailPage() {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { loading, project, payments, expenses, documents, error, refresh } =
    useProjectDetail(projectId);
  const [statusDraft, setStatusDraft] = useState({ projectId: null, status: "" });
  const [tab, setTab] = useState("overview");

  const status =
    statusDraft.projectId === projectId && statusDraft.status
      ? statusDraft.status
      : project?.status || "survey";
  const progress = PROGRESS_MAP[status] || 0;
  const [paymentSheetOpen, setPaymentSheetOpen] = useState(false);
  const [expenseSheetOpen, setExpenseSheetOpen] = useState(false);
  const [rabItemSheetOpen, setRabItemSheetOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [actionError, setActionError] = useState("");
  const [selectedRabItem, setSelectedRabItem] = useState(null);

  const [paymentActionOpen, setPaymentActionOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  const [expenseActionOpen, setExpenseActionOpen] = useState(false);

  const [receiptViewerOpen, setReceiptViewerOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteDocumentDialogOpen, setDeleteDocumentDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documentSheetOpen, setDocumentSheetOpen] = useState(false);
  const [invoiceSheetOpen, setInvoiceSheetOpen] = useState(false);
  const [projectEditOpen, setProjectEditOpen] = useState(false);
  const [documentFilter, setDocumentFilter] = useState("Semua");
  const [actionLoading, setActionLoading] = useState("");

  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const rabItemsQuery = useQuery({
    queryKey: ["project-rab-items", projectId],
    queryFn: () => getProjectItems(projectId),
    enabled: Boolean(projectId),
  });
  const rabSettingsQuery = useQuery({
    queryKey: ["project-rab-settings", projectId],
    queryFn: () => getRabSettings(projectId),
    enabled: Boolean(projectId),
  });
  const invoicesQuery = useQuery({
    queryKey: ["project-invoices", projectId],
    queryFn: () => getProjectInvoices(projectId),
    enabled: Boolean(projectId),
  });
  const rabItems = rabItemsQuery.data || EMPTY_ARRAY;
  const rabSettings = rabSettingsQuery.data || normalizeRabSettings();
  const invoices = invoicesQuery.data || EMPTY_ARRAY;

  const totalIncome = useMemo(
    () => payments.reduce((sum, item) => sum + Number(item.amount || 0), 0),
    [payments],
  );

  const totalExpense = useMemo(
    () => expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0),
    [expenses],
  );

  const rabGrandTotal = useMemo(
    () => rabItems.reduce((sum, item) => sum + Number(item.subtotal || 0), 0),
    [rabItems],
  );
  const rabTotals = useMemo(
    () => calculateRabTotals(rabGrandTotal, rabSettings),
    [rabGrandTotal, rabSettings],
  );
  const savedContractValue =
    project?.original_contract_value == null
      ? Number(project?.contract_value || 0)
      : Number(project.original_contract_value || 0);
  const projectValue =
    savedContractValue > 0 ? savedContractValue : Number(rabTotals.finalTotal || 0);
  const profit = totalIncome - totalExpense;
  const outstanding = projectValue - totalIncome;

  async function refreshProjectData() {
    await refresh();
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["projects"] }),
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] }),
      queryClient.invalidateQueries({ queryKey: ["payments"] }),
      queryClient.invalidateQueries({ queryKey: ["expenses"] }),
    ]);
  }

  async function handleRabSettingsChange(nextSettings) {
    queryClient.setQueryData(["project-rab-settings", projectId], nextSettings);

    try {
      await updateRabSettings(projectId, nextSettings);
    } catch (error) {
      setActionError(error.message);
      rabSettingsQuery.refetch();
    }
  }

  async function loadRabItems() {
    await rabItemsQuery.refetch();
  }

  async function loadInvoices() {
    await invoicesQuery.refetch();
  }

  async function handleStatusChange(nextStatus) {
    try {
      setStatusDraft({ projectId, status: nextStatus });
      setActionError("");
      setActionLoading("status");
      await updateProjectStatus(projectId, nextStatus);
      await refreshProjectData();
      showToast({
        title: "Status proyek diperbarui",
        message: `Status sekarang ${getStatusLabel(nextStatus)}.`,
      });
    } catch (error) {
      setActionError(error.message);
      showToast({
        type: "error",
        title: "Status gagal diperbarui",
        message: error.message,
      });
      setStatusDraft({ projectId, status: "" });
    } finally {
      setActionLoading("");
    }
  }

  async function handleCreatePayment(payment) {
    try {
      setActionError("");
      await createPayment(projectId, {
        payment_date: payment.date,
        payment_type: payment.title.toLowerCase() === "pelunasan" ? "pelunasan" : "dp",
        amount: payment.amount,
        payment_method: payment.method || null,
        notes: payment.note,
      });
      await refreshProjectData();
      showToast({ title: "Pembayaran tersimpan" });
    } catch (error) {
      setActionError(error.message);
      showToast({
        type: "error",
        title: "Pembayaran gagal disimpan",
        message: error.message,
      });
    }
  }

  async function handleCreateExpense(expense) {
    try {
      setActionError("");
      await createExpense(projectId, {
        expense_date: expense.date,
        category: expense.category,
        amount: expense.amount,
        description: expense.name,
      });
      await refreshProjectData();
      showToast({ title: "Pengeluaran tersimpan" });
    } catch (error) {
      setActionError(error.message);
      showToast({
        type: "error",
        title: "Pengeluaran gagal disimpan",
        message: error.message,
      });
    }
  }

  async function handleDeletePayment(id) {
    try {
      setActionError("");
      setActionLoading(`payment-${id}`);
      await deletePayment(id);
      await refreshProjectData();
      showToast({ title: "Pembayaran dihapus" });
    } catch (error) {
      setActionError(error.message);
      showToast({
        type: "error",
        title: "Pembayaran gagal dihapus",
        message: error.message,
      });
    } finally {
      setActionLoading("");
    }
  }

  async function handleDeleteExpense(id) {
    try {
      setActionError("");
      setActionLoading(`expense-${id}`);
      await deleteExpense(id);
      await refreshProjectData();
      showToast({ title: "Pengeluaran dihapus" });
    } catch (error) {
      setActionError(error.message);
      showToast({
        type: "error",
        title: "Pengeluaran gagal dihapus",
        message: error.message,
      });
    } finally {
      setActionLoading("");
    }
  }

  async function handleDeleteProject() {
    try {
      setActionError("");
      setActionLoading("delete-project");
      await deleteProject(projectId);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["projects"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] }),
      ]);
      showToast({ title: "Proyek dihapus" });
      navigate("/projects");
    } catch (error) {
      setActionError(error.message);
      showToast({
        type: "error",
        title: "Proyek gagal dihapus",
        message: error.message,
      });
    } finally {
      setActionLoading("");
    }
  }

  async function handleCreateRabItem(payload) {
    try {
      setActionError("");
      setActionLoading("rab-item");

      if (selectedRabItem) {
        await updateProjectItem(selectedRabItem.id, payload);
        setSelectedRabItem(null);
        showToast({ title: "Item RAB diperbarui" });
      } else {
        await createProjectItem(projectId, payload);
        showToast({ title: "Item RAB ditambahkan" });
      }

      await loadRabItems();
      setRabItemSheetOpen(false);
    } catch (error) {
      setActionError(error.message);
      showToast({
        type: "error",
        title: "Item RAB gagal disimpan",
        message: error.message,
      });
    } finally {
      setActionLoading("");
    }
  }

  async function handleDeleteRabItem(itemId) {
    try {
      setActionError("");
      setActionLoading(`rab-delete-${itemId}`);
      await deleteProjectItem(itemId);
      await loadRabItems();
      showToast({ title: "Item RAB dihapus" });
    } catch (error) {
      setActionError(error.message);
      showToast({
        type: "error",
        title: "Item RAB gagal dihapus",
        message: error.message,
      });
    } finally {
      setActionLoading("");
    }
  }

  async function handleApproveRab() {
    try {
      setActionError("");
      setActionLoading("approve-rab");
      const shouldMoveToWaitingDp = ["survey", "quotation"].includes(
        project?.status,
      );

      await updateProject(projectId, {
        contract_value: rabTotals.finalTotal,
        ...(shouldMoveToWaitingDp ? { status: "waiting_dp" } : {}),
      });
      if (shouldMoveToWaitingDp) {
        setStatusDraft({ projectId, status: "waiting_dp" });
      }
      await refreshProjectData();
      showToast({
        title: "RAB disetujui",
        message: "Nilai kontrak sudah mengikuti total akhir RAB.",
      });
    } catch (error) {
      setActionError(error.message);
      showToast({
        type: "error",
        title: "RAB gagal disetujui",
        message: error.message,
      });
    } finally {
      setActionLoading("");
    }
  }

  async function handleUploadDocument(payload) {
    try {
      setActionError("");
      setActionLoading("upload-document");
      await uploadProjectDocument(projectId, {
        file: payload.file,
        documentType: payload.documentType,
        notes: payload.notes,
      });
      await refreshProjectData();
      setDocumentSheetOpen(false);
      showToast({ title: "Dokumen berhasil diupload" });
    } catch (error) {
      setActionError(error.message);
      showToast({
        type: "error",
        title: "Upload dokumen gagal",
        message: error.message,
      });
    } finally {
      setActionLoading("");
    }
  }

  async function handleUpdateProject(payload) {
    try {
      setActionError("");
      setActionLoading("edit-project");
      await updateProject(projectId, {
        ...payload,
        start_date: payload.start_date || null,
        target_finish_date: payload.target_finish_date || null,
      });
      setStatusDraft({ projectId, status: payload.status });
      await refreshProjectData();
      setProjectEditOpen(false);
      showToast({ title: "Data proyek diperbarui" });
    } catch (error) {
      setActionError(error.message);
      showToast({
        type: "error",
        title: "Data proyek gagal diperbarui",
        message: error.message,
      });
    } finally {
      setActionLoading("");
    }
  }

  async function handleDeleteDocument() {
    if (!selectedDocument) return;

    try {
      setActionError("");
      setActionLoading("delete-document");
      await deleteProjectDocument(selectedDocument.id);
      await refreshProjectData();
      setSelectedDocument(null);
      setDeleteDocumentDialogOpen(false);
      showToast({ title: "Dokumen dihapus" });
    } catch (error) {
      setActionError(error.message);
      showToast({
        type: "error",
        title: "Dokumen gagal dihapus",
        message: error.message,
      });
    } finally {
      setActionLoading("");
    }
  }

  async function handleSaveInvoice(payload) {
    try {
      setActionError("");
      setActionLoading("invoice");
      await saveProjectInvoice(projectId, payload);
      await loadInvoices();
      setInvoiceSheetOpen(false);
      showToast({
        title: "Invoice disiapkan",
        message: "PDF invoice akan dibuka di tab baru.",
      });
      window.open(
        `/projects/${projectId}/invoice/print?type=${payload.invoice_type}`,
        "_blank",
        "noreferrer",
      );
    } catch (error) {
      setActionError(error.message);
      showToast({
        type: "error",
        title: "Invoice gagal disiapkan",
        message: error.message,
      });
    } finally {
      setActionLoading("");
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-[#252A27] bg-[#161917] p-4 text-sm text-[#8B9388]">
        Memuat detail proyek...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="space-y-4">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-sm text-[#8B9388]"
        >
          <ArrowLeft size={16} />
          Kembali
        </Link>
        <div className="rounded-2xl border border-[#252A27] bg-[#161917] p-4 text-sm text-[#8B9388]">
          Proyek tidak ditemukan.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Hapus proyek?"
        description="Proyek ini akan dihapus dari daftar. Pastikan data RAB, pembayaran, dan dokumen terkait sudah tidak diperlukan."
        confirmText={
          actionLoading === "delete-project" ? "Menghapus..." : "Hapus Proyek"
        }
        onCancel={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteProject}
      />

      <ConfirmDialog
        open={deleteDocumentDialogOpen}
        title="Hapus dokumen?"
        description="Dokumen ini akan dihapus dari daftar proyek. File yang sudah dihapus tidak bisa ditampilkan lagi dari aplikasi."
        confirmText={
          actionLoading === "delete-document" ? "Menghapus..." : "Hapus Dokumen"
        }
        onCancel={() => {
          setDeleteDocumentDialogOpen(false);
          setSelectedDocument(null);
        }}
        onConfirm={handleDeleteDocument}
      />

      <ProjectEditSheet
        open={projectEditOpen}
        project={project}
        saving={actionLoading === "edit-project"}
        onClose={() => setProjectEditOpen(false)}
        onSubmit={handleUpdateProject}
      />

      <PaymentSheet
        open={paymentSheetOpen}
        onClose={() => setPaymentSheetOpen(false)}
        onSubmit={handleCreatePayment}
      />

      <ExpenseSheet
        open={expenseSheetOpen}
        onClose={() => setExpenseSheetOpen(false)}
        onSubmit={handleCreateExpense}
      />

      <DocumentUploadSheet
        open={documentSheetOpen}
        saving={actionLoading === "upload-document"}
        onClose={() => setDocumentSheetOpen(false)}
        onSubmit={handleUploadDocument}
      />

      <InvoiceSheet
        open={invoiceSheetOpen}
        project={project}
        existingInvoices={invoices}
        saving={actionLoading === "invoice"}
        onClose={() => setInvoiceSheetOpen(false)}
        onSubmit={handleSaveInvoice}
      />

      <RabItemSheet
        open={rabItemSheetOpen}
        item={selectedRabItem}
        saving={actionLoading === "rab-item"}
        onClose={() => {
          setRabItemSheetOpen(false);
          setSelectedRabItem(null);
        }}
        onSubmit={handleCreateRabItem}
      />

      <PaymentActionSheet
        open={paymentActionOpen}
        payment={selectedPayment}
        onClose={() => setPaymentActionOpen(false)}
        onEdit={(payment) => {
          console.log("edit", payment);
        }}
        onDelete={handleDeletePayment}
      />

      <ExpenseActionSheet
        open={expenseActionOpen}
        expense={selectedExpense}
        onClose={() => setExpenseActionOpen(false)}
        onViewReceipt={(expense) => {
          setSelectedReceipt(expense);
          setReceiptViewerOpen(true);
        }}
        onEdit={(expense) => {
          console.log("edit", expense);
        }}
        onDelete={handleDeleteExpense}
      />

      <ReceiptViewerSheet
        open={receiptViewerOpen}
        receipt={selectedReceipt}
        onClose={() => setReceiptViewerOpen(false)}
      />

      {/* Back */}
      <Link
        to="/projects"
        className="inline-flex items-center gap-2 text-sm text-[#8B9388]"
      >
        <ArrowLeft size={16} />
        Kembali
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold text-white">
            {project.project_name}
          </h1>

          <p className="mt-1 text-sm text-[#8B9388]">
            {project.customer?.full_name || "-"}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={() => setProjectEditOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#161917] text-[#8B9388]"
            title="Edit proyek"
          >
            <Pencil size={18} />
          </button>

          <button
            onClick={() => setDeleteDialogOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400"
            title="Hapus proyek"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {(actionError || error) && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          {actionError || error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        <TabButton
          active={tab === "overview"}
          onClick={() => setTab("overview")}
        >
          Overview
        </TabButton>

        <TabButton active={tab === "finance"} onClick={() => setTab("finance")}>
          Finance
        </TabButton>

        <TabButton active={tab === "rab"} onClick={() => setTab("rab")}>
          RAB
        </TabButton>

        <TabButton
          active={tab === "documents"}
          onClick={() => setTab("documents")}
        >
          Documents
        </TabButton>
      </div>

      {/* OVERVIEW */}
      {tab === "overview" && (
        <div className="space-y-5">
          <div className="rounded-2xl border border-[#252A27] bg-[#161917] p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-white">Status Proyek</h2>

              <span className="rounded-full bg-[#4A5B45]/20 px-3 py-1 text-xs text-[#7C9A72]">
                {getStatusLabel(status)}
              </span>
            </div>

            <select
              value={status}
              disabled={actionLoading === "status"}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full rounded-xl border border-[#252A27] bg-[#101311] p-3 text-white outline-none disabled:opacity-60"
            >
              {STATUS_OPTIONS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>

            <div className="mt-5">
              <div className="mb-2 flex justify-between text-xs">
                <span className="text-[#8B9388]">Progress</span>

                <span className="text-[#8B9388]">{progress}%</span>
              </div>

              <div className="h-2 rounded-full bg-[#252A27]">
                <div
                  className="h-2 rounded-full bg-[#7C9A72]"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#252A27] bg-[#161917] p-5">
            <h2 className="mb-4 font-semibold text-white">Informasi Proyek</h2>

            <div className="space-y-4">
              <InfoRow
                icon={User}
                label="Customer"
                value={project.customer?.full_name || "-"}
              />

              <InfoRow
                icon={Briefcase}
                label="Jenis"
                value={project.survey?.project_type || "-"}
              />

              <InfoRow
                icon={Wallet}
                label="Nilai"
                value={formatCurrency(projectValue)}
              />

              <InfoRow
                icon={Calendar}
                label="Deadline"
                value={formatDate(project.target_finish_date)}
              />
            </div>
          </div>
        </div>
      )}

      {/* FINANCE */}
      {tab === "finance" && (
        <div className="space-y-5">
          {/* Summary */}
          <div className="grid grid-cols-2 gap-3">
            <SummaryCard
              title="Pemasukan"
              value={formatCurrency(totalIncome)}
              color="text-[#7C9A72]"
            />

            <SummaryCard
              title="Pengeluaran"
              value={formatCurrency(totalExpense)}
              color="text-red-400"
            />

            <SummaryCard
              title="Profit"
              value={formatCurrency(profit)}
              color="text-[#7C9A72]"
            />

            <SummaryCard
              title="Sisa Tagihan"
              value={formatCurrency(outstanding)}
              color="text-[#2596BE]"
            />
          </div>

          {/* Payments */}
          <div className="rounded-2xl border border-[#252A27] bg-[#161917]">
            <div className="flex items-center justify-between border-b border-[#252A27] p-4">
              <h2 className="font-semibold text-white">Pembayaran</h2>

              <button
                className="rounded-lg bg-[#4A5B45] px-3 py-2 text-sm text-white"
                onClick={() => setPaymentSheetOpen(true)}
              >
                + Tambah
              </button>
            </div>

            {payments.map((payment) => (
              <PaymentRow
                key={payment.id}
                id={payment.id}
                title={getPaymentTitle(payment.payment_type)}
                amount={Number(payment.amount || 0)}
                date={formatDate(payment.payment_date)}
                onAction={(paymentData) => {
                  setSelectedPayment(paymentData);
                  setPaymentActionOpen(true);
                }}
              />
            ))}
          </div>

          {/* Expenses */}
          <div className="rounded-2xl border border-[#252A27] bg-[#161917]">
            <div className="flex items-center justify-between border-b border-[#252A27] p-4">
              <h2 className="font-semibold text-white">Pengeluaran</h2>

              <button
                className="rounded-lg bg-[#4A5B45] px-3 py-2 text-sm text-white"
                onClick={() => setExpenseSheetOpen(true)}
              >
                + Tambah
              </button>
            </div>

            {expenses.map((expense) => (
              <ExpenseRow
                key={expense.id}
                id={expense.id}
                name={expense.description || getExpenseCategory(expense.category)}
                amount={formatCurrency(expense.amount)}
                date={formatDate(expense.expense_date)}
                receipt={expense.receipt}
                onAction={(expenseData) => {
                  setSelectedExpense(expenseData);
                  setExpenseActionOpen(true);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {tab === "rab" && (
        <RabTab
          projectId={projectId}
          items={rabItems}
          grandTotal={rabGrandTotal}
          settings={rabSettings}
          totals={rabTotals}
          onSettingsChange={handleRabSettingsChange}
          onAddItem={() => {
            setSelectedRabItem(null);
            setRabItemSheetOpen(true);
          }}
          onEditItem={(item) => {
            setSelectedRabItem(item);
            setRabItemSheetOpen(true);
          }}
          onApprove={handleApproveRab}
          onDeleteItem={handleDeleteRabItem}
          approving={actionLoading === "approve-rab"}
          deletingItemId={
            actionLoading.startsWith("rab-delete-")
              ? actionLoading.replace("rab-delete-", "")
              : ""
          }
        />
      )}

      {/* DOCUMENTS */}
      {tab === "documents" && (
        <div className="space-y-5">
          {/* Upload */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setDocumentSheetOpen(true)}
              className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-[#4A5B45] bg-[#4A5B45]/10 p-4 text-[#7C9A72]"
            >
              <FileText size={18} />
              Upload
            </button>

            <button
              onClick={() => setInvoiceSheetOpen(true)}
              className="flex items-center justify-center gap-2 rounded-2xl border border-[#252A27] bg-[#161917] p-4 text-white"
            >
              <FileText size={18} />
              Invoice
            </button>
          </div>

          {/* Filter */}
          <div className="flex flex-wrap gap-2">
            {["Semua", "RAB", "Invoice", "Kontrak", "Progress"].map((item) => (
              <button
                key={item}
                onClick={() => setDocumentFilter(item)}
                className={`rounded-full border border-[#252A27] px-4 py-2 text-sm ${
                  documentFilter === item
                    ? "bg-[#4A5B45] text-white"
                    : "bg-[#161917] text-[#8B9388]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Documents */}
          <div className="space-y-3">
            {filterDocuments(documents, documentFilter).length === 0 && (
              <div className="rounded-2xl border border-[#252A27] bg-[#161917] p-4 text-sm text-[#8B9388]">
                Belum ada dokumen.
              </div>
            )}

            {filterDocuments(documents, documentFilter).map((document) => (
              <DocumentCard
                key={document.id}
                id={document.id}
                type={getDocumentType(document.document_type)}
                name={document.file_name}
                date={formatDate(document.created_at)}
                size={formatFileSize(document.file_size)}
                url={document.file_url}
                onDelete={() => {
                  setSelectedDocument(document);
                  setDeleteDocumentDialogOpen(true);
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DocumentCard({ type, name, date, size, url, onDelete }) {
  const isImage = type === "Progress";

  return (
    <div className="rounded-2xl border border-[#252A27] bg-[#161917] p-4">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#101311]">
          {isImage ? (
            <Image size={20} className="text-[#7C9A72]" />
          ) : (
            <FolderOpen size={20} className="text-[#7C9A72]" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-full bg-[#4A5B45]/15 px-2 py-1 text-xs text-[#7C9A72]">
              {type}
            </span>
          </div>

          <h3 className="truncate text-white">{name}</h3>

          <p className="mt-1 text-xs text-[#8B9388]">
            {date} • {size}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#101311]"
          >
            <Download size={18} className="text-[#8B9388]" />
          </a>

          <button
            onClick={onDelete}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400"
            title="Hapus dokumen"
          >
            <Trash2 size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}

function getStatusLabel(status) {
  return (
    STATUS_OPTIONS.find((item) => item.value === status)?.label ||
    status ||
    "Survey"
  );
}

function getPaymentTitle(type) {
  if (type === "pelunasan") return "Pelunasan";
  return "DP";
}

function getExpenseCategory(category) {
  const labels = {
    material: "Material",
    upah: "Upah",
    transport: "Transport",
    operasional: "Operasional",
    lainnya: "Lainnya",
  };

  return labels[category] || category || "-";
}

function getDocumentType(type) {
  const labels = {
    design: "Design",
    rab: "RAB",
    invoice: "Invoice",
    contract: "Kontrak",
    progress: "Progress",
  };

  return labels[type] || type || "Dokumen";
}

function filterDocuments(documents, filter) {
  if (filter === "Semua") return documents;

  const filterMap = {
    RAB: "rab",
    Invoice: "invoice",
    Kontrak: "contract",
    Progress: "progress",
  };

  return documents.filter(
    (document) => document.document_type === filterMap[filter],
  );
}

function formatDate(value) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function formatFileSize(value) {
  const size = Number(value || 0);

  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function TabButton({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm transition ${
        active ? "bg-[#4A5B45] text-white" : "bg-[#161917] text-[#8B9388]"
      }`}
    >
      {children}
    </button>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Icon size={16} className="text-[#8B9388]" />

        <span className="text-[#8B9388]">{label}</span>
      </div>

      <span className="font-medium text-white">{value}</span>
    </div>
  );
}

function SummaryCard({ title, value, color }) {
  return (
    <div className="rounded-2xl border border-[#252A27] bg-[#161917] p-4">
      <p className="text-xs text-[#8B9388]">{title}</p>

      <p className={`mt-2 font-semibold ${color}`}>{value}</p>
    </div>
  );
}

function ExpenseRow({ id, name, amount, date, receipt, onAction }) {
  return (
    <div className="border-t border-[#252A27] p-4">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-medium text-white">{name}</h4>

          <p className="mt-1 text-xs text-[#8B9388]">{date}</p>

          <p className="mt-3 text-red-400">-{amount}</p>
        </div>

        <button
          onClick={() =>
            onAction({
              id,
              name,
              amount,
              date,
              receipt,
            })
          }
          className="
            rounded-lg
            p-2
            text-[#8B9388]
            hover:bg-[#252A27]
          "
        >
          <MoreVertical size={18} />
        </button>
      </div>
    </div>
  );
}

function PaymentRow({ id, title, amount, date, onAction }) {
  return (
    <div className="border-t border-[#252A27] p-4">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-medium text-white">{title}</h4>

          <p className="mt-1 text-xs text-[#8B9388]">{date}</p>

          <p className="mt-3 text-[#7C9A72]">+{formatCurrency(amount)}</p>
        </div>

        <button
          onClick={() =>
            onAction({
              id,
              title,
              amount,
              date,
            })
          }
          className="
            rounded-lg
            p-2
            text-[#8B9388]
            hover:bg-[#252A27]
          "
        >
          <MoreVertical size={18} />
        </button>
      </div>
    </div>
  );
}
