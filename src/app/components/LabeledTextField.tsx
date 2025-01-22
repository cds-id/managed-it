import { forwardRef, PropsWithoutRef } from "react"
import { useField, useFormikContext, ErrorMessage } from "formik"
import { InputHTMLAttributes } from "react" // Add this import

export interface LabeledTextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "name"> {
  /** Field name. */
  name: string
  /** Field label. */
  label: string
  /** Field type. Doesn't include radio buttons and checkboxes */
  type?: "text" | "password" | "email" | "number"
  outerProps?: any
}

export const LabeledTextField = forwardRef<HTMLInputElement, LabeledTextFieldProps>(
  ({ name, label, outerProps, ...props }, ref) => {
    const [input] = useField(name)
    const { isSubmitting } = useFormikContext()

    return (
      <div {...outerProps}>
        <label className="block text-sm font-medium text-gray-700">
          {label}
          <input
            {...input}
            disabled={isSubmitting}
            {...props}
            ref={ref}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </label>

        <ErrorMessage name={name}>
          {(msg) => (
            <div role="alert" className="text-red-600 text-sm mt-1">
              {msg}
            </div>
          )}
        </ErrorMessage>
      </div>
    )
  }
)

LabeledTextField.displayName = "LabeledTextField"

export default LabeledTextField
