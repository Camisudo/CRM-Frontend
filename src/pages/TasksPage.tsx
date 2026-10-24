import { useState } from "react";
import { useTasks, useDeleteTask, useToggleTaskComplete } from "../hooks/useTasks";
import { useUIStore } from "../store/uiStore";
import { TaskStatus } from "../types";
import { Plus, Loader, CheckCircle2, Circle, Edit2, Trash2 } from "lucide-react";
import TaskFormModal from "../components/features/TaskFormModal";
import DeleteConfirmModal from "../components/common/DeleteConfirmModal";
import type { Task } from "../types";

const taskTypeColors: Record<string, string> = {
  call: "bg-blue-100 text-blue-800",
  email: "bg-purple-100 text-purple-800",
  meeting: "bg-green-100 text-green-800",
  follow_up: "bg-orange-100 text-orange-800",
  other: "bg-gray-100 text-gray-800",
};

export default function TasksPage() {
  const [statusFilter, setStatusFilter] = useState<TaskStatus | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data, isLoading, error } = useTasks({
    status: statusFilter ? [statusFilter] : undefined,
    sortBy: "dueDate",
    sortOrder: "asc",
  });

  const { openModal } = useUIStore();
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask();
  const { mutate: toggleComplete } = useToggleTaskComplete();

  const tasks = data?.data || [];

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

  const priorityColors: Record<string, string> = {
    high: "text-error",
    medium: "text-warning",
    low: "text-neutral-400",
  };

  const statusOptions = [
    { value: null, label: "All" },
    { value: TaskStatus.Open, label: "Open" },
    { value: TaskStatus.InProgress, label: "In Progress" },
    { value: TaskStatus.Completed, label: "Completed" },
  ];

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
      <div className="mb-6 flex gap-2">
        {statusOptions.map((option) => (
          <button
            key={option.value || "all"}
            onClick={() => setStatusFilter(option.value as TaskStatus | null)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              statusFilter === option.value
                ? "bg-primary-600 text-white"
                : "bg-neutral-200 text-neutral-900 hover:bg-neutral-300"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {tasks.length > 0 ? (
          tasks.map((task: Task) => (
            <div
              key={task.id}
              className={`card p-4 flex items-start space-x-4 hover:shadow-md transition-shadow ${
                task.status === TaskStatus.Completed ? "opacity-60" : ""
              }`}
            >
              {/* Checkbox */}
              <button
                onClick={() =>
                  toggleComplete({
                    id: task.id,
                    completed: task.status !== TaskStatus.Completed,
                  })
                }
                className="mt-1 text-neutral-400 hover:text-primary-600 transition-colors flex-shrink-0"
              >
                {task.status === TaskStatus.Completed ? (
                  <CheckCircle2 size={24} className="text-success" />
                ) : (
                  <Circle size={24} />
                )}
              </button>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3
                      className={`font-semibold ${
                        task.status === TaskStatus.Completed ? "line-through text-neutral-400" : ""
                      }`}
                    >
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-sm text-neutral-600 mt-1">{task.description}</p>
                    )}

                    {/* Tags */}
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

                  {/* Due Date & Actions */}
                  <div className="flex-shrink-0">
                    <div className="text-right mb-3">
                      {task.dueDate && (
                        <p className="text-sm text-neutral-600">
                          {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      )}
                      <p className="text-xs text-neutral-500">
                        {task.assignedTo.firstName}
                      </p>
                    </div>

                    {/* Row Actions */}
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
          ))
        ) : (
          <div className="card p-12 text-center">
            <p className="text-neutral-500 mb-4">No tasks found</p>
          </div>
        )}
      </div>

      {/* Task Form Modal */}
      <TaskFormModal task={selectedTask || undefined} />

      {/* Delete Confirmation Modal */}
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
    </div>
  );
}
