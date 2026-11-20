import { useAuthStore } from "../../store/authStore";
import { LogOut, Bell, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">CRM Dashboard</h1>
      </div>

      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button type="button" aria-label="Notifications" className="p-2 hover:bg-neutral-100 rounded-lg relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
        </button>

        {/* User menu */}
        <div className="flex items-center space-x-3 border-l border-neutral-200 pl-4">
          <div className="text-right">
            <p className="text-sm font-medium">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-neutral-500">{user?.role}</p>
          </div>
          <button type="button" aria-label="Account" className="p-2 hover:bg-neutral-100 rounded-lg">
            <User size={20} />
          </button>
          <button
            onClick={handleLogout}
            aria-label="Log out"
            className="p-2 hover:bg-neutral-100 rounded-lg text-error"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
