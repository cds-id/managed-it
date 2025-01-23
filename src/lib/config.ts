import { ConfigCheckResult } from './types/config'
import { join } from 'path'
import { readFile } from 'fs/promises'
import db from 'db'

export async function checkConfig(): Promise<ConfigCheckResult> {
  try {
    // Check if .env exists
    const envPath = join(process.cwd(), '.env')
    await readFile(envPath, 'utf-8')

    // Check required environment variables
    const requiredEnvVars = [
      'DATABASE_URL',
      'SESSION_SECRET_KEY',
      'COMPANY_NAME',
      'UPLOAD_PROVIDER'
    ]

    const missingVars = requiredEnvVars.filter(
      (varName) => !process.env[varName]
    )

    if (missingVars.length > 0) {
      return {
        success: false,
        error: `Missing required environment variables: ${missingVars.join(', ')}`
      }
    }

    // Check database connection
    try {
      await db.$connect()

      // Check if admin user exists
      const adminExists = await db.user.findFirst({
        where: { role: 'ADMIN' }
      })

      if (!adminExists) {
        return {
          success: false,
          error: 'No admin user found'
        }
      }

    } catch (dbError) {
      return {
        success: false,
        error: 'Database connection failed: ' + (dbError as Error).message
      }
    } finally {
      await db.$disconnect()
    }

    return {
      success: true,
      error: null
    }
  } catch (error) {
    return {
      success: false,
      error: 'Configuration check failed: ' + (error as Error).message
    }
  }
}
