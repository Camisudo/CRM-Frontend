import { useState } from "react";
import { useDashboardMetrics } from "../hooks/useDashboard";
import { Loader } from "lucide-react";

const RANGES = [
  { value: "7days", label: "Last 7 days" },
  { value: "30days", label: "Last 30 days" },
  { value: "90days", label: "Last 90 days" },
] as const;

const STAGE_ORDER = ["prospect", "qualified", "proposal", "negotiation", "closed_won", "closed_lost"];

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<(typeof RANGES)[number]["value"]>("30days");
  const { data, isLoading, error } = useDashboardMetrics({ dateRange });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader className="animate-spin text-brand" size={32} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8">
        <div className="bg-error/10 border border-error text-error px-4 py-3 rounded">
          Failed to load reports. Please try again.
        </div>
      </div>
    );
  }

  const { summary, byStage } = data;
  const stages = [
    ...STAGE_ORDER.filter((s) => s in byStage),
    ...Object.keys(byStage).filter((s) => !STAGE_ORDER.includes(s)),
  ];
  const maxValue = Math.max(1, ...stages.map((s) => byStage[s].value));

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Reports</h1>
        <select
          aria-label="Date range"
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value as (typeof RANGES)[number]["value"])}
          className="input-base w-44"
        >
          {RANGES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Stat label="Contacts" value={summary.totalContacts.toLocaleString()} />
        <Stat label="Active deals" value={summary.activeDeals.toLocaleString()} />
        <Stat label="Pipeline value" value={`$${summary.totalPipelineValue.toLocaleString()}`} />
        <Stat label="Closed this month" value={summary.closedThisMonth.toLocaleString()} />
        <Stat label="Win rate" value={`${summary.winRate.toFixed(1)}%`} />
      </div>

      <div className="card p-6">
        <h2 className="font-semibold text-lg mb-4">Pipeline by stage</h2>
        {stages.length === 0 ? (
          <p className="text-neutral-500">No pipeline data for this range</p>
        ) : (
          <div className="space-y-3">
            {stages.map((s) => {
              const { count, value } = byStage[s];
              const pct = (value / maxValue) * 100;
              return (
                <div key={s}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize">{s.replace(/_/g, " ")}</span>
                    <span className="text-neutral-600">
                      {count} · ${value.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 bg-neutral-200 rounded">
                    <div className="h-2 bg-brand rounded" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-6">
      <p className="text-sm text-neutral-600 mb-2">{label}</p>
      <p className="text-2xl font-bold text-brand">{value}</p>
    </div>
  );
}
