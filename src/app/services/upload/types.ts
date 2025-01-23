export interface UploadResult {
  url: string
  path: string
}

export interface UploadService {
  uploadFile(file: Buffer, filename: string, contentType: string): Promise<UploadResult>
}
