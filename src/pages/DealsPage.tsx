import { useState } from "react";
import { useDeals, useDeleteDeal } from "../hooks/useDeals";
import { useUIStore } from "../store/uiStore";
import { DealStage } from "../types";
import { Plus, Loader, Edit2, Trash2 } from "lucide-react";
import DealFormModal from "../components/features/DealFormModal";
import DeleteConfirmModal from "../components/common/DeleteConfirmModal";
import type { Deal } from "../types";

const stages = [
  { value: DealStage.Prospect, label: "Prospect", color: "bg-blue-100" },
  { value: DealStage.Qualified, label: "Qualified", color: "bg-cyan-100" },
  { value: DealStage.Proposal, label: "Proposal", color: "bg-yellow-100" },
  { value: DealStage.Negotiation, label: "Negotiation", color: "bg-orange-100" },
  { value: DealStage.ClosedWon, label: "Won", color: "bg-green-100" },
  { value: DealStage.ClosedLost, label: "Lost", color: "bg-red-100" },
];

export default function DealsPage() {
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");

  const { data, isLoading, error } = useDeals({
    minValue: minValue || undefined,
    maxValue: maxValue || undefined,
    limit: 100,
  });
  const { openModal } = useUIStore();
  const { mutate: deleteDeal, isPending: isDeleting } = useDeleteDeal();

  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const deals = data?.data || [];

  const dealsByStage = stages.map((stage) => ({
    ...stage,
    deals: deals.filter((d: Deal) => d.stage === stage.value),
  }));

  const totalPipelineValue = deals.reduce((sum: number, d: Deal) => sum + (d.value || 0), 0);

  const handleEditDeal = (deal: Deal) => {
    setSelectedDeal(deal);
    openModal("deal-form");
  };

  const handleDeleteClick = (deal: Deal) => {
    setSelectedDeal(deal);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (selectedDeal) {
      deleteDeal(selectedDeal.id, {
        onSuccess: () => {
          setShowDeleteConfirm(false);
          setSelectedDeal(null);
        },
      });
    }
  };

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
        <button
          onClick={() => {
            setSelectedDeal(null);
            openModal("deal-form");
          }}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>New Deal</span>
        </button>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <input
          type="number"
          min="0"
          aria-label="Minimum value"
          placeholder="Min value"
          value={minValue}
          onChange={(e) => setMinValue(e.target.value)}
          className="input-base w-40"
        />
        <input
          type="number"
          min="0"
          aria-label="Maximum value"
          placeholder="Max value"
          value={maxValue}
          onChange={(e) => setMaxValue(e.target.value)}
          className="input-base w-40"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="animate-spin text-primary-600" size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
          {dealsByStage.map((stage) => (
            <div key={stage.value}>
              <h2 className="font-semibold text-sm mb-4">
                {stage.label} ({stage.deals.length})
              </h2>
              <div className="space-y-3">
                {stage.deals.map((deal: Deal) => (
                  <div
                    key={deal.id}
                    className={`${stage.color} p-4 rounded-lg border cursor-pointer hover:shadow-md transition-shadow`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{deal.title}</p>
                        <p className="text-xs text-neutral-600 mt-1">
                          ${deal.value?.toLocaleString() || 0}
                        </p>
                        <p className="text-xs text-neutral-600">
                          {deal.probability}% likely
                        </p>
                      </div>

                      {/* Row Actions */}
                      <div className="flex gap-1 flex-shrink-0">
                        <button
                          onClick={() => handleEditDeal(deal)}
                          className="p-1.5 hover:bg-white/50 rounded transition-colors"
                          title="Edit deal"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(deal)}
                          className="p-1.5 hover:bg-red-200 rounded transition-colors text-error"
                          title="Delete deal"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Deal Form Modal */}
      <DealFormModal deal={selectedDeal || undefined} />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setSelectedDeal(null);
        }}
        onConfirm={handleConfirmDelete}
        itemName={selectedDeal?.title || ""}
        itemType="deal"
        isLoading={isDeleting}
      />
    </div>
  );
}
