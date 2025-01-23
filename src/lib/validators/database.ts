import { z } from 'zod'
import type { ConnectionOptions } from 'mysql2'

export const databaseConfigSchema = z.object({
  host: z.string().min(1, 'Host is required'),
  port: z.string().regex(/^\d+$/, 'Port must be a number'),
  database: z.string().min(1, 'Database name is required'),
  username: z.string().min(1, 'Username is required'),
  password: z.string()
})

export type DatabaseConfig = z.infer<typeof databaseConfigSchema>

export function buildDatabaseUrl(config: DatabaseConfig): string {
  return `mysql://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}`
}

export function buildConnectionConfig(config: DatabaseConfig): any {
  return {
    host: config.host,
    port: String(parseInt(config.port, 10)),
    username: config.username,
    password: config.password,
    database: config.database,
    connectTimeout: 10000,
    ssl: {
      rejectUnauthorized: false // for development
    }
  }
}
