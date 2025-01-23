import { loadServerEnv } from '@/src/lib/env'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const env = loadServerEnv()

    return NextResponse.json({
      success: true,
      config: {
        uploadProvider: env.UPLOAD_PROVIDER,
        companyName: env.COMPANY_NAME,
        reportLanguage: env.REPORT_LANGUAGE
      }
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
