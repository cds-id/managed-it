import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { UploadService, UploadResult } from './types'
import { uploadConfig } from '../../config/upload'

export class LocalUploadService implements UploadService {
  private async ensureUploadDirectory() {
    const dir = join(process.cwd(), uploadConfig.local.uploadDir)
    await mkdir(dir, { recursive: true })
    console.log('Upload directory ensured:', dir)
  }

  async uploadFile(file: Buffer, filename: string, contentType: string): Promise<UploadResult> {
    console.log('LocalUploadService: Starting upload for', filename)
    await this.ensureUploadDirectory()

    const filepath = join(process.cwd(), uploadConfig.local.uploadDir, filename)
    await writeFile(filepath, file)
    console.log('File written successfully:', filepath)

    const url = `${uploadConfig.local.publicPath}/${filename}`
    return { url, path: filepath }
  }
}
