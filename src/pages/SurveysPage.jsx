import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, ClipboardList, Mail, MapPin, Pencil, Phone, Plus, Search, Trash2, User } from "lucide-react";
import SurveySheet from "@/components/surveys/SurveySheet";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { getInitialSurveyForm } from "@/lib/surveyForm";
import { getCustomers } from "@/services/customer.service";
import { createSurvey, deleteSurvey, getSurveys, updateSurvey } from "@/services/survey.service";

const STATUS_LABEL = { scheduled: "Terjadwal", visited: "Sudah disurvey", quotation_prepared: "Penawaran disiapkan", approved: "Disetujui", rejected: "Ditolak" };

export default function SurveysPage() {
  const [search, setSearch] = useState(""); const [open, setOpen] = useState(false); const [selected, setSelected] = useState(null); const [form, setForm] = useState(() => getInitialSurveyForm(null)); const [saving, setSaving] = useState(false); const [error, setError] = useState(""); const [toDelete, setToDelete] = useState(null);
  const surveysQuery = useQuery({ queryKey: ["surveys"], queryFn: getSurveys }); const customersQuery = useQuery({ queryKey: ["customers"], queryFn: getCustomers }); const surveys = surveysQuery.data || []; const customers = customersQuery.data || [];
  const filtered = useMemo(() => { const term = search.toLowerCase(); return surveys.filter((survey) => [survey.customer?.full_name, survey.customer?.phone, survey.email, survey.installation_area, survey.need].some((value) => String(value || "").toLowerCase().includes(term))); }, [search, surveys]);
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const payload = () => ({ ...form, notes: form.notes || null });
  async function save() { try { setSaving(true); setError(""); if (selected) await updateSurvey(selected.id, payload()); else await createSurvey(payload()); await surveysQuery.refetch(); setOpen(false); } catch (saveError) { setError(saveError.message); } finally { setSaving(false); } }
  async function remove() { try { setSaving(true); await deleteSurvey(toDelete.id); await surveysQuery.refetch(); setToDelete(null); } catch (deleteError) { setError(deleteError.message); } finally { setSaving(false); } }
  function openCreate() { setSelected(null); setForm(getInitialSurveyForm(null, customers)); setOpen(true); }
  function openEdit(survey) { setSelected(survey); setForm(getInitialSurveyForm(survey, customers)); setOpen(true); }
  return <div className="space-y-5"><SurveySheet customers={customers} editing={Boolean(selected)} form={form} onChange={update} onClose={() => setOpen(false)} onSubmit={save} open={open} saving={saving} /><ConfirmDialog confirmText={saving ? "Menghapus..." : "Hapus"} description="Data survey akan dihapus permanen." onCancel={() => setToDelete(null)} onConfirm={remove} open={Boolean(toDelete)} title="Hapus survey?" />
    <div className="flex items-start justify-between gap-3"><div><p className="text-sm text-[#8B9388]">Data dari form client dan input manual</p><h1 className="mt-1 text-2xl font-semibold text-white">Surveys</h1></div><button className="flex items-center gap-2 rounded-xl bg-[#4A5B45] px-3 py-2 text-sm font-medium text-white" onClick={openCreate}><Plus size={16} />Survey</button></div>
    <div className="relative"><Search className="absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-[#8B9388]" /><input className="w-full rounded-2xl border border-[#252A27] bg-[#161917] py-3 pl-11 pr-4 text-white outline-none" onChange={(event) => setSearch(event.target.value)} placeholder="Cari nama, kebutuhan, area..." value={search} /></div>{error && <StateCard danger text={error} />}{(surveysQuery.isPending || customersQuery.isPending) && <StateCard text="Memuat survey..." />}{!surveysQuery.isPending && filtered.length === 0 && <StateCard text="Belum ada survey yang cocok." />}
    <div className="grid gap-4 xl:grid-cols-2">{filtered.map((survey) => <article className="rounded-2xl border border-[#252A27] bg-[#161917] p-5" key={survey.id}><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="text-xs font-medium uppercase tracking-wider text-[#7C9A72]">{STATUS_LABEL[survey.status] || survey.status}</p><h2 className="mt-1 truncate text-lg font-semibold text-white">{survey.customer?.full_name || "Customer"}</h2></div><ClipboardList className="size-5 text-[#7C9A72]" /></div><div className="mt-4 grid gap-2 text-sm text-[#B6BDB4]"><Info icon={Phone} value={survey.customer?.phone} /><Info icon={Mail} value={survey.email} /><Info icon={MapPin} value={`${survey.installation_area || "-"} - ${survey.customer?.address || ""}`} /><Info icon={User} value={survey.need} /><Info icon={Calendar} value={`Target: ${formatDate(survey.target_finishing)}`} /></div><div className="mt-4 flex gap-2 border-t border-[#252A27] pt-4"><button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#101311] py-2 text-sm text-white" onClick={() => openEdit(survey)}><Pencil size={15} />Edit</button><button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500/10 py-2 text-sm text-red-400" onClick={() => setToDelete(survey)}><Trash2 size={15} />Hapus</button></div></article>)}</div>
  </div>;
}
function Info({ icon: Icon, value }) { return value ? <p className="flex gap-2"><Icon className="mt-0.5 size-4 shrink-0 text-[#7C9A72]" />{value}</p> : null; }
function StateCard({ text, danger }) { return <div className={`rounded-2xl border p-4 text-sm ${danger ? "border-red-500/30 bg-red-500/10 text-red-300" : "border-[#252A27] bg-[#161917] text-[#8B9388]"}`}>{text}</div>; }
function formatDate(value) { return value ? new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(new Date(value)) : "-"; }
