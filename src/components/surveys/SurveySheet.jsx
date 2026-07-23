import Sheet from "@/components/ui/Sheet";

const STATUS_OPTIONS = [
  ["scheduled", "Terjadwal"],
  ["visited", "Sudah disurvey"],
  ["quotation_prepared", "Penawaran disiapkan"],
  ["approved", "Disetujui"],
  ["rejected", "Ditolak"],
];

export default function SurveySheet({ open, form, editing, customers = [], saving, onChange, onClose, onSubmit }) {
  const canSubmit = form.customer_id && form.installation_area && form.need && form.target_finishing;
  return <Sheet open={open} onClose={onClose} title={editing ? "Edit Survey" : "Tambah Survey"}>
    <div className="space-y-5">
      <Field label="Customer"><select className={inputClassName} onChange={(event) => onChange("customer_id", event.target.value)} value={form.customer_id}>{customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.full_name} - {customer.phone || "tanpa nomor"}</option>)}</select></Field>
      <Field label="Email"><input className={inputClassName} onChange={(event) => onChange("email", event.target.value)} placeholder="nama@email.com" type="email" value={form.email} /></Field>
      <Field label="Area pemasangan"><input className={inputClassName} onChange={(event) => onChange("installation_area", event.target.value)} placeholder="Contoh: Rumah Pribadi" value={form.installation_area} /></Field>
      <Field label="Kebutuhan"><input className={inputClassName} onChange={(event) => onChange("need", event.target.value)} placeholder="Contoh: Wall Panel" value={form.need} /></Field>
      <Field label="Target finishing"><input className={inputClassName} onChange={(event) => onChange("target_finishing", event.target.value)} type="date" value={form.target_finishing} /></Field>
      <Field label="Status"><select className={inputClassName} onChange={(event) => onChange("status", event.target.value)} value={form.status}>{STATUS_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></Field>
      <div className="space-y-3 rounded-xl border border-[#252A27] bg-[#101311] p-4 text-sm text-[#C5CBC3]">
        <Consent checked={form.survey_fee_acknowledged} label="Setuju biaya survey Rp150.000" onChange={(value) => onChange("survey_fee_acknowledged", value)} />
        <Consent checked={form.refund_acknowledged} label="Setuju biaya survey tidak dikembalikan" onChange={(value) => onChange("refund_acknowledged", value)} />
        <Consent checked={form.commitment_fee_acknowledged} label="Setuju ketentuan commitment fee" onChange={(value) => onChange("commitment_fee_acknowledged", value)} />
      </div>
      <Field label="Catatan"><textarea className={inputClassName} onChange={(event) => onChange("notes", event.target.value)} placeholder="Catatan tambahan" rows={3} value={form.notes} /></Field>
      <button className="w-full rounded-xl bg-[#4A5B45] py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50" disabled={!canSubmit || saving} onClick={onSubmit}>{saving ? "Menyimpan..." : "Simpan Survey"}</button>
    </div>
  </Sheet>;
}

function Consent({ checked, label, onChange }) { return <label className="flex items-center gap-3"><input checked={checked} className="size-4 accent-[#7C9A72]" onChange={(event) => onChange(event.target.checked)} type="checkbox" />{label}</label>; }
function Field({ children, label }) { return <div><label className="mb-2 block text-sm text-[#8B9388]">{label}</label>{children}</div>; }
const inputClassName = "w-full rounded-xl border border-[#252A27] bg-[#101311] p-3 text-white outline-none";
