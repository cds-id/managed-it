'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface ConfigState {
  isConfigured: boolean
  isLoading: boolean
  error: string | null
}

const ConfigContext = createContext<ConfigState>({
  isConfigured: false,
  isLoading: true,
  error: null
})

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ConfigState>({
    isConfigured: false,
    isLoading: true,
    error: null
  })
  const router = useRouter()

  useEffect(() => {
    async function checkConfiguration() {
      try {
        const response = await fetch('/api/setup/check')
        const data = await response.json()

        setState({
          isConfigured: data.isConfigured,
          isLoading: false,
          error: data.error || null
        })

        if (!data.isConfigured) {
          router.push('/setup')
        }
      } catch (error) {
        setState({
          isConfigured: false,
          isLoading: false,
          error: 'Failed to check system configuration'
        })
        router.push('/setup')
      }
    }

    checkConfiguration()
  }, [router])

  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  if (state.error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Configuration Error</h2>
          <p className="text-gray-600 mb-4">{state.error}</p>
          <button
            onClick={() => router.push('/setup')}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
          >
            Go to Setup
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export const useConfig = () => useContext(ConfigContext)
