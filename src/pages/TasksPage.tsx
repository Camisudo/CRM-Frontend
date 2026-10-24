import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTasks, useDeleteTask, useToggleTaskComplete } from "../hooks/useTasks";
import { useBulkSelection } from "../hooks/useBulkSelection";
import { useUIStore } from "../store/uiStore";
import { apiClient } from "../services/api";
import { TaskStatus } from "../types";
import { Plus, Loader, CheckCircle2, Circle, Edit2, Trash2 } from "lucide-react";
import TaskFormModal from "../components/features/TaskFormModal";
import DeleteConfirmModal from "../components/common/DeleteConfirmModal";
import type { Task } from "../types";

const taskTypeColors: Record<string, string> = {
  call: "bg-neutral-100 text-ink",
  email: "bg-neutral-100 text-ink",
  meeting: "bg-neutral-100 text-ink",
  follow_up: "bg-neutral-100 text-ink",
  other: "bg-neutral-100 text-ink",
};

const priorityColors: Record<string, string> = {
  high: "text-error",
  medium: "text-brand",
  low: "text-neutral-400",
};

const statusOptions: { value: TaskStatus | ""; label: string }[] = [
  { value: "", label: "All" },
  { value: TaskStatus.Open, label: "Open" },
  { value: TaskStatus.InProgress, label: "In Progress" },
  { value: TaskStatus.Completed, label: "Completed" },
];

export default function TasksPage() {
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "">("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showBulkDelete, setShowBulkDelete] = useState(false);
  const [bulkBusy, setBulkBusy] = useState(false);

  const { data, isLoading, error } = useTasks({
    status: statusFilter ? [statusFilter] : undefined,
    priority: priorityFilter ? [priorityFilter] : undefined,
    type: typeFilter ? [typeFilter] : undefined,
    sortBy: "dueDate",
    sortOrder: "asc",
    limit: 100,
  });

  const { openModal, showNotification } = useUIStore();
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask();
  const { mutate: toggleComplete } = useToggleTaskComplete();
  const queryClient = useQueryClient();

  const tasks: Task[] = data?.data || [];
  const bulk = useBulkSelection(tasks);

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    openModal("task-form");
  };

  const handleDeleteClick = (task: Task) => {
    setSelectedTask(task);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (selectedTask) {
      deleteTask(selectedTask.id, {
        onSuccess: () => {
          setShowDeleteConfirm(false);
          setSelectedTask(null);
        },
      });
    }
  };

  // Sequential per-item PATCH; the API has no bulk endpoint.
  const handleBulkComplete = async () => {
    const ids = bulk.selectedIds;
    setBulkBusy(true);
    let failed = 0;
    for (const id of ids) {
      try {
        await apiClient.updateTask(id, {
          status: TaskStatus.Completed,
          completedAt: new Date().toISOString(),
        } as Partial<Task>);
      } catch {
        failed += 1;
      }
    }
    setBulkBusy(false);
    bulk.clear();
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
    queryClient.invalidateQueries({ queryKey: ["my-tasks"] });
    const ok = ids.length - failed;
    showNotification({
      type: failed ? "warning" : "success",
      message: failed
        ? `Completed ${ok} of ${ids.length} tasks; ${failed} failed`
        : `Completed ${ok} task${ok === 1 ? "" : "s"}`,
    });
  };

  // Sequential per-item DELETE; the API has no bulk endpoint.
  const handleBulkDelete = async () => {
    const ids = bulk.selectedIds;
    setBulkBusy(true);
    let failed = 0;
    for (const id of ids) {
      try {
        await apiClient.deleteTask(id);
      } catch {
        failed += 1;
      }
    }
    setBulkBusy(false);
    setShowBulkDelete(false);
    bulk.clear();
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
    queryClient.invalidateQueries({ queryKey: ["my-tasks"] });
    const ok = ids.length - failed;
    showNotification({
      type: failed ? "warning" : "success",
      message: failed
        ? `Deleted ${ok} of ${ids.length} tasks; ${failed} failed`
        : `Deleted ${ok} task${ok === 1 ? "" : "s"}`,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin text-brand" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-error/10 border border-error text-error px-4 py-3 rounded">
          Failed to load tasks. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <button
          onClick={() => {
            setSelectedTask(null);
            openModal("task-form");
          }}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>New Task</span>
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3">
        <div className="flex gap-2">
          {statusOptions.map((option) => (
            <button
              key={option.value || "all"}
              onClick={() => setStatusFilter(option.value)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                statusFilter === option.value
                  ? "bg-brand text-night"
                  : "bg-neutral-200 text-neutral-900 hover:bg-neutral-300"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        <select
          aria-label="Filter by priority"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="input-base w-40"
        >
          <option value="">All priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select
          aria-label="Filter by type"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="input-base w-40"
        >
          <option value="">All types</option>
          <option value="call">Call</option>
          <option value="email">Email</option>
          <option value="meeting">Meeting</option>
          <option value="follow_up">Follow-up</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Bulk action bar */}
      {bulk.selected.size > 0 && (
        <div className="mb-4 flex items-center justify-between card p-3">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              aria-label="Select all tasks on this page"
              checked={bulk.allSelected}
              onChange={bulk.toggleAll}
            />
            <p className="text-sm">{bulk.selected.size} selected</p>
          </div>
          <div className="flex gap-2">
            <button onClick={bulk.clear} className="btn-secondary">
              Clear
            </button>
            <button
              onClick={handleBulkComplete}
              disabled={bulkBusy}
              className="btn-primary disabled:opacity-50"
            >
              Mark complete
            </button>
            <button
              onClick={() => setShowBulkDelete(true)}
              disabled={bulkBusy}
              className="px-4 py-2 bg-error text-white rounded-lg hover:opacity-90 font-medium disabled:opacity-50"
            >
              Delete selected
            </button>
          </div>
        </div>
      )}

      {/* Tasks List */}
      <div className="space-y-3">
        {tasks.length > 0 ? (
          tasks.map((task) => {
            const completed = task.status === TaskStatus.Completed;
            return (
              <div
                key={task.id}
                className={`card p-4 flex items-start space-x-4 hover:shadow-md transition-shadow ${
                  completed ? "opacity-60" : ""
                }`}
              >
                <input
                  type="checkbox"
                  aria-label={`Select task ${task.title}`}
                  className="mt-2"
                  checked={bulk.selected.has(task.id)}
                  onChange={() => bulk.toggle(task.id)}
                />

                <button
                  onClick={() =>
                    toggleComplete({ id: task.id, completed: !completed })
                  }
                  title={completed ? "Mark open" : "Mark complete"}
                  className="mt-1 text-neutral-400 hover:text-brand transition-colors flex-shrink-0"
                >
                  {completed ? (
                    <CheckCircle2 size={24} className="text-ink" />
                  ) : (
                    <Circle size={24} />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className={`font-semibold ${completed ? "line-through text-neutral-400" : ""}`}>
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-sm text-neutral-600 mt-1">{task.description}</p>
                      )}
                      <div className="flex gap-2 mt-3 flex-wrap">
                        <span className={`text-xs px-2 py-1 rounded ${taskTypeColors[task.type]}`}>
                          {task.type}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded font-medium ${priorityColors[task.priority]}`}>
                          {task.priority}
                        </span>
                        {task.relatedTo?.contact && (
                          <span className="text-xs px-2 py-1 bg-neutral-100 rounded">
                            {task.relatedTo.contact.firstName}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      <div className="text-right mb-3">
                        {task.dueDate && (
                          <p className="text-sm text-neutral-600">
                            {new Date(task.dueDate).toLocaleDateString()}
                          </p>
                        )}
                        <p className="text-xs text-neutral-500">{task.assignedTo?.firstName}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditTask(task)}
                          className="p-2 text-neutral-600 hover:bg-neutral-100 rounded transition-colors"
                          title="Edit task"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(task)}
                          className="p-2 text-error hover:bg-error/10 rounded transition-colors"
                          title="Delete task"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="card p-12 text-center">
            <p className="text-neutral-500">No tasks found</p>
          </div>
        )}
      </div>

      <TaskFormModal task={selectedTask || undefined} />

      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setSelectedTask(null);
        }}
        onConfirm={handleConfirmDelete}
        itemName={selectedTask?.title || ""}
        itemType="task"
        isLoading={isDeleting}
      />

      <DeleteConfirmModal
        isOpen={showBulkDelete}
        onClose={() => setShowBulkDelete(false)}
        onConfirm={handleBulkDelete}
        itemName={`${bulk.selected.size} selected tasks`}
        itemType="task"
        isLoading={bulkBusy}
      />
    </div>
  );
}
