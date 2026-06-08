import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  Briefcase,
  DollarSign,
  Receipt,
  Wallet,
} from "lucide-react";

import { getDashboardSummary } from "@/services/dashboard.service";
import { getProjects } from "@/services/project.service";

const PROGRESS_MAP = {
  survey: 10,
  quotation: 40,
  waiting_dp: 45,
  production: 60,
  installation: 90,
  completed: 100,
  cancelled: 0,
};

const ACTIVE_STATUSES = ["survey", "quotation", "waiting_dp", "production", "installation"];

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const [summaryData, projectData] = await Promise.all([
          getDashboardSummary(),
          getProjects(),
        ]);

        if (active) {
          setSummary(summaryData);
          setProjects(projectData || []);
        }
      } catch (loadError) {
        if (active) setError(loadError.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  const activeProjects = useMemo(() => {
    return projects
      .filter((project) => ACTIVE_STATUSES.includes(project.status))
      .slice(0, 3);
  }, [projects]);

  return (
    <div className="w-full max-w-full space-y-5 overflow-hidden">
      <div>
        <p className="text-sm text-[#8B9388]">Selamat datang</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white">
          Dashboard
        </h1>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#4A5B45] to-[#647A5E] p-6">
        <div className="flex min-w-0 items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm text-white/80">Estimasi Profit</p>

            <h2 className="mt-2 break-words text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {loading ? "..." : formatCurrency(summary?.estimated_profit)}
            </h2>

            <div className="mt-3 flex items-center gap-2">
              <ArrowUpRight size={16} />
              <span className="text-sm text-white/90">
                {loading
                  ? "Memuat ringkasan..."
                  : `${summary?.total_projects || 0} proyek tercatat`}
              </span>
            </div>
          </div>

          <div className="shrink-0 rounded-2xl bg-white/10 p-3 backdrop-blur">
            <DollarSign size={28} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <SummaryCard
          title="Revenue"
          value={loading ? "..." : formatCurrency(summary?.total_paid)}
          icon={Wallet}
          color="text-[#2596BE]"
        />

        <SummaryCard
          title="Expense"
          value={loading ? "..." : formatCurrency(summary?.total_expense)}
          icon={Receipt}
          color="text-red-500"
        />
      </div>

      <div className="rounded-3xl border border-[#252A27] bg-[#161917] p-5">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Proyek Aktif</h2>
            <p className="text-sm text-[#8B9388]">
              {loading
                ? "Memuat proyek..."
                : `${activeProjects.length} proyek ditampilkan`}
            </p>
          </div>

          <div className="rounded-xl bg-[#4A5B45]/20 p-2">
            <Briefcase size={18} className="text-[#7C9A72]" />
          </div>
        </div>

        <div className="space-y-3">
          {!loading && activeProjects.length === 0 && (
            <p className="text-sm text-[#8B9388]">Belum ada proyek aktif.</p>
          )}

          {activeProjects.map((project) => {
            const progress = PROGRESS_MAP[project.status] || 0;

            return (
              <div key={project.id} className="rounded-2xl bg-[#101311] p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="truncate font-medium text-white">
                    {project.project_name}
                  </h3>

                  <span className="shrink-0 text-sm font-medium text-[#7C9A72]">
                    {formatCurrency(project.contract_value)}
                  </span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#252A27]">
                  <div
                    className="h-full rounded-full bg-[#7C9A72]"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <p className="mt-2 text-xs text-[#8B9388]">
                  Progress {progress}%
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4">
        <ActivityCard
          title="Piutang"
          rows={[
            ["Sisa tagihan", formatCurrency(summary?.remaining_payment)],
            ["Nilai kontrak", formatCurrency(summary?.total_contract_value)],
          ]}
        />

        <ActivityCard
          title="Status Proyek"
          rows={[
            ["Survey", summary?.survey_projects || 0],
            ["Produksi", summary?.production_projects || 0],
            ["Selesai", summary?.completed_projects || 0],
          ]}
        />
      </div>
    </div>
  );
}

function SummaryCard({ title, value, icon: Icon, color }) {
  return (
    <div className="min-w-0 rounded-2xl border border-[#252A27] bg-[#161917] p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs text-[#8B9388]">{title}</span>
        <Icon size={18} className={color} />
      </div>

      <h3 className="break-words text-base font-semibold text-white sm:text-xl">
        {value}
      </h3>
    </div>
  );
}

function ActivityCard({ title, rows }) {
  return (
    <div className="rounded-3xl border border-[#252A27] bg-[#161917] p-5">
      <h2 className="mb-4 text-lg font-semibold text-white">{title}</h2>

      <div className="space-y-3">
        {rows.map(([label, value]) => (
          <div key={label} className="flex min-w-0 justify-between gap-3">
            <span className="min-w-0 text-sm text-[#8B9388]">{label}</span>
            <span className="min-w-0 break-words text-right text-white">
              {value}
            </span>
          </div>
        ))}
      </div>
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
