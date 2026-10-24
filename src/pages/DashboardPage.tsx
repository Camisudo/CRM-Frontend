import { useDashboardMetrics, useMyTasks } from "../hooks/useDashboard";
import { Link } from "react-router-dom";
import { Loader } from "lucide-react";
import type { Deal } from "../types";

export default function DashboardPage() {
  const { data: metrics, isLoading: metricsLoading } = useDashboardMetrics();
  const { data: tasksData, isLoading: tasksLoading } = useMyTasks();

  const topDeals = metrics?.topDeals || [];
  const summary = metrics?.summary;
  const tasks = Array.isArray(tasksData?.data) ? tasksData.data : [];

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-8">Dashboard</h2>

      {/* Metric cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metricsLoading ? (
          <div className="col-span-full flex items-center justify-center py-12">
            <Loader className="animate-spin text-brand" size={32} />
          </div>
        ) : (
          <>
            <div className="card p-6">
              <p className="text-sm text-neutral-600 mb-2">Total Contacts</p>
              <p className="text-3xl font-bold text-brand">
                {summary?.totalContacts?.toLocaleString() || 0}
              </p>
            </div>
            <div className="card p-6">
              <p className="text-sm text-neutral-600 mb-2">Active Deals</p>
              <p className="text-3xl font-bold text-brand">
                {summary?.activeDeals || 0}
              </p>
            </div>
            <div className="card p-6">
              <p className="text-sm text-neutral-600 mb-2">Pipeline Value</p>
              <p className="text-3xl font-bold text-brand">
                ${(summary?.totalPipelineValue || 0).toLocaleString()}
              </p>
            </div>
            <div className="card p-6">
              <p className="text-sm text-neutral-600 mb-2">Win Rate</p>
              <p className="text-3xl font-bold text-ink">
                {summary?.winRate?.toFixed(1)}%
              </p>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent deals */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Top Deals</h3>
            <Link to="/deals" className="text-brand hover:underline text-sm">
              View all
            </Link>
          </div>
          {metricsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader className="animate-spin text-brand" size={24} />
            </div>
          ) : topDeals.length > 0 ? (
            <div className="space-y-3">
              {topDeals.map((deal: Deal) => (
                <div
                  key={deal.id}
                  className="pb-3 border-b border-neutral-200 last:border-b-0"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{deal.title}</h4>
                      <p className="text-sm text-neutral-600">
                        {deal.contact?.firstName} {deal.contact?.lastName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        ${deal.value.toLocaleString()}
                      </p>
                      <p className="text-xs text-neutral-500">{deal.stage}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-neutral-500">No deals yet</p>
          )}
        </div>

        {/* My tasks */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">My Tasks</h3>
            <Link to="/tasks" className="text-brand hover:underline text-sm">
              View all
            </Link>
          </div>
          {tasksLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader className="animate-spin text-brand" size={24} />
            </div>
          ) : Array.isArray(tasks) && tasks.length > 0 ? (
            <div className="space-y-2">
              {tasks.slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  className="p-2 bg-neutral-50 rounded border-l-2 border-brand"
                >
                  <p className="text-sm font-medium line-clamp-2">
                    {task.title}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-neutral-500">
                      {task.type}
                    </span>
                    {task.dueDate && (
                      <span className="text-xs text-neutral-500">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {Array.isArray(tasks) && tasks.length > 5 && (
                <Link
                  to="/tasks"
                  className="text-sm text-brand hover:underline block mt-2"
                >
                  +{tasks.length - 5} more
                </Link>
              )}
            </div>
          ) : (
            <p className="text-neutral-500">No tasks assigned</p>
          )}
        </div>
      </div>
    </div>
  );
}
