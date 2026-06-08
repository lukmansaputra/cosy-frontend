import { useEffect, useState } from "react";
import {
  Building2,
  Briefcase,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Save,
  TrendingUp,
  User,
  Wallet,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { getDashboardSummary } from "@/services/dashboard.service";
import { updateProfile } from "@/services/auth.service";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { logout, setUser, user } = useAuth();
  const { showToast } = useToast();
  const [summary, setSummary] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(() => getInitialForm(user));

  useEffect(() => {
    setForm(getInitialForm(user));
  }, [user]);

  useEffect(() => {
    let active = true;

    async function loadSummary() {
      try {
        const data = await getDashboardSummary();

        if (active) setSummary(data);
      } catch (loadError) {
        if (active) setError(loadError.message);
      }
    }

    loadSummary();

    return () => {
      active = false;
    };
  }, []);

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setError("");
      setSaving(true);
      const updatedUser = await updateProfile(form);

      setUser(updatedUser);
      updateField("new_password", "");
      showToast({ title: "Profile berhasil disimpan" });
    } catch (saveError) {
      setError(saveError.message);
      showToast({
        type: "error",
        title: "Profile gagal disimpan",
        message: saveError.message,
      });
    } finally {
      setSaving(false);
    }
  }

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-[#252A27] bg-[#161917] p-6">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#4A5B45]/25 text-3xl font-semibold text-[#9fbd91]">
            {getInitials(user?.full_name)}
          </div>

          <h1 className="mt-4 text-2xl font-semibold text-white">
            {user?.full_name || "-"}
          </h1>

          <p className="mt-1 text-sm text-[#8B9388]">
            {getRoleLabel(user?.role)} - {user?.company_name || "COSY MUSEUM"}
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      <section>
        <h2 className="mb-3 text-sm font-medium text-[#8B9388]">
          Statistik Bisnis
        </h2>

        <div className="grid grid-cols-2 gap-3">
          <StatCard
            title="Total Project"
            value={summary?.total_projects || 0}
            icon={Briefcase}
            color="text-[#2596BE]"
          />

          <StatCard
            title="Revenue"
            value={formatCurrency(summary?.total_paid)}
            icon={Wallet}
            color="text-[#2596BE]"
          />

          <StatCard
            title="Profit"
            value={formatCurrency(summary?.estimated_profit)}
            icon={TrendingUp}
            color="text-[#7C9A72]"
          />

          <StatCard
            title="Produksi"
            value={summary?.production_projects || 0}
            icon={Building2}
            color="text-[#7C9A72]"
          />
        </div>
      </section>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-[#252A27] bg-[#161917]"
      >
        <div className="border-b border-[#252A27] p-4">
          <h2 className="font-semibold text-white">Profile & Perusahaan</h2>
        </div>

        <div className="space-y-4 p-4">
          <InputField
            icon={User}
            label="Nama"
            value={form.full_name}
            onChange={(value) => updateField("full_name", value)}
            placeholder="Nama pengguna"
          />

          <ReadonlyRow
            icon={Mail}
            label="Email Login"
            value={user?.email || "-"}
          />

          <InputField
            icon={Phone}
            label="Telepon"
            value={form.phone}
            onChange={(value) => updateField("phone", value)}
            placeholder="Nomor telepon"
          />

          <InputField
            icon={Building2}
            label="Nama Perusahaan"
            value={form.company_name}
            onChange={(value) => updateField("company_name", value)}
            placeholder="Nama perusahaan"
          />

          <InputField
            icon={Phone}
            label="Telepon Perusahaan"
            value={form.company_phone}
            onChange={(value) => updateField("company_phone", value)}
            placeholder="Nomor perusahaan"
          />

          <InputField
            icon={Mail}
            label="Email Perusahaan"
            type="email"
            value={form.company_email}
            onChange={(value) => updateField("company_email", value)}
            placeholder="email@perusahaan.com"
          />

          <InputField
            icon={MapPin}
            label="Alamat Perusahaan"
            value={form.company_address}
            onChange={(value) => updateField("company_address", value)}
            placeholder="Alamat perusahaan"
          />

          <InputField
            label="Password Baru"
            type="password"
            value={form.new_password}
            onChange={(value) => updateField("new_password", value)}
            placeholder="Kosongkan jika tidak diganti"
          />

          <button
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#4A5B45] py-4 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={18} />
            {saving ? "Menyimpan..." : "Simpan Profile"}
          </button>
        </div>
      </form>

      <button
        onClick={handleLogout}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 py-4 text-red-400"
      >
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="rounded-2xl border border-[#252A27] bg-[#161917] p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-[#8B9388]">{title}</p>
        <Icon size={16} className="text-[#8B9388]" />
      </div>

      <p className={`mt-3 break-words text-lg font-semibold ${color}`}>
        {value}
      </p>
    </div>
  );
}

function InputField({
  icon: Icon,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-[#8B9388]">{label}</label>
      <div className="relative">
        {Icon && (
          <Icon
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B9388]"
          />
        )}
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-xl border border-[#252A27] bg-[#101311] p-3 text-white outline-none ${
            Icon ? "pl-10" : ""
          }`}
        />
      </div>
    </div>
  );
}

function ReadonlyRow({ icon: Icon, label, value }) {
  return (
    <div>
      <p className="mb-2 text-sm text-[#8B9388]">{label}</p>
      <div className="flex items-center gap-3 rounded-xl border border-[#252A27] bg-[#101311] p-3 text-white/70">
        <Icon size={16} className="text-[#8B9388]" />
        <span className="truncate">{value}</span>
      </div>
    </div>
  );
}

function getInitialForm(user) {
  return {
    full_name: user?.full_name || "",
    phone: user?.phone || "",
    company_name: user?.company_name || "COSY MUSEUM",
    company_phone: user?.company_phone || "",
    company_email: user?.company_email || "",
    company_address: user?.company_address || "",
    new_password: "",
  };
}

function getInitials(name = "C") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item[0])
    .join("")
    .toUpperCase();
}

function getRoleLabel(role) {
  const labels = {
    owner: "Owner",
    coowner: "Co-Owner",
    designer: "Designer",
    admin: "Admin",
  };

  return labels[role] || "User";
}

function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}
