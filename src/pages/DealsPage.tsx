import { useDeals } from "../hooks/useDeals";
import { DealStage } from "../types";
import { Plus, Loader } from "lucide-react";
import type { Deal } from "../types";

const stages = [
  { value: DealStage.Prospect, label: "Prospect" },
  { value: DealStage.Qualified, label: "Qualified" },
  { value: DealStage.Proposal, label: "Proposal" },
  { value: DealStage.Negotiation, label: "Negotiation" },
  { value: DealStage.ClosedWon, label: "Won" },
  { value: DealStage.ClosedLost, label: "Lost" },
];

export default function DealsPage() {
  const { data, isLoading, error } = useDeals();

  const deals = data?.data || [];

  const dealsByStage = stages.reduce(
    (acc, stage) => {
      acc[stage.value] = deals.filter((d: Deal) => d.stage === stage.value);
      return acc;
    },
    {} as Record<string, Deal[]>
  );

  const totalPipelineValue = deals.reduce((sum: number, deal: Deal) => sum + deal.value, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin text-primary-600" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-error/10 border border-error text-error px-4 py-3 rounded">
          Failed to load deals. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Pipeline</h1>
          <p className="text-neutral-600 mt-1">
            Total Value: ${totalPipelineValue.toLocaleString()} • {deals.length} deals
          </p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Plus size={20} />
          <span>New Deal</span>
        </button>
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-6 min-w-max">
          {stages.map((stage) => {
            const stageDeal = dealsByStage[stage.value] || [];
            return (
              <div key={stage.value} className="w-80 flex-shrink-0">
                {/* Column Header */}
                <div className="mb-4">
                  <h2 className="font-semibold text-lg mb-2">{stage.label}</h2>
                  <p className="text-sm text-neutral-600">
                    {stageDeal.length} deal{stageDeal.length !== 1 ? "s" : ""} •{" "}
                    ${stageDeal.reduce((sum, d) => sum + d.value, 0).toLocaleString()}
                  </p>
                </div>

                {/* Cards */}
                <div className="space-y-3">
                  {stageDeal.map((deal: Deal) => (
                    <div key={deal.id} className="card p-4 hover:shadow-md transition-shadow cursor-pointer">
                      <h3 className="font-semibold mb-2 line-clamp-2">{deal.title}</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-600">Amount:</span>
                          <span className="font-semibold">
                            ${deal.value.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-600">Probability:</span>
                          <span className="font-semibold">{deal.probability}%</span>
                        </div>
                        <div className="pt-2 border-t border-neutral-200">
                          <p className="text-xs text-neutral-500">
                            {deal.contact?.firstName} {deal.contact?.lastName}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {stageDeal.length === 0 && (
                    <div className="card p-4 text-center text-neutral-400 py-8">
                      <p className="text-sm">No deals</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
