import { mkdir } from 'fs/promises'
import { join } from 'path'

export const uploadConfig = {
  provider: process.env.UPLOAD_PROVIDER || 'local',
  local: {
    uploadDir: 'public/uploads',
    publicPath: '/uploads',
  },
  oss: {
    region: process.env.OSS_REGION,
    accessKeyId: process.env.OSS_ACCESS_KEY_ID,
    accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
    bucket: process.env.OSS_BUCKET,
    secure: true,
  }
}

// Create uploads directory if it doesn't exist
export const initializeUploadDirectory = async () => {
  if (uploadConfig.provider === 'local') {
    const uploadDir = join(process.cwd(), uploadConfig.local.uploadDir)
    await mkdir(uploadDir, { recursive: true })
  }
}

// Initialize on import
initializeUploadDirectory().catch(console.error)
