"use client"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import { useCallback, useState } from "react"

interface RichTextEditorProps {
  initialContent?: string
  onChange: (html: string) => void
  placeholder?: string
}

export function RichTextEditor({
  initialContent = "",
  onChange,
  placeholder,
}: RichTextEditorProps) {
  const [isUploading, setIsUploading] = useState(false)

  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: initialContent,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none min-h-[150px] focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      const content = editor.getHTML()
      const updatedContent = content.replace(/\/uploads\/([\w-]+\.\w+)/g, "/api/uploads/$1")
      onChange(updatedContent)
    },
  })

  const uploadImage = useCallback(async (file: File) => {
    try {
      setIsUploading(true)
      const formData = new FormData()
      formData.append("file", file)

      console.log("Uploading file:", file.name)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Upload failed")
      }

      const data = await response.json()
      console.log("Upload response:", data)

      return data.url
    } catch (error) {
      console.error("Upload error:", error)
      throw error
    } finally {
      setIsUploading(false)
    }
  }, [])

  if (!editor) return null

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <div className="border-b px-4 py-2 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded ${editor.isActive("bold") ? "bg-gray-200" : "hover:bg-gray-100"}`}
        >
          Bold
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded ${
            editor.isActive("italic") ? "bg-gray-200" : "hover:bg-gray-100"
          }`}
        >
          Italic
        </button>

        <label className="relative">
          <span
            className={`inline-flex items-center px-3 py-2 rounded text-sm font-medium
            ${
              isUploading
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50 cursor-pointer"
            } border border-gray-300`}
          >
            {isUploading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Uploading...
              </>
            ) : (
              "Add Image"
            )}
          </span>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0]
              if (file) {
                try {
                  const url = await uploadImage(file)
                  editor.chain().focus().setImage({ src: url }).run()
                } catch (error) {
                  alert("Failed to upload image. Please try again.")
                }
              }
            }}
            disabled={isUploading}
          />
        </label>
      </div>

      <EditorContent editor={editor} className="p-4" />
    </div>
  )
}
