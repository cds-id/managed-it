import { SprintForm } from "../components/SprintForm"
import { Metadata } from 'next'
import Link from "next/link"

export const metadata: Metadata = {
  title: "New Sprint",
}

export default function NewSprintPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-4">
          <Link
            href="/sprints"
            className="text-sm text-indigo-600 hover:text-indigo-900 flex items-center"
          >
            ← Back to Sprints
          </Link>
        </div>
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-8">Create New Sprint</h1>
            <SprintForm />
          </div>
        </div>
      </div>
    </div>
  )
}
