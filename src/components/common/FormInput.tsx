interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
}

export default function FormInput({
  label,
  error,
  required,
  id,
  ...props
}: FormInputProps) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium mb-1">
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </label>
      <input
        id={id}
        className={`input-base ${error ? "border-error focus:ring-error" : ""}`}
        {...props}
      />
      {error && <p className="text-sm text-error mt-1">{error}</p>}
    </div>
  );
}
