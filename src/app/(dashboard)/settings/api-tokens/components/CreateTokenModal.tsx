"use client"
import { Dialog } from "@headlessui/react"
import { useState } from "react"
import { useMutation } from "@blitzjs/rpc"
import createApiToken from "../mutations/createApiToken"

interface CreateTokenModalProps {
  isOpen: boolean
  onClose: () => void
  onTokenCreated: (token: string) => void
}

export function CreateTokenModal({ isOpen, onClose, onTokenCreated }: CreateTokenModalProps) {
  const [createApiTokenMutation] = useMutation(createApiToken)
  const [name, setName] = useState("")
  const [type, setType] = useState<"PERSONAL" | "INTEGRATION">("PERSONAL")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      const result = await createApiTokenMutation({ name, type })
      onTokenCreated(result.token)
      // Reset form
      setName("")
      setType("PERSONAL")
      // Close the create modal
      onClose()
    } catch (error) {
      console.error("Failed to create token:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setName("")
      setType("PERSONAL")
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-6">
          <Dialog.Title className="text-lg font-medium mb-4">Create API Token</Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Token Name
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="My API Token"
                  required
                  disabled={isSubmitting}
                />
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Token Type
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as "PERSONAL" | "INTEGRATION")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  disabled={isSubmitting}
                >
                  <option value="PERSONAL">Personal</option>
                  <option value="INTEGRATION">Integration</option>
                </select>
              </label>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Creating...
                  </span>
                ) : (
                  "Create Token"
                )}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}
