'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface ErrorBoundaryProps {
  children: React.ReactNode
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('Error caught by boundary:', error)
      // Check if error is related to missing env or configuration
      if (error.message.includes('Configuration error') ||
          error.message.includes('Environment variables not found')) {
        setHasError(true)
        router.push('/setup')
      }
    }

    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [router])

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              System Setup Required
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              The application needs to be configured. Redirecting to setup...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
