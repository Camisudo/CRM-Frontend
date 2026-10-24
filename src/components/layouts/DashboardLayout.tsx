import { Routes, Route } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import Header from "../common/Header";
import ToastContainer from "../common/ToastContainer";
import DashboardPage from "../../pages/DashboardPage";
import ContactsPage from "../../pages/ContactsPage";
import DealsPage from "../../pages/DealsPage";
import TasksPage from "../../pages/TasksPage";

export default function DashboardLayout() {
  return (
    <div className="flex h-screen bg-neutral-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/deals" element={<DealsPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            {/* Additional routes for detail pages will go here */}
          </Routes>
        </main>
      </div>

      {/* Toast notifications */}
      <ToastContainer />
    </div>
  );
}
