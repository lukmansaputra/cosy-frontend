import { useEffect, useMemo, useState } from "react";
import { Calendar, ClipboardList, MapPin, Search, User } from "lucide-react";

import { getSurveys } from "@/services/survey.service";

const STATUS_LABEL = {
  pending: "Pending",
  scheduled: "Terjadwal",
  completed: "Selesai",
  cancelled: "Batal",
};

export default function SurveysPage() {
  const [surveys, setSurveys] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadSurveys() {
      try {
        setLoading(true);
        setError("");

        const data = await getSurveys();

        if (active) setSurveys(data || []);
      } catch (loadError) {
        if (active) setError(loadError.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadSurveys();

    return () => {
      active = false;
    };
  }, []);

  const filteredSurveys = useMemo(() => {
    return surveys.filter((survey) => {
      const keyword = search.toLowerCase();

      return (
        (survey.customer?.full_name || "").toLowerCase().includes(keyword) ||
        (survey.project_type || "").toLowerCase().includes(keyword) ||
        (survey.project_location || "").toLowerCase().includes(keyword) ||
        (survey.surveyor_name || "").toLowerCase().includes(keyword)
      );
    });
  }, [search, surveys]);

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm text-[#8B9388]">Jadwal Survey</p>
        <h1 className="mt-1 text-2xl font-semibold text-white">Surveys</h1>
      </div>

      <div className="relative">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B9388]"
        />

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Cari survey..."
          className="w-full rounded-2xl border border-[#252A27] bg-[#161917] py-3 pl-11 pr-4 text-white outline-none"
        />
      </div>

      <div className="space-y-3">
        {loading && <StateCard text="Memuat survey..." />}
        {error && <StateCard text={error} danger />}

        {!loading && !error && filteredSurveys.length === 0 && (
          <StateCard text="Belum ada survey yang cocok." />
        )}

        {filteredSurveys.map((survey) => (
          <div
            key={survey.id}
            className="rounded-2xl border border-[#252A27] bg-[#161917] p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <ClipboardList size={16} className="text-[#7C9A72]" />
                  <h3 className="truncate font-semibold text-white">
                    {survey.project_type || "-"}
                  </h3>
                </div>

                <InfoLine
                  icon={User}
                  value={survey.customer?.full_name || "-"}
                />
                <InfoLine icon={Calendar} value={formatDate(survey.survey_date)} />
                <InfoLine icon={MapPin} value={survey.project_location || "-"} />
              </div>

              <span className="shrink-0 rounded-full bg-[#4A5B45]/20 px-3 py-1 text-xs text-[#7C9A72]">
                {STATUS_LABEL[survey.status] || survey.status || "Survey"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function InfoLine({ icon: Icon, value }) {
  return (
    <p className="mt-2 flex items-center gap-2 text-sm text-[#8B9388]">
      <Icon size={14} />
      <span className="truncate">{value}</span>
    </p>
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

function StateCard({ text, danger = false }) {
  return (
    <div
      className={`rounded-2xl border p-4 text-sm ${
        danger
          ? "border-red-500/30 bg-red-500/10 text-red-300"
          : "border-[#252A27] bg-[#161917] text-[#8B9388]"
      }`}
    >
      {text}
    </div>
  );
}
