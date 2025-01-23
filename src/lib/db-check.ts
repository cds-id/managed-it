import { PrismaClient } from '@prisma/client'
import { loadServerEnv } from './env'

export async function checkDatabaseConnection() {
  // Ensure environment variables are loaded
  loadServerEnv()

  if (!process.env.DATABASE_URL) {
    return {
      success: false,
      error: 'DATABASE_URL environment variable is not set'
    }
  }

  const prisma = new PrismaClient()

  try {
    await prisma.$connect()
    return { success: true, error: null }
  } catch (error: any) {
    return {
      success: false,
      error: `Database connection failed: ${error.message}`
    }
  } finally {
    await prisma.$disconnect()
  }
}
