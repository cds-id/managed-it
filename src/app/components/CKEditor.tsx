"use client"
import { CKEditor } from "@ckeditor/ckeditor5-react"
import ClassicEditor from "@ckeditor/ckeditor5-build-classic"
import { uploadPlugin } from "./CKEditorUploadAdapter"
import { useState } from "react"

interface CKEditorProps {
  initialValue?: string
  onChange: (data: string) => void
  placeholder?: string
}

export function RichTextEditor({ initialValue = "", onChange, placeholder }: CKEditorProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="relative">
      <CKEditor
        editor={ClassicEditor}
        data={initialValue}
        config={{
          extraPlugins: [uploadPlugin],
          licenseKey: "GPL",
          placeholder,
          toolbar: {
            items: [
              "heading",
              "|",
              "bold",
              "italic",
              "link",
              "bulletedList",
              "numberedList",
              "|",
              "outdent",
              "indent",
              "|",
              "imageUpload",
              "blockQuote",
              "insertTable",
              "mediaEmbed",
              "undo",
              "redo",
            ],
            shouldNotGroupWhenFull: true,
          },
          image: {
            toolbar: [
              "imageStyle:inline",
              "imageStyle:block",
              "imageStyle:side",
              "|",
              "toggleImageCaption",
              "imageTextAlternative",
            ],
            upload: {
              types: ["jpeg", "png", "gif", "bmp", "webp", "tiff"],
            },
          },
          table: {
            contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
          },
          mediaEmbed: {
            previewsInData: true,
          },
        }}
        onReady={(editor) => {
          const root = editor.editing.view.document.getRoot()
          if (root) {
            editor.editing.view.change((writer) => {
              writer.setStyle("min-height", "200px", root)
            })
          }
        }}
        onChange={(event, editor) => {
          const data = editor.getData()
          onChange(data)
        }}
      />

      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      )}

      {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
    </div>
  )
}
