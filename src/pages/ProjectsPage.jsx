import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, ChevronRight, Briefcase, Plus } from "lucide-react";
import { Link } from "react-router-dom";

import ProjectSheet from "@/components/projects/ProjectSheet";
import { getCustomers } from "@/services/customer.service";
import { createProject, getProjects } from "@/services/project.service";

const STATUS_COLOR = {
  Survey: "bg-slate-500/20 text-slate-300",
  Desain: "bg-blue-500/20 text-blue-300",
  Quotation: "bg-cyan-500/20 text-cyan-300",
  "Menunggu DP": "bg-orange-500/20 text-orange-300",
  Produksi: "bg-yellow-500/20 text-yellow-300",
  Instalasi: "bg-green-500/20 text-green-300",
  Selesai: "bg-emerald-500/20 text-emerald-300",
  Batal: "bg-red-500/20 text-red-300",
};

const PROGRESS_MAP = {
  Survey: 10,
  Desain: 30,
  Quotation: 40,
  "Menunggu DP": 45,
  Produksi: 60,
  Instalasi: 90,
  Selesai: 100,
  Batal: 0,
};

const STATUS_LABEL = {
  survey: "Survey",
  design: "Desain",
  desain: "Desain",
  quotation: "Quotation",
  waiting_dp: "Menunggu DP",
  production: "Produksi",
  produksi: "Produksi",
  installation: "Instalasi",
  instalasi: "Instalasi",
  completed: "Selesai",
  selesai: "Selesai",
  cancelled: "Batal",
  batal: "Batal",
};
const EMPTY_ARRAY = [];

export default function ProjectsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Semua");
  const [projectSheetOpen, setProjectSheetOpen] = useState(false);
  const [actionError, setActionError] = useState("");
  const queryClient = useQueryClient();
  const projectsQuery = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });
  const customersQuery = useQuery({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });
  const projects = projectsQuery.data || EMPTY_ARRAY;
  const customers = customersQuery.data || EMPTY_ARRAY;
  const loading = projectsQuery.isPending || customersQuery.isPending;
  const error =
    actionError ||
    projectsQuery.error?.message ||
    customersQuery.error?.message ||
    "";

  async function handleCreateProject(payload) {
    try {
      setActionError("");

      await createProject(payload);
      await projectsQuery.refetch();
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    } catch (createError) {
      setActionError(createError.message);
    }
  }

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const projectStatus = getStatusLabel(project.status);
      const projectName = project.project_name || "";
      const customerName = project.customer?.full_name || "";

      const matchStatus = status === "Semua" || projectStatus === status;

      const matchSearch =
        projectName.toLowerCase().includes(search.toLowerCase()) ||
        customerName.toLowerCase().includes(search.toLowerCase());

      return matchStatus && matchSearch;
    });
  }, [projects, search, status]);

  return (
    <div className="space-y-5 w-full overflow-hidden">
      <ProjectSheet
        open={projectSheetOpen}
        onClose={() => setProjectSheetOpen(false)}
        onSubmit={handleCreateProject}
        customers={customers}
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-[#8B9388]">Kelola Proyek</p>

          <h1 className="mt-1 text-2xl font-semibold text-white">Projects</h1>
        </div>

        <button
          onClick={() => setProjectSheetOpen(true)}
          className="flex shrink-0 items-center gap-2 rounded-xl bg-[#4A5B45] px-3 py-2 text-sm font-medium text-white"
        >
          <Plus size={16} />
          Proyek
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B9388]"
        />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari proyek..."
          className="w-full rounded-2xl border border-[#252A27] bg-[#161917] py-3 pl-11 pr-4 text-white outline-none"
        />
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {[
          "Semua",
          "Survey",
          "Desain",
          "Quotation",
          "Menunggu DP",
          "Produksi",
          "Instalasi",
          "Selesai",
        ].map((item) => (
          <button
            key={item}
            onClick={() => setStatus(item)}
            className={`rounded-full px-4 py-2 text-sm transition ${
              status === item
                ? "bg-[#4A5B45] text-white"
                : "bg-[#161917] text-[#8B9388]"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Project List */}
      <div className="space-y-3">
        {loading && (
          <div className="rounded-2xl border border-[#252A27] bg-[#161917] p-4 text-sm text-[#8B9388]">
            Memuat proyek...
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {!loading && !error && filteredProjects.length === 0 && (
          <div className="rounded-2xl border border-[#252A27] bg-[#161917] p-4 text-sm text-[#8B9388]">
            Belum ada proyek yang cocok.
          </div>
        )}

        {filteredProjects.map((project) => {
          const projectStatus = getStatusLabel(project.status);
          const progress = PROGRESS_MAP[projectStatus] ?? 0;

          return (
            <Link
              to={`/projects/${project.id}`}
              key={project.id}
              className="
              block
              rounded-2xl
              border
              border-[#252A27]
              bg-[#161917]
              p-4
              text-inherit
              no-underline
              transition-all
              hover:border-[#4A5B45]
              active:scale-[0.99]
            "
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold text-white">
                    {project.project_name}
                  </h3>

                  <p className="mt-1 text-sm text-[#8B9388]">
                    {project.customer?.full_name || "-"}
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs ${
                    STATUS_COLOR[projectStatus] || STATUS_COLOR.Survey
                  }`}
                >
                  {projectStatus}
                </span>
              </div>

              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs text-[#8B9388]">Progress</span>

                  <span className="text-xs text-[#8B9388]">{progress}%</span>
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

              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs text-[#8B9388]">Nilai Proyek</p>

                  <p className="mt-1 text-sm font-medium text-white">
                    {formatCurrency(project.contract_value)}
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-2 text-[#7C9A72]">
                  <Briefcase size={16} />
                  <ChevronRight size={16} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function getStatusLabel(status) {
  return STATUS_LABEL[status] || status || "Survey";
}

function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}
