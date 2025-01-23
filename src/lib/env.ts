import { config } from 'dotenv'
import path from 'path'
import * as fs from 'fs'
export interface EnvConfig {
  DATABASE_URL?: string
  UPLOAD_PROVIDER: 'local' | 'oss'
  COMPANY_NAME: string
  REPORT_LANGUAGE: 'ID' | 'EN'
}

export function getPublicEnv(): Partial<EnvConfig> {
  return {
    UPLOAD_PROVIDER: process.env.NEXT_PUBLIC_UPLOAD_PROVIDER as 'local' | 'oss',
    COMPANY_NAME: process.env.NEXT_PUBLIC_COMPANY_NAME,
    REPORT_LANGUAGE: process.env.NEXT_PUBLIC_REPORT_LANGUAGE as 'ID' | 'EN'
  }
}
// This should only be used in server-side code
export function loadServerEnv() {
  const envPath = path.resolve(process.cwd(), '.env')

  if (!fs.existsSync(envPath)) {
    throw new Error('.env file not found')
  }

  config({ path: envPath })

  return process.env
}
