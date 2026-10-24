import { useState } from "react";
import { useContacts } from "../hooks/useContacts";
import { useUIStore } from "../store/uiStore";
import { Link } from "react-router-dom";
import { Plus, Search, Loader } from "lucide-react";
import ContactFormModal from "../components/features/ContactFormModal";
import type { Contact } from "../types";

export default function ContactList() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useContacts({
    search,
    page,
    limit: 20,
  });

  const { openModal } = useUIStore();

  const handleOpenModal = () => {
    openModal("contact-form");
  };

  const contacts = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Contacts</h1>
        <button onClick={handleOpenModal} className="btn-primary flex items-center space-x-2">
          <Plus size={20} />
          <span>New Contact</span>
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-neutral-400" size={20} />
          <input
            type="text"
            placeholder="Search contacts..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="input-base pl-10"
          />
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader className="animate-spin text-primary-600" size={32} />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-error/10 border border-error text-error px-4 py-3 rounded mb-6">
          Failed to load contacts. Please try again.
        </div>
      )}

      {/* Table */}
      {!isLoading && contacts.length > 0 && (
        <>
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Phone</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Type</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Owner</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact: Contact) => (
                  <tr key={contact.id} className="border-b border-neutral-200 hover:bg-neutral-50">
                    <td className="px-6 py-3">
                      <Link
                        to={`/contacts/${contact.id}`}
                        className="text-primary-600 hover:underline font-medium"
                      >
                        {contact.firstName} {contact.lastName || ""}
                      </Link>
                    </td>
                    <td className="px-6 py-3 text-sm">{contact.email}</td>
                    <td className="px-6 py-3 text-sm">{contact.phone || "-"}</td>
                    <td className="px-6 py-3 text-sm">
                      <span className="px-2 py-1 bg-neutral-100 rounded text-xs font-medium">
                        {contact.type}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm">{contact.owner.firstName}</td>
                    <td className="px-6 py-3 text-sm">
                      <Link
                        to={`/contacts/${contact.id}`}
                        className="text-primary-600 hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-neutral-600">
                Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
              </p>
              <div className="space-x-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="btn-secondary disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
                  disabled={page === pagination.totalPages}
                  className="btn-secondary disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Empty state */}
      {!isLoading && contacts.length === 0 && (
        <div className="card p-12 text-center">
          <p className="text-neutral-500 mb-4">No contacts found</p>
          <button onClick={handleOpenModal} className="btn-primary">
            Create your first contact
          </button>
        </div>
      )}

      {/* Contact Form Modal */}
      <ContactFormModal />
    </div>
  );
}
