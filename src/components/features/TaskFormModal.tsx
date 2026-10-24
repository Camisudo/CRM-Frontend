import { useState } from "react";
import { useCreateTask, useUpdateTask } from "../../hooks/useTasks";
import { useUIStore } from "../../store/uiStore";
import Modal from "../common/Modal";
import FormInput from "../common/FormInput";
import FormSelect from "../common/FormSelect";
import FormTextarea from "../common/FormTextarea";
import { Loader } from "lucide-react";
import { TaskStatus, TaskType } from "../../types";
import type { Task } from "../../types";

interface TaskFormModalProps {
  task?: Task;
}

export default function TaskFormModal({ task }: TaskFormModalProps) {
  const { modal, closeModal } = useUIStore();
  const { mutate: createTask, isPending: isCreating } = useCreateTask();
  const { mutate: updateTask, isPending: isUpdating } = useUpdateTask(
    task?.id || ""
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    type: task?.type || TaskType.Call,
    status: task?.status || TaskStatus.Open,
    priority: task?.priority || "medium",
    dueDate: task?.dueDate ? task.dueDate.split("T")[0] : "",
  });

  const isOpen = modal.isOpen && modal.type === "task-form";
  const isEditing = !!task;
  const isLoading = isCreating || isUpdating;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      title: formData.title,
      description: formData.description || undefined,
      type: formData.type as TaskType,
      status: formData.status as TaskStatus,
      priority: formData.priority as "low" | "medium" | "high",
      dueDate: formData.dueDate || undefined,
    };

    if (isEditing) {
      updateTask(payload, {
        onSuccess: () => {
          closeModal();
        },
      });
    } else {
      createTask(payload, {
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
      title={isEditing ? "Edit Task" : "New Task"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          id="title"
          label="Task Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          error={errors.title}
          required
        />

        <FormTextarea
          id="description"
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Optional task details"
        />

        <div className="grid grid-cols-2 gap-4">
          <FormSelect
            id="type"
            label="Task Type"
            value={formData.type}
            onChange={(e) =>
              setFormData({
                ...formData,
                type: e.target.value as TaskType,
              })
            }
            options={[
              { value: TaskType.Call, label: "Call" },
              { value: TaskType.Email, label: "Email" },
              { value: TaskType.Meeting, label: "Meeting" },
              { value: TaskType.FollowUp, label: "Follow-up" },
              { value: TaskType.Other, label: "Other" },
            ]}
            required
          />

          <FormSelect
            id="priority"
            label="Priority"
            value={formData.priority}
            onChange={(e) =>
              setFormData({
                ...formData,
                priority: e.target.value as "low" | "medium" | "high",
              })
            }
            options={[
              { value: "low", label: "Low" },
              { value: "medium", label: "Medium" },
              { value: "high", label: "High" },
            ]}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormSelect
            id="status"
            label="Status"
            value={formData.status}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value as TaskStatus,
              })
            }
            options={[
              { value: TaskStatus.Open, label: "Open" },
              { value: TaskStatus.InProgress, label: "In Progress" },
              { value: TaskStatus.Completed, label: "Completed" },
              { value: TaskStatus.Cancelled, label: "Cancelled" },
            ]}
            required
          />

          <FormInput
            id="dueDate"
            label="Due Date"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          />
        </div>

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
            {isEditing ? "Update Task" : "Create Task"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
