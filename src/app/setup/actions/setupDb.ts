'use server'

import { exec } from 'child_process'
import { promisify } from 'util'
import { writeFile } from 'fs/promises'
import type { DatabaseConfig } from '../types'

const execAsync = promisify(exec)

export default async function setupDb(config: DatabaseConfig) {
  try {
    // Generate database URL
    const dbUrl = `mysql://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}`

    // Update .env file
    await writeFile('.env', `DATABASE_URL="${dbUrl}"\n`, { flag: 'a' })

    // Run migrations
    await execAsync('npx prisma migrate deploy')

    return { success: true }
  } catch (error: any) {
    throw new Error(`Database setup failed: ${error.message}`)
  }
}
