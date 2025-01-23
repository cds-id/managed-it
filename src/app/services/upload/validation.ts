export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

export function validateUpload(fileSize: number, fileType: string) {
  if (fileSize > MAX_FILE_SIZE) {
    throw new Error('File is too large. Maximum size is 5MB')
  }

  if (!ALLOWED_FILE_TYPES.includes(fileType)) {
    throw new Error('Invalid file type. Please upload an image (JPEG, PNG, GIF, or WebP)')
  }
}
