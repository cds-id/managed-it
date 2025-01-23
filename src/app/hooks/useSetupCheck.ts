'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export function useSetupCheck() {
  const [isChecking, setIsChecking] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function checkSetup() {
      try {
        const response = await fetch('/api/setup/check')
        const { isConfigured } = await response.json()

        if (!isConfigured) {
          router.push('/setup')
        }
      } catch (error) {
        console.error('Setup check failed:', error)
        router.push('/setup')
      } finally {
        setIsChecking(false)
      }
    }

    checkSetup()
  }, [router])

  return isChecking
}
