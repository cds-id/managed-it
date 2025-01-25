"use client"
import { CKEditor } from "@ckeditor/ckeditor5-react"
import ClassicEditor from "@ckeditor/ckeditor5-build-classic"

interface CKEditorProps {
  initialValue?: string
  onChange: (data: string) => void
  placeholder?: string
}

export function RichTextEditor({ initialValue = "", onChange, placeholder }: CKEditorProps) {
  return (
    <CKEditor
      editor={ClassicEditor}
      data={initialValue}
      config={{
        placeholder,
        toolbar: [
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
        image: {
          toolbar: ["imageStyle:full", "imageStyle:side", "|", "imageTextAlternative"],
        },
      }}
      onChange={(event, editor) => {
        const data = editor.getData()
        onChange(data)
      }}
    />
  )
}
