import { useState } from "react";
import { useCreateContact, useUpdateContact } from "../../hooks/useContacts";
import { useUIStore } from "../../store/uiStore";
import Modal from "../common/Modal";
import FormInput from "../common/FormInput";
import FormSelect from "../common/FormSelect";
import { Loader } from "lucide-react";
import type { Contact } from "../../types";

interface ContactFormModalProps {
  contact?: Contact;
}

export default function ContactFormModal({ contact }: ContactFormModalProps) {
  const { modal, closeModal } = useUIStore();
  const { mutate: createContact, isPending: isCreating } = useCreateContact();
  const { mutate: updateContact, isPending: isUpdating } = useUpdateContact(
    contact?.id || ""
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    type: contact?.type || "individual",
    firstName: contact?.firstName || "",
    lastName: contact?.lastName || "",
    companyName: contact?.companyName || "",
    email: contact?.email || "",
    phone: contact?.phone || "",
    website: contact?.website || "",
    street: contact?.address?.street || "",
    city: contact?.address?.city || "",
    state: contact?.address?.state || "",
    postalCode: contact?.address?.postalCode || "",
    country: contact?.address?.country || "",
  });

  const isOpen = modal.isOpen && modal.type === "contact-form";
  const isEditing = !!contact;
  const isLoading = isCreating || isUpdating;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (formData.type === "individual" && !formData.lastName.trim()) {
      newErrors.lastName = "Last name is required for individuals";
    }
    if (formData.type === "company" && !formData.companyName.trim()) {
      newErrors.companyName = "Company name is required for companies";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      type: formData.type as "individual" | "company",
      firstName: formData.firstName,
      lastName: formData.lastName || undefined,
      companyName: formData.companyName || undefined,
      email: formData.email,
      phone: formData.phone || undefined,
      website: formData.website || undefined,
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country,
      },
    };

    if (isEditing) {
      updateContact(payload, {
        onSuccess: () => {
          closeModal();
        },
      });
    } else {
      createContact(payload, {
        onSuccess: () => {
          closeModal();
        },
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      title={isEditing ? "Edit Contact" : "New Contact"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Contact Type */}
        <FormSelect
          id="type"
          label="Contact Type"
          value={formData.type}
          onChange={(e) =>
            setFormData({
              ...formData,
              type: e.target.value as "individual" | "company",
            })
          }
          options={[
            { value: "individual", label: "Individual" },
            { value: "company", label: "Company" },
          ]}
          required
        />

        {/* Name Fields */}
        {formData.type === "individual" ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                id="firstName"
                label="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                error={errors.firstName}
                required
              />
              <FormInput
                id="lastName"
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                error={errors.lastName}
                required
              />
            </div>
          </>
        ) : (
          <FormInput
            id="companyName"
            label="Company Name"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            error={errors.companyName}
            required
          />
        )}

        {/* Contact Information */}
        <FormInput
          id="email"
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
          required
        />

        <FormInput
          id="phone"
          label="Phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />

        <FormInput
          id="website"
          label="Website"
          type="url"
          value={formData.website}
          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
        />

        {/* Address */}
        <div className="border-t pt-4">
          <h3 className="font-semibold mb-4">Address (Optional)</h3>

          <FormInput
            id="street"
            label="Street"
            value={formData.street}
            onChange={(e) => setFormData({ ...formData, street: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              id="city"
              label="City"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
            <FormInput
              id="state"
              label="State"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              id="postalCode"
              label="Postal Code"
              value={formData.postalCode}
              onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
            />
            <FormInput
              id="country"
              label="Country"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end border-t pt-4">
          <button
            type="button"
            onClick={closeModal}
            disabled={isLoading}
            className="btn-secondary disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading && <Loader size={18} className="animate-spin" />}
            {isEditing ? "Update Contact" : "Create Contact"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
