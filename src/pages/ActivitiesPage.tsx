import { useState } from "react";
import { useActivities } from "../hooks/useActivities";
import { ActivityType } from "../types";
import type { Activity } from "../types";
import { Loader } from "lucide-react";

const PAGE_SIZE = 50;

const typeOptions: { value: string; label: string }[] = [
  { value: "", label: "All activity" },
  ...Object.values(ActivityType).map((t) => ({
    value: t,
    label: t.replace(/_/g, " "),
  })),
];

export default function ActivitiesPage() {
  const [type, setType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useActivities({
    page,
    limit: PAGE_SIZE,
    type: type ? [type] : undefined,
    fromDate: fromDate || undefined,
    toDate: toDate || undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const activities: Activity[] = data?.data || [];
  const pagination = data?.pagination;

  const resetPage = () => setPage(1);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Activity</h1>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <select
          aria-label="Filter by activity type"
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            resetPage();
          }}
          className="input-base w-56"
        >
          {typeOptions.map((o) => (
            <option key={o.value || "all"} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <input
          type="date"
          aria-label="From date"
          value={fromDate}
          onChange={(e) => {
            setFromDate(e.target.value);
            resetPage();
          }}
          className="input-base w-44"
        />
        <input
          type="date"
          aria-label="To date"
          value={toDate}
          onChange={(e) => {
            setToDate(e.target.value);
            resetPage();
          }}
          className="input-base w-44"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="animate-spin text-primary-600" size={32} />
        </div>
      ) : error ? (
        <div className="bg-error/10 border border-error text-error px-4 py-3 rounded">
          Failed to load activity. Please try again.
        </div>
      ) : activities.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-neutral-500">No activity matches these filters</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-neutral-50">
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700">When</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700">Type</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700">Description</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700">By</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((a) => (
                <tr key={a.id} className="border-b">
                  <td className="px-6 py-3 text-sm whitespace-nowrap">
                    {new Date(a.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-3 text-sm">
                    <span className="text-xs px-2 py-1 rounded bg-neutral-100">
                      {a.type.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm">{a.description}</td>
                  <td className="px-6 py-3 text-sm text-neutral-600">
                    {a.actor ? `${a.actor.firstName} ${a.actor.lastName}` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-neutral-600">
            Page {pagination.page} of {pagination.totalPages} · {pagination.total} events
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="btn-secondary disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
              disabled={page === pagination.totalPages}
              className="btn-secondary disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
