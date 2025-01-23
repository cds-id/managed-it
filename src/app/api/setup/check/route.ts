import { NextResponse } from 'next/server'
import { loadServerEnv } from '@/src/lib/env'
import { validateEnv } from '@/src/lib/validators/env'
import { checkDatabaseConnection } from '@/src/lib/db-check'

export async function GET() {
  try {
    // Load environment variables
    loadServerEnv()

    // Validate environment variables
    const envCheck = validateEnv()
    if (!envCheck.success) {
      return NextResponse.json({
        isConfigured: false,
        error: envCheck.error
      })
    }

    // Check database connection
    const dbCheck = await checkDatabaseConnection()
    if (!dbCheck.success) {
      return NextResponse.json({
        isConfigured: false,
        error: dbCheck.error
      })
    }

    return NextResponse.json({
      isConfigured: true,
      error: null
    })
  } catch (error: any) {
    return NextResponse.json({
      isConfigured: false,
      error: error.message || 'Configuration check failed'
    })
  }
}
