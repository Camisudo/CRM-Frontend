import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useContacts, useDeleteContact } from "../hooks/useContacts";
import { useBulkSelection } from "../hooks/useBulkSelection";
import { useUIStore } from "../store/uiStore";
import { apiClient } from "../services/api";
import { Plus, Search, Loader, Edit2, Trash2 } from "lucide-react";
import ContactFormModal from "../components/features/ContactFormModal";
import DeleteConfirmModal from "../components/common/DeleteConfirmModal";
import type { Contact } from "../types";

type ContactTypeFilter = "" | "individual" | "company";

export default function ContactList() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<ContactTypeFilter>("");
  const [page, setPage] = useState(1);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showBulkDelete, setShowBulkDelete] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const { data, isLoading, error } = useContacts({
    search,
    type: typeFilter,
    page,
    limit: 20,
  });

  const { openModal, showNotification } = useUIStore();
  const { mutate: deleteContact, isPending: isDeleting } = useDeleteContact();
  const queryClient = useQueryClient();

  const contacts: Contact[] = data?.data || [];
  const pagination = data?.pagination;
  const bulk = useBulkSelection(contacts);

  const handleOpenNewModal = () => {
    setSelectedContact(null);
    openModal("contact-form");
  };

  const handleEditContact = (contact: Contact) => {
    setSelectedContact(contact);
    openModal("contact-form");
  };

  const handleDeleteClick = (contact: Contact) => {
    setSelectedContact(contact);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (selectedContact) {
      deleteContact(selectedContact.id, {
        onSuccess: () => {
          setShowDeleteConfirm(false);
          setSelectedContact(null);
        },
      });
    }
  };

  // Sequential per-item deletes; the API has no bulk endpoint.
  const handleBulkDelete = async () => {
    const ids = bulk.selectedIds;
    setBulkDeleting(true);
    let failed = 0;
    for (const id of ids) {
      try {
        await apiClient.deleteContact(id);
      } catch {
        failed += 1;
      }
    }
    setBulkDeleting(false);
    setShowBulkDelete(false);
    bulk.clear();
    queryClient.invalidateQueries({ queryKey: ["contacts"] });
    const ok = ids.length - failed;
    showNotification({
      type: failed ? "warning" : "success",
      message: failed
        ? `Deleted ${ok} of ${ids.length} contacts; ${failed} failed`
        : `Deleted ${ok} contact${ok === 1 ? "" : "s"}`,
    });
  };

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-error/10 border border-error text-error px-4 py-3 rounded">
          Failed to load contacts. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Contacts</h1>
        <button
          onClick={handleOpenNewModal}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>New Contact</span>
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-64">
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
        <select
          aria-label="Filter by contact type"
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value as ContactTypeFilter);
            setPage(1);
          }}
          className="input-base w-44"
        >
          <option value="">All types</option>
          <option value="individual">Individuals</option>
          <option value="company">Companies</option>
        </select>
      </div>

      {/* Bulk action bar */}
      {bulk.selected.size > 0 && (
        <div className="mb-4 flex items-center justify-between card p-3">
          <p className="text-sm">{bulk.selected.size} selected</p>
          <div className="flex gap-2">
            <button onClick={bulk.clear} className="btn-secondary">
              Clear
            </button>
            <button
              onClick={() => setShowBulkDelete(true)}
              className="px-4 py-2 bg-error text-white rounded-lg hover:opacity-90 font-medium"
            >
              Delete selected
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="animate-spin text-brand" size={32} />
        </div>
      ) : (
        <>
          {contacts.length > 0 && (
            <div className="card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-neutral-50">
                    <th className="px-4 py-3 w-10">
                      <input
                        type="checkbox"
                        aria-label="Select all contacts on this page"
                        checked={bulk.allSelected}
                        onChange={bulk.toggleAll}
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700">Phone</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700">Company</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-neutral-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact) => (
                    <tr key={contact.id} className="border-b hover:bg-neutral-50 transition-colors">
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          aria-label={`Select ${contact.firstName}`}
                          checked={bulk.selected.has(contact.id)}
                          onChange={() => bulk.toggle(contact.id)}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium">
                          {contact.firstName} {contact.lastName}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {contact.type === "individual" ? "Individual" : "Company"}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <a href={`mailto:${contact.email}`} className="text-brand hover:underline">
                          {contact.email}
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        {contact.phone ? (
                          <a href={`tel:${contact.phone}`} className="text-brand hover:underline">
                            {contact.phone}
                          </a>
                        ) : (
                          <span className="text-neutral-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {contact.companyName || <span className="text-neutral-400">—</span>}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditContact(contact)}
                            className="p-2 text-neutral-600 hover:bg-neutral-100 rounded transition-colors"
                            title="Edit contact"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(contact)}
                            className="p-2 text-error hover:bg-error/10 rounded transition-colors"
                            title="Delete contact"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {contacts.length === 0 && (
            <div className="card p-12 text-center">
              <p className="text-neutral-500 mb-4">No contacts found</p>
              <button onClick={handleOpenNewModal} className="btn-primary">
                Create your first contact
              </button>
            </div>
          )}

          {pagination && pagination.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-neutral-600">
                Page {pagination.page} of {pagination.totalPages}
              </p>
              <div className="flex gap-2">
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

      <ContactFormModal contact={selectedContact || undefined} />

      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setSelectedContact(null);
        }}
        onConfirm={handleConfirmDelete}
        itemName={selectedContact ? `${selectedContact.firstName} ${selectedContact.lastName}` : ""}
        itemType="contact"
        isLoading={isDeleting}
      />

      <DeleteConfirmModal
        isOpen={showBulkDelete}
        onClose={() => setShowBulkDelete(false)}
        onConfirm={handleBulkDelete}
        itemName={`${bulk.selected.size} selected contacts`}
        itemType="contact"
        isLoading={bulkDeleting}
      />
    </div>
  );
}
