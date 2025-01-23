'use client'
import { useState } from 'react'
import { DatabaseConfig, buildConnectionConfig } from '@/src/lib/validators/database'

export function DatabaseStep({
  config,
  onChange,
  onNext,
  onBack
}: {
  config: DatabaseConfig
  onChange: (config: DatabaseConfig) => void
  onNext: () => void
  onBack: () => void
}) {
  const [validating, setValidating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleValidateDatabase = async (config: DatabaseConfig) => {
    try {
      const response = await fetch('/api/setup/validate-db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(buildConnectionConfig(config)),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Database validation failed')
      }

      const data = await response.json()
      return data
    } catch (error: any) {
      throw new Error(error.message || 'Failed to validate database connection')
    }
  }

  const handleSubmit = async () => {
    try {
      setValidating(true)
      setError(null)

      const result = await handleValidateDatabase(config)

      if (result.success) {
        onNext()
      } else {
        setError(result.error)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setValidating(false)
    }
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Database Configuration</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Database Host
          </label>
          <input
            type="text"
            value={config.host}
            onChange={(e) => onChange({ ...config, host: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Port
          </label>
          <input
            type="text"
            value={config.port}
            onChange={(e) => onChange({ ...config, port: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Database Name
          </label>
          <input
            type="text"
            value={config.database}
            onChange={(e) => onChange({ ...config, database: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            value={config.username}
            onChange={(e) => onChange({ ...config, username: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        <div className="flex justify-between pt-4">
          <button
            onClick={onBack}
            disabled={validating}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
          >
            Back
          </button>
          <button
            onClick={handleSubmit}
            disabled={validating}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            {validating ? 'Validating...' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}
