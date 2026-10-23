export default function DashboardPage() {
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-8">Welcome to CRM</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Metric cards */}
        <div className="card p-6">
          <p className="text-sm text-neutral-600 mb-2">Total Contacts</p>
          <p className="text-3xl font-bold">--</p>
        </div>
        <div className="card p-6">
          <p className="text-sm text-neutral-600 mb-2">Active Deals</p>
          <p className="text-3xl font-bold">--</p>
        </div>
        <div className="card p-6">
          <p className="text-sm text-neutral-600 mb-2">Pipeline Value</p>
          <p className="text-3xl font-bold">--</p>
        </div>
        <div className="card p-6">
          <p className="text-sm text-neutral-600 mb-2">Win Rate</p>
          <p className="text-3xl font-bold">--%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent deals */}
        <div className="lg:col-span-2 card p-6">
          <h3 className="font-semibold mb-4">Recent Deals</h3>
          <p className="text-neutral-500">No data available yet</p>
        </div>

        {/* My tasks */}
        <div className="card p-6">
          <h3 className="font-semibold mb-4">My Tasks</h3>
          <p className="text-neutral-500">No tasks assigned</p>
        </div>
      </div>
    </div>
  );
}
