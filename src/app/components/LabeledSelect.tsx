import { forwardRef } from "react"
import { useField, useFormikContext } from "formik"

interface Option {
  label: string
  value: string
}

interface LabeledSelectProps {
  name: string
  label: string
  options: Array<{ label: string; value: string }>
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
  placeholder?: string
}

export const LabeledSelect = forwardRef<HTMLSelectElement, LabeledSelectProps>(
  ({ name, label, options, onChange, ...props }, ref) => {
    const [field] = useField(name)
    const { isSubmitting } = useFormikContext()

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700">
          {label}
          <select
            {...field}
            disabled={isSubmitting}
            ref={ref}
            onChange={(e) => {
              field.onChange(e)
              onChange?.(e)
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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

LabeledSelect.displayName = "LabeledSelect"
