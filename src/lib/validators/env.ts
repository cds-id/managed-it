import { z } from 'zod'

export const envSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  SESSION_SECRET_KEY: z.string().min(1, 'SESSION_SECRET_KEY is required'),
  UPLOAD_PROVIDER: z.enum(['local', 'oss']),
  COMPANY_NAME: z.string().min(1, 'COMPANY_NAME is required'),
  REPORT_LANGUAGE: z.enum(['ID', 'EN'])
})

export function validateEnv() {
  try {
    const result = envSchema.safeParse(process.env)
    if (!result.success) {
      const errors = result.error.errors.map(err =>
        `${err.path.join('.')}: ${err.message}`
      ).join(', ')
      return {
        success: false,
        error: `Environment validation failed: ${errors}`
      }
    }
    return { success: true, error: null }
  } catch (error: any) {
    return {
      success: false,
      error: `Environment validation error: ${error.message}`
    }
  }
}
