import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import Header from "../common/Header";
import ToastContainer from "../common/ToastContainer";
const DashboardPage = lazy(() => import("../../pages/DashboardPage"));
const ContactsPage = lazy(() => import("../../pages/ContactsPage"));
const DealsPage = lazy(() => import("../../pages/DealsPage"));
const TasksPage = lazy(() => import("../../pages/TasksPage"));
const ActivitiesPage = lazy(() => import("../../pages/ActivitiesPage"));
const ReportsPage = lazy(() => import("../../pages/ReportsPage"));

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
          <Suspense fallback={<p className="p-6 text-sm text-neutral-500">Loading…</p>}>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/deals" element={<DealsPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/activity" element={<ActivitiesPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            {/* Additional routes for detail pages will go here */}
          </Routes>
          </Suspense>
        </main>
      </div>

      {/* Toast notifications */}
      <ToastContainer />
    </div>
  );
}
