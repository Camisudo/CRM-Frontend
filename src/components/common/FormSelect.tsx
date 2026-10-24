interface FormSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  required?: boolean;
  options: { value: string | number; label: string }[];
}

export default function FormSelect({
  label,
  error,
  required,
  id,
  options,
  ...props
}: FormSelectProps) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium mb-1">
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </label>
      <select
        id={id}
        className={`input-base ${error ? "border-error focus:ring-error" : ""}`}
        {...props}
      >
        <option value="">-- Select {label.toLowerCase()} --</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-error mt-1">{error}</p>}
    </div>
  );
}
