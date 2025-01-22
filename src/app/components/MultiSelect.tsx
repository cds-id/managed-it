import { forwardRef } from "react"
import { useField, useFormikContext } from "formik"

interface Option {
  label: string
  value: string
}

interface MultiSelectProps {
  name: string
  label: string
  options: Option[]
  placeholder?: string
}

export const MultiSelect = forwardRef<HTMLSelectElement, MultiSelectProps>(
  ({ name, label, options, placeholder }, ref) => {
    const [field, , helpers] = useField(name)
    const { isSubmitting } = useFormikContext()

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700">
          {label}
          <select
            {...field}
            multiple
            disabled={isSubmitting}
            ref={ref}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={field.value || []}
            onChange={(e) => {
              const values = Array.from(e.target.selectedOptions).map((option) => option.value)
              helpers.setValue(values)
            }}
          >
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

MultiSelect.displayName = "MultiSelect"
