'use server'

import { writeFile } from 'fs/promises'
import type { CompanyConfig } from '../types'

export default async function setupCompany(config: CompanyConfig) {
  try {
    const envContent = `
COMPANY_NAME="${config.name}"
COMPANY_EMAIL="${config.email}"
COMPANY_PHONE="${config.phone}"
COMPANY_ADDRESS="${config.address}"
REPORT_LANGUAGE=${config.language}
UPLOAD_PROVIDER=${config.uploadProvider}
${config.uploadProvider === 'oss' ? `
OSS_REGION=${config.ossConfig?.region}
OSS_ACCESS_KEY_ID=${config.ossConfig?.accessKeyId}
OSS_ACCESS_KEY_SECRET=${config.ossConfig?.accessKeySecret}
OSS_BUCKET=${config.ossConfig?.bucket}
` : ''}
`

    await writeFile('.env', envContent, { flag: 'a' })

    return { success: true }
  } catch (error: any) {
    throw new Error(`Company setup failed: ${error.message}`)
  }
}
