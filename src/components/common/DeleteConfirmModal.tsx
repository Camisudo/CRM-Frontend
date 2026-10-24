import { AlertTriangle, Loader } from "lucide-react";
import Modal from "./Modal";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  itemType: "contact" | "deal" | "task";
  isLoading?: boolean;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  itemType,
  isLoading = false,
}: DeleteConfirmModalProps) {
  const itemTypeLabel = {
    contact: "Contact",
    deal: "Deal",
    task: "Task",
  }[itemType];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Delete ${itemTypeLabel}`}
      size="sm"
    >
      <div className="space-y-4">
        {/* Warning icon and message */}
        <div className="flex gap-3">
          <AlertTriangle className="flex-shrink-0 text-brand" size={24} />
          <div>
            <p className="font-semibold">
              Are you sure you want to delete this {itemTypeLabel.toLowerCase()}?
            </p>
            <p className="text-sm text-neutral-600 mt-1">
              "{itemName}"
            </p>
          </div>
        </div>

        {/* Warning text */}
        <div className="bg-brand/10 border border-brand/30 rounded p-3">
          <p className="text-sm text-neutral-700">
            This action cannot be undone. All associated data will be permanently removed.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end border-t pt-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="btn-secondary disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-error text-white rounded-lg hover:opacity-90 font-medium flex items-center gap-2 disabled:opacity-50 transition-colors"
          >
            {isLoading && <Loader size={18} className="animate-spin" />}
            Delete {itemTypeLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
