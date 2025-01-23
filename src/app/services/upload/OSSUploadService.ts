import OSS from 'ali-oss'
import { UploadService, UploadResult } from './types'
import { uploadConfig } from '../../config/upload'

export class OSSUploadService implements UploadService {
  private client: OSS

  constructor() {
    this.client = new OSS({
      region: uploadConfig.oss.region!,
      accessKeyId: uploadConfig.oss.accessKeyId!,
      accessKeySecret: uploadConfig.oss.accessKeySecret!,
      bucket: uploadConfig.oss.bucket!,
      secure: uploadConfig.oss.secure
    })
  }

  async uploadFile(file: Buffer, filename: string, contentType: string): Promise<UploadResult> {
    const path = `uploads/${filename}`

    await this.client.put(path, file, {
      mime: contentType,
      headers: {
        'Content-Type': contentType
      }
    })

    const url = this.client.signatureUrl(path, {
      expires: 3600 * 24 * 365 // URL valid for 1 year
    })

    return { url, path }
  }
}
