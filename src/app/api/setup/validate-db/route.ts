import { NextResponse } from 'next/server'
import mysql from 'mysql2/promise'
import type { ConnectionOptions } from 'mysql2'
import { databaseConfigSchema, buildDatabaseUrl } from '@/src/lib/validators/database'

export async function POST(request: Request) {
  if (request.method !== 'POST') {
    return NextResponse.json({
      success: false,
      error: 'Method not allowed'
    }, { status: 405 })
  }

  try {
    const contentType = request.headers.get('content-type')
    if (!contentType?.includes('application/json')) {
      return NextResponse.json({
        success: false,
        error: 'Content-Type must be application/json'
      }, { status: 400 })
    }

    const body = await request.json()

    // Validate schema
    const config = databaseConfigSchema.parse(body)

    try {
      // Format connection options
      const connectionConfig: ConnectionOptions = {
        host: config.host,
        port: parseInt(config.port, 10),
        user: config.username,
        password: config.password,
        database: config.database,
        connectTimeout: 10000, // 10 seconds timeout
        ssl: {
          rejectUnauthorized: false // for development
        }
      }


      // Create connection
      const connection = await mysql.createConnection(connectionConfig)

      // Test connection
      await connection.connect()

      // Test query
      await connection.query('SELECT 1')

      // Close connection
      await connection.end()

      return NextResponse.json({
        success: true,
        message: 'Database connection successful'
      })
    } catch (dbError: any) {
      return NextResponse.json({
        success: false,
        error: `Database connection failed: ${dbError.message}`
      }, { status: 400 })
    }
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to validate database configuration'
    }, { status: 400 })
  }
}

export async function GET() {
  return NextResponse.json({
    error: 'Method not allowed'
  }, { status: 405 })
}
