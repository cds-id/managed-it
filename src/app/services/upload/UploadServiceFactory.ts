import { UploadService } from './types'
import { LocalUploadService } from './LocalUploadService'
import { OSSUploadService } from './OSSUploadService'
import { uploadConfig } from '../../config/upload'

export class UploadServiceFactory {
  static getService(): UploadService {
    switch (uploadConfig.provider) {
      case 'oss':
        return new OSSUploadService()
      case 'local':
      default:
        return new LocalUploadService()
    }
  }
}
