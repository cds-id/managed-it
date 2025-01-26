"use client"
import { useState } from "react"
import { useQuery, useMutation } from "@blitzjs/rpc"
import getApiTokens from "../queries/getApiTokens"
import deleteApiToken from "../mutations/deleteApiToken"
import { formatDistanceToNow } from "date-fns"
import { CreateTokenModal } from "./CreateTokenModal"

export function ApiTokenList() {
  const [{ tokens }, { refetch }] = useQuery(getApiTokens, {})
  const [deleteApiTokenMutation] = useMutation(deleteApiToken)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newToken, setNewToken] = useState<string | null>(null)

  const handleTokenCreated = (token: string) => {
    setNewToken(token)
    refetch()
  }

  const handleCloseNewTokenModal = () => {
    setNewToken(null)
  }

  const handleDelete = async (tokenId: string) => {
    if (confirm("Are you sure you want to delete this token?")) {
      await deleteApiTokenMutation({ id: tokenId })
      refetch()
    }
  }

  return (
    <div className="mt-8">
      <div className="mb-4">
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Create New Token
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {tokens.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No API tokens found. Create one to get started.
          </div>
        ) : (
          <ul role="list" className="divide-y divide-gray-200">
            {tokens.map((token) => (
              <li key={token.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-indigo-600 truncate">{token.name}</p>
                      <p className="mt-1 text-xs text-gray-500">Type: {token.type}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">
                        {token.lastUsedAt
                          ? `Last used ${formatDistanceToNow(new Date(token.lastUsedAt))} ago`
                          : "Never used"}
                      </span>
                      <button
                        onClick={() => handleDelete(token.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <CreateTokenModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onTokenCreated={handleTokenCreated}
      />

      {newToken && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Save Your API Token</h3>
            <p className="text-sm text-gray-500 mb-4">
              Make sure to copy your API token now. You won&rsquo;t be able to see it again!
            </p>
            <div className="bg-gray-100 p-4 rounded break-all font-mono text-sm mb-4">
              {newToken}
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => navigator.clipboard.writeText(newToken)}
                className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Copy to Clipboard
              </button>
              <button
                onClick={handleCloseNewTokenModal}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
