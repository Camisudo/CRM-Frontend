import { Routes, Route } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import Header from "../common/Header";
import DashboardPage from "../../pages/DashboardPage";

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
            {/* Routes for other pages will go here */}
          </Routes>
        </main>
      </div>
    </div>
  );
}
