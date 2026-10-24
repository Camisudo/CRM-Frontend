interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  required?: boolean;
}

export default function FormTextarea({
  label,
  error,
  required,
  id,
  ...props
}: FormTextareaProps) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium mb-1">
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </label>
      <textarea
        id={id}
        className={`input-base resize-none ${error ? "border-error focus:ring-error" : ""}`}
        rows={4}
        {...props}
      />
      {error && <p className="text-sm text-error mt-1">{error}</p>}
    </div>
  );
}
