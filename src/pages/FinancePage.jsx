import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Briefcase,
  Receipt,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { getDashboardSummary } from "@/services/dashboard.service";
import { getExpenses } from "@/services/expenses.service";
import { getPayments } from "@/services/payment.service";
import { getProjects } from "@/services/project.service";

export default function FinancePage() {
  const [summary, setSummary] = useState(null);
  const [projects, setProjects] = useState([]);
  const [payments, setPayments] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadFinance() {
      try {
        setLoading(true);
        setError("");

        const [summaryData, projectData, paymentData, expenseData] = await Promise.all([
          getDashboardSummary(),
          getProjects(),
          getPayments(),
          getExpenses(),
        ]);

        const projectList = projectData || [];

        if (active) {
          setSummary(summaryData);
          setProjects(projectList);
          setPayments(paymentData || []);
          setExpenses(expenseData || []);
        }
      } catch (loadError) {
        if (active) setError(loadError.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadFinance();

    return () => {
      active = false;
    };
  }, []);

  const recentPayments = useMemo(() => {
    return [...payments]
      .sort((a, b) => new Date(b.payment_date) - new Date(a.payment_date))
      .slice(0, 3);
  }, [payments]);

  const recentExpenses = useMemo(() => {
    return [...expenses]
      .sort((a, b) => new Date(b.expense_date) - new Date(a.expense_date))
      .slice(0, 3);
  }, [expenses]);

  const topProjects = useMemo(() => {
    return [...projects]
      .sort((a, b) => Number(b.contract_value || 0) - Number(a.contract_value || 0))
      .slice(0, 3);
  }, [projects]);

  return (
    <div className="w-full max-w-full space-y-5 overflow-hidden">
      <div>
        <p className="text-sm text-[#8B9388]">Keuangan Cosy</p>
        <h1 className="mt-1 text-2xl font-semibold text-white">Finance</h1>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <StatCard
          title="Revenue"
          value={loading ? "..." : formatCurrency(summary?.total_paid)}
          color="text-[#2596BE]"
          icon={Wallet}
        />

        <StatCard
          title="Expense"
          value={loading ? "..." : formatCurrency(summary?.total_expense)}
          color="text-red-400"
          icon={Receipt}
        />

        <StatCard
          title="Profit"
          value={loading ? "..." : formatCurrency(summary?.estimated_profit)}
          color="text-[#7C9A72]"
          icon={TrendingUp}
        />

        <StatCard
          title="Piutang"
          value={loading ? "..." : formatCurrency(summary?.remaining_payment)}
          color="text-yellow-400"
          icon={Briefcase}
        />
      </div>

      <section className="rounded-2xl border border-[#252A27] bg-[#161917]">
        <div className="border-b border-[#252A27] p-4">
          <h2 className="font-semibold text-white">Pembayaran Terbaru</h2>
        </div>

        {!loading && recentPayments.length === 0 && (
          <EmptyRow text="Belum ada pembayaran." />
        )}

        {recentPayments.map((item) => (
          <PaymentRow
            key={item.id}
            project={item.project?.project_name || "-"}
            amount={formatCurrency(item.amount)}
            date={formatDate(item.payment_date)}
          />
        ))}
      </section>

      <section className="rounded-2xl border border-[#252A27] bg-[#161917]">
        <div className="border-b border-[#252A27] p-4">
          <h2 className="font-semibold text-white">Pengeluaran Terbaru</h2>
        </div>

        {!loading && recentExpenses.length === 0 && (
          <EmptyRow text="Belum ada pengeluaran." />
        )}

        {recentExpenses.map((item) => (
          <ExpenseRow
            key={item.id}
            title={item.description || item.category || "-"}
            amount={formatCurrency(item.amount)}
            date={formatDate(item.expense_date)}
          />
        ))}
      </section>

      <section className="rounded-2xl border border-[#252A27] bg-[#161917]">
        <div className="border-b border-[#252A27] p-4">
          <h2 className="font-semibold text-white">Top Project Value</h2>
        </div>

        {!loading && topProjects.length === 0 && (
          <EmptyRow text="Belum ada proyek." />
        )}

        {topProjects.map((item) => (
          <ProjectProfitRow
            key={item.id}
            name={item.project_name || "-"}
            profit={formatCurrency(item.contract_value)}
          />
        ))}
      </section>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="min-w-0 rounded-2xl border border-[#252A27] bg-[#161917] p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-[#8B9388]">{title}</p>
        <Icon size={16} className="text-[#8B9388]" />
      </div>

      <p className={`mt-3 break-words text-base font-semibold sm:text-lg ${color}`}>
        {value}
      </p>
    </div>
  );
}

function PaymentRow({ project, amount, date }) {
  return (
    <div className="border-t border-[#252A27] p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-white">{project}</p>
          <p className="mt-1 text-xs text-[#8B9388]">{date}</p>
        </div>

        <div className="flex min-w-0 shrink items-center gap-2 text-right text-[#7C9A72]">
          <ArrowUpRight size={16} />
          <span className="break-words">{amount}</span>
        </div>
      </div>
    </div>
  );
}

function ExpenseRow({ title, amount, date }) {
  return (
    <div className="border-t border-[#252A27] p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-white">{title}</p>
          <p className="mt-1 text-xs text-[#8B9388]">{date}</p>
        </div>

        <div className="flex min-w-0 shrink items-center gap-2 text-right text-red-400">
          <ArrowDownRight size={16} />
          <span className="break-words">{amount}</span>
        </div>
      </div>
    </div>
  );
}

function ProjectProfitRow({ name, profit }) {
  return (
    <div className="border-t border-[#252A27] p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="truncate text-white">{name}</span>
        <span className="min-w-0 break-words text-right font-medium text-[#7C9A72]">
          {profit}
        </span>
      </div>
    </div>
  );
}

function EmptyRow({ text }) {
  return <div className="border-t border-[#252A27] p-4 text-sm text-[#8B9388]">{text}</div>;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function formatDate(value) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}
