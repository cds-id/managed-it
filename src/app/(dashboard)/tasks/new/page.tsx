import { TaskForm } from "../components/TaskForm"
import { Metadata } from 'next'
import Link from "next/link"

export const metadata: Metadata = {
  title: "New Task",
}

export default function NewTaskPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4 sm:mb-0">Create New Task</h1>
        <Link
          href="/tasks"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Back to Tasks
        </Link>
      </div>
      <div className="max-w-2xl mx-auto">
        <TaskForm />
      </div>
    </div>
  )
}
