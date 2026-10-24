import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  CheckSquare,
  Activity,
  BarChart3,
  Menu,
} from "lucide-react";
import { useUIStore } from "../../store/uiStore";

export default function Sidebar() {
  const location = useLocation();
  const { sidebarOpen, toggleSidebar } = useUIStore();

  const menuItems = [
    { label: "Dashboard", path: "/", icon: LayoutDashboard },
    { label: "Contacts", path: "/contacts", icon: Users },
    { label: "Deals", path: "/deals", icon: Briefcase },
    { label: "Tasks", path: "/tasks", icon: CheckSquare },
    { label: "Activity", path: "/activity", icon: Activity },
    { label: "Reports", path: "/reports", icon: BarChart3 },
  ];

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 hover:bg-neutral-200 rounded"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <div
        className={`bg-neutral-900 text-white w-64 flex flex-col transition-all duration-300 ${
          !sidebarOpen ? "-translate-x-full lg:translate-x-0" : ""
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-neutral-800">
          <h1 className="text-2xl font-bold">CRM</h1>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary-600 text-white"
                    : "text-neutral-300 hover:bg-neutral-800"
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800">
          <p className="text-xs text-neutral-400">v1.0.0</p>
        </div>
      </div>
    </>
  );
}
