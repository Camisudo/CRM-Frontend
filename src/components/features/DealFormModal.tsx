import { useState } from "react";
import { useCreateDeal, useUpdateDeal } from "../../hooks/useDeals";
import { useUIStore } from "../../store/uiStore";
import Modal from "../common/Modal";
import FormInput from "../common/FormInput";
import FormSelect from "../common/FormSelect";
import { Loader } from "lucide-react";
import { DealStage } from "../../types";
import type { Deal } from "../../types";

interface DealFormModalProps {
  deal?: Deal;
}

function DealFormModalInner({
  deal: initialDeal,
}: DealFormModalProps) {
  const { modal, closeModal } = useUIStore();
  const { mutate: createDeal, isPending: isCreating } = useCreateDeal();
  const { mutate: updateDeal, isPending: isUpdating } = useUpdateDeal(
    initialDeal?.id || ""
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    title: initialDeal?.title || "",
    description: initialDeal?.description || "",
    value: initialDeal?.value?.toString() || "",
    currency: initialDeal?.currency || "USD",
    stage: initialDeal?.stage || DealStage.Prospect,
    probability: initialDeal?.probability?.toString() || "50",
    expectedCloseDate: initialDeal?.expectedCloseDate
      ? initialDeal.expectedCloseDate.split("T")[0]
      : "",
  });

  const isOpen = modal.isOpen && modal.type === "deal-form";
  const isEditing = !!initialDeal;
  const isLoading = isCreating || isUpdating;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.value) newErrors.value = "Value is required";
    if (isNaN(Number(formData.value))) newErrors.value = "Value must be a number";
    if (isNaN(Number(formData.probability))) newErrors.probability = "Probability must be a number";
    const prob = Number(formData.probability);
    if (prob < 0 || prob > 100) newErrors.probability = "Probability must be between 0 and 100";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      title: formData.title,
      description: formData.description || undefined,
      value: Number(formData.value),
      currency: formData.currency,
      stage: formData.stage as DealStage,
      probability: Number(formData.probability),
      expectedCloseDate: formData.expectedCloseDate || undefined,
    };

    if (isEditing) {
      updateDeal(payload, {
        onSuccess: () => {
          closeModal();
        },
      });
    } else {
      createDeal(payload, {
        onSuccess: () => {
          closeModal();
        },
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      title={isEditing ? "Edit Deal" : "New Deal"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          id="title"
          label="Deal Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          error={errors.title}
          required
        />

        <FormInput
          id="description"
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Optional details about the deal"
        />

        <div className="grid grid-cols-2 gap-4">
          <FormInput
            id="value"
            label="Deal Value"
            type="number"
            value={formData.value}
            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
            error={errors.value}
            required
          />
          <FormSelect
            id="currency"
            label="Currency"
            value={formData.currency}
            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
            options={[
              { value: "USD", label: "USD" },
              { value: "EUR", label: "EUR" },
              { value: "GBP", label: "GBP" },
              { value: "CAD", label: "CAD" },
            ]}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormSelect
            id="stage"
            label="Stage"
            value={formData.stage}
            onChange={(e) =>
              setFormData({
                ...formData,
                stage: e.target.value as DealStage,
              })
            }
            options={[
              { value: DealStage.Prospect, label: "Prospect" },
              { value: DealStage.Qualified, label: "Qualified" },
              { value: DealStage.Proposal, label: "Proposal" },
              { value: DealStage.Negotiation, label: "Negotiation" },
              { value: DealStage.ClosedWon, label: "Won" },
              { value: DealStage.ClosedLost, label: "Lost" },
            ]}
            required
          />
          <FormInput
            id="probability"
            label="Probability (%)"
            type="number"
            min="0"
            max="100"
            value={formData.probability}
            onChange={(e) => setFormData({ ...formData, probability: e.target.value })}
            error={errors.probability}
            required
          />
        </div>

        <FormInput
          id="expectedCloseDate"
          label="Expected Close Date"
          type="date"
          value={formData.expectedCloseDate}
          onChange={(e) =>
            setFormData({ ...formData, expectedCloseDate: e.target.value })
          }
        />

        {/* Actions */}
        <div className="flex gap-3 justify-end border-t pt-4">
          <button
            type="button"
            onClick={closeModal}
            disabled={isLoading}
            className="btn-secondary disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading && <Loader size={18} className="animate-spin" />}
            {isEditing ? "Update Deal" : "Create Deal"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

/**
 * Renders nothing while closed. The inner form mounts on each open, so its
 * fields initialise from the current record. Keying by id also resets the
 * form when switching between records.
 */
export default function DealFormModal(props: { deal?: Deal }) {
  const modal = useUIStore((s) => s.modal);
  if (!(modal.isOpen && modal.type === "deal-form")) return null;
  return <DealFormModalInner key={props.deal?.id ?? "new"} {...props} />;
}
