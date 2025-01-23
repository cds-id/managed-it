export interface DatabaseConfig {
  host: string
  port: string
  username: string
  password: string
  database: string
}

export interface AdminUser {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface CompanyConfig {
  name: string
  email: string
  phone: string
  address: string
  language: 'EN' | 'ID'
  uploadProvider: 'local' | 'oss'
  ossConfig: {
    region: string
    accessKeyId: string
    accessKeySecret: string
    bucket: string
  } | null
}
