import { forwardRef } from "react"
import { useField, useFormikContext } from "formik"

interface Option {
  label: string
  value: string
}

interface LabeledSelectProps {
  name: string
  label: string
  options: Option[]
  placeholder?: string
  className?: string
}

export const LabeledSelect = forwardRef<HTMLSelectElement, LabeledSelectProps>(
  ({ name, label, options, placeholder, className, ...props }, ref) => {
    const [input] = useField(name)
    const { isSubmitting } = useFormikContext()

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700">
          {label}
          <select
            {...input}
            disabled={isSubmitting}
            {...props}
            ref={ref}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    )
  }
)

LabeledSelect.displayName = "LabeledSelect"
