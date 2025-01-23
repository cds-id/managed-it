export interface ConfigCheckResult {
  success: boolean
  error: string | null
}

export interface DatabaseCheckResult {
  success: boolean
  error: string | null
}

export interface SystemConfig {
  database: {
    url: string
    [key: string]: string
  }
  company: {
    name: string
    email: string
    [key: string]: string
  }
  upload: {
    provider: 'local' | 'oss'
    [key: string]: string
  }
}
