import { NextResponse } from 'next/server'
import { UploadServiceFactory } from '../../services/upload/UploadServiceFactory'
import { nanoid } from 'nanoid'
import { validateUpload } from '../../services/upload/validation'

// Route Segment Config
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    console.log('Received file:', file.name, 'Size:', file.size, 'Type:', file.type)

    // Validate the file
    validateUpload(file.size, file.type)

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Generate unique filename
    const uniqueId = nanoid()
    const extension = file.name.split('.').pop() || 'jpg'
    const uniqueFilename = `${uniqueId}.${extension}`

    console.log('Processing file:', uniqueFilename)

    // Get upload service based on configuration
    const uploadService = UploadServiceFactory.getService()

    // Upload file
    const result = await uploadService.uploadFile(buffer, uniqueFilename, file.type)

    console.log('Upload successful:', result)

    return NextResponse.json({
      success: true,
      url: result.url,
      path: result.path
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    )
  }
}
