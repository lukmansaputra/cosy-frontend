import { typography } from "@/lib/typography";

export default function KpiCard({ title, value, icon: Icon, color }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 md:p-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-wider text-zinc-500 md:text-xs">
          {title}
        </p>

        <Icon size={18} className={color} />
      </div>

      <h2
        className={`
          ${typography.kpiValue}
          ${color}
        `}
      >
        {value}
      </h2>
    </div>
  );
}
