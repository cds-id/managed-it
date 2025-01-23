'use client'
import { useState } from 'react'
import { AdminUser } from '../types'
import { createAdmin } from '../actions/createAdmin'

export function AdminStep({
  config,
  onChange,
  onNext,
  onBack
}: {
  config: AdminUser
  onChange: (config: AdminUser) => void
  onNext: () => void
  onBack: () => void
}) {
  const [error, setError] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const handleSubmit = async () => {
    try {
      setIsCreating(true)
      setError(null)

      const result = await createAdmin(config)

      if (result.success) {
        onNext()
      } else {
        setError(result.error || 'Failed to create admin user')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Create Admin Account</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            value={config.name}
            onChange={(e) => onChange({ ...config, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter admin name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={config.email}
            onChange={(e) => onChange({ ...config, email: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="admin@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            value={config.password}
            onChange={(e) => onChange({ ...config, password: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter password"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            value={config.confirmPassword}
            onChange={(e) => onChange({ ...config, confirmPassword: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Confirm password"
          />
        </div>
      </div>

      {error && (
        <div className="text-red-600 text-sm mt-4">{error}</div>
      )}

      <div className="flex justify-between pt-8">
        <button
          onClick={onBack}
          disabled={isCreating}
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={isCreating}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          {isCreating ? 'Creating...' : 'Next'}
        </button>
      </div>
    </div>
  )
}
