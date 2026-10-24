import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { useUIStore } from "../../store/uiStore";
import type { Notification } from "../../types";

export default function ToastContainer() {
  const { notifications, removeNotification } = useUIStore();

  const iconMap = {
    success: <CheckCircle2 size={20} className="text-ink" />,
    error: <AlertCircle size={20} className="text-error" />,
    warning: <AlertTriangle size={20} className="text-brand" />,
    info: <Info size={20} className="text-brand" />,
  };

  const bgMap = {
    success: "bg-neutral-100 border-neutral-300",
    error: "bg-error/10 border-error/30",
    warning: "bg-brand/10 border-brand/30",
    info: "bg-neutral-50 border-neutral-300",
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-3 max-w-sm">
      {notifications.map((notification: Notification) => (
        <div
          key={notification.id}
          className={`${bgMap[notification.type]} border rounded-lg p-4 shadow-lg flex items-start gap-3 animate-in fade-in slide-in-from-right`}
        >
          <div className="flex-shrink-0 mt-0.5">
            {iconMap[notification.type]}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-neutral-900">
              {notification.message}
            </p>
          </div>
          <button
            onClick={() => removeNotification(notification.id)}
            className="flex-shrink-0 text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      ))}
    </div>
  );
}
