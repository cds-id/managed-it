export class UploadAdapter {
  private loader: any

  constructor(loader: any) {
    this.loader = loader
  }

  async upload(): Promise<{ default: string }> {
    try {
      const file = await this.loader.file
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()
      return {
        default: data.url,
      }
    } catch (error) {
      console.error("Upload failed:", error)
      throw error
    }
  }

  abort(): void {
    // Abort upload implementation
  }
}

export function uploadPlugin(editor: any) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader: any) => {
    return new UploadAdapter(loader)
  }
}
